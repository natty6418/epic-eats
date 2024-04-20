"use client";
import React from "react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";

export default function ProfilePage({params}){
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [myRecipes, setMyRecipes] = useState([]);
    const { data: session } = useSession();
    const searchParams = useSearchParams()

    const createQueryString = useCallback(
        (name, value) => {
          const params = new URLSearchParams(searchParams)
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
      )
    useEffect(() => {
        const { id } = params;
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
            const res = await fetch(`/api/recipe`); //TODO: Modify the route
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
            <div className="container mx-auto p-8">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
                <img src={user?.profilePic || "https://via.placeholder.com/150"} alt="Profile Photo" className="rounded-full w-32 h-32 mb-4 object-cover"/>
                <h1 className="text-xl font-semibold">{user?.username}</h1>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-gray-600">{user?.bio}</p>
                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={
                    () =>  router.push('/profile/' + user._id + '/edit')
                    }>Edit Profile</button>
            </div>
        
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="font-semibold text-gray-800 mb-2">My Recipes</h2>
                    {
                        myRecipes?.length > 0 ? myRecipes?.map((recipe) => (
                            <div key={recipe._id} className="border-b pb-4">
                                <h3 className="text-lg font-semibold text-gray-800">{recipe.title}</h3>
                                <p className="text-gray-600">{recipe.instructions}</p>
                                <Link href={'/recipe' + '?' + createQueryString("id", recipe._id)} className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                                    View Recipe
                                </Link>
                            </div>
                        )) : <p className="text-gray-800">No recipes found</p>
                    }
                </div>
            </div>
        </div>
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