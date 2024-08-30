import React, { useState } from 'react'
import { useEvents, useDeleteEvent } from '../integrations/supabase/hooks/events'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { format } from 'date-fns'
import { toast } from 'sonner'
import AddEventForm from './AddEventForm'
import EditEventForm from './EditEventForm'
import { useSupabaseAuth } from '../integrations/supabase/auth'

const Events = () => {
  const { session } = useSupabaseAuth()
  const { data: events, isLoading, error } = useEvents(session.user.id)
  const [editingEvent, setEditingEvent] = useState(null)
  const deleteEventMutation = useDeleteEvent()

  if (isLoading) return <div>Loading events...</div>
  if (error) return <div>Error loading events: {error.message}</div>

  const handleDeleteEvent = (id) => {
    deleteEventMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Event deleted successfully')
      },
      onError: (error) => {
        toast.error(`Failed to delete event: ${error.message}`)
      }
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <AddEventForm userId={session.user.id} />
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
                <Button onClick={() => setEditingEvent(event)} className="mr-2">Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the event.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
              userId={session.user.id}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Events
