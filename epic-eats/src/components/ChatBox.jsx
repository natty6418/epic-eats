"use client"
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { FaUserCircle, FaRobot } from 'react-icons/fa';  // Make sure to install react-icons

export default function ChatBox({ profilePic }) {
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
        <div className='card p-6 w-[50%] h-[75%] flex flex-col'>
    <div className='text-xl font-semibold text-center mb-4 gradient-text font-poppins'>
        Kitchen Conversations
    </div>
    <div ref={chatContainerRef} className='flex-grow overflow-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
        {messages.map((message, index) => (
            <>
                {message.sender === 'user' ? (
                    <div className="flex flex-row-reverse gap-3 items-center">
                        <img
                            src={profilePic || "https://via.placeholder.com/150"}
                            alt="Profile Picture"
                            className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-lg"
                        />
                        <div key={index} className={`flex items-center gap-3 p-4 rounded-lg self-end gradient-bg text-white shadow-md`}>
                            <div className='max-w-[75%] text-base leading-relaxed'>
                                <ReactMarkdown>{message.text}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-row gap-3 items-center">
                        <FaRobot className="text-3xl text-orange-500" />
                        <div key={index} className={`max-w-[75%] flex items-center gap-3 p-4 rounded-lg self-start bg-white/90 border border-gray-200 text-gray-800 shadow`}>
                            <div className='text-base leading-relaxed'>
                                <ReactMarkdown>{message.text}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}
            </>
        ))}

        {isTyping && (
            <div className='self-start bg-orange-50 text-orange-700 p-3 rounded-lg max-w-[40%] animate-pulse border border-orange-200'>
                <FaRobot className="inline-block text-xl" /> Typing...
            </div>
        )}
    </div>

    <form className='flex mt-4' onSubmit={(e) => e.preventDefault()}>
        <input
            className='input-field flex-grow rounded-r-none'
            type='text'
            value={userInput}
            placeholder='Type a message...'
            onChange={(e) => setUserInput(e.target.value)}
        />
        <button
            className='btn-primary rounded-l-none'
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isTyping}
        >
            Send
        </button>
    </form>
</div>



    )
}
