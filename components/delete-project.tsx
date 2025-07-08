"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { deleteProject } from "@/services/project"

interface DeleteProjectProps {
  projectId: string
  open: boolean
  onOpenChange: (val: { open: boolean, projectId: string }) => void
  onDelete: (projectId: string) => void
}

export function DeleteProject({ projectId, open, onOpenChange, onDelete }: DeleteProjectProps) {
  const [confirmInput, setConfirmInput] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)
  
  React.useEffect(() => {
    if (!open) {
      setConfirmInput("")
    }
  }, [open])

  const isMatch = confirmInput === "delete my project"

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isMatch) return

    setIsDeleting(true)
    try {
      const response = await deleteProject(projectId)
      if (response.status === 200) {
        toast.success("Project deleted successfully!")
        onDelete(projectId)
        onOpenChange({open:false, projectId: ''})
      } else {
        throw new Error("Delete failed")
      }
    } catch {
      toast.error("Failed to delete project. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => onOpenChange({ open: val, projectId })}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleDelete}>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              To delete this project, please type <strong>delete my project</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Label htmlFor="confirmName">Confirm here</Label>
            <Input
              id="confirmName"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="Type here"
              required
              autoFocus
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={!isMatch || isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
