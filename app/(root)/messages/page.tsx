'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Send, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import moment from 'moment'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/ui/site-header'
import Loading from '@/components/loading'

const defaultImage = 'https://via.placeholder.com/150'

const userData = {
  id: 'user1',
  name: 'You',
}

const exampleConversations = [
  {
    _id: 'conv1',
    updatedAt: new Date().toISOString(),
    lastMessage: 'Hey, how are you?',
    participants: [
      { _id: 'user1', name: 'You', profilePictureUrl: null },
      { _id: 'user2', name: 'Alice', profilePictureUrl: null },
    ],
  },
  {
    _id: 'conv2',
    updatedAt: new Date().toISOString(),
    lastMessage: 'Let’s catch up tomorrow.',
    participants: [
      { _id: 'user1', name: 'You', profilePictureUrl: null },
      { _id: 'user3', name: 'Bob', profilePictureUrl: null },
    ],
  },
]

const exampleMessages = [
  {
    _id: 'msg1',
    sender: { _id: 'user1' },
    text: 'Hello Alice!',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'msg2',
    sender: { _id: 'user2' },
    text: 'Hi! How are you?',
    createdAt: new Date().toISOString(),
  },
]

export default function MessagesPage() {
  const [query, setQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [conversations, setConversations] = useState(exampleConversations)
  const [selectedConversation, setSelectedConversation] = useState(exampleConversations[0])
  const [messages, setMessages] = useState(exampleMessages)
  const [loadConvs, setLoadConvs] = useState(false)
  const [loadMssgs, setLoadMssgs] = useState(false)

  const messagesEndRef = useRef(null)

  const conversationsToShow = conversations.filter((c) => {
    const other = c.participants.find((p) => p._id !== userData.id)
    return other?.name.toLowerCase().includes(query.toLowerCase())
  })

  const otherParticipant = selectedConversation?.participants.find(p => p._id !== userData.id)

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

    // Simulate response from other user
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' })
  }, [messages])

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
                    {conversationsToShow.map((conv) => {
                        const participant = conv.participants.find((p) => p._id !== userData.id)
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
                                <Avatar className="w-12 h-12 shadow-md ring-2 ring-blue-300 dark:ring-blue-600">
                                <Image
                                width={100}
                                height={100}
                                    src={participant?.profilePictureUrl || defaultImage}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full object-cover transition border-2 border-white"
                                />
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold truncate">{participant?.name}</h3>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {moment(conv.updatedAt).fromNow()}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {conv.lastMessage}
                                </div>
                                </div>
                            </div>
                            )
                    })}

                    {loadConvs && <Loading message='Laoding cnversations...'/>}
                    {conversations.length === 0 && !loadConvs && (
                        <h1 className="text-xl mt-2 ml-2">No conversations found.</h1>
                    )}
                    </div>
                </div>

                <div className="w-2/3 flex flex-col">
                    {selectedConversation && (
                    <>
                        <div className="flex items-center justify-between w-full dark:bg-black/60 border-b border-gray-200 dark:border-gray-900 p-4">
                            <div className="flex gap-4">
                                    <Avatar className="w-12 h-12 shadow-md ring-2 ring-blue-300 dark:ring-blue-600">
                                        <Image
                                        width={100}
                                        height={100}
                                            src={otherParticipant?.profilePictureUrl || defaultImage}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full object-cover transition border-2 border-white"
                                        />
                                        </Avatar>
                                    <div>
                                    <div className="font-semibold text-lg">{otherParticipant?.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Last active {moment(selectedConversation.updatedAt).fromNow()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-black/60 custom-scrollbar">
                        {messages.map((msg) => {
                            const isOwnMessage = msg.sender._id === userData.id
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
