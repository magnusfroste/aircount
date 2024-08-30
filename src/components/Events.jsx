import React, { useState } from 'react'
import { useEvents } from '../integrations/supabase/hooks/events'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'
import AddEventForm from './AddEventForm'
import EditEventForm from './EditEventForm'

const Events = () => {
  const { data: events, isLoading, error } = useEvents()
  const [editingEvent, setEditingEvent] = useState(null)

  if (isLoading) return <div>Loading events...</div>
  if (error) return <div>Error loading events: {error.message}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <AddEventForm />
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{format(new Date(event.date), 'PPP')}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <Button onClick={() => setEditingEvent(event)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Event</h2>
            <EditEventForm 
              event={editingEvent} 
              onCancel={() => setEditingEvent(null)} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Events
