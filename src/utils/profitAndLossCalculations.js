import { useMemo } from 'react';

export const useProfitAndLossData = (transactions, accounts) => {
  return useMemo(() => {
    if (!transactions || !accounts) return null;

    const accountMap = accounts.reduce((acc, account) => {
      acc[account.account] = account.account_name;
      return acc;
    }, {});

    const accountSums = transactions.reduce((acc, transaction) => {
      const account = transaction.account;
      const amount = transaction.credit - transaction.debit; // Inverted calculation
      acc[account] = (acc[account] || 0) + amount;
      return acc;
    }, {});

    const categories = {
      'Income': ['3', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
      'Costs': ['4', '5', '6', '7'],
      'Financial Income': ['8314'],
      'Taxes': ['8910'],
      'Net Income': []
    };

    const plData = Object.entries(categories).map(([category, prefixes]) => {
      const accounts = Object.entries(accountSums)
        .filter(([account, sum]) => 
          prefixes.some(prefix => account.startsWith(prefix)) && sum !== 0
        )
        .map(([account, sum]) => ({ account, accountName: accountMap[account] || 'Unknown', sum }));
      
      const sum = accounts.reduce((acc, { sum }) => acc + sum, 0);
      return { category, sum, accounts };
    });

    const totalIncome = plData.find(item => item.category === 'Income')?.sum || 0;
    const totalCosts = plData.find(item => item.category === 'Costs')?.sum || 0;
    const financialIncome = plData.find(item => item.category === 'Financial Income')?.sum || 0;
    const taxes = plData.find(item => item.category === 'Taxes')?.sum || 0;
    const netIncome = totalIncome + totalCosts + financialIncome + taxes;

    plData.find(item => item.category === 'Net Income').sum = netIncome;

    return { plData, totalIncome, totalCosts, financialIncome, taxes, netIncome };
  }, [transactions, accounts]);
};