"use client"
import { useState, useEffect, useRef } from "react"
import { Send, X, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { API_BASE_URL } from "@/lib/apiConfig"

interface Message {
    _id: string;
    sender: string;
    recipient: string;
    text: string;
    createdAt: string;
}

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
    receiver: any;
    currentUser: any;
}

export default function ChatWindow({ isOpen, onClose, receiver, currentUser }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen && receiver) {
            fetchMessages()
            const interval = setInterval(fetchMessages, 3000) // Poll every 3s
            return () => clearInterval(interval)
        }
    }, [isOpen, receiver])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/chat/${receiver._id}`, {
                headers: { "token": `Bearer ${currentUser?.accessToken}` }
            })
            const data = await res.json()
            if (Array.isArray(data)) setMessages(data)
        } catch (err) {
            console.error("Error fetching messages:", err)
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/chat/send`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "token": `Bearer ${currentUser?.accessToken}`
                },
                body: JSON.stringify({
                    recipientId: receiver._id,
                    text: newMessage
                })
            })
            if (res.ok) {
                setNewMessage("")
                fetchMessages()
            }
        } catch (err) {
            console.error("Error sending message:", err)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen || !receiver) return null

    return (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-[60] border-l border-pink-100 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Chat Header */}
            <div className="p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="size-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                             {receiver.personalDetails?.profilePic ? (
                                <img src={receiver.personalDetails.profilePic} className="w-full h-full object-cover" />
                             ) : <User className="size-5" />}
                        </div>
                        <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 leading-none">{receiver.personalDetails?.fullname || receiver.username}</h3>
                        <p className="text-[10px] text-pink-500 font-black uppercase tracking-widest mt-1">Matched</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-pink-100 rounded-full transition-colors text-slate-400">
                    <X className="size-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100 mb-2">
                         <Heart className="size-3 text-pink-600 fill-pink-600" />
                         <span className="text-[10px] text-pink-600 font-black uppercase tracking-widest">You are connected</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Conversation is encrypted and private</p>
                </div>

                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 pb-20">
                        <Send className="size-12 mb-4" />
                        <p className="text-sm font-medium">No messages yet. Say hi!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender === currentUser._id
                        return (
                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                                    isMe ? 'bg-pink-600 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-pink-50'
                                }`}>
                                    <p className="leading-relaxed">{msg.text}</p>
                                    <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-pink-200' : 'text-slate-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-pink-100 bg-white">
                <div className="relative flex items-center">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..." 
                        className="w-full h-12 pl-4 pr-12 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                        disabled={loading}
                    />
                    <button 
                        type="submit"
                        disabled={loading || !newMessage.trim()}
                        className="absolute right-2 size-8 bg-pink-600 text-white rounded-xl flex items-center justify-center hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:scale-95 active:scale-90"
                    >
                        <Send className="size-4" />
                    </button>
                </div>
            </form>
        </div>
    )
}
