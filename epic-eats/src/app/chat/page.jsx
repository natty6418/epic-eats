"use client"
import React, {useEffect, useState} from "react";
import ChatBox from "@/components/ChatBox";
import Loading from "@/components/Loading";
import { 
  ChatBubbleLeftEllipsisIcon, 
  SparklesIcon, 
  LightBulbIcon,
  BookOpenIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function ChatPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

                {/* Features Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="card p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <LightBulbIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Cooking Tips</h3>
                        <p className="text-gray-600 text-sm">Get expert advice on techniques, ingredients, and methods</p>
                    </div>
                    <div className="card p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <BookOpenIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Recipe Ideas</h3>
                        <p className="text-gray-600 text-sm">Discover new recipes based on your preferences and ingredients</p>
                    </div>
                    <div className="card p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <ClockIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Answers</h3>
                        <p className="text-gray-600 text-sm">Get instant help with cooking questions and troubleshooting</p>
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="max-w-4xl mx-auto">
                    <ChatBox profilePic={user?.profilePic} />
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