"use client";
import React, { useState} from "react";
import Link from 'next/link';
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
export default function RecipeCard({ recipe, currentUserId }) {
    const [user, setUser] = useState(recipe.userId);
    const [showFullInstructions, setShowFullInstructions] = useState(false);
    const searchParams = useSearchParams()
    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )
    const toggleInstructions = () => {
        setShowFullInstructions(!showFullInstructions);
    };
    const previewInstructions = recipe.instructions.length > 150
        ? recipe.instructions.substring(0, 150) + '...'
        : recipe.instructions;

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
        setUser(prev => ({
            ...prev,
            followers: prev.followers.filter(follower => follower !== currentUserId)
        }));
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
        setUser(prev => ({
            ...prev,
            followers: [...prev.followers, currentUserId]
        }));
    }


    function followBtn() {
        return (
            <button
                onClick={follow}
                className="border text-blue-400 hover:bg-blue-400 hover:text-white rounded-full px-4 py-2 transition-colors duration-300 ease-in-out"

            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className=" w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
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
                    <path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
            </button>
        )
    }
    function FollowStatus() {
        if (currentUserId === user._id) {
            return (
                <div></div>
            )
        }
        if (user.followers.includes(currentUserId)) {
            return unfollowBtn();
        } else {
            return followBtn();
        }
    }
    const saveRecipe = async () => {

        const res = await fetch(`/api/user/savedRecipes/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({recipeId: recipe._id})
        })
        const data = await res.json();
        if (data.error) {
            console.log(data.error);
            return;
        }
        console.log("No error");
        setUser(prev => ({
            ...prev,
            savedRecipes: [...prev.savedRecipes, recipe._id]
        }));
    }
    const removeRecipe = async () => {
        const res = await fetch(`/api/user/savedRecipes/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({recipeId: recipe._id})
        })
        const data = await res.json();
        if (data.error) {
            console.log(data.error);
            return;
        }
        setUser(prev => ({
            ...prev,
            savedRecipes: prev.savedRecipes.filter(savedRecipe => savedRecipe !== recipe._id)
        }));
    }

    const SavedBtn = () => {
        if (user.savedRecipes?.includes(recipe._id)) {
            return (
                <button
                    onClick={removeRecipe}
                    className="flex-grow text-center text-blue-400 font-medium py-2 px-4 rounded-br-lg transition-colors duration-300 ease-in-out bg-white hover:bg-green-400 hover:text-white">
                    Saved
                </button>
            )
        } else {
            return (
                <button
                    onClick={saveRecipe}
                    className="flex-grow text-center text-blue-400 font-medium py-2 px-4 rounded-br-lg transition-colors duration-300 ease-in-out bg-white hover:bg-green-400 hover:text-white">
                    Save
                </button>
            )
        }
    }
    return (
        <div className="bg-white rounded-lg shadow-md pt-2 hover:shadow-lg transition-shadow duration-300 ease-in-out pb-5 mb-4 relative h-full">
            <div className="flex flex-row items-center justify-between m-2">
                <Link href={`/profile/${user._id}`} >
                    <div className="flex flex-row w-fit">
                        <img
                            src={user?.profilePic || "https://via.placeholder.com/150"}
                            alt="Profile Picture"
                            className="w-10 h-10 object-cover rounded-full border-2 border-white relative top-0"
                        />
                        <div className="flex items-center space-x-2 ml-2">
                            <p className="text-gray-800 font-semibold">{user?.username}</p>
                            <p className="text-sm text-gray-600">{new Date(recipe.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                </Link>
                <FollowStatus />
            </div>
            <img className="w-full h-48 object-cover " src={recipe.image} alt="Recipe Image" />
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">{recipe.title}</h3>
                <p className="text-gray-600">
                    {showFullInstructions ? recipe.instructions : previewInstructions}
                    {recipe.instructions.length > 150 &&
                        <span
                            onClick={toggleInstructions}
                            className="text-blue-500 hover:text-blue-700 text-sm font-semibold mt-2 cursor-pointer">
                            {showFullInstructions ? 'Show Less' : 'Show More'}
                        </span>
                    }
                </p>
            </div>
            <div className="absolute flex bottom-0 w-full mt-3">
                <Link href={'/recipe' + '?' + createQueryString("id", recipe._id)} className="flex-grow text-center text-blue-400 font-medium py-2 px-4 rounded-bl-lg transition-colors duration-300 ease-in-out bg-white hover:bg-blue-400 hover:text-white">
                    View
                </Link>
                <SavedBtn />
            </div>

        </div>
    );

}
