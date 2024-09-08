export const parseSEFile = (content) => {
  const lines = content.split('\n')
  const accounts = []

  for (const line of lines) {
    if (line.startsWith('#KONTO')) {
      const [, account, ...nameParts] = line.split(' ')
      if (account && nameParts.length > 0) {
        const encodedName = nameParts.join(' ').replace(/^"|"$/g, '')
        const decodedName = decodeSwedishCharacters(encodedName)
        accounts.push({ account, account_name: decodedName })
      }
    }
  }

  return accounts
}

const decodeSwedishCharacters = (text) => {
  return text
    .replace(/"/g, 'ä')
    .replace(/†/g, 'å')
    .replace(/"/g, 'ö')
    .replace(/'/g, 'é')
}