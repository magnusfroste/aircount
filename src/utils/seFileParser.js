import iconv from 'iconv-lite';

const containsSwedishChars = (str) => {
  return /[åäöÅÄÖ]/.test(str);
};

export const parseSEFile = (content) => {
  const originalEncoding = detectEncoding(content);
  console.log(`Original detected encoding: ${originalEncoding}`);
  
  const decodedContent = translateCharacters(content);
  console.log(`Decoded content (first 100 chars): ${decodedContent.substring(0, 100)}`);
  
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

  const finalEncoding = detectEncoding(decodedContent);
  console.log(`Final detected encoding: ${finalEncoding}`);

  return { accounts, originalEncoding, finalEncoding, decodedContent };
};

export const detectEncoding = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    return 'UTF-8 with BOM';
  }

  if (containsSwedishChars(content)) {
    return 'UTF-8';
  }

  const pc8Regex = /[\x80-\xFF]/;
  if (pc8Regex.test(content)) {
    const iso88591SpecificChars = /[\xA0-\xFF]/;
    if (iso88591SpecificChars.test(content)) {
      return 'ISO-8859-1';
    }
    return 'PC-8 (DOS Latin US)';
  }

  if (!/[^\x00-\x7F]/.test(content)) {
    return 'ASCII';
  }

  return 'UTF-8';
};

export const translateCharacters = (content) => {
  console.log('Translating characters using CP437 (DOS Latin US) encoding');
  
  try {
    const buffer = Buffer.from(content, 'binary');
    const decoded = iconv.decode(buffer, 'CP437');
    console.log(`Translation completed. Sample: ${decoded.substring(0, 50)}`);
    return decoded;
  } catch (error) {
    console.error(`Error during translation: ${error.message}`);
    return content;
  }
};

export const getAvailableEncodings = () => {
  return ['UTF-8', 'ISO-8859-1', 'PC-8 (DOS Latin US)', 'ASCII'];
};