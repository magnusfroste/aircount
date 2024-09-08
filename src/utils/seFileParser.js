// Mapping for DOS PC-8 (Code page 850) to Unicode
const cp850ToUnicode = {
  0xE5: 0x00E5, // å
  0x84: 0x00E4, // ä
  0x94: 0x00F6, // ö
  0x8F: 0x00C5, // Å
  0x8E: 0x00C4, // Ä
  0x99: 0x00D6, // Ö
  // Add more mappings as needed
};

function decodeDosPC8(buffer) {
  return Array.from(buffer).map(byte => {
    if (byte in cp850ToUnicode) {
      return String.fromCharCode(cp850ToUnicode[byte]);
    }
    return String.fromCharCode(byte);
  }).join('');
}

export const parseSEFile = (content) => {
  // Convert the string content to a Uint8Array
  const buffer = new Uint8Array(content.split('').map(c => c.charCodeAt(0)));
  
  // Decode the content using our custom DOS PC-8 decoder
  const decodedContent = decodeDosPC8(buffer);
  
  const lines = decodedContent.split('\n');
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