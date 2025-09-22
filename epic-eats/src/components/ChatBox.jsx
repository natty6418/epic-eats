"use client"
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { 
  PaperAirplaneIcon, 
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function ChatBox({ profilePic, onMessagesChange, initialMessages = null }) {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState(initialMessages ?? [
        {
            text: "Hello! I'm your AI cooking assistant. I'm here to help you with recipes, cooking tips, ingredient substitutions, and any culinary questions you might have. What would you like to know?",
            sender: 'assistant'
        }
    ]);
    useEffect(() => {
        if (initialMessages) {
            setMessages(initialMessages);
        }
    }, [initialMessages]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const currentInput = userInput.trim();
        // Display the user's input immediately
        setMessages(prev => [...prev, { text: currentInput, sender: 'user' }]);
        setUserInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    history: messages.map(msg => msg.text),
                    message: currentInput
                }),
            });
            const data = await response.json();
            // Add the API response to the messages
            setMessages(prev => [...prev, { text: data.message, sender: 'assistant' }]);
        } catch (e) {
            console.error('Error sending message:', e);
            setMessages(prev => [...prev, { 
                text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", 
                sender: 'assistant' 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        if (typeof onMessagesChange === 'function') {
            onMessagesChange(messages);
        }
    }, [messages, isTyping, onMessagesChange]);

    return (
        <div className="card p-6 shadow-xl h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                    <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">AI Chef Assistant</h3>
                    <p className="text-sm text-gray-500">Always here to help with your cooking</p>
                </div>
            </div>

            {/* Messages Container */}
            <div 
                ref={chatContainerRef} 
                className="flex-grow overflow-auto flex flex-col gap-4 mb-6 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
                {messages.map((message, index) => (
                    <div key={index}>
                        {message.sender === 'user' ? (
                            <div className="flex flex-row-reverse gap-3 items-start">
                                <img
                                    src={profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                                    alt="Profile Picture"
                                    className="w-8 h-8 object-cover rounded-full border-2 border-white shadow-sm flex-shrink-0"
                                />
                                <div className="max-w-[70%] bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 rounded-2xl rounded-tr-md shadow-lg">
                                    <div className="text-sm leading-relaxed">
                                        <ReactMarkdown>{message.text}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-3 items-start">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <SparklesIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="max-w-[70%] bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-md shadow-sm">
                                    <div className="text-sm leading-relaxed">
                                        <ReactMarkdown>{message.text}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="flex flex-row gap-3 items-start">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-md shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span className="text-sm text-gray-500">AI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Form */}
            <form 
                className="flex gap-3" 
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                }}
            >
                <div className="flex-1 relative">
                    <input
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-orange-400 focus:shadow-lg focus:outline-none transition-all duration-200 resize-none"
                        type="text"
                        value={userInput}
                        placeholder="Ask me anything about cooking..."
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isTyping}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                        Press Enter to send
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={!userInput.trim() || isTyping}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                    {isTyping ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <PaperAirplaneIcon className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">Send</span>
                </button>
            </form>
        </div>
    );
}