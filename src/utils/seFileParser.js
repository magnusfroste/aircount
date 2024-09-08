import iconv from 'iconv-lite';

export const parseSEFile = (content) => {
  const lines = content.split('\n')
  const accounts = []

  for (const line of lines) {
    if (line.startsWith('#KONTO')) {
      const [, account, ...nameParts] = line.split(' ')
      if (account && nameParts.length > 0) {
        const encodedName = nameParts.join(' ').replace(/^"|"$/g, '')
        const decodedName = convertISO88591ToUTF8(encodedName)
        accounts.push({ account, account_name: decodedName })
      }
    }
  }

  return accounts
}

const convertISO88591ToUTF8 = (text) => {
  // Create a buffer from the ISO-8859-1 encoded text
  const buffer = Buffer.from(text, 'binary')
  
  // Use iconv-lite to decode the buffer as ISO-8859-1 and encode it as UTF-8
  return iconv.decode(iconv.encode(buffer, 'iso-8859-1'), 'utf-8')
}