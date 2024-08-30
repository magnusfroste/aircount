import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateEvent } from '../integrations/supabase/hooks/events'
import { toast } from 'sonner'

const EditEventForm = ({ event, onCancel }) => {
  const [editedEvent, setEditedEvent] = useState(event)
  const updateEventMutation = useUpdateEvent()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!editedEvent.name || !editedEvent.date || !editedEvent.location) {
      toast.error('Please fill in all required fields')
      return
    }
    updateEventMutation.mutate(editedEvent, {
      onSuccess: () => {
        toast.success('Event updated successfully')
        onCancel()
      },
      onError: (error) => {
        toast.error(`Failed to update event: ${error.message}`)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Event Name"
        value={editedEvent.name}
        onChange={(e) => setEditedEvent({ ...editedEvent, name: e.target.value })}
        required
      />
      <Input
        type="date"
        value={editedEvent.date}
        onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
        required
      />
      <Input
        placeholder="Location"
        value={editedEvent.location}
        onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
        required
      />
      <Textarea
        placeholder="Description"
        value={editedEvent.description}
        onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={updateEventMutation.isPending}>
          {updateEventMutation.isPending ? 'Updating...' : 'Update Event'}
        </Button>
      </div>
    </form>
  )
}

export default EditEventForm