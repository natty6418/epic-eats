"use client"
import React, {useEffect, useState} from "react";
import ChatBox from "@/components/ChatBox";
import Loading from "@/components/Loading";


export default function ChatPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch("/api/user/me");
            const data = await res.json();
            setUser(data);
            setIsLoading(false);
        }
        fetchUser();
    }, []);
    if (isLoading) {
        return <Loading />;
    }
    return (
        <div className="flex-grow overflow-hidden flex items-center justify-center">
            <ChatBox 
                profilePic={user.profilePic}
            />
        </div>
    );
}