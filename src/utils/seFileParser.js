// Simple function to detect if a string contains Swedish characters
const containsSwedishChars = (str) => {
  return /[åäöÅÄÖ]/.test(str);
};

export const parseSEFile = (content) => {
  const lines = content.split('\n');
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

// More comprehensive encoding detection
export const detectEncoding = (content) => {
  const encodings = [
    { name: 'UTF-8', detect: (str) => /[\u0080-\uFFFF]/.test(str) },
    { name: 'ISO-8859-1', detect: (str) => /[\x80-\xFF]/.test(str) && !/[\u0100-\uFFFF]/.test(str) },
    { name: 'PC-8 (DOS Latin US)', detect: (str) => /[\x80-\xFF]/.test(str) && !/[\u0100-\uFFFF]/.test(str) },
    { name: 'ASCII', detect: (str) => !/[\x80-\xFF]/.test(str) },
  ];

  for (const encoding of encodings) {
    if (encoding.detect(content)) {
      console.log(`Detected encoding: ${encoding.name}`);
      return encoding.name;
    }
  }

  console.log('No specific encoding detected, assuming UTF-8');
  return 'Unknown (possibly UTF-8)';
};

// This function is no longer needed, but we'll keep it for compatibility
export const getAvailableEncodings = () => {
  return ['UTF-8', 'ISO-8859-1', 'PC-8 (DOS Latin US)', 'ASCII'];
};