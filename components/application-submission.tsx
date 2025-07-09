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
import { Send } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Textarea } from "./ui/textarea"

export function ApplicationSubmission({ proposeCollaboration }: {proposeCollaboration?: boolean}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {
                    proposeCollaboration ?
                    <Button className="bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700">
                        Propose collaboration
                    </Button> 
                    : <button>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="w-9 h-9 rounded-full border flex items-center justify-center bg-gray-100 dark:bg-muted/50 cursor-pointer">
                                    <Send className="w-4 h-4 text-gray-500 dark:text-gray-200"/>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                Apply to this project
                            </TooltipContent>
                        </Tooltip>
                    </button> 
                }
                
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        { proposeCollaboration ? "Propose a collaboration" : "Apply to This Project"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        { proposeCollaboration ? "Introduce yourself and explain what kind of collaboration you're looking for. The developer will get back to you if interested." : "Provide a short message and your preferred contact method. The project owner will review your request."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-1">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        placeholder="Write a short introduction or why you're interested..."
                        className="min-h-[100px]"
                    />
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-between gap-2">
                    <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                    </DialogClose>
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                    Send Application
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
