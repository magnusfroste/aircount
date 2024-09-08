import iconv from 'iconv-lite';

export const parseSEFile = (content) => {
  // Decode the content using CP437 encoding
  const decodedContent = iconv.decode(Buffer.from(content, 'binary'), 'CP437');
  
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

  return accounts;
};