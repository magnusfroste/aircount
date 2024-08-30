import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAddEvent } from '../integrations/supabase/hooks/events'
import { toast } from 'sonner'

const AddEventForm = () => {
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '', description: '' })
  const addEventMutation = useAddEvent()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newEvent.name || !newEvent.date || !newEvent.location) {
      toast.error('Please fill in all required fields')
      return
    }
    addEventMutation.mutate(newEvent, {
      onSuccess: () => {
        setNewEvent({ name: '', date: '', location: '', description: '' })
        toast.success('Event added successfully')
      },
      onError: (error) => {
        toast.error(`Failed to add event: ${error.message}`)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Event Name"
        value={newEvent.name}
        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
        required
      />
      <Input
        type="date"
        value={newEvent.date}
        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        required
      />
      <Input
        placeholder="Location"
        value={newEvent.location}
        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
        required
      />
      <Textarea
        placeholder="Description"
        value={newEvent.description}
        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
      />
      <Button type="submit" disabled={addEventMutation.isPending}>
        {addEventMutation.isPending ? 'Adding...' : 'Add Event'}
      </Button>
    </form>
  )
}

export default AddEventForm