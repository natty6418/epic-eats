"use client";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import RecipeCard from "@/components/RecipeCard";
import UserCard from "@/components/UserCard";
import { Tab } from '@headlessui/react';
import { UserIcon, BookOpenIcon, UsersIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProfilePage({ params }) {
  const [user, setUser] = useState(null);
  const [myRecipes, setMyRecipes] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const { id } = params;
  const isMyProfile = session?.user?.id === id || id === 'me';

  useEffect(() => {
    const userId = id === 'me' ? session?.user?.id : id;
    if (!userId) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        const [userRes, recipesRes, followersRes, followingRes] = await Promise.all([
          fetch(`/api/user/${userId}`),
          fetch(`/api/recipe/user-recipe/${userId}`),
          fetch(`/api/user/${userId}/followers`),
          fetch(`/api/user/${userId}/following`),
        ]);

        const userData = await userRes.json();
        const recipesData = await recipesRes.json();
        const followersData = await followersRes.json();
        const followingData = await followingRes.json();

        if (userData.error) throw new Error(userData.error);
        
        setUser(userData);
        setMyRecipes(recipesData);
        setFollowers(followersData);
        setFollowing(followingData);

      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, session]);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <div className="text-center py-20">User not found.</div>;
  }

  const tabs = [
    { name: 'Recipes', icon: BookOpenIcon, count: myRecipes.length },
    { name: 'Followers', icon: UserIcon, count: followers.length },
    { name: 'Following', icon: UsersIcon, count: following.length },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img
                src={user.profilePic || "https://via.placeholder.com/150"}
                alt="Profile Photo"
                className="w-40 h-40 rounded-full object-cover border-8 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-lg">
                {myRecipes.length}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold gradient-text font-poppins mb-2">{user.username}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <p className="text-gray-700 leading-relaxed mb-6 max-w-xl mx-auto md:mx-0">{user.bio || 'No bio yet.'}</p>
              {isMyProfile ? (
                <Link href="/profile/me/edit" className="btn-primary">
                  Edit Profile
                </Link>
              ) : (
                // NOTE: Follow/Unfollow button logic would go here
                <button className="btn-secondary">Follow</button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-orange-500/20 p-1 mb-8">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-orange-700',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-orange-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
                      : 'text-orange-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <tab.icon className="w-5 h-5" />
                  {tab.name} ({tab.count})
                </div>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {/* Recipes Panel */}
            <Tab.Panel className="card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRecipes.length > 0 ? (
                  myRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={{ ...recipe, userId: user }}
                      currentUser={session?.user}
                      saved={session?.user?.savedRecipes?.includes(recipe._id)}
                      setCurrentUser={setUser} // This might need adjustment depending on RecipeCard logic
                    />
                  ))
                ) : (
                  <p className="text-gray-600 col-span-full text-center py-12">No recipes found.</p>
                )}
              </div>
            </Tab.Panel>

            {/* Followers Panel */}
            <Tab.Panel className="card p-6">
              <div className="max-w-md mx-auto space-y-4">
                {followers.length > 0 ? (
                  followers.map((follower) => (
                    <UserCard key={follower._id} user={follower} currentUserId={session?.user?.id} />
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-12">No followers yet.</p>
                )}
              </div>
            </Tab.Panel>

            {/* Following Panel */}
            <Tab.Panel className="card p-6">
              <div className="max-w-md mx-auto space-y-4">
                {following.length > 0 ? (
                  following.map((follow) => (
                    <UserCard key={follow._id} user={follow} currentUserId={session?.user?.id} />
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-12">Not following anyone yet.</p>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
