import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export const StatCard = ({ title, value, icon, change, suffix = "" }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toFixed(2)} {suffix}</div>
      <p className="text-xs text-muted-foreground">
        +{change}% from last year
      </p>
    </CardContent>
  </Card>
)

export const ChartCard = ({ title, data, type = "bar" }) => (
  <Card className="col-span-4">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill="#8884d8" name="Income" />
            <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="mrr" stroke="#8884d8" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

export const KPICard = ({ title, kpis }) => (
  <Card className="col-span-2">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        {kpis.map(({ label, value }) => (
          <div key={label}>
            <dt className="font-medium text-muted-foreground">{label}</dt>
            <dd className="text-2xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </CardContent>
  </Card>
)