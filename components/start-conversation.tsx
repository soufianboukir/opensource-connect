'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useState } from "react"
import clsx from "clsx"
import { Application } from "@/interfaces"
import { toast } from "sonner"
import { Mail } from "lucide-react"
import { startChating } from "@/services/communication"

export function StartConversation({ applicationData }: {
  applicationData: Application
  editable?: boolean
}) {
  
  const user = applicationData.applicant  
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false);

  const startConversation = async () =>{
    if(message === ''){
      toast.error('Please type a message')
      return
    }
    if(message.length <= 0){
      toast.error('Please type a message greater than 10 charachters')
      return
    }
    try{
      setLoading(true)
      
      const response = await startChating(applicationData.applicant._id || applicationData.toUser._id,message,applicationData.project?._id)
      if(response.status === 200){
        toast.success('New conversation started successfully!')
      }
    }catch(error:any){
      if(error.response.data.message){
        toast.error(error.response.data.message)
      }else{
        toast.error('An error occured. try again')
      }
    }finally{
      setLoading(false)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Mail className="w-4 h-4"/>Message</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Start conversation for 
            {applicationData.type === "project application"
              ? " Project Application"
              : " Collaboration Request"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Submitted on {new Date(applicationData.createdAt).toLocaleDateString()} - Status:{" "}
            <Badge
                className={clsx("capitalize", {
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': applicationData.status === 'pending',
                })}
            >
              {applicationData.status}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatarUrl || applicationData.toUser.avatarUrl} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/user/${user?.username || applicationData.toUser.username}`}
                className="font-medium hover:underline"
              >
                {user?.name || applicationData.toUser.name}
              </Link>
              <div className="text-sm text-muted-foreground">@{user?.username || applicationData.toUser.username}</div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message and the developer will be notified"
                rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={startConversation} type="submit" className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? "Sending..." : "Send message"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}