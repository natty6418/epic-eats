"use client";
import React, { use } from "react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import Loading from "@/components/Loading";
import RecipeCard from "@/components/RecipeCard";
import Dialog from '@mui/material/Dialog';
import UserCard from "@/components/UserCard";

export default function ProfilePage({params}){
    const [user, setUser] = useState(null);
    const [myRecipes, setMyRecipes] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showFollowersOrFollowing, setShowFollowersOrFollowing] = useState("followers");
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();
    const { id } = params;
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
        const fetchFollowers = async () => {
            const res = await fetch(`/api/user/${id}/followers`);
            const data = await res.json();
            setFollowers(data);
        };
        fetchFollowers();
    },
    []);
    useEffect(() => {
        const fetchFollowing = async () => {
            const res = await fetch(`/api/user/${id}/following`);
            const data = await res.json();
            setFollowing(data);
        };
        fetchFollowing();
    },
    []);
    function Followers(){
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                <h2 className="font-semibold text-gray-800 mb-2">Followers</h2>
                <ul className="text-gray-600">
                    {followers.length > 0 ? followers.map((follower) => (
                        <UserCard key={follower._id} user={follower} currentUserId={user._id}/>
                    )) : <p className="text-gray-800">No followers found</p>}
                </ul>
            </div>
        )
    }
    function Following(){
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                <h2 className="font-semibold text-gray-800 mb-2">Following</h2>
                <ul className="text-gray-600">
                    {following.length > 0 ? following.map((follow) => (
                        <UserCard key={follow._id} user={follow} currentUserId={user._id}/>
                    )) : <p className="text-gray-800">Not following anyone</p>}
                </ul>
            </div>
        )
    
    }

    useEffect(() => {
        const fetchMyRecipes = async () => {
            const res = await fetch(id === 'me'?`/api/recipe/user-recipe`:`/api/recipe/user-recipe/${id}`); 
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
                      <Link href="/profile/me/edit"
                        className="mt-4 text-blue-500 hover:text-blue-700 font-light underline cursor-pointer"
                      >
                        Edit Profile
                      </Link>
                    )}
                  </div>
                </div>
                <div 
                className="flex flex-row sm:flex-col items-center sm:items-start justify-around sm:justify-start w-full sm:w-auto mt-4 sm:mt-0">
                  <p className="font-medium">{myRecipes.length || "0"} recipes</p>
                  <p 
                  onClick={() => {
                        setShowFollowersOrFollowing("following");
                        setOpen(true);
                    }
                  }
                  className="font-medium cursor-pointer">{user?.following.length || "0"} following</p>
                  <p 
                  onClick={() => {
                        setShowFollowersOrFollowing("followers");
                        setOpen(true);
                    }
                }
                  className="font-medium cursor-pointer">{user?.followers.length || "0"} followers</p>
                </div>
              </div>
              
            
                <div className="mt-6 flex flex-col max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="font-semibold text-gray-800 mb-2">Recipes</h2>
                <div className="grid grid-cols-1 gap-6">

                        {
                            myRecipes?.length > 0 ? myRecipes?.map((recipe) => (
                                <RecipeCard key={recipe._id} recipe={{...recipe, userId: user}} currentUser={user} saved={user?.savedRecipes.includes(recipe._id)} setCurrentUser={setUser}/>
                            )) : <p className="text-gray-800">No recipes found</p>
                        }
                    </div>
                    </div>
                </div>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="flex justify-center items-center border-none rounded-lg shadow-lg"
                >
                <div className="mt-6 flex flex-col mx-auto w-[400px] border-none"> 
                <div className="bg-white rounded-lg shadow-lg p-3">
                        {showFollowersOrFollowing === "followers" ? <Followers /> : <Following />}
                    </div>
                </div>
                </Dialog>
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

