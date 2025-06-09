import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface CheckInButtonProps {
  eventId: string
}

export function CheckInButton({ eventId }: CheckInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleCheckIn = async () => {
    if (!user) {
      toast.error('Please sign in to check in')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          eventId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check in')
      }

      toast.success('Successfully checked in!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to check in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckIn}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? 'Checking in...' : 'Check In'}
    </Button>
  )
} 