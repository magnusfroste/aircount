export const findMatchingTemplate = (templates, bankTransaction) => {
  if (!templates || !bankTransaction) return null;
  
  return templates.find(template => 
    template.description && 
    bankTransaction.description.toLowerCase().includes(template.description.toLowerCase())
  );
};

export const generateTransactions = (bankTransaction, matchingTemplate) => {
  if (!bankTransaction) return [];
  
  if (matchingTemplate) {
    const absAmount = Math.abs(bankTransaction.amount);
    const scaleFactor = absAmount / (matchingTemplate.debit || matchingTemplate.credit);
    
    return [
      {
        account: matchingTemplate.account_number,
        description: bankTransaction.description,
        debit: matchingTemplate.debit * scaleFactor,
        credit: matchingTemplate.credit * scaleFactor,
        date: bankTransaction.date,
      },
      {
        account: '1930',
        description: bankTransaction.description,
        debit: matchingTemplate.credit * scaleFactor,
        credit: matchingTemplate.debit * scaleFactor,
        date: bankTransaction.date,
      }
    ];
  }
  
  // Default logic if no template matches
  const isDebit = bankTransaction.amount < 0;
  const absAmount = Math.abs(bankTransaction.amount);
  
  if (isDebit) {
    return [
      {
        account: '4000',
        description: bankTransaction.description,
        debit: absAmount,
        credit: 0,
        date: bankTransaction.date,
      },
      {
        account: '1930',
        description: bankTransaction.description,
        debit: 0,
        credit: absAmount,
        date: bankTransaction.date,
      }
    ];
  } else {
    return [
      {
        account: '1930',
        description: bankTransaction.description,
        debit: absAmount,
        credit: 0,
        date: bankTransaction.date,
      },
      {
        account: '3000',
        description: bankTransaction.description,
        debit: 0,
        credit: absAmount,
        date: bankTransaction.date,
      }
    ];
  }
};