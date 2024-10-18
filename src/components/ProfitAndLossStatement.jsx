import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from '../utils/numberFormatting';

const ProfitAndLossStatement = ({ plStatement }) => {
  if (!plStatement) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profit and Loss Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead className="text-right">Amount (SEK)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plStatement.plData.map(({ category, sum, accounts }) => (
                <React.Fragment key={category}>
                  <TableRow className="font-medium">
                    <TableCell>{category}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">{formatNumber(sum.toFixed(2))}</TableCell>
                  </TableRow>
                  {accounts.map(({ account, accountName, sum }) => (
                    <TableRow key={account}>
                      <TableCell className="pl-8"></TableCell>
                      <TableCell>{account}</TableCell>
                      <TableCell>{accountName}</TableCell>
                      <TableCell className="text-right">{formatNumber(sum.toFixed(2))}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Total Income</TableCell>
                <TableCell className="text-right">{formatNumber(plStatement.totalIncome.toFixed(2))}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Costs</TableCell>
                <TableCell className="text-right">{formatNumber(plStatement.totalCosts.toFixed(2))}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Financial Income</TableCell>
                <TableCell className="text-right">{formatNumber(plStatement.financialIncome.toFixed(2))}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Taxes</TableCell>
                <TableCell className="text-right">{formatNumber(plStatement.taxes.toFixed(2))}</TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell>Net Income</TableCell>
                <TableCell className="text-right">{formatNumber(plStatement.netIncome.toFixed(2))}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitAndLossStatement;