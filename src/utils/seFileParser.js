import iconv from 'iconv-lite';

const containsSwedishChars = (str) => {
  return /[åäöÅÄÖ]/.test(str);
};

export const parseSEFile = (content) => {
  const encoding = detectEncoding(content);
  const decodedContent = translateCharacters(content, encoding);
  
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

  return { accounts, encoding, decodedContent };
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

export const translateCharacters = (content, encoding) => {
  if (encoding === 'UTF-8' || encoding === 'UTF-8 with BOM' || encoding === 'ASCII') {
    return content;
  }

  if (encoding === 'ISO-8859-1' || encoding === 'PC-8 (DOS Latin US)') {
    const buffer = Buffer.from(content, 'binary');
    return iconv.decode(buffer, encoding);
  }

  console.warn(`Unsupported encoding: ${encoding}. Returning original content.`);
  return content;
};

export const getAvailableEncodings = () => {
  return ['UTF-8', 'ISO-8859-1', 'PC-8 (DOS Latin US)', 'ASCII'];
};