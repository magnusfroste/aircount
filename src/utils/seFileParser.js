import iconv from 'iconv-lite';

export const parseSEFile = (content) => {
  // Convert the entire content from ISO-8859-1 to UTF-8
  const utf8Content = iconv.decode(Buffer.from(content, 'binary'), 'iso-8859-1');
  const lines = utf8Content.split('\n');
  const accounts = [];

  for (const line of lines) {
    if (line.startsWith('#KONTO')) {
      const [, account, ...nameParts] = line.split(' ');
      if (account && nameParts.length > 0) {
        const accountName = nameParts.join(' ').replace(/^"|"$/g, '');
        accounts.push({ account, account_name: accountName });
      }
    }
  }

  return accounts;
};