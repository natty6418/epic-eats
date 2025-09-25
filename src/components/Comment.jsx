"use clent";
import React from "react";
import Link from 'next/link';

export default function Comment({ userId, profilePic, username, comment, createdAt }) {
    
    return (
    <div className="flex flex-col justify-between mt-3 border-b-2 border-gray-300">
        <div className="flex flex-row w-full justify-between">
        <Link href={`/profile/${userId}`} >
            <div className="flex flex-row w-fit">
                <img
                    src={profilePic || "https://via.placeholder.com/150"}
                    alt="Profile Picture"
                    className="w-10 h-10 object-cover rounded-full border-2 border-white relative top-0"
                />
                <div className="flex items-center space-x-2 ml-2">
                    <p className="text-gray-800 font-semibold">{username}</p>
                </div>
            </div>
        </Link>
        <p
            className="text-gray-600 text-sm"
        >{
            new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }</p>
        </div>
        <p
            className="text-gray-800 mt-1"
        >{comment}</p>
        </div>
    );
}