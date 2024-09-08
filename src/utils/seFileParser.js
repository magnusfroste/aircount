export const parseSEFile = (content) => {
  // Use TextDecoder with windows-1252 encoding (close to CP437 for our needs)
  const decoder = new TextDecoder('windows-1252');
  const decodedContent = decoder.decode(new Uint8Array(content));
  
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