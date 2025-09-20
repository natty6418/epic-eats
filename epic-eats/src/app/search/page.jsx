"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import RecipeCard from '@/components/RecipeCard';
import Loading from '@/components/Loading';
import UserCard from '@/components/UserCard';
import { MagnifyingGlassIcon, UsersIcon, SparklesIcon } from '@heroicons/react/24/outline';


const SearchPage = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(search);
    const [activeTab, setActiveTab] = useState('recipes'); // Default to recipes
    const [results, setResults] = useState({ users: [], recipes: [] });
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch('/api/user/me');
            const data = await res.json();
            setUser(data);
        }
        fetchUser();
        performSearch({ preventDefault: () => {} });
    },
    []);
    

    // Function to handle search
    async function performSearch(evt) {
        evt.preventDefault();
        setIsLoading(true);
        const userSearch = await fetch(`/api/user?q=${searchQuery}`);
        const users = await userSearch.json();
        const recipeSearch = await fetch(`/api/recipe?q=${searchQuery}`);
        const recipes = await recipeSearch.json();
        setResults({ users, recipes });
        setIsLoading(false);
    };
    function UserList(){
        return (
            <div className='max-w-lg mx-auto'>
                {results.users.length>0 ? results.users.map(el => (
                    <div key={el._id} className="card p-3 m-2">
                      <UserCard user={el} currentUserId={user._id}/>
                    </div>
                )) :
                <p className="text-center text-gray-600">No users found</p>}
            </div>
        );
    }
    function RecipeList(){
        return (
            <div className='grid grid-cols-1 gap-6 max-w-md mx-auto mb-2'>
                {results.recipes.length>0 ? results.recipes.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={{...recipe}} currentUserId={user} saved={user.savedRecipes.includes(recipe._id)} setCurrentUser={setUser}/>
                )) : <p className="text-center text-gray-600">No recipes found</p>}
            </div>
        );
    }

    return (
        isLoading ? 
        <Loading /> :
        <div className="min-h-screen px-4 py-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold gradient-text font-poppins">Search</h1>
              <p className="text-gray-600 mt-2">Find chefs and recipes across the community</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={performSearch} className="max-w-2xl mx-auto mb-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chefs or recipes..."
                    className="input-field pl-10 pr-28"
                  />
                  <button type="submit" className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2">Search</button>
                </div>
              </div>
            </form>

            {/* Tabs */}
            <div className="flex justify-center mt-2 gap-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'users' ? 'gradient-bg text-white shadow' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                <span className="inline-flex items-center gap-2"><UsersIcon className="w-5 h-5"/> Users</span>
              </button>
              <button
                onClick={() => setActiveTab('recipes')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'recipes' ? 'gradient-bg text-white shadow' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                Recipes
              </button>
            </div>

            {/* Results */}
            <div className="mt-6 flex flex-col max-w-xl mx-auto">
              <div className="card p-6">
                {activeTab === 'users' ? <UserList /> : <RecipeList />}
              </div>
            </div>
          </div>
        </div>
    );
};

export default SearchPage;
