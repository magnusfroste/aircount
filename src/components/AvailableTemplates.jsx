import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const AvailableTemplates = ({ templates, accounts, selectedTemplates, handleTemplateSelect, searchTerm, setSearchTerm }) => {
  const groupedTemplates = templates.reduce((acc, template) => {
    const groupName = template.name.split(' - ')[0];
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(template);
    return acc;
  }, {});

  const filteredGroups = Object.entries(groupedTemplates).filter(([groupName, groupTemplates]) => 
    groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupTemplates.some(template => template.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.map(([groupName, groupTemplates]) => (
              <React.Fragment key={groupName}>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={5} className="font-medium">{groupName}</TableCell>
                </TableRow>
                {groupTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedTemplates.includes(template.id)}
                        onChange={() => handleTemplateSelect(template.id)}
                      />
                    </TableCell>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.account_number} - {accounts.find(acc => acc.account === template.account_number)?.account_name || 'Unknown Account'}</TableCell>
                    <TableCell>{template.debit}</TableCell>
                    <TableCell>{template.credit}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default AvailableTemplates