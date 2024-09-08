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
  // Check for BOM (Byte Order Mark)
  if (content.charCodeAt(0) === 0xFEFF) {
    return 'UTF-8 with BOM';
  }

  // Check for Swedish characters
  if (containsSwedishChars(content)) {
    return 'UTF-8';
  }

  // Check for PC-8 (DOS Latin US) or ISO-8859-1 specific characters
  const pc8Regex = /[\x80-\xFF]/;
  if (pc8Regex.test(content)) {
    // Further distinguish between PC-8 and ISO-8859-1
    // This is a simplified check and may not be 100% accurate
    const iso88591SpecificChars = /[\xA0-\xFF]/;
    if (iso88591SpecificChars.test(content)) {
      return 'ISO-8859-1';
    }
    return 'PC-8 (DOS Latin US)';
  }

  // If no special characters are found, it's likely ASCII
  if (!/[^\x00-\x7F]/.test(content)) {
    return 'ASCII';
  }

  // Default to UTF-8 if no other encoding is detected
  return 'UTF-8';
};

// This function is no longer needed, but we'll keep it for compatibility
export const getAvailableEncodings = () => {
  return ['UTF-8', 'ISO-8859-1', 'PC-8 (DOS Latin US)', 'ASCII'];
};