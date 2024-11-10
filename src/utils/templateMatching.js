export const findMatchingTemplate = (templates, bankTransaction) => {
  if (!templates || !bankTransaction) return null;
  
  const matchingTemplate = templates.find(template => {
    const templateDesc = template.description?.toLowerCase().trim() || '';
    const transactionDesc = bankTransaction.description.toLowerCase().trim();
    return templateDesc && transactionDesc.includes(templateDesc);
  });

  return matchingTemplate;
};

export const generateTransactions = (bankTransaction, matchingTemplate) => {
  if (!bankTransaction) return [];
  
  const absAmount = Math.abs(bankTransaction.amount);
  const isNegativeAmount = bankTransaction.amount < 0;
  
  if (matchingTemplate) {
    return [
      {
        account: '1930',
        accountName: 'Bank Account',
        description: bankTransaction.description,
        debit: isNegativeAmount ? 0 : absAmount,
        credit: isNegativeAmount ? absAmount : 0,
        date: bankTransaction.date,
      },
      {
        account: matchingTemplate.account_number,
        accountName: matchingTemplate.name,
        description: bankTransaction.description,
        debit: isNegativeAmount ? absAmount : 0,
        credit: isNegativeAmount ? 0 : absAmount,
        date: bankTransaction.date,
      }
    ];
  }
  
  // For unmatched transactions
  return [
    {
      account: '1930',
      accountName: 'Bank Account',
      description: bankTransaction.description,
      debit: isNegativeAmount ? 0 : absAmount,
      credit: isNegativeAmount ? absAmount : 0,
      date: bankTransaction.date,
    },
    {
      account: isNegativeAmount ? '4000' : '3000',
      accountName: isNegativeAmount ? 'Default Expense' : 'Default Income',
      description: bankTransaction.description,
      debit: isNegativeAmount ? absAmount : 0,
      credit: isNegativeAmount ? 0 : absAmount,
      date: bankTransaction.date,
    }
  ];
};