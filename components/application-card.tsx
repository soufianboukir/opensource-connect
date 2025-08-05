import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Application } from '@/interfaces'
import Link from 'next/link'
import { Badge } from './ui/badge'
import { ExternalLink } from 'lucide-react'
import clsx from 'clsx'
import moment from 'moment'
import { ApplicationActionDialog } from './application-actions'
import { ViewApplication } from './view-application'
import { StartConversation } from './start-conversation'
export function ApplicationCard({
  data,
  direction,
}: {
  data: Application
  direction: 'incoming' | 'outgoing'
}) {
  const user = direction === 'incoming' ? data.applicant : data.toUser
  const isPending = data.status === 'pending'
  const isAccepted = data.status === 'accepted'
  const isRejected = data.status === 'rejected'
  const isProject = data.type === 'project application'

  return (
    <div className={"border rounded-lg shadow-sm hover:shadow-md relative transition-shadow p-5 space-y-4"}>
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/user/${user?.username}`} className="font-semibold hover:underline text-base">
              {user?.name}
            </Link>
            <span className="text-sm text-muted-foreground">@{user?.username}</span>

            {user?.experienceLevel && (
              <Badge variant="outline" className="capitalize ml-1">{user.experienceLevel}</Badge>
            )}
            {user?.openToWork && (
              <Badge variant="secondary">Open to work</Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{user?.headLine}</div>
        </div>

        <div className="text-sm text-muted-foreground">
            {moment(data.createdAt).fromNow()}
        </div>
      </div>

      <div className="pl-3 border-l-4 border-primary/20">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={isProject ? "default" : "secondary"} className="capitalize">
            {data.type}
          </Badge>
          <Badge
            className={clsx("capitalize", {
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': data.status === 'accepted',
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': data.status === 'rejected',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': data.status === 'pending',
            })}
          >
            {data.status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground whitespace-pre-line line-clamp-3">
          {data.message || <span className="italic">No message provided.</span>}
        </div>
      </div>

      {data.project && (
        <div className="p-3 bg-muted/10 rounded-md">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href={`/project/${data.project.publicId}`}
                className="font-medium hover:underline flex items-center gap-1"
              >
                {data.project.title}
                <ExternalLink className="h-3 w-3" />
              </Link>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {data.project.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {data.project.techStackNeeded?.slice(0, 3).map(tech => (
                <Badge key={tech} variant="outline">{tech}</Badge>
              ))}
              {data.project.techStackNeeded?.length > 3 && (
                <Badge variant="outline">+{data.project.techStackNeeded.length - 3}</Badge>
              )}
            </div>
          </div>
        </div>
      )}

        <br />

      {
        isRejected && (
              <div className="flex gap-2 justify-end pt-2 absolute bottom-4 mt-4 right-4">
                <ApplicationActionDialog
                  actionType="cancel"
                  triggerLabel={"Delete"}
                  applicationId={data._id}/>
              </div>
        )
      }
      {
        isAccepted && (direction === 'outgoing' || direction === 'incoming') && (
        <div className="flex gap-2 justify-end pt-2 absolute bottom-4 mt-4 right-4">
          <StartConversation applicationData={data}/>
        </div>
        )
      }
      {isPending && (
        <div className="flex gap-2 justify-end pt-2 absolute bottom-4 mt-4 right-4">
          <ViewApplication applicationData={data} editable={direction === 'outgoing'} />
          {direction === 'incoming' ? (
            <>
              <ApplicationActionDialog 
                actionType="reject"
                triggerLabel={"Reject"}
                applicationId={data._id}/>
               <ApplicationActionDialog
                actionType="accept"
                triggerLabel={"Accept"}
                applicationId={data._id}/>
            </>
          ) : (
            <>
            <ApplicationActionDialog
              actionType="cancel"
              triggerLabel={"Cancel"}
              applicationId={data._id}
            />
            </>
          )}
        </div>
      )}
    </div>
  )
}
