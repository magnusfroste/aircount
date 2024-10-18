import React from 'react';
import { useTransactions } from '../integrations/supabase/hooks/transactions';
import { useAccounts } from '../integrations/supabase/hooks/accounts';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useProfitAndLossData } from '../utils/profitAndLossCalculations';
import ProfitAndLossStatement from './ProfitAndLossStatement';
import { useFiscalYear } from '../contexts/FiscalYearContext';

const ProfitAndLoss = () => {
  const { session } = useSupabaseAuth();
  const { selectedYear } = useFiscalYear();
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions(session?.user?.id, 'desc', selectedYear);
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(session?.user?.id);

  const plStatement = useProfitAndLossData(transactions, accounts);

  if (!session) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          You must be logged in to view the Profit and Loss statement.
        </AlertDescription>
      </Alert>
    );
  }

  if (!selectedYear) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Fiscal Year Not Selected</AlertTitle>
        <AlertDescription>
          Please select a fiscal year to view the Profit and Loss statement.
        </AlertDescription>
      </Alert>
    );
  }

  if (transactionsLoading || accountsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Profit and Loss data...</span>
      </div>
    );
  }

  if (transactionsError || accountsError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription>
          {transactionsError?.message || accountsError?.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!transactions?.length || !accounts?.length || !plStatement) {
    return (
      <Alert>
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          There is no data available for the Profit and Loss statement. Please ensure you have transactions and accounts for the selected fiscal year ({selectedYear}).
        </AlertDescription>
      </Alert>
    );
  }

  return <ProfitAndLossStatement plStatement={plStatement} />;
};

export default ProfitAndLoss;