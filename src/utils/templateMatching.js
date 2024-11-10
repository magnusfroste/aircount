export const findMatchingTemplate = (templates, bankTransaction) => {
  if (!templates || !bankTransaction) return null;
  
  const matchingTemplate = templates.find(template => {
    const templateName = template.name?.toLowerCase().trim() || '';
    const transactionDesc = bankTransaction.description.toLowerCase().trim();
    return templateName && (
      transactionDesc.includes(templateName) ||
      templateName.includes('skatteverket') && transactionDesc.includes('skatteverket')
    );
  });

  return matchingTemplate;
};

export const generateTransactions = (bankTransaction, matchingTemplate) => {
  if (!bankTransaction) return [];
  
  const absAmount = Math.abs(bankTransaction.amount);
  
  if (matchingTemplate) {
    // Use the template's exact structure
    return [
      {
        account: matchingTemplate.account_number,
        description: bankTransaction.description,
        debit: matchingTemplate.debit > 0 ? absAmount : 0,
        credit: matchingTemplate.credit > 0 ? absAmount : 0,
        date: bankTransaction.date,
      },
      {
        account: '1930', // Bank account is always the contra account
        description: bankTransaction.description,
        debit: matchingTemplate.credit > 0 ? absAmount : 0,
        credit: matchingTemplate.debit > 0 ? absAmount : 0,
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