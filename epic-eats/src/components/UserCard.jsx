"use clent";
import React from "react";
import Link from 'next/link';
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function UserCard({ user, currentUserId }) {
    const { data: session } = useSession();
    const [isFollowing, setIsFollowing] = useState(user.followers.includes(currentUserId));
    const unfollow = async () => {
        const res = await fetch(`/api/user/unfollow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentUserId,
                userToUnfollowId: user._id
            })
        })
        const data = await res.json();
        if (data.error) {
            console.log(data.error);
            return;
        }
        setIsFollowing(false);
    }
    const follow = async () => {
        const res = await fetch(`/api/user/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentUserId,
                userToFollowId: user._id
            })
        })
        const data = await res.json();
        if (data.error) {
            console.log(data.error);
            return;
        }
        setIsFollowing(true);
    }
    function followBtn() {
        return (
            <button
                onClick={follow}
                className="border text-blue-400 hover:bg-blue-400 hover:text-white rounded-full px-4 py-2 transition-colors duration-300 ease-in-out"

            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className=" w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>

            </button>
        )
    }
    function unfollowBtn() {
        return (
            <button
                onClick={unfollow}
                className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full px-4 py-2 transition-colors duration-300 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
            </button>
        )
    }
    function FollowStatus() {
        if (currentUserId === user._id || currentUserId !== session?.user?.id) {
            return (
                <div></div>
            )
        } else{
        if (isFollowing) {
            return unfollowBtn();
        } else {
            return followBtn();
        }
    }
    }
    return (
    <div className="flex flex-row items-center justify-between">
        <Link href={`/profile/${user._id}`} >
            <div className="flex flex-row w-fit">
                <img
                    src={user?.profilePic || "https://via.placeholder.com/150"}
                    alt="Profile Picture"
                    className="w-10 h-10 object-cover rounded-full border-2 border-white relative top-0"
                />
                <div className="flex items-center space-x-2 ml-2">
                    <p className="text-gray-800 font-semibold">{user?.username}</p>
                </div>
            </div>
        </Link>
       <FollowStatus />
        </div>
    );
}