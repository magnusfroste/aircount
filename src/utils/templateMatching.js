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
  
  if (matchingTemplate) {
    // Always use template accounts when a template is matched
    return [
      {
        account: '1930',
        description: bankTransaction.description,
        debit: 0,
        credit: absAmount,
        date: bankTransaction.date,
      },
      {
        account: matchingTemplate.account_number,
        description: bankTransaction.description,
        debit: absAmount,
        credit: 0,
        date: bankTransaction.date,
      }
    ];
  }
  
  // For unmatched transactions, use default accounts
  const isNegativeAmount = bankTransaction.amount < 0;
  return [
    {
      account: '1930',
      description: bankTransaction.description,
      debit: isNegativeAmount ? 0 : absAmount,
      credit: isNegativeAmount ? absAmount : 0,
      date: bankTransaction.date,
    },
    {
      account: isNegativeAmount ? '4000' : '3000',
      description: bankTransaction.description,
      debit: isNegativeAmount ? absAmount : 0,
      credit: isNegativeAmount ? 0 : absAmount,
      date: bankTransaction.date,
    }
  ];
};