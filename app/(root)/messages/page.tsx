'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader, Search, Send, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import moment from 'moment'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/ui/site-header'
import Loading from '@/components/loading'
import { deleteMessageService, getConversations, getMessagesByConversation, sendMessage } from '@/services/communication'
import { useSession } from 'next-auth/react'
import { EmptyState } from '@/components/empty-state'
import Link from 'next/link'
import { toast } from 'sonner'
import Pusher from 'pusher-js'
import { Conversation, Message, User } from '@/interfaces'

interface NewMessagePayload {
  message: Message
  conversationId: string
}

export default function MessagesPage() {
  const [query, setQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const conversationsToShow = query ? filteredConversations : conversations
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadConvs, setLoadConvs] = useState(false)
  const [loadMssgs, setLoadMssgs] = useState(false)
  const [sending, setSending] = useState(false)
  const { data: session, status } = useSession()
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const fetchConversations = async () => {
    try {
      setLoadConvs(true)
      const response = await getConversations()
      if (response.status === 200) {
        setConversations(response.data.conversations)
      }
    } finally {
      setLoadConvs(false)
    }
  }

  const otherParticipant = selectedConversation?.participants.find(
    (p: User) => p._id !== session?.user.id
  )

  const sendNewMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Please type a message')
      return
    }
    if (!selectedConversation) return

    try {
      setSending(true)
      const response = await sendMessage(selectedConversation._id, newMessage)
      if (response.status === 200) {
        setNewMessage('')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setSending(false)
    }
  }

  const deleteMessage = (id: string) => {
    toast.promise(deleteMessageService(id), {
      loading: 'Deleting...',
      success: () => {
        setMessages((prev) => prev.filter((m) => m._id !== id))
        return 'Message deleted successfully'
      },
      error: (err) => err.data.message
    })
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0])
    }
  }, [conversations, selectedConversation])

  useEffect(() => {
    if (!selectedConversation) return
    const fetchMessages = async () => {
      try {
        setLoadMssgs(true)
        const response = await getMessagesByConversation(selectedConversation._id)
        if (response.status === 200) {
          setMessages(response.data.messages)
        }
      } finally {
        setLoadMssgs(false)
      }
    }
    fetchMessages()
  }, [selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    })

    conversations.forEach((conv) => {
      if (!conv._id) return
      const channel = pusher.subscribe(`conversation-${conv._id}`)

      const handleNewMessage = (data: NewMessagePayload) => {
        const { message, conversationId } = data
        const isOwnMessage = message.sender._id === session?.user.id

        if (!isOwnMessage) {
          try {
            const audio = new Audio('/notification-audio.wav')
            audio.play()
          } catch (err) {
            console.error('Failed to play audio', err)
          }
        }

        if (selectedConversation?._id === conversationId) {
          setMessages((prev) => [...prev, message])
        }

        setConversations((prevConvs) => {
          const updatedConvs = prevConvs.map((c) =>
            c._id === conversationId
              ? { ...c, lastMessage: message, updatedAt: message.createdAt }
              : c
          )
          return updatedConvs.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
        })
      }

      channel.bind('new-message', handleNewMessage)

      return () => {
        channel.unbind('new-message', handleNewMessage)
        pusher.unsubscribe(`conversation-${conv._id}`)
      }
    })

    return () => {
      pusher.disconnect()
    }
  }, [conversations, selectedConversation?._id, session?.user.id])

  useEffect(() => {
    const searchConv = () => {
      const lowerTerm = query.toLowerCase()
      return conversations.filter((conversation) => {
        const participant = conversation.participants.find(
          (p:User) => p._id !== session?.user.id
        )
        return participant
          ? participant.name?.toLowerCase().includes(lowerTerm) ||
              participant.username?.toLowerCase().includes(lowerTerm)
          : false
      })
    }
    setFilteredConversations(query ? searchConv() : conversations)
  }, [query, conversations, session?.user.id])

  if (status === 'loading') return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title="Messages" />
        <div className="flex flex-col md:flex-row h-[90vh] bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
          
          <div className="w-full md:w-1/3 border-gray-200 bg-white dark:bg-black flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 py-2 rounded-full bg-gray-100 dark:bg-muted/60 border-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-row md:flex-col">
              {conversationsToShow.map((conv) => {
                const participant = conv?.participants?.find(
                  (p: User) => p._id !== session?.user.id
                )

                return (
                  <div
                    key={conv._id}
                    className={cn(
                      'flex items-center p-4 gap-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-muted/20',
                      selectedConversation?._id === conv._id &&
                        'bg-blue-100/30 dark:bg-muted/40 border-l-4'
                    )}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={participant?.avatarUrl} />
                      <AvatarFallback>
                        {participant?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 hidden md:block">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold truncate">
                          {participant?.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {moment(conv.updatedAt).fromNow()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {conv?.lastMessage?.text}
                      </div>
                    </div>
                  </div>
                )
              })}

              {loadConvs && <Loading message="Loading conversations..." />}
              {!loadConvs && conversationsToShow.length === 0 && (
                <EmptyState
                  message="No conversation found"
                  description="Try starting a chat with another developer."
                />
              )}
            </div>
          </div>

          <div className="w-full md:w-2/3 flex flex-col">
            {selectedConversation && (
              <>
                <div className="flex items-center justify-between dark:bg-black/60 border-b border-gray-200 dark:border-gray-900 p-4">
                  <div className="flex gap-4 items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={otherParticipant?.avatarUrl} />
                      <AvatarFallback>{otherParticipant?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={`/user/${otherParticipant?.username || 'unknown'}`}
                        className="font-semibold text-lg hover:text-sky-700"
                      >
                        {otherParticipant?.name}
                      </Link>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last active {moment(selectedConversation.updatedAt).fromNow()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/60 custom-scrollbar max-h-[80vh]">
                  {messages.map((msg) => {
                    const isOwnMessage = msg.sender._id === session?.user.id
                    return (
                      <div key={msg._id} className={cn('flex group', isOwnMessage ? 'justify-end' : 'justify-start')}>
                        <div
                          className={cn(
                            'relative max-w-xl p-4 rounded-2xl shadow',
                            isOwnMessage
                              ? 'bg-blue-600 text-white rounded-tr-none'
                              : 'bg-white dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 rounded-tl-none'
                          )}
                        >
                          {isOwnMessage && (
                            <button
                              onClick={() => deleteMessage(msg._id)}
                              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <p className="break-words">{msg.text}</p>
                          <div className={cn('text-xs mt-2 opacity-70', isOwnMessage ? 'text-blue-100' : 'text-gray-500')}>
                            {moment(msg.createdAt).fromNow()}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {loadMssgs && <Loading message="Loading messages..." />}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white dark:bg-black/60 border-t border-gray-200 dark:border-gray-900">
                  <div className="flex gap-3 items-center">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendNewMessage()}
                      className="flex-1 rounded-full bg-gray-100 dark:bg-inherit px-4 py-5 focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      onClick={sendNewMessage}
                      className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      disabled={!newMessage.trim() || sending}
                    >
                      {sending ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
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
