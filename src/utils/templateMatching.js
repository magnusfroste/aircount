export const findMatchingTemplate = (templates, bankTransaction) => {
  if (!templates || !bankTransaction) return null;
  
  console.log('Attempting to match transaction:', {
    transactionDescription: bankTransaction.description,
    amount: bankTransaction.amount,
    availableTemplates: templates.map(t => ({
      name: t.name,
      description: t.description
    }))
  });
  
  // Ensure we're using the template's description field for matching
  const matchingTemplate = templates.find(template => {
    // Convert both strings to lowercase and trim whitespace for comparison
    const templateDesc = template.description?.toLowerCase().trim() || '';
    const transactionDesc = bankTransaction.description.toLowerCase().trim();
    
    const isMatch = templateDesc && transactionDesc.includes(templateDesc);
    
    if (templateDesc.includes('skatteverket') || templateDesc.includes('banktjänster')) {
      console.log('Checking template match:', {
        templateDescription: templateDesc,
        transactionDescription: transactionDesc,
        isMatch
      });
    }
    
    return isMatch;
  });

  return matchingTemplate;
};

export const generateTransactions = (bankTransaction, matchingTemplate) => {
  if (!bankTransaction) return [];
  
  if (matchingTemplate) {
    const absAmount = Math.abs(bankTransaction.amount);
    
    console.log('Generating transactions with template:', {
      templateName: matchingTemplate.name,
      templateDescription: matchingTemplate.description,
      bankDescription: bankTransaction.description,
      amount: bankTransaction.amount,
      templateAccounts: {
        main: matchingTemplate.account_number,
        contra: matchingTemplate.contra_account
      }
    });
    
    // If amount is negative (outgoing payment), debit the main account and credit the contra account
    // If amount is positive (incoming payment), credit the main account and debit the contra account
    const isNegativeAmount = bankTransaction.amount < 0;
    
    return [
      {
        account: matchingTemplate.account_number,
        description: bankTransaction.description,
        debit: isNegativeAmount ? absAmount : 0,
        credit: isNegativeAmount ? 0 : absAmount,
        date: bankTransaction.date,
      },
      {
        account: matchingTemplate.contra_account,
        description: bankTransaction.description,
        debit: isNegativeAmount ? 0 : absAmount,
        credit: isNegativeAmount ? absAmount : 0,
        date: bankTransaction.date,
      }
    ];
  }
  
  // If no template matches, use default accounts based on transaction type
  const isDebit = bankTransaction.amount < 0;
  const absAmount = Math.abs(bankTransaction.amount);
  
  console.log('No matching template found for:', {
    description: bankTransaction.description,
    amount: bankTransaction.amount
  });
  
  // For unmatched transactions, use 1930 as the bank account and 
  // either 4000 for expenses (negative amounts) or 3000 for income (positive amounts)
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