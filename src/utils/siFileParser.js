export const parseSIFile = (content) => {
  const lines = content.split('\n')
  const transactions = []
  let currentTransaction = null

  for (const line of lines) {
    if (line.startsWith('#VER')) {
      if (currentTransaction) {
        transactions.push(...currentTransaction)
      }
      currentTransaction = []
    } else if (line.startsWith('#TRANS') && currentTransaction) {
      const [, account, , amount, date] = line.split(' ')
      currentTransaction.push({
        date,
        account,
        debit: parseFloat(amount) > 0 ? Math.abs(parseFloat(amount)) : 0,
        credit: parseFloat(amount) < 0 ? Math.abs(parseFloat(amount)) : 0,
      })
    }
  }

  if (currentTransaction) {
    transactions.push(...currentTransaction)
  }

  return transactions
}