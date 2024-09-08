export const parseSEFile = (content) => {
  const lines = content.split('\n')
  const transactions = []
  let currentTransaction = null
  let currentVer = null

  for (const line of lines) {
    if (line.startsWith('#VER')) {
      if (currentTransaction) {
        transactions.push(...currentTransaction)
      }
      const verMatch = line.match(/#VER\s+"[^"]+"\s+(\d+)/)
      currentVer = verMatch ? verMatch[1] : null
      currentTransaction = []
    } else if (line.startsWith('#TRANS') && currentTransaction !== null) {
      const [, account, , amount, date] = line.split(' ')
      currentTransaction.push({
        date,
        account,
        debit: parseFloat(amount) > 0 ? Math.abs(parseFloat(amount)) : 0,
        credit: parseFloat(amount) < 0 ? Math.abs(parseFloat(amount)) : 0,
        ver: currentVer
      })
    }
  }

  if (currentTransaction) {
    transactions.push(...currentTransaction)
  }

  return transactions
}