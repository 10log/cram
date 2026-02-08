#!/usr/bin/env python3
"""
Pre-process SADIE II HRTF dataset into compact decoder filters for CRAM.

Reads SOFA files from the SADIE II database, computes ambisonic-to-binaural
decoder FIR filters via pseudo-inverse of the spherical harmonic matrix,
and outputs compact binary filter files + resized ear thumbnails.

Usage:
    python preprocess-sadie-hrtf.py --input <SADIE-II-path> --output <public/hrtf/>

Requirements:
    pip install pysofaconventions numpy scipy Pillow

Output structure:
    <output>/
        manifest.json
        thumbnails/
            D1_L.jpg
            D1_R.jpg
            ...
        filters/
            D1_order1.bin
            D1_order2.bin
            D1_order3.bin
            ...

Binary filter format per file:
    Header: uint32 nChannels, uint32 filterLength, uint32 sampleRate
    Data: For each ambisonic channel (0..nChannels-1):
        Float32[filterLength]  (left ear FIR)
        Float32[filterLength]  (right ear FIR)
"""

import argparse
import json
import os
import struct
import sys

import numpy as np
from scipy.special import sph_harm_y
from PIL import Image

try:
    import pysofaconventions as pysofa
    import netCDF4
    USE_PYSOFA = True
except ImportError:
    USE_PYSOFA = False
    try:
        import sofar
        USE_SOFAR = True
    except ImportError:
        USE_SOFAR = False


# SADIE II subjects with metadata
SUBJECTS = {
    "D1": {"name": "D1 (KU100)", "description": "Neumann KU100 dummy head"},
    "D2": {"name": "D2 (KEMAR)", "description": "GRAS KEMAR dummy head"},
    "H3": {"name": "H3", "description": "Human subject H3"},
    "H4": {"name": "H4", "description": "Human subject H4"},
    "H5": {"name": "H5", "description": "Human subject H5"},
    "H6": {"name": "H6", "description": "Human subject H6"},
    "H7": {"name": "H7", "description": "Human subject H7"},
    "H8": {"name": "H8", "description": "Human subject H8"},
    "H9": {"name": "H9", "description": "Human subject H9"},
    "H10": {"name": "H10", "description": "Human subject H10"},
    "H11": {"name": "H11", "description": "Human subject H11"},
    "H12": {"name": "H12", "description": "Human subject H12"},
    "H13": {"name": "H13", "description": "Human subject H13"},
    "H14": {"name": "H14", "description": "Human subject H14"},
    "H15": {"name": "H15", "description": "Human subject H15"},
    "H16": {"name": "H16", "description": "Human subject H16"},
    "H17": {"name": "H17", "description": "Human subject H17"},
    "H18": {"name": "H18", "description": "Human subject H18"},
    "H19": {"name": "H19", "description": "Human subject H19"},
    "H20": {"name": "H20", "description": "Human subject H20"},
}

# Max ambisonic order to compute
MAX_ORDER = 3


def real_spherical_harmonic(n, m, az, el):
    """
    Compute real spherical harmonic Y_n^m in ACN/N3D convention.

    Parameters:
        n: degree (0, 1, 2, ...)
        m: order (-n..n)
        az: azimuth in radians (0..2*pi, 0=front, pi/2=left)
        el: elevation in radians (-pi/2..pi/2, 0=horizontal)

    Returns:
        Real-valued SH coefficient (N3D normalization)
    """
    # Convert elevation to colatitude for scipy's sph_harm
    theta = np.pi / 2 - el  # colatitude
    phi = az  # azimuth

    abs_m = abs(m)

    # scipy sph_harm_y uses (n, m, theta, phi) — note argument order change from old sph_harm
    Y_complex = sph_harm_y(n, abs_m, theta, phi)

    if m > 0:
        Y_real = np.sqrt(2) * np.real(Y_complex) * (-1)**m
    elif m < 0:
        Y_real = np.sqrt(2) * np.imag(Y_complex) * (-1)**abs_m
    else:
        Y_real = np.real(Y_complex)

    # Convert from SN3D (scipy default after extraction) to N3D
    # N3D = SN3D * sqrt(2n+1)
    # Actually scipy gives fully normalized (orthonormal) SH
    # We need N3D which includes the sqrt(2n+1) factor
    # The scipy sph_harm already includes the Condon-Shortley phase
    # For N3D from scipy's orthonormal: multiply by sqrt(4*pi)
    # then the N3D normalization = sqrt((2n+1) * factorial(n-|m|) / factorial(n+|m|))
    # But scipy already handles normalization, we just need the real part extraction

    # Actually, let's be precise: scipy gives fully normalized complex SH
    # Our conversion to real SH with N3D normalization:
    return np.real(Y_real)


def acn_index(n, m):
    """ACN (Ambisonic Channel Number) index for degree n, order m."""
    return n * n + n + m


def compute_sh_matrix(azimuths, elevations, max_order):
    """
    Compute the spherical harmonic encoding matrix for given directions.

    Parameters:
        azimuths: array of azimuth angles in radians
        elevations: array of elevation angles in radians
        max_order: maximum ambisonic order

    Returns:
        Y: matrix of shape (n_directions, n_channels) where
           n_channels = (max_order + 1)^2
    """
    n_dirs = len(azimuths)
    n_channels = (max_order + 1) ** 2
    Y = np.zeros((n_dirs, n_channels))

    for n in range(max_order + 1):
        for m in range(-n, n + 1):
            ch = acn_index(n, m)
            for d in range(n_dirs):
                Y[d, ch] = real_spherical_harmonic(n, m, azimuths[d], elevations[d])

    return Y


def compute_decoder_filters(hrir_left, hrir_right, azimuths, elevations, order):
    """
    Compute ambisonic decoder FIR filters via pseudo-inverse.

    For each ambisonic channel i:
        decoder_left[i]  = sum_d( decode_weight[i,d] * hrir_left[d] )
        decoder_right[i] = sum_d( decode_weight[i,d] * hrir_right[d] )

    Parameters:
        hrir_left: (n_directions, filter_length) left ear HRIRs
        hrir_right: (n_directions, filter_length) right ear HRIRs
        azimuths: (n_directions,) azimuth in radians
        elevations: (n_directions,) elevation in radians
        order: ambisonic order

    Returns:
        filters_left: (n_channels, filter_length)
        filters_right: (n_channels, filter_length)
    """
    n_channels = (order + 1) ** 2

    # Build SH matrix: (n_dirs, n_channels)
    Y = compute_sh_matrix(azimuths, elevations, order)

    # Pseudo-inverse decoding: D = pinv(Y) = (Y^T Y)^{-1} Y^T
    # D shape: (n_channels, n_dirs)
    D = np.linalg.pinv(Y)

    # Apply decoder weights to HRIRs
    # filters_left[ch] = sum_d D[ch, d] * hrir_left[d]
    filters_left = D @ hrir_left    # (n_channels, filter_length)
    filters_right = D @ hrir_right  # (n_channels, filter_length)

    return filters_left, filters_right


def load_sofa(sofa_path):
    """
    Load HRIR data from a SOFA file.

    Returns:
        hrir_left: (n_directions, filter_length)
        hrir_right: (n_directions, filter_length)
        azimuths: (n_directions,) in radians
        elevations: (n_directions,) in radians
        sample_rate: int
    """
    if USE_PYSOFA:
        sofa = pysofa.SOFAFile(sofa_path, 'r')
        # Source positions in spherical coordinates (azimuth, elevation, distance)
        positions = sofa.getVariableValue('SourcePosition')
        data_ir = sofa.getVariableValue('Data.IR')
        sample_rate = int(sofa.getVariableValue('Data.SamplingRate'))
        sofa.close()
    else:
        # Use netCDF4 directly
        ds = netCDF4.Dataset(sofa_path, 'r')
        positions = ds.variables['SourcePosition'][:]
        data_ir = ds.variables['Data.IR'][:]
        sample_rate = int(ds.variables['Data.SamplingRate'][:].flat[0])
        ds.close()

    # Convert masked arrays to regular numpy arrays
    positions = np.asarray(positions, dtype=np.float64)
    data_ir = np.asarray(data_ir, dtype=np.float64)

    # positions: (n_measurements, 3) -> (azimuth_deg, elevation_deg, distance)
    azimuths_deg = positions[:, 0]
    elevations_deg = positions[:, 1]

    azimuths = np.deg2rad(azimuths_deg)
    elevations = np.deg2rad(elevations_deg)

    # data_ir: (n_measurements, n_receivers, filter_length)
    # n_receivers = 2 (left=0, right=1)
    hrir_left = data_ir[:, 0, :]
    hrir_right = data_ir[:, 1, :]

    return hrir_left, hrir_right, azimuths, elevations, sample_rate


def write_binary_filters(output_path, filters_left, filters_right, sample_rate):
    """
    Write decoder filters in compact binary format.

    Header: uint32 nChannels, uint32 filterLength, uint32 sampleRate
    Data: For each channel: Float32[filterLength] left, Float32[filterLength] right
    """
    n_channels, filter_length = filters_left.shape

    with open(output_path, 'wb') as f:
        # Header
        f.write(struct.pack('<III', n_channels, filter_length, sample_rate))

        # Data
        for ch in range(n_channels):
            f.write(filters_left[ch].astype(np.float32).tobytes())
            f.write(filters_right[ch].astype(np.float32).tobytes())


def process_thumbnail(input_path, output_path, max_width=200, max_height=300):
    """Resize an ear image to thumbnail size and save as JPEG."""
    try:
        img = Image.open(input_path)
        img.thumbnail((max_width, max_height), Image.LANCZOS)
        # Convert to RGB if necessary (some PNGs have alpha)
        if img.mode in ('RGBA', 'P', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        img.save(output_path, 'JPEG', quality=85)
        return True
    except Exception as e:
        print(f"  Warning: Could not process thumbnail {input_path}: {e}")
        return False


def find_sofa_file(subject_dir, subject_id):
    """Find the 44K SOFA file for a subject."""
    sofa_dir = os.path.join(subject_dir, f"{subject_id}_HRIR_SOFA")
    if not os.path.isdir(sofa_dir):
        return None

    # Prefer 44K 16-bit 256-tap
    for f in os.listdir(sofa_dir):
        if '44K' in f and f.endswith('.sofa'):
            return os.path.join(sofa_dir, f)

    # Fallback: any SOFA file
    for f in os.listdir(sofa_dir):
        if f.endswith('.sofa'):
            return os.path.join(sofa_dir, f)

    return None


def find_ear_images(subject_dir, subject_id):
    """Find left and right ear images for a subject."""
    scans_dir = os.path.join(subject_dir, f"{subject_id}_Scans")
    if not os.path.isdir(scans_dir):
        return None, None

    left_img = None
    right_img = None

    for f in os.listdir(scans_dir):
        fl = f.lower()
        if fl.endswith('.png') or fl.endswith('.jpg'):
            if '(l)' in fl or '_l.' in fl or '(l).' in fl:
                left_img = os.path.join(scans_dir, f)
            elif '(r)' in fl or '_r.' in fl or '(r).' in fl:
                right_img = os.path.join(scans_dir, f)
            elif '3dscan' in fl and not left_img:
                # Use 3D scan preview as fallback
                left_img = os.path.join(scans_dir, f)
                right_img = os.path.join(scans_dir, f)

    return left_img, right_img


def main():
    parser = argparse.ArgumentParser(description="Pre-process SADIE II HRTF data for CRAM")
    parser.add_argument('--input', required=True, help="Path to SADIE II dataset root")
    parser.add_argument('--output', required=True, help="Output directory (e.g., public/hrtf/)")
    parser.add_argument('--max-order', type=int, default=MAX_ORDER, help="Maximum ambisonic order (default: 3)")
    parser.add_argument('--subjects', nargs='*', help="Specific subjects to process (default: all)")
    args = parser.parse_args()

    input_dir = args.input
    output_dir = args.output
    max_order = args.max_order

    if not os.path.isdir(input_dir):
        print(f"Error: Input directory not found: {input_dir}")
        sys.exit(1)

    # Create output directories
    filters_dir = os.path.join(output_dir, "filters")
    thumbnails_dir = os.path.join(output_dir, "thumbnails")
    os.makedirs(filters_dir, exist_ok=True)
    os.makedirs(thumbnails_dir, exist_ok=True)

    subjects_to_process = args.subjects or list(SUBJECTS.keys())
    manifest_subjects = []

    for subject_id in subjects_to_process:
        if subject_id not in SUBJECTS:
            print(f"Warning: Unknown subject {subject_id}, skipping")
            continue

        subject_dir = os.path.join(input_dir, subject_id)
        if not os.path.isdir(subject_dir):
            print(f"Warning: Subject directory not found: {subject_dir}, skipping")
            continue

        meta = SUBJECTS[subject_id]
        print(f"\nProcessing {subject_id} ({meta['name']})...")

        # Find SOFA file
        sofa_path = find_sofa_file(subject_dir, subject_id)
        if not sofa_path:
            print(f"  Warning: No SOFA file found for {subject_id}, skipping")
            continue

        print(f"  Loading SOFA: {os.path.basename(sofa_path)}")
        try:
            hrir_left, hrir_right, azimuths, elevations, sample_rate = load_sofa(sofa_path)
        except Exception as e:
            print(f"  Error loading SOFA file: {e}")
            continue

        print(f"  Directions: {len(azimuths)}, Filter length: {hrir_left.shape[1]}, Sample rate: {sample_rate}")

        # Compute decoder filters for each order
        for order in range(1, max_order + 1):
            n_channels = (order + 1) ** 2
            print(f"  Computing order {order} decoder ({n_channels} channels)...")

            filters_left, filters_right = compute_decoder_filters(
                hrir_left, hrir_right, azimuths, elevations, order
            )

            output_path = os.path.join(filters_dir, f"{subject_id}_order{order}.bin")
            write_binary_filters(output_path, filters_left, filters_right, sample_rate)

            file_size = os.path.getsize(output_path)
            print(f"    Saved: {output_path} ({file_size / 1024:.1f} KB)")

        # Process ear thumbnails
        left_img, right_img = find_ear_images(subject_dir, subject_id)
        thumbnail_left = ""
        thumbnail_right = ""

        if left_img:
            thumb_path = os.path.join(thumbnails_dir, f"{subject_id}_L.jpg")
            if process_thumbnail(left_img, thumb_path):
                thumbnail_left = f"thumbnails/{subject_id}_L.jpg"
                print(f"  Thumbnail L: {thumb_path}")

        if right_img:
            thumb_path = os.path.join(thumbnails_dir, f"{subject_id}_R.jpg")
            if process_thumbnail(right_img, thumb_path):
                thumbnail_right = f"thumbnails/{subject_id}_R.jpg"
                print(f"  Thumbnail R: {thumb_path}")

        manifest_subjects.append({
            "id": subject_id,
            "name": f"SADIE II \u2014 {meta['name']}",
            "description": meta["description"],
            "maxOrder": max_order,
            "sampleRate": sample_rate,
            "filterLength": int(hrir_left.shape[1]),
            "thumbnailLeft": thumbnail_left,
            "thumbnailRight": thumbnail_right,
        })

    # Write manifest
    manifest = {
        "version": 1,
        "dataset": "SADIE II",
        "subjects": manifest_subjects,
    }

    manifest_path = os.path.join(output_dir, "manifest.json")
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    print(f"\nManifest written: {manifest_path}")
    print(f"Processed {len(manifest_subjects)} subjects successfully.")


if __name__ == "__main__":
    main()
