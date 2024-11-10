export const findMatchingTemplate = (templates, bankTransaction) => {
  if (!templates || !bankTransaction) return null;
  
  const matchingTemplate = templates.find(template => {
    const templateName = template.name?.toLowerCase().trim() || '';
    const transactionDesc = bankTransaction.description.toLowerCase().trim();
    return templateName && (
      transactionDesc.includes(templateName.split(' - ')[0]) ||
      (templateName.includes('skatteverket') && transactionDesc.includes('skatteverket'))
    );
  });

  return matchingTemplate;
};

export const generateTransactions = (bankTransaction, matchingTemplate) => {
  if (!bankTransaction || !matchingTemplate) return [];
  
  const absAmount = Math.abs(bankTransaction.amount);
  
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
};