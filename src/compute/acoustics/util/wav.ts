type DecoderFunction = (buffer: ArrayBuffer, offset: number, output: number[][], channels: number, samples: number) => void;
type EncoderFunction = (buffer: ArrayBuffer, offset: number, input: number[][], channels: number, samples: number) => void;

export const data_decoders: Record<string, DecoderFunction> = {
  pcm8: (
    buffer: ArrayBuffer,
    offset: number,
    output: number[][],
    channels: number,
    samples: number
  ): void => {
    let input = new Uint8Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) {
        let data = input[pos++] - 128;
        output[ch][i] = data < 0 ? data / 128 : data / 127;
      }
    }
  },
  pcm16: (
    buffer: ArrayBuffer,
    offset: number,
    output: number[][],
    channels: number,
    samples: number
  ): void => {
    let input = new Int16Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) {
        let data = input[pos++];
        output[ch][i] = data < 0 ? data / 32768 : data / 32767;
      }
    }
  },
  pcm24: (
    buffer: ArrayBuffer,
    offset: number,
    output: number[][],
    channels: number,
    samples: number
  ): void => {
    let input = new Uint8Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) {
        let x0 = input[pos++];
        let x1 = input[pos++];
        let x2 = input[pos++];
        let xx = x0 + (x1 << 8) + (x2 << 16);
        let data = xx > 0x800000 ? xx - 0x1000000 : xx;
        output[ch][i] = data < 0 ? data / 8388608 : data / 8388607;
      }
    }
  },
  pcm32: (
    buffer: ArrayBuffer,
    offset: number,
    output: number[][],
    channels: number,
    samples: number
  ): void => {
    let input = new Int32Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) {
        let data = input[pos++];
        output[ch][i] = data < 0 ? data / 2147483648 : data / 2147483647;
      }
    }
  },
  pcm32f: (
    buffer: ArrayBuffer,
    offset: number,
    output: number[][],
    channels: number,
    samples: number
  ): void => {
    let input = new Float32Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) output[ch][i] = input[pos++];
    }
  },
  pcm64f: (
    buffer: ArrayBuffer,
    offset: number,
    output: number[][],
    channels: number,
    samples: number
  ): void => {
    let input = new Float64Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) output[ch][i] = input[pos++];
    }
  },
};

export const data_encoders: Record<string, EncoderFunction> = {
  pcm8: (
    buffer: ArrayBuffer,
    offset: number,
    input: number[][],
    channels: number,
    samples: number
  ): void => {
    let output = new Uint8Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) {
        let v = Math.max(-1, Math.min(input[ch][i], 1));
        v = ((v * 0.5 + 0.5) * 255) | 0;
        output[pos++] = v;
      }
    }
  },
  pcm16: (
    buffer: ArrayBuffer,
    offset: number,
    input: number[][],
    channels: number,
    samples: number
  ): void => {
    let output = new Int16Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) {
        let v = Math.max(-1, Math.min(input[ch][i], 1));
        v = (v < 0 ? v * 32768 : v * 32767) | 0;
        output[pos++] = v;
      }
    }
  },
  pcm24: (
    buffer: ArrayBuffer,
    offset: number,
    input: number[][],
    channels: number,
    samples: number
  ): void => {
    let output = new Uint8Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) {
        let v = Math.max(-1, Math.min(input[ch][i], 1));
        v = (v < 0 ? 0x1000000 + v * 8388608 : v * 8388607) | 0;
        output[pos++] = (v >> 0) & 0xff;
        output[pos++] = (v >> 8) & 0xff;
        output[pos++] = (v >> 16) & 0xff;
      }
    }
  },
  pcm32: (
    buffer: ArrayBuffer,
    offset: number,
    input: number[][],
    channels: number,
    samples: number
  ): void => {
    let output = new Int32Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) {
        let v = Math.max(-1, Math.min(input[ch][i], 1));
        v = (v < 0 ? v * 2147483648 : v * 2147483647) | 0;
        output[pos++] = v;
      }
    }
  },
  pcm32f: (
    buffer: ArrayBuffer,
    offset: number,
    input: number[][],
    channels: number,
    samples: number
  ): void => {
    let output = new Float32Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) {
        let v = Math.max(-1, Math.min(input[ch][i], 1));
        output[pos++] = v;
      }
    }
  },
  pcm64f: (
    buffer: ArrayBuffer,
    offset: number,
    input: number[][],
    channels: number,
    samples: number
  ): void => {
    let output = new Float64Array(buffer, offset);
    let pos = 0;
    for (let i = 0; i < samples; ++i) {
      for (let ch = 0; ch < channels; ++ch) {
        let v = Math.max(-1, Math.min(input[ch][i], 1));
        output[pos++] = v;
      }
    }
  },
};

function lookupDecoder(bitDepth: number, floatingPoint: boolean): DecoderFunction {
  const name = 'pcm' + bitDepth + (floatingPoint ? 'f' : '');
  const fn = data_decoders[name];
  if (!fn) throw new TypeError('Unsupported data format: ' + name);
  return fn;
}

function lookupEncoder(bitDepth: number, floatingPoint: boolean): EncoderFunction {
  const name = 'pcm' + bitDepth + (floatingPoint ? 'f' : '');
  const fn = data_encoders[name];
  if (!fn) throw new TypeError('Unsupported data format: ' + name);
  return fn;
}

interface DecodeResult {
  sampleRate: number;
  channelData: Float32Array[];
}

export function decode(buffer: ArrayBuffer | { buffer: ArrayBuffer; byteOffset: number; length: number }): DecodeResult | undefined {
  let pos = 0,
    end = 0;
  let arrayBuffer: ArrayBuffer;
  if ('buffer' in buffer) {
    // If we are handed a typed array or a buffer, then we have to consider the
    // offset and length into the underlying array buffer.
    pos = buffer.byteOffset;
    end = buffer.length;
    arrayBuffer = buffer.buffer;
  } else {
    // If we are handed a straight up array buffer, start at offset 0 and use
    // the full length of the buffer.
    pos = 0;
    end = buffer.byteLength;
    arrayBuffer = buffer;
  }

  const v = new DataView(arrayBuffer);

  function u8() {
    let x = v.getUint8(pos);
    pos++;
    return x;
  }

  function u16() {
    let x = v.getUint16(pos, true);
    pos += 2;
    return x;
  }

  function u32() {
    let x = v.getUint32(pos, true);
    pos += 4;
    return x;
  }

  function string(len: number) {
    let str = '';
    for (let i = 0; i < len; ++i) str += String.fromCharCode(u8());
    return str;
  }

  if (string(4) !== 'RIFF') throw new TypeError('Invalid WAV file');
  u32();
  if (string(4) !== 'WAVE') throw new TypeError('Invalid WAV file');

  let fmt;

  while (pos < end) {
    let type = string(4);
    let size = u32();
    let next = pos + size;
    switch (type) {
      case 'fmt ':
        let formatId = u16();
        if (formatId !== 0x0001 && formatId !== 0x0003)
          throw new TypeError(
            'Unsupported format in WAV file: ' + formatId.toString(16)
          );
        fmt = {
          format: 'lpcm',
          floatingPoint: formatId === 0x0003,
          channels: u16(),
          sampleRate: u32(),
          byteRate: u32(),
          blockSize: u16(),
          bitDepth: u16(),
        };
        break;
      case 'data':
        if (!fmt) throw new TypeError('Missing "fmt " chunk.');
        const samples = Math.floor(size / fmt.blockSize);
        const channels = fmt.channels;
        const sampleRate = fmt.sampleRate;
        const channelData: Float32Array[] = [];
        for (let ch = 0; ch < channels; ++ch)
          channelData[ch] = new Float32Array(samples);
        lookupDecoder(fmt.bitDepth, fmt.floatingPoint)(
          arrayBuffer,
          pos,
          channelData as unknown as number[][],
          channels,
          samples
        );
        return {
          sampleRate,
          channelData,
        };
    }
    pos = next;
  }
}
export interface encodeParams {
  sampleRate: number;
  floatingPoint?: boolean;
  float?: boolean;
  bitDepth: number;
  channels: number;
}
export function encode(channelData: number[][] | Float32Array[], opts: encodeParams): Uint8Array {
  const sampleRate = opts.sampleRate || 48000;
  const floatingPoint = Boolean(opts.float || opts.floatingPoint);
  const bitDepth = floatingPoint ? 32 : opts.bitDepth | 0 || 16;
  const channels = channelData.length;
  const samples = channelData[0].length;
  const buffer = new ArrayBuffer(44 + samples * channels * (bitDepth >> 3));

  const v = new DataView(buffer);
  let pos = 0;

  function u8(x: number) {
    v.setUint8(pos++, x);
  }

  function u16(x: number) {
    v.setUint16(pos, x, true);
    pos += 2;
  }

  function u32(x: number) {
    v.setUint32(pos, x, true);
    pos += 4;
  }

  function string(s: string) {
    for (var i = 0; i < s.length; ++i) u8(s.charCodeAt(i));
  }

  // write header
  string('RIFF');
  u32(buffer.byteLength - 8);
  string('WAVE');

  // write 'fmt ' chunk
  string('fmt ');
  u32(16);
  u16(floatingPoint ? 0x0003 : 0x0001);
  u16(channels);
  u32(sampleRate);
  u32(sampleRate * channels * (bitDepth >> 3));
  u16(channels * (bitDepth >> 3));
  u16(bitDepth);

  // write 'data' chunk
  string('data');
  u32(buffer.byteLength - 44);
  lookupEncoder(bitDepth, floatingPoint)(
    buffer,
    pos,
    channelData as number[][],
    channels,
    samples
  );
  
  return new Uint8Array(buffer);
}

export function wavAsBlob(data: Float32Array[], {sampleRate = 44100, bitDepth = 16 }: { sampleRate: number, bitDepth: number }): Blob {
  const encoded = encode(data, {
    channels: data.length,
    sampleRate,
    bitDepth
  });
  return new Blob([encoded.buffer as ArrayBuffer], {type: "audio/wav"});
}
