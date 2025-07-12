'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Star } from 'lucide-react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/ui/site-header'

const feedbackTypes = ['General', 'Bug Report', 'Feature Request', 'Project Experience', 'Other']

export default function FeedbackPage() {
    const [type, setType] = useState('General')
    const [rating, setRating] = useState(0)
    const [message, setMessage] = useState('')
    const [loading,setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!message.trim()) {
            toast.error('Feedback message is required.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, rating, message }),
            })
            
            if (res.ok) {
                toast.success('Thank you for your feedback!')
                setMessage('')
                setRating(0)
            } else {
                toast.error('Failed to send feedback.')
            }
        } catch {
            toast.error('An unexpected error occurred.')
        }finally{
            setLoading(false)
        }
    }
  

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title="Submit a feedback" />
            <div className="md:w-[60%] w-[90%] mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold tracking-tight">How Was Your Experience?</h1>

                <div className="space-y-2 mx-auto w-[100%]">
                    <Label>Type of Feedback</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {feedbackTypes.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Rate your experience</Label>
                    <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                        key={i}
                        className={`w-6 h-6 cursor-pointer transition-colors ${
                            i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                        }`}
                        onClick={() => setRating(i)}
                        />
                    ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Your Message</Label>
                    <Textarea
                    rows={5}
                    placeholder="Tell us more..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <Button onClick={handleSubmit} className="bg-blue-600 text-white dark:bg-blue-700 hover:bg-blue-700" disabled={loading}>
                    {
                        loading ?'Sending...' : 'Send feedback'
                    }
                </Button>
            </div>
      </SidebarInset>
    </SidebarProvider>
    
  )
}
