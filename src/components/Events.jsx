import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns'

const Events = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
      if (error) throw error
      return data
    },
  })

  if (isLoading) return <div>Loading events...</div>
  if (error) return <div>Error loading events: {error.message}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{format(new Date(event.date), 'PPP')}</TableCell>
              <TableCell>{event.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Events