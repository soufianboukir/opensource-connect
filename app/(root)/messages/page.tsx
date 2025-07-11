'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ClipboardList, Handshake, Search, Send, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import moment from 'moment'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/ui/site-header'
import Loading from '@/components/loading'
import { getConversations, getMessagesByConversation } from '@/services/communication'
import { useSession } from 'next-auth/react'
import { EmptyState } from '@/components/empty-state'
import Link from 'next/link'

const defaultImage = 'https://via.placeholder.com/150'


export default function MessagesPage() {
  const [query, setQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messages, setMessages] = useState([])
  const [loadConvs, setLoadConvs] = useState(false)
  const [loadMssgs, setLoadMssgs] = useState(false)
  const { data: session, status } = useSession()

  const messagesEndRef = useRef(null)

  // const conversationsToShow = conversations.filter((c) => {
  //   const other = c.participants.find((p) => p._id !== session?.user.id)
  //   return other?.name.toLowerCase().includes(query.toLowerCase())
  // })

  const fetchConversations = async () =>{
    try{
        setLoadConvs(true)
        const response = await getConversations()
        console.log(response);
        
        if(response.status === 200){
            setConversations(response.data.conversations)
        }
    }catch{

    }finally{
        setLoadConvs(false)
    }
  }

  
  const otherParticipant = selectedConversation?.participants.find(p => p._id !== session?.user.id)

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg = {
      _id: `msg-${Date.now()}`,
      sender: { _id: userData.id },
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
    }

    setMessages([...messages, newMsg])
    setNewMessage('')

    setTimeout(() => {
      const reply = {
        _id: `msg-${Date.now()}-reply`,
        sender: { _id: otherParticipant._id },
        text: 'Got it!',
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, reply])
    }, 1000)
  }

  const deleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m._id !== id))
  }

  useEffect(() =>{
    fetchConversations()
  },[])

  useEffect(() =>{
    const fetchMessagesByConversation = async () =>{
      try{
          setLoadMssgs(true)          
          const response = await getMessagesByConversation(selectedConversation._id)
          
          if(response.status === 200){
              setMessages(response.data.messages)
          }
      }catch{
  
      }finally{
        setLoadMssgs(false)
      }
    }
    fetchMessagesByConversation()
  },[selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0])
    }
  }, [conversations, selectedConversation])

  if(status === 'loading') return null

  return (

    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title="Messages" />
            <div className="flex h-[90vh] bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
                <div className="w-1/3 border-gray-200 bg-white dark:bg-black flex flex-col">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search conversations..."
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              className="pl-10 py-2 rounded-full bg-gray-100 dark:bg-muted/60 border-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {conversations && conversations.map((conv) => {
                        const participant = conv?.participants?.find((p) => p._id !== session?.user.id)
                        console.log(conv);
                        
                        
                            return (
                            <div
                                key={conv._id}
                                className={cn(
                                'flex items-center p-4 gap-3 cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-muted/20',
                                selectedConversation?._id === conv._id &&
                                    'bg-blue-100/30 dark:bg-muted/40 border-l-4'
                                )}
                                onClick={() => setSelectedConversation(conv)}
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={participant?.avatarUrl} />
                                    <AvatarFallback>{participant?.name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold truncate">{participant?.name}</h3>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {moment(conv.updatedAt).fromNow()}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {conv?.lastMessage.text}
                                    </div>
                                </div>
                            </div>
                            )
                    })}

                    {loadConvs && <Loading message='Laoding cnversations...'/>}
                        {conversations.length === 0 && !loadConvs && (
                          <EmptyState message='No conversation found' description='Try to propose collaborations to other developers or post projects to get applications'/>
                        )}
                    </div>
                </div>

                <div className="w-2/3 flex flex-col">
                    {selectedConversation && (
                    <>
                        <div className="flex items-center justify-between w-full dark:bg-black/60 border-b border-gray-200 dark:border-gray-900 p-4">
                          <div className="flex gap-4 items-center">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={otherParticipant?.avatarUrl} />
                              <AvatarFallback>{otherParticipant?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-lg">
                                <Link href={`/user/${otherParticipant.username}`} className='hover:text-sky-700 duration-200'>  
                                  {otherParticipant?.name}
                                </Link>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Last active {moment(selectedConversation.updatedAt).fromNow()}
                              </div>
                            </div>
                          </div>

                          {selectedConversation?.project && (
                            <Button
                              variant="outline"
                              className="text-sm font-medium dark:hover:bg-muted/30"
                            >
                              <ClipboardList />
                              Project Application
                            </Button>
                          )}
                          {!selectedConversation?.project && (
                            <Button
                              variant="outline"
                              className="text-sm font-medium dark:hover:bg-muted/30"
                            >
                              <Handshake className='w-8 h-8'/>
                              Collaboration Proposal
                            </Button>
                          )}
                        </div>


                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-black/60 custom-scrollbar">
                        {messages && messages.map((msg) => {
                            const isOwnMessage = msg.sender._id === session?.user.id
                            return (
                            <div key={msg._id} className={cn('flex group', isOwnMessage ? 'justify-end' : 'justify-start')}>
                                <div
                                className={cn(
                                    'relative max-w-xl p-4 rounded-2xl shadow transition-all duration-200',
                                    !isOwnMessage
                                    ? 'bg-white dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 rounded-tl-none'
                                    : 'bg-blue-600 text-white rounded-tr-none'
                                )}
                                >
                                {isOwnMessage && (
                                    <button
                                    onClick={() => deleteMessage(msg._id)}
                                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow cursor-pointer"
                                    title="Delete message"
                                    >
                                    <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <p className="leading-relaxed break-words">{msg.text}</p>
                                <div className={cn('text-xs mt-2 opacity-70', isOwnMessage ? 'text-blue-100' : 'text-gray-500')}>
                                    {moment(msg.createdAt).fromNow()}
                                </div>
                                </div>
                            </div>
                            )
                        })}
                        {loadMssgs && <Loading message='Loading your messages'/>}
                        <div ref={messagesEndRef} />
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-900 p-4 bg-white dark:bg-black/60">
                            <div className="flex gap-3 items-center">
                                <Input
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                className="flex-1 rounded-full bg-gray-100 dark:bg-inherit border-3 px-4 py-5 focus:ring-2 focus:ring-blue-500 transition"
                                />
                                <Button
                                onClick={sendMessage}
                                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition disabled:opacity-50"
                                disabled={!newMessage.trim()}
                                >
                                <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </>
                    )}
                </div>
                </div>
        </SidebarInset>
    </SidebarProvider>
    
  )
}
