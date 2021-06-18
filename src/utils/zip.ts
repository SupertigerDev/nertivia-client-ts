import pako from "pako";
import * as Base64 from "base64-arraybuffer";

export function zip(value: string) {
  const binaryString = pako.deflate(value, { to: "string" });
  return btoa(binaryString);
}

const textDecoder = new TextDecoder();

export function unzip(base64: string) {
  try {
    const binaryString = atob(base64);
    return pako.inflate(binaryString, { to: "string" });
  } catch {
    return null;
  }
}

export function unzipAlt(base64: string) {
  try {
    const base64buf: ArrayBuffer = Base64.decode(base64);
    return pako.inflate(textDecoder.decode(base64buf), { to: "string" });
  } catch (err) {
    console.warn(err);
    return null;
  }
}
