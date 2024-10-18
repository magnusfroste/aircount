import React, { createContext, useState, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const FiscalYearContext = createContext();

export const useFiscalYear = () => useContext(FiscalYearContext);

export const FiscalYearProvider = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const { session } = useSupabaseAuth();

  const { data: fiscalYears, isLoading } = useQuery({
    queryKey: ['fiscal-years', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiscal_years')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('year', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (fiscalYears && fiscalYears.length > 0 && !selectedYear) {
      setSelectedYear(fiscalYears[0].year.toString());
    }
  }, [fiscalYears, selectedYear]);

  return (
    <FiscalYearContext.Provider value={{ selectedYear, setSelectedYear, fiscalYears, isLoading }}>
      {children}
    </FiscalYearContext.Provider>
  );
};