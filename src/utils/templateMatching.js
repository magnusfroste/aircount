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
    const isMatch = template.description && 
      bankTransaction.description.toLowerCase().includes(template.description.toLowerCase());
    
    if (template.description?.toLowerCase().includes('skatteverket')) {
      console.log('Found Skatteverket template:', {
        templateDescription: template.description,
        transactionDescription: bankTransaction.description,
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
    
    // Calculate scale factor based on the template's amounts
    const templateBaseAmount = matchingTemplate.debit || matchingTemplate.credit;
    const scaleFactor = absAmount / templateBaseAmount;
    
    console.log('Matching template found:', {
      templateName: matchingTemplate.name,
      templateDescription: matchingTemplate.description,
      bankDescription: bankTransaction.description,
      amount: bankTransaction.amount,
      scaleFactor
    });
    
    return [
      {
        account: matchingTemplate.account_number,
        description: bankTransaction.description,
        debit: matchingTemplate.debit * scaleFactor,
        credit: matchingTemplate.credit * scaleFactor,
        date: bankTransaction.date,
      },
      {
        account: '1930', // Bank account
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
  
  console.log('No matching template found for:', {
    description: bankTransaction.description,
    amount: bankTransaction.amount
  });
  
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