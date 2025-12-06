import { STLLoader } from '../stl';

describe('STLLoader', () => {
  let loader: STLLoader;

  beforeEach(() => {
    loader = new STLLoader();
  });

  describe('ensureString', () => {
    it('returns string as-is', () => {
      const result = loader.ensureString('hello world');
      expect(result).toBe('hello world');
    });

    it('converts ArrayBuffer to string', () => {
      const buffer = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
      const result = loader.ensureString(buffer.buffer);
      expect(result).toBe('Hello');
    });
  });

  describe('ensureBinary', () => {
    it('returns ArrayBuffer as-is', () => {
      const buffer = new ArrayBuffer(10);
      const result = loader.ensureBinary(buffer);
      expect(result).toBe(buffer);
    });

    it('converts string to ArrayBuffer', () => {
      const result = loader.ensureBinary('ABC');
      expect(result).toBeInstanceOf(ArrayBuffer);
      const view = new Uint8Array(result);
      expect(view[0]).toBe(65); // 'A'
      expect(view[1]).toBe(66); // 'B'
      expect(view[2]).toBe(67); // 'C'
    });
  });

  describe('parseASCII', () => {
    it('parses a simple ASCII STL triangle', () => {
      const stlContent = `solid test
  facet normal 0 0 1
    outer loop
      vertex 0 0 0
      vertex 1 0 0
      vertex 0.5 1 0
    endloop
  endfacet
endsolid test`;

      const geometry = loader.parseASCII(stlContent);

      expect(geometry).toBeDefined();
      // Check that position attribute was set
      const positionAttr = geometry.getAttribute('position');
      expect(positionAttr).toBeDefined();
      expect(positionAttr.count).toBe(3); // 3 vertices

      // Check that normal attribute was set
      const normalAttr = geometry.getAttribute('normal');
      expect(normalAttr).toBeDefined();
      expect(normalAttr.count).toBe(3); // 3 normals (one per vertex)
    });

    it('parses multiple facets', () => {
      const stlContent = `solid test
  facet normal 0 0 1
    outer loop
      vertex 0 0 0
      vertex 1 0 0
      vertex 0.5 1 0
    endloop
  endfacet
  facet normal 0 0 -1
    outer loop
      vertex 0 0 0
      vertex 0.5 1 0
      vertex 1 0 0
    endloop
  endfacet
endsolid test`;

      const geometry = loader.parseASCII(stlContent);

      const positionAttr = geometry.getAttribute('position');
      expect(positionAttr.count).toBe(6); // 2 triangles * 3 vertices
    });

    it('parses scientific notation in coordinates', () => {
      const stlContent = `solid test
  facet normal 0 0 1e0
    outer loop
      vertex 1.5e-3 2.0e+2 -3.5e-1
      vertex 1e0 0e0 0
      vertex 0 1e1 0
    endloop
  endfacet
endsolid test`;

      const geometry = loader.parseASCII(stlContent);

      const positionAttr = geometry.getAttribute('position');
      expect(positionAttr).toBeDefined();
      expect(positionAttr.count).toBe(3);
    });

    it('handles negative coordinates', () => {
      const stlContent = `solid test
  facet normal -1 0 0
    outer loop
      vertex -1 -2 -3
      vertex -4 -5 -6
      vertex -7 -8 -9
    endloop
  endfacet
endsolid test`;

      const geometry = loader.parseASCII(stlContent);

      const positionAttr = geometry.getAttribute('position');
      expect(positionAttr.count).toBe(3);
    });

    it('handles empty solid', () => {
      const stlContent = `solid empty
endsolid empty`;

      const geometry = loader.parseASCII(stlContent);

      const positionAttr = geometry.getAttribute('position');
      expect(positionAttr.count).toBe(0);
    });
  });

  describe('parseBinary', () => {
    function createBinarySTL(faces: number[][]): ArrayBuffer {
      // Binary STL format:
      // 80 bytes header
      // 4 bytes (uint32) number of triangles
      // For each triangle:
      //   12 bytes (3 x float32) normal vector
      //   36 bytes (3 x 3 x float32) vertex coordinates
      //   2 bytes (uint16) attribute byte count

      const numFaces = faces.length;
      const faceSize = 12 + 36 + 2; // normal + 3 vertices + attribute
      const bufferSize = 80 + 4 + numFaces * faceSize;

      const buffer = new ArrayBuffer(bufferSize);
      const view = new DataView(buffer);

      // Header (80 bytes) - leave as zeros

      // Number of triangles
      view.setUint32(80, numFaces, true);

      // Write faces
      let offset = 84;
      for (const face of faces) {
        // Normal (nx, ny, nz)
        view.setFloat32(offset, face[0], true);
        view.setFloat32(offset + 4, face[1], true);
        view.setFloat32(offset + 8, face[2], true);
        offset += 12;

        // Vertex 1
        view.setFloat32(offset, face[3], true);
        view.setFloat32(offset + 4, face[4], true);
        view.setFloat32(offset + 8, face[5], true);
        offset += 12;

        // Vertex 2
        view.setFloat32(offset, face[6], true);
        view.setFloat32(offset + 4, face[7], true);
        view.setFloat32(offset + 8, face[8], true);
        offset += 12;

        // Vertex 3
        view.setFloat32(offset, face[9], true);
        view.setFloat32(offset + 4, face[10], true);
        view.setFloat32(offset + 8, face[11], true);
        offset += 12;

        // Attribute byte count
        view.setUint16(offset, 0, true);
        offset += 2;
      }

      return buffer;
    }

    it('parses a single triangle', () => {
      // Normal: (0, 0, 1), Vertices: (0,0,0), (1,0,0), (0.5,1,0)
      const face = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0.5, 1, 0];
      const buffer = createBinarySTL([face]);

      const geometry = loader.parseBinary(buffer);

      expect(geometry).toBeDefined();
      const positionAttr = geometry.getAttribute('position');
      expect(positionAttr).toBeDefined();
      expect(positionAttr.count).toBe(3);

      const normalAttr = geometry.getAttribute('normal');
      expect(normalAttr).toBeDefined();
      expect(normalAttr.count).toBe(3);
    });

    it('parses multiple triangles', () => {
      const face1 = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0.5, 1, 0];
      const face2 = [0, 0, -1, 0, 0, 0, 0.5, 1, 0, 1, 0, 0];
      const buffer = createBinarySTL([face1, face2]);

      const geometry = loader.parseBinary(buffer);

      const positionAttr = geometry.getAttribute('position');
      expect(positionAttr.count).toBe(6); // 2 triangles * 3 vertices
    });

    it('parses empty binary STL', () => {
      const buffer = createBinarySTL([]);

      const geometry = loader.parseBinary(buffer);

      const positionAttr = geometry.getAttribute('position');
      expect(positionAttr.count).toBe(0);
    });

    it('correctly extracts vertex positions', () => {
      // Single triangle with known vertices
      const face = [0, 0, 1, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5];
      const buffer = createBinarySTL([face]);

      const geometry = loader.parseBinary(buffer);

      const positionAttr = geometry.getAttribute('position');
      const positions = positionAttr.array;

      // First vertex: (1.5, 2.5, 3.5)
      expect(positions[0]).toBeCloseTo(1.5);
      expect(positions[1]).toBeCloseTo(2.5);
      expect(positions[2]).toBeCloseTo(3.5);

      // Second vertex: (4.5, 5.5, 6.5)
      expect(positions[3]).toBeCloseTo(4.5);
      expect(positions[4]).toBeCloseTo(5.5);
      expect(positions[5]).toBeCloseTo(6.5);

      // Third vertex: (7.5, 8.5, 9.5)
      expect(positions[6]).toBeCloseTo(7.5);
      expect(positions[7]).toBeCloseTo(8.5);
      expect(positions[8]).toBeCloseTo(9.5);
    });

    it('correctly extracts normals', () => {
      const face = [0.5, 0.6, 0.7, 0, 0, 0, 1, 0, 0, 0, 1, 0];
      const buffer = createBinarySTL([face]);

      const geometry = loader.parseBinary(buffer);

      const normalAttr = geometry.getAttribute('normal');
      const normals = normalAttr.array;

      // All three vertices share the same face normal
      expect(normals[0]).toBeCloseTo(0.5);
      expect(normals[1]).toBeCloseTo(0.6);
      expect(normals[2]).toBeCloseTo(0.7);
      expect(normals[3]).toBeCloseTo(0.5);
      expect(normals[4]).toBeCloseTo(0.6);
      expect(normals[5]).toBeCloseTo(0.7);
    });

    describe('with colors', () => {
      function createColoredBinarySTL(
        faces: number[][],
        defaultColor?: { r: number; g: number; b: number; a: number },
        faceColors?: Array<{ r: number; g: number; b: number } | null>
      ): ArrayBuffer {
        const numFaces = faces.length;
        const faceSize = 12 + 36 + 2;
        const bufferSize = 80 + 4 + numFaces * faceSize;

        const buffer = new ArrayBuffer(bufferSize);
        const view = new DataView(buffer);
        const uint8View = new Uint8Array(buffer);

        // Write COLOR= header at byte 0
        if (defaultColor) {
          // "COLOR=" as bytes
          uint8View[0] = 0x43; // C
          uint8View[1] = 0x4f; // O
          uint8View[2] = 0x4c; // L
          uint8View[3] = 0x4f; // O
          uint8View[4] = 0x52; // R
          uint8View[5] = 0x3d; // =
          uint8View[6] = Math.round(defaultColor.r * 255);
          uint8View[7] = Math.round(defaultColor.g * 255);
          uint8View[8] = Math.round(defaultColor.b * 255);
          uint8View[9] = Math.round(defaultColor.a * 255);
        }

        // Number of triangles
        view.setUint32(80, numFaces, true);

        // Write faces
        let offset = 84;
        for (let i = 0; i < faces.length; i++) {
          const face = faces[i];

          // Normal
          view.setFloat32(offset, face[0], true);
          view.setFloat32(offset + 4, face[1], true);
          view.setFloat32(offset + 8, face[2], true);
          offset += 12;

          // Vertices
          for (let v = 0; v < 3; v++) {
            view.setFloat32(offset, face[3 + v * 3], true);
            view.setFloat32(offset + 4, face[4 + v * 3], true);
            view.setFloat32(offset + 8, face[5 + v * 3], true);
            offset += 12;
          }

          // Attribute byte (color info)
          if (faceColors && faceColors[i]) {
            // Pack RGB into 16 bits: 5 bits each, bit 15 = 0 for custom color
            const color = faceColors[i]!;
            const r5 = Math.round(color.r * 31) & 0x1f;
            const g5 = Math.round(color.g * 31) & 0x1f;
            const b5 = Math.round(color.b * 31) & 0x1f;
            const packed = r5 | (g5 << 5) | (b5 << 10);
            view.setUint16(offset, packed, true);
          } else if (defaultColor) {
            // Use default color (bit 15 = 1)
            view.setUint16(offset, 0x8000, true);
          } else {
            view.setUint16(offset, 0, true);
          }
          offset += 2;
        }

        return buffer;
      }

      it('parses STL with default color in header', () => {
        const face = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
        const buffer = createColoredBinarySTL(
          [face],
          { r: 1, g: 0, b: 0, a: 1 }
        );

        const geometry = loader.parseBinary(buffer);

        expect((geometry as any).hasColors).toBe(true);
        expect((geometry as any).alpha).toBeCloseTo(1);

        const colorAttr = geometry.getAttribute('color');
        expect(colorAttr).toBeDefined();
      });

      it('parses STL with per-face colors', () => {
        const face1 = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
        const face2 = [0, 0, -1, 0, 0, 0, 0, 1, 0, 1, 0, 0];
        const buffer = createColoredBinarySTL(
          [face1, face2],
          { r: 0.5, g: 0.5, b: 0.5, a: 1 },
          [
            { r: 1, g: 0, b: 0 },  // Red face
            { r: 0, g: 0, b: 1 }   // Blue face
          ]
        );

        const geometry = loader.parseBinary(buffer);

        expect((geometry as any).hasColors).toBe(true);
        const colorAttr = geometry.getAttribute('color');
        expect(colorAttr).toBeDefined();
        expect(colorAttr.count).toBe(6); // 2 faces * 3 vertices
      });
    });
  });

  describe('parse', () => {
    it('detects and parses ASCII STL', () => {
      const stlContent = `solid test
  facet normal 0 0 1
    outer loop
      vertex 0 0 0
      vertex 1 0 0
      vertex 0.5 1 0
    endloop
  endfacet
endsolid test`;

      const geometry = loader.parse(stlContent);

      expect(geometry).toBeDefined();
      const positionAttr = geometry.getAttribute('position');
      expect(positionAttr.count).toBe(3);
    });

    it('detects and parses binary STL', () => {
      // Create a binary STL that doesn't start with "solid"
      const numFaces = 1;
      const faceSize = 50; // 12 (normal) + 36 (vertices) + 2 (attribute)
      const bufferSize = 80 + 4 + numFaces * faceSize;

      const buffer = new ArrayBuffer(bufferSize);
      const view = new DataView(buffer);
      const uint8View = new Uint8Array(buffer);

      // Write non-"solid" bytes at start
      uint8View[0] = 0x00;

      // Set face count
      view.setUint32(80, 1, true);

      // Write a simple face
      let offset = 84;
      // Normal: (0, 0, 1)
      view.setFloat32(offset, 0, true);
      view.setFloat32(offset + 4, 0, true);
      view.setFloat32(offset + 8, 1, true);
      offset += 12;

      // 3 vertices
      for (let i = 0; i < 3; i++) {
        view.setFloat32(offset, i, true);
        view.setFloat32(offset + 4, 0, true);
        view.setFloat32(offset + 8, 0, true);
        offset += 12;
      }

      // Attribute
      view.setUint16(offset, 0, true);

      const geometry = loader.parse(buffer);

      expect(geometry).toBeDefined();
      const positionAttr = geometry.getAttribute('position');
      expect(positionAttr.count).toBe(3);
    });

    it('correctly identifies binary by byte length match', () => {
      // Create a binary STL where byte length exactly matches expected
      const numFaces = 2;
      const faceSize = 50;
      const expectedSize = 80 + 4 + numFaces * faceSize;

      const buffer = new ArrayBuffer(expectedSize);
      const view = new DataView(buffer);

      // Even if first bytes are 's','o','l','i','d',
      // if size matches binary format, treat as binary
      // (but actual implementation checks bytes first)
      view.setUint32(80, numFaces, true);

      // Fill in face data
      let offset = 84;
      for (let f = 0; f < numFaces; f++) {
        // Normal
        view.setFloat32(offset, 0, true);
        view.setFloat32(offset + 4, 0, true);
        view.setFloat32(offset + 8, 1, true);
        offset += 12;

        // 3 vertices
        for (let v = 0; v < 3; v++) {
          view.setFloat32(offset, v, true);
          view.setFloat32(offset + 4, f, true);
          view.setFloat32(offset + 8, 0, true);
          offset += 12;
        }

        // Attribute
        view.setUint16(offset, 0, true);
        offset += 2;
      }

      const geometry = loader.parse(buffer);

      expect(geometry).toBeDefined();
      const positionAttr = geometry.getAttribute('position');
      expect(positionAttr.count).toBe(6); // 2 faces * 3 vertices
    });
  });
});
