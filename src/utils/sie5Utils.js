import { Builder, parseString } from 'xml2js'

export const exportToSIE5 = async (transactions, accounts, openingBalances, user) => {
  const builder = new Builder()
  
  // Group transactions by ver (transaction number)
  const groupedTransactions = transactions?.reduce((acc, transaction) => {
    if (!acc[transaction.ver]) {
      acc[transaction.ver] = [];
    }
    acc[transaction.ver].push(transaction);
    return acc;
  }, {}) || {};
  
  const sie5Data = {
    Sie: {
      $: {
        xmlns: 'http://www.sie.se/sie5',
        version: '5.0'
      },
      FileInfo: {
        SoftwareProduct: {
          $: { name: 'AirCount', version: '1.0' }
        },
        Company: {
          $: { 
            organizationId: user?.id || '',
            name: user?.email || 'Unknown'
          }
        },
        FiscalYears: [{
          $: {
            start: new Date().getFullYear() + '-01',
            end: new Date().getFullYear() + '-12',
            primary: true
          }
        }]
      },
      Accounts: accounts?.map(account => ({
        $: {
          id: account.account,
          name: account.account_name,
          type: account.account.startsWith('1') ? 'asset' :
                account.account.startsWith('2') ? 'liability' :
                account.account.startsWith('3') ? 'income' :
                'expense'
        }
      })) || [],
      OpeningBalances: openingBalances?.map(balance => ({
        $: {
          account: balance.account,
          amount: balance.balance.toString()
        }
      })) || [],
      Journal: Object.entries(groupedTransactions).map(([ver, entries]) => ({
        $: {
          id: ver,
          journalDate: entries[0].date // Use the date from the first entry in the group
        },
        LedgerEntry: entries.map(entry => ({
          $: {
            accountId: entry.account,
            amount: (entry.debit - entry.credit).toString()
          }
        }))
      }))
    }
  }

  return builder.buildObject(sie5Data)
}

export const importFromSIE5 = async (xmlData, userId) => {
  return new Promise((resolve, reject) => {
    parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}