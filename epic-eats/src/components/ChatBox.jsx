"use client"
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { FaUserCircle, FaRobot } from 'react-icons/fa';  // Make sure to install react-icons

export default function ChatBox({ userID, profilePic, username }) {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async () => {
        // Display the user's input immediately
        setMessages(messages => [...messages, { text: userInput, sender: 'user' }]);
        setUserInput('');
        setIsTyping(true);
    
        try {
            const response = await fetch('api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    history: messages.map(msg => msg.text),  // Only send text to API
                    message: userInput 
                }),
            });
            const data = await response.json();
            // Add the API response to the messages
            setMessages(messages => [...messages, { text: data.message, sender: 'assistant' }]);
        } catch (e) {
            console.error('Error sending message:', e);
        } finally {
            setIsTyping(false);
        }
    };

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]); // This effect runs whenever messages change

    return (
        <div className='bg-white rounded-lg p-6 w-[50%] h-[75%] flex flex-col shadow-2xl border border-gray-200'>
            <div ref={chatContainerRef} className='flex-grow overflow-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300'>
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${message.sender === 'user' ? 'self-end bg-gradient-to-r from-blue-400 to-blue-500 text-white' : 'self-start bg-gradient-to-r from-green-400 to-green-500 text-white'}`}>
                        {message.sender === 'user' ? <FaUserCircle className="text-3xl" /> : <FaRobot className="text-3xl" />}
                        <div className='max-w-[80%] text-base leading-relaxed'>
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className='self-start bg-gray-200 text-gray-600 p-3 rounded-lg max-w-[40%] animate-pulse'>
                        <FaRobot className="inline-block text-xl" /> Typing...
                    </div>
                )}
            </div>

            <form className='flex mt-4' onSubmit={(e) => e.preventDefault()}>
                <input
                    className='flex-grow p-3 rounded-l-lg border border-gray-300 focus:outline-none'
                    type='text'
                    value={userInput}
                    placeholder='Type a message...'
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button className='bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 transition-all duration-200'
                    onClick={handleSendMessage} 
                    disabled={!userInput.trim() || isTyping}
                >
                    Send
                </button>
            </form>
        </div>
    
    )
}
