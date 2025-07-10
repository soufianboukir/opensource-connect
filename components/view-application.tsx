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
import { ExternalLink } from "lucide-react"
import { useState } from "react"
import clsx from "clsx"
import { Application } from "@/interfaces"
import { toast } from "sonner"
import { editApplication } from "@/services/application"

export function ViewApplication({ applicationData, editable = false }: {
  applicationData: Application
  editable?: boolean
}) {
  
  const user = applicationData.applicant  
  const project = applicationData.project
  const [message, setMessage] = useState(applicationData.message || "")
  const [loading, setLoading] = useState(false);

  const saveChanges = async () =>{
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
      const response = await editApplication(applicationData._id,message)
      if(response.status === 200){
        toast.success('Application message updated successfully')
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
        <Button variant="outline">View Application</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {applicationData.type === "project application"
              ? "Project Application"
              : "Collaboration Request"}
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
          {project && (
            <div className="rounded-lg border p-4 bg-muted/20">
              <Link
                href={`/project/${project.publicId}`}
                className="font-medium flex items-center gap-1 hover:underline"
              >
                {project.title}
                <ExternalLink className="w-4 h-4" />
              </Link>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {project.description}
              </p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            {editable ? (
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your application message..."
                rows={4}
              />
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {message || <em>No message provided.</em>}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {editable && <Button onClick={saveChanges} type="submit" className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
