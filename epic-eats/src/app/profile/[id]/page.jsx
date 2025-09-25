"use client";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import RecipeCard from "@/components/RecipeCard";
import UserCard from "@/components/UserCard";
import { Tab } from '@headlessui/react';
import { 
  UserIcon, 
  BookOpenIcon, 
  UsersIcon,
  HeartIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  PencilIcon,
  ShareIcon,
  CalendarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProfilePage({ params }) {
  const [user, setUser] = useState(null);
  const [myRecipes, setMyRecipes] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
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

        // Check if current user is following this user
        if (!isMyProfile && session?.user?.id) {
          setIsFollowing(followersData.some(follower => follower._id === session.user.id));
        }

      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, session, isMyProfile]);

  const handleFollow = async () => {
    if (!session?.user?.id || isMyProfile) return;
    
    setIsLoadingFollow(true);
    try {
      const res = await fetch('/api/user/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserId: session.user.id,
          userToFollowId: user._id
        })
      });
      
      if (res.ok) {
        setIsFollowing(true);
        setFollowers(prev => [...prev, session.user]);
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const handleUnfollow = async () => {
    if (!session?.user?.id || isMyProfile) return;
    
    setIsLoadingFollow(true);
    try {
      const res = await fetch('/api/user/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserId: session.user.id,
          userToUnfollowId: user._id
        })
      });
      
      if (res.ok) {
        setIsFollowing(false);
        setFollowers(prev => prev.filter(follower => follower._id !== session.user.id));
      }
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full mx-auto bg-gray-100 flex items-center justify-center mb-4">
            <UserIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const totalLikes = myRecipes.reduce((total, recipe) => total + (recipe.likes?.length || 0), 0);
  
  const tabs = [
    { name: 'Recipes', icon: BookOpenIcon, count: myRecipes.length },
    { name: 'Followers', icon: UsersIcon, count: followers.length },
    { name: 'Following', icon: UserIcon, count: following.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Profile Header */}
        <div className="card p-8 lg:p-10 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={user.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"}
                alt="Profile Photo"
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold gradient-text font-poppins mb-2">
                    {user.username}
                  </h1>
                  <p className="text-gray-600 text-lg">{user.email}</p>
                </div>
                <div className="flex gap-3">
                  {isMyProfile ? (
                    <Link 
                      href="/profile/me/edit" 
                      className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 inline-flex items-center gap-2"
                    >
                      <PencilIcon className="w-5 h-5" />
                      Edit Profile
                    </Link>
                  ) : (
                    <button 
                      onClick={isFollowing ? handleUnfollow : handleFollow}
                      disabled={isLoadingFollow}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                        isFollowing 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white'
                      } disabled:opacity-50`}
                    >
                      {isLoadingFollow ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>{isFollowing ? 'Unfollow' : 'Follow'}</>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 max-w-2xl">
                {user.bio || 'No bio yet. This user hasn\'t shared anything about themselves.'}
              </p>

              

              {/* Profile Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="w-9 h-9 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center ring-1 ring-orange-200">
                    <BookOpenIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-2xl font-semibold text-gray-800">{myRecipes.length}</div>
                    <div className="text-gray-600 text-xs">Recipes</div>
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="w-9 h-9 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <HeartSolidIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xl font-semibold text-gray-800">{totalLikes}</div>
                    <div className="text-gray-600 text-xs">Total Likes</div>
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <UsersIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xl font-semibold text-gray-800">{followers.length}</div>
                    <div className="text-gray-600 text-xs">Followers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl p-1 bg-white/70 backdrop-blur border border-gray-200">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-3 text-sm font-medium leading-5 transition-all duration-200',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-orange-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white hover:shadow'
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

          <Tab.Panels className="mt-8">
            {/* Recipes Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Recipes</h2>
                  {isMyProfile && (
                    <Link href="/create" className="btn-primary inline-flex items-center gap-2">
                      <SparklesIcon className="w-5 h-5" />
                      Create Recipe
                    </Link>
                  )}
                </div>
                
                {myRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe._id}
                        recipe={{ ...recipe, userId: user }}
                        currentUser={session?.user}
                        saved={session?.user?.savedRecipes?.includes(recipe._id)}
                        setCurrentUser={setUser}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 flex items-center justify-center mb-6">
                      <BookOpenIcon className="w-12 h-12 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {isMyProfile ? "You haven't posted any recipes yet" : "No recipes to show"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {isMyProfile 
                        ? "Share your first recipe and inspire the community!"
                        : "Check back later or explore other profiles and the feed."
                      }
                    </p>
                    {isMyProfile && (
                      <Link href="/create" className="btn-primary inline-flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5" />
                        Create Recipe
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </Tab.Panel>

            {/* Followers Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Followers</h2>
                {followers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {followers.map((follower) => (
                      <UserCard key={follower._id} user={follower} currentUserId={session?.user?.id} />
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 flex items-center justify-center mb-6">
                      <UsersIcon className="w-12 h-12 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No followers yet</h3>
                    <p className="text-gray-600">
                      {isMyProfile 
                        ? "Post great recipes and engage with others to grow your audience."
                        : "This user doesn't have any followers yet."
                      }
                    </p>
                  </div>
                )}
              </div>
            </Tab.Panel>

            {/* Following Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Following</h2>
                {following.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {following.map((follow) => (
                      <UserCard key={follow._id} user={follow} currentUserId={session?.user?.id} />
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 flex items-center justify-center mb-6">
                      <UserIcon className="w-12 h-12 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {isMyProfile ? "You're not following anyone yet" : "Not following anyone"}
                    </h3>
                    <p className="text-gray-600">
                      {isMyProfile 
                        ? "Explore the feed and follow chefs you like to personalize your experience."
                        : "This user isn't following anyone yet."
                      }
                    </p>
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}