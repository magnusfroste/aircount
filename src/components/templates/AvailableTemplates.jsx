import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const AvailableTemplates = ({ templates, accounts, selectedTemplates, handleTemplateSelect, searchTerm }) => {
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.name]) {
      acc[template.name] = []
    }
    acc[template.name].push(template)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groupedTemplates).map(([templateName, templates]) => (
        <Card key={templateName}>
          <CardHeader>
            <CardTitle>{templateName}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedTemplates.includes(template.id)}
                        onChange={() => handleTemplateSelect(template.id)}
                      />
                    </TableCell>
                    <TableCell>{template.account_number} - {accounts.find(acc => acc.account === template.account_number)?.account_name || 'Unknown Account'}</TableCell>
                    <TableCell>{template.debit}</TableCell>
                    <TableCell>{template.credit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default AvailableTemplates