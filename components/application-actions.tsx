'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { applicationAction } from '@/services/application'
import { toast } from 'sonner'

type Props = {
  actionType: 'accept' | 'reject' | 'cancel'
  applicationId: string
  triggerLabel?: React.ReactNode
  onCompleted?: () => void
}

type ActionText = {
  accept:{
    title: string,
    description: string,
    button: 'Accept' | 'Reject' | 'Cancel',
    color:"default" | "destructive" | "link" | "outline" | "secondary" | "ghost",
  },
  reject:{
    title: string,
    description: string,
    button: 'Accept' | 'Reject' | 'Cancel',
    color:"default" | "destructive" | "link" | "outline" | "secondary" | "ghost",
  },
  cancel:{
    title: string,
    description: string,
    button: 'Accept' | 'Reject' | 'Cancel',
    color:"default" | "destructive" | "link" | "outline" | "secondary" | "ghost",
  }
}

const actionText:ActionText = {
  accept: {
    title: 'Accept Application',
    description: 'Are you sure you want to accept this application? The applicant will be notified.',
    button: 'Accept',
    color: 'default',
  },
  reject: {
    title: 'Reject Application',
    description: 'Are you sure you want to reject this application? The applicant will be notified.',
    button: 'Reject',
    color: 'destructive',
  },
  cancel: {
    title: 'Cancel Application',
    description: 'Do you want to cancel your application? You will not be considered for this project.',
    button: 'Cancel',
    color: 'destructive',
  },
}

export function ApplicationActionDialog({ actionType, applicationId, triggerLabel = 'Take Action', onCompleted }: Props) {
  const [loading, setLoading] = useState(false)
  const { title, description, button, color } = actionText[actionType]

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await applicationAction(applicationId,actionType)
      if(response.status === 200){
        toast.success(response.data.message)
        window.location.reload()
      }
    } catch (error: any) {
      if(error.response.data.message){
          toast.error(error.response.data.message)
      }else{
          toast.success('An error occured! please try again')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        
        <Button variant={actionText[actionType].color} size={'sm'}>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            variant={color === 'destructive' ? 'destructive' : 'default'}
            disabled={loading}
          >
            {loading ? 'Processing...' : button}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
