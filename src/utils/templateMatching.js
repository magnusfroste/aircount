export const findMatchingTemplate = (templates, bankTransaction) => {
  if (!templates || !bankTransaction) return null;
  
  const templateName = templates[0]?.name?.toLowerCase().trim().split(' - ')[0] || '';
  const transactionDesc = bankTransaction.description.toLowerCase().trim();
  
  const isMatch = templateName && (
    transactionDesc.includes(templateName) ||
    (templateName.includes('skatteverket') && transactionDesc.includes('skatteverket'))
  );

  return isMatch ? templates : null;
};

export const generateTransactions = (bankTransaction, matchingTemplate) => {
  if (!bankTransaction || !Array.isArray(matchingTemplate)) return [];
  
  const absAmount = Math.abs(bankTransaction.amount);
  
  return matchingTemplate.map(template => ({
    account: template.account_number,
    description: bankTransaction.description,
    debit: template.debit > 0 ? absAmount : 0,
    credit: template.credit > 0 ? absAmount : 0,
    date: bankTransaction.date,
  }));
};