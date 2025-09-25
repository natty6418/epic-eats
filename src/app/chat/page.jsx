"use client"
import React, { useEffect, useState } from "react";
import ChatBox from "@/components/ChatBox";
import Loading from "@/components/Loading";
import { 
  ChatBubbleLeftEllipsisIcon, 
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function ChatPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
        const [messages, setMessages] = useState([{
        text: "Hello! I'm your AI cooking assistant. I'm here to help you with recipes, cooking tips, ingredient substitutions, and any culinary questions you might have. What would you like to know?",
        sender: 'assistant'
    }]);
    const [lastSavedCount, setLastSavedCount] = useState(0);
    const [history, setHistory] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [showHistoryMobile, setShowHistoryMobile] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

    useEffect(() => {
        async function fetchHistory(){
            try{
                const res = await fetch('/api/chat/history');
                if (res.ok){
                    const list = await res.json();
                    console.log(list);
                    const normalized = Array.isArray(list)
                        ? list
                        : (Array.isArray(list?.items) ? list.items : []);
                    setHistory(normalized);
                } else {
                    setHistory([]);
                }
            } catch(e){
                console.error('Failed to load chat history:', e);
            }
        }
        fetchHistory();
    }, [user]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (!user) return;
            const hasUserMessage = messages.some(m => m.sender === 'user');
            const hasNew = hasUserMessage && messages.length > 0 && messages.length !== lastSavedCount;
            if (!hasNew) return;
            try {
                const res = await fetch('/api/chat/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: activeChatId, data: messages }),
                });
                if (res.ok) {
                    const saved = await res.json();
                    if (!activeChatId) {
                        setActiveChatId(saved.id);
                        setHistory(prev => [{ id: saved.id, createdAt: saved.createdAt, title: saved.title || '', preview: messages[0]?.text || '' }, ...prev]);
                    } else if (saved.title) {
                        setHistory(prev => prev.map(h => h.id === activeChatId ? { ...h, title: saved.title } : h));
                    }
                    setLastSavedCount(messages.length);
                }
            } catch (e) {
                console.error('Autosave failed:', e);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [messages, lastSavedCount, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg">
              <ChatBubbleLeftEllipsisIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text font-poppins mb-4">
            Kitchen Conversations
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Chat with our AI chef for cooking tips, recipe suggestions, and culinary guidance
          </p>
        </div>

                

                {/* Chat Interface with History Sidebar */}
                {/* Mobile controls */}
                {/* Mobile controls */}
                <div className="md:hidden mb-4 flex items-center justify-between gap-3">
                    <button
                        onClick={() => setShowHistoryMobile(v => !v)}
                        className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-orange-300 text-orange-700 bg-orange-50 flex items-center justify-center gap-2"
                        aria-expanded={showHistoryMobile}
                        aria-controls="mobile-history"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        {showHistoryMobile ? 'Hide History' : 'Show History'}
                    </button>
                    <button
                        onClick={() => {
                            setActiveChatId(null);
                            const welcome = [{
                                text: "Hello! I'm your AI cooking assistant. I'm here to help you with recipes, cooking tips, ingredient substitutions, and any culinary questions you might have. What would you like to know?",
                                sender: 'assistant'
                            }];
                            setMessages(welcome);
                            setLastSavedCount(0);
                            setShowHistoryMobile(false);
                        }}
                        className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Chat
                    </button>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar (desktop) or collapsible (mobile) */}
                    <div className="md:col-span-1">
                        <div id="mobile-history" className={`card p-4 ${showHistoryMobile ? 'block' : 'hidden'} md:block md:h-[600px] overflow-auto`}>
                        <div className="hidden md:flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800">History</h4>
                            <button
                                onClick={() => {
                                    setActiveChatId(null);
                                    const welcome = [{
                                        text: "Hello! I'm your AI cooking assistant. I'm here to help you with recipes, cooking tips, ingredient substitutions, and any culinary questions you might have. What would you like to know?",
                                        sender: 'assistant'
                                    }];
                                    setMessages(welcome);
                                    setLastSavedCount(0);
                                }}
                                className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 flex items-center gap-1.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                New Chat
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(Array.isArray(history) ? history : []).map(item => (
                                <div key={item.id} className={`group flex items-start gap-2 p-2 rounded-lg border ${activeChatId===item.id? 'border-orange-400 bg-orange-50':'border-gray-200 hover:bg-gray-50'}`}>
                                    <button
                                        onClick={async () => {
                                            try{
                                                const res = await fetch(`/api/chat/${item.id}`);
                                                if (res.ok){
                                                    const chat = await res.json();
                                                    setActiveChatId(item.id);
                                                    setMessages(chat.data || []);
                                                    setLastSavedCount((chat.data || []).length);
                                                    // Close mobile history when selecting a chat
                                                    setShowHistoryMobile(false);
                                                }
                                            }catch(e){
                                                console.error('Failed to load chat:', e);
                                            }
                                        }}
                                        className="flex-1 text-left"
                                    >
                                        <div className="text-sm text-gray-700 line-clamp-2">{item.title || item.preview || 'New chat'}</div>
                                        <div className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleString()}</div>
                                    </button>
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try{
                                                const res = await fetch(`/api/chat/${item.id}`, { method: 'DELETE' });
                                                if (res.status === 204){
                                                    setHistory(prev => prev.filter(h => h.id !== item.id));
                                                    if (activeChatId === item.id){
                                                        setActiveChatId(null);
                                                        const welcome = [{
                                                            text: "Hello! I'm your AI cooking assistant. I'm here to help you with recipes, cooking tips, ingredient substitutions, and any culinary questions you might have. What would you like to know?",
                                                            sender: 'assistant'
                                                        }];
                                                        setMessages(welcome);
                                                        setLastSavedCount(0);
                                                    }
                                                }
                                            }catch(e){
                                                console.error('Failed to delete chat:', e);
                                            }
                                        }}
                                        className="opacity-70 md:opacity-0 md:group-hover:opacity-100 text-xs text-red-600 hover:text-red-700 px-2 py-1"
                                        title="Delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <ChatBox 
                            profilePic={user?.profilePic}
                            onMessagesChange={setMessages}
                            initialMessages={messages}
                        />
                    </div>
                </div>

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="card p-8 bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-orange-500" />
              Try asking me about:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">• "How do I make perfect pasta?"</p>
                <p className="text-gray-700 font-medium">• "What can I substitute for eggs?"</p>
                <p className="text-gray-700 font-medium">• "Give me a quick dinner recipe"</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">• "How do I store fresh herbs?"</p>
                <p className="text-gray-700 font-medium">• "What's the best way to season chicken?"</p>
                <p className="text-gray-700 font-medium">• "Help me plan a dinner party menu"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
