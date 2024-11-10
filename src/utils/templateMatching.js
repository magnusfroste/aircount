export const findMatchingTemplate = (templates, bankTransaction) => {
  if (!templates || !bankTransaction) return [];
  return templates;
};

export const generateTransactions = (bankTransaction, template) => {
  if (!bankTransaction || !template) return [];
  
  const absAmount = Math.abs(bankTransaction.amount);
  
  return [{
    account: template.account_number,
    description: bankTransaction.description,
    debit: template.debit > 0 ? absAmount : 0,
    credit: template.credit > 0 ? absAmount : 0,
    date: bankTransaction.date,
  }];
};