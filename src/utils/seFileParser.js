import iconv from 'iconv-lite'

export const parseSEFile = (content) => {
  // Convert PC-8 (DOS Latin US) to UTF-8
  const buffer = Buffer.from(content, 'binary')
  const utf8Content = iconv.decode(buffer, 'cp437')

  const lines = utf8Content.split('\n')
  const accounts = []

  for (const line of lines) {
    if (line.startsWith('#KONTO')) {
      const [, account, name] = line.split(' ')
      const cleanedName = name.replace(/^"|"$/g, '').replace(/"/g, 'ö').replace(/†/g, 'å').replace(/"/g, 'ä')
      accounts.push({ account, account_name: cleanedName })
    }
  }

  return accounts
}