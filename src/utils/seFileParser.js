export const parseSEFile = (content) => {
  // Use windows-1252 encoding which is compatible with Swedish characters
  const decoder = new TextDecoder('windows-1252');
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