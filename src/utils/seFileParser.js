import { Buffer } from 'buffer';

const detectEncoding = (buffer) => {
  // Check for UTF-8 BOM
  if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    return 'UTF-8';
  }

  // Check for UTF-16 BOM
  if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
    return 'UTF-16BE';
  }
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    return 'UTF-16LE';
  }

  // Heuristic check for ISO-8859-1 or Windows-1252
  const isLatin1 = buffer.some(byte => byte > 0x7F && byte < 0xA0);
  if (isLatin1) {
    return 'ISO-8859-1';
  }

  // Default to UTF-8 if no other encoding is detected
  return 'UTF-8';
};

const decodeBuffer = (buffer, encoding) => {
  if (encoding === 'UTF-16BE' || encoding === 'UTF-16LE') {
    return new TextDecoder(encoding).decode(buffer);
  }
  return Buffer.from(buffer).toString(encoding);
};

export const parseSEFile = (fileContent) => {
  const buffer = new Uint8Array(fileContent);
  const detectedEncoding = detectEncoding(buffer);
  console.log(`Detected encoding: ${detectedEncoding}`);

  const decodedContent = decodeBuffer(buffer, detectedEncoding);
  console.log(`Decoded content (first 100 chars): ${decodedContent.substring(0, 100)}`);

  const lines = decodedContent.split('\n');
  const accounts = [];

  for (const line of lines) {
    if (line.startsWith('#KONTO')) {
      const [, account, ...nameParts] = line.split(' ');
      if (account && nameParts.length > 0) {
        const accountName = nameParts.join(' ').trim().replace(/^"|"$/g, '');
        accounts.push({ account, account_name: accountName });
      }
    }
  }

  console.log(`Total lines parsed: ${lines.length}`);
  console.log(`Valid accounts extracted: ${accounts.length}`);

  if (accounts.length === 0) {
    throw new Error(`No valid accounts found in the file. Lines parsed: ${lines.length}`);
  }

  return { accounts, decodedContent, detectedEncoding };
};

export const getAvailableEncodings = () => {
  return ['UTF-8', 'ISO-8859-1', 'UTF-16BE', 'UTF-16LE'];
};