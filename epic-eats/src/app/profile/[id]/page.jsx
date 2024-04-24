"use client";
import React from "react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import RecipeCard from "@/components/RecipeCard";

export default function ProfilePage({params}){
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [myRecipes, setMyRecipes] = useState([]);
    const { data: session } = useSession();
    const searchParams = useSearchParams()
    const { id } = params;
    const createQueryString = useCallback(
        (name, value) => {
          const params = new URLSearchParams(searchParams)
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
      )
    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`/api/user/${id}`);
            const data = await res.json();
            if (data.error) {
                console.log("error", data.error);
                return;
            }
            setUser(data);
        };
        fetchUser();
    }
    , [session]);

    useEffect(() => {
        const fetchMyRecipes = async () => {
            const res = await fetch(id === 'me'?`/api/recipe/user-recipe`:`/api/recipe/user-recipe/${id}`); //TODO: Modify the route
            const data = await res.json();
            setMyRecipes(data);
        };
        fetchMyRecipes();
    }
    , [user]);
    const profilePage = () => {
        if (!user) {
            return <Loading />;
        }
        
            return (
                <main className="bg-gray-50 p-8 flex justify-center items-center">
                <div className="container p-8 h-full max-w-5xl">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between sm:h-64">
                <div className="flex flex-col sm:flex-row items-center">
                  <img src={user?.profilePic || "https://via.placeholder.com/150"} alt="Profile Photo" className="rounded-full w-32 h-32 mb-4 sm:mb-0 object-cover"/>
                  <div className="sm:ml-6 flex flex-col justify-center items-center sm:items-start text-center sm:text-left w-full">
                    <h1 className="text-xl font-semibold">{user?.username}</h1>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-gray-600">{user?.bio}</p>
                    {id === 'me' && (
                      <button
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => router.push('/profile/me/edit')}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
                <div 
                className="flex flex-row sm:flex-col items-center sm:items-start justify-around sm:justify-start w-full sm:w-auto mt-4 sm:mt-0">
                  <p className="font-medium">{myRecipes.length || "0"} recipes</p>
                  <p className="font-medium">{user?.following.length || "0"} following</p>
                  <p className="font-medium">{user?.followers.length || "0"} followers</p>
                </div>
              </div>
              
            
                <div className="mt-6 flex flex-col max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="font-semibold text-gray-800 mb-2">My Recipes</h2>
                        {
                            myRecipes?.length > 0 ? myRecipes?.map((recipe) => (
                                <RecipeCard key={recipe._id} recipe={{...recipe, userId: user}} currentUserId={user?._id}/>
                            )) : <p className="text-gray-800">No recipes found</p>
                        }
                    </div>
                </div>
            </div>
            </main>
            )
        
    }
    return (            
        
        <>
        {profilePage()}
        </>

    )
}

// {<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-white rounded-lg shadow-lg p-6">
//                         <h2 className="font-semibold text-gray-800 mb-2">Followers</h2>
//                         <ul className="text-gray-600">
//                             <li>Follower 1</li>
//                             <li>Follower 2</li>
//                         </ul>
//                     </div>
        
                
//                     <div className="bg-white rounded-lg shadow-lg p-6">
//                         <h2 className="font-semibold text-gray-800 mb-2">Following</h2>
//                         <ul className="text-gray-600">
//                             <li>Following 1</li>
//                             <li>Following 2</li>
//                         </ul>
//                     </div>
//                 </div>}
// <div className="bg-white rounded-lg shadow-lg p-6">
//                         <h2 className="font-semibold text-gray-800 mb-2">Saved Recipes</h2>
//                         <ul className="text-gray-600">
//                             <li>Recipe 3</li>
//                             <li>Recipe 4</li>
//                         </ul>
//                     </div>