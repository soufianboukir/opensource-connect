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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { useState } from "react"
import clsx from "clsx"

export function ViewApplication({ applicationData, editable = false }: {
  applicationData: any
  editable?: boolean
}) {
  const user = applicationData.applicant
  const project = applicationData.project
  const [message, setMessage] = useState(applicationData.message || "")

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
            Submitted {new Date(applicationData.createdAt).toLocaleDateString()} - Status:{" "}
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
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/user/${user?.username}`}
                className="font-medium hover:underline"
              >
                {user?.name}
              </Link>
              <div className="text-sm text-muted-foreground">@{user?.username}</div>
            </div>
          </div>
          {project && (
            <div className="rounded-lg border p-4 bg-muted/20">
              <Link
                href={`/project/${project.uniqueId}`}
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

        {/* Footer */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {editable && <Button type="submit" className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
