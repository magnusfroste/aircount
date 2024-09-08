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
  // Convert the text from ISO-8859-1 to UTF-8
  const buffer = Buffer.from(text, 'binary')
  return iconv.decode(buffer, 'ISO-8859-1')
}