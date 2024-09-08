import iconv from 'iconv-lite';

export const parseSEFile = (content, encoding = 'CP437') => {
  // Detect the encoding if not provided
  const detectedEncoding = encoding || detectEncoding(content);
  
  // Decode the content using the detected or provided encoding
  const decodedContent = iconv.decode(Buffer.from(content, 'binary'), detectedEncoding);
  
  const lines = decodedContent.split('\n');
  const accounts = [];
  let linesParsed = 0;
  let accountsFound = 0;

  for (const line of lines) {
    linesParsed++;
    if (line.startsWith('#KONTO')) {
      accountsFound++;
      const [, account, ...nameParts] = line.split(' ');
      if (account && nameParts.length > 0) {
        const accountName = nameParts.join(' ').trim().replace(/^"|"$/g, '');
        accounts.push({ account, account_name: accountName });
      } else {
        console.warn(`Invalid account format at line ${linesParsed}: ${line}`);
      }
    }
  }

  console.log(`Total lines parsed: ${linesParsed}`);
  console.log(`Total #KONTO lines found: ${accountsFound}`);
  console.log(`Valid accounts extracted: ${accounts.length}`);

  if (accounts.length === 0) {
    throw new Error(`No valid accounts found in the file. 
      Lines parsed: ${linesParsed}, 
      #KONTO lines found: ${accountsFound}`);
  }

  return accounts;
};

// Helper function to detect the most likely encoding
export const detectEncoding = (content) => {
  const encodings = ['CP437', 'ISO-8859-1', 'UTF-8', 'windows-1252'];
  for (const encoding of encodings) {
    try {
      const decoded = iconv.decode(Buffer.from(content, 'binary'), encoding);
      if (decoded.includes('å') || decoded.includes('ä') || decoded.includes('ö')) {
        console.log(`Detected encoding: ${encoding}`);
        return encoding;
      }
    } catch (error) {
      console.error(`Error decoding with ${encoding}:`, error);
    }
  }
  console.log('No specific encoding detected, defaulting to CP437');
  return 'CP437'; // Default to CP437 if no encoding is detected
};

// Helper function to get available encodings
export const getAvailableEncodings = () => {
  return iconv.encodingExists.codes();
};