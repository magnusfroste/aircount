import { Builder, Parser } from 'xml2js'

export const exportToSIE5 = async (transactions, accounts, openingBalances, user) => {
  const builder = new Builder()
  
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
      Journal: transactions?.map((transaction, index) => ({
        $: {
          id: transaction.ver || index.toString(),
          journalDate: transaction.date
        },
        LedgerEntry: [{
          $: {
            accountId: transaction.account,
            amount: (transaction.debit - transaction.credit).toString()
          }
        }]
      })) || []
    }
  }

  return builder.buildObject(sie5Data)
}

export const importFromSIE5 = async (xmlData, userId) => {
  const parser = new Parser({ explicitArray: false })
  const result = await parser.parseStringPromise(xmlData)

  // Here you would implement the logic to import the data into your database
  // This would involve calling your Supabase mutation hooks to insert the data
  
  return result
}