'use client'

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
import { Send, UserPlus } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { sendApplication } from "@/services/application"
import { toast } from "sonner"

export function ApplicationSubmission({ proposeCollaboration, project, toUser }: {proposeCollaboration?: boolean, project?: string, toUser?: string}) {
    const [loading,setLoading] = useState(false);
    const [message,setMessage] = useState<string>('');

    const handleSubmit = async () =>{
        try{            
            if(message === ''){
                toast.error('Please type a message')
                return
            }
            if(message.length <= 10){
                toast.error('Please type a message greater than 10 charachters')
                return
            }
            setLoading(true)
            const response = await sendApplication(toUser!,proposeCollaboration ? 'propose collaboration' : 'project application',message,project)
            if(response.status === 200){
                toast.success('Application has been submitted successfully')
            }
        }catch(error: any){
            if(error.response.data.message){
                toast.error(error.response.data.message)
            }else{
                toast.error('An error occured. please try again')
            }
        }finally{
            setLoading(false)
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                {
                    proposeCollaboration ?
                    <Button className="bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700">
                        <span className="hidden md:block">Propose collaboration</span>
                        <UserPlus className="block md:hidden"/>
                    </Button> 
                    : 
                    <div className="w-9 h-9 rounded-full border flex items-center justify-center bg-gray-100 dark:bg-muted/50 cursor-pointer">
                        <Send className="w-4 h-4 text-gray-500 dark:text-gray-200"/>
                    </div>
                }
                
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        { proposeCollaboration ? "Propose a collaboration" : "Apply to This Project"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        { proposeCollaboration ? "Introduce yourself and explain what kind of collaboration you're looking for. The developer will get back to you if interested." : "Provide a short message. The project owner will review your request."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-1">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={loading} onClick={handleSubmit}>
                        {
                            loading ? "Sending..." : "Send Application" 
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
