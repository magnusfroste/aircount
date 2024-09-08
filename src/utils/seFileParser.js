// Mapping for DOS PC-8 (Code page 850) to Unicode
const cp850ToUnicode = {
  0x80: 0x00C7, // Ç
  0x81: 0x00FC, // ü
  0x82: 0x00E9, // é
  0x83: 0x00E2, // â
  0x84: 0x00E4, // ä
  0x85: 0x00E0, // à
  0x86: 0x00E5, // å
  0x87: 0x00E7, // ç
  0x88: 0x00EA, // ê
  0x89: 0x00EB, // ë
  0x8A: 0x00E8, // è
  0x8B: 0x00EF, // ï
  0x8C: 0x00EE, // î
  0x8D: 0x00EC, // ì
  0x8E: 0x00C4, // Ä
  0x8F: 0x00C5, // Å
  0x90: 0x00C9, // É
  0x91: 0x00E6, // æ
  0x92: 0x00C6, // Æ
  0x93: 0x00F4, // ô
  0x94: 0x00F6, // ö
  0x95: 0x00F2, // ò
  0x96: 0x00FB, // û
  0x97: 0x00F9, // ù
  0x98: 0x00FF, // ÿ
  0x99: 0x00D6, // Ö
  0x9A: 0x00DC, // Ü
  // ... (other mappings remain the same)
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
        const accountName = nameParts.join(' ').trim().replace(/^"|"$/g, '');
        accounts.push({ account, account_name: accountName });
      }
    }
  }

  return accounts;
};