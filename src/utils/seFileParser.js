import iconv from 'iconv-lite';

export const detectEncoding = (buffer) => {
  // For this specific case, we're assuming IBM-437 encoding
  return 'IBM437';
};

const decodeBuffer = (buffer, encoding) => {
  return iconv.decode(Buffer.from(buffer), encoding);
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

  return { accounts, decodedContent, originalEncoding: detectedEncoding };
};

export const getAvailableEncodings = () => {
  return ['IBM437'];
};