export const parseSEFile = (content) => {
  // Decode ISO-8859-1 to UTF-8 using TextDecoder
  const decoder = new TextDecoder('iso-8859-1');
  const utf8Content = decoder.decode(new Uint8Array(content.split('').map(c => c.charCodeAt(0))));
  
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