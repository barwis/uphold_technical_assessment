import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  (global as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder;
  (global as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
}
