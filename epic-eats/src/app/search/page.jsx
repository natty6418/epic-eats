"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import RecipeCard from '@/components/RecipeCard';
import Loading from '@/components/Loading';
import UserCard from '@/components/UserCard';


const SearchPage = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(search);
    const [activeTab, setActiveTab] = useState('users'); // Default to 'users' or 'recipes'
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
            <div
            className='max-w-lg mx-auto'
            >
                {results.users.length>0?results.users.map(el => (
                    <div key={el._id} className="bg-white rounded-lg shadow-md p-2 hover:shadow-lg transition-shadow duration-300 ease-in-out m-2">
                    <UserCard user={el} currentUserId={user._id}/>
                    </div>
                )):
                <p className="text-center">No users found</p>}
            </div>
        );
    }
    function RecipeList(){
        return (
            <div
                className='grid grid-cols-1 gap-6 max-w-md mx-auto mb-2'
            >
                {results.recipes.length>0?results.recipes.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={{...recipe}} currentUserId={user} saved={user.savedRecipes.includes(recipe._id)} setCurrentUser={setUser}/>
                ))
                : <p className="text-center">No recipes found</p>
            }
            </div>
        );
    }

    return (
        isLoading ? 
        <Loading /> :
        <div className="mt-8 container mx-auto px-4 max-w-4xl">
        <form onSubmit={performSearch} className=" flex items-center space-x-2 max-w-2xl mx-auto">
    <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
    >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
  
    </button>
</form>

    
            <div className="flex justify-center  mt-4">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`py-2 px-4 border-b-4 ${activeTab === 'users' ? ' border-blue-500 text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('recipes')}
                    className={`py-2 px-4 border-b-4 ${activeTab === 'recipes' ? ' border-blue-500 text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
                >
                    Recipes
                </button>
            </div>
            <div className="mt-6 flex flex-col max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">

                {
                    activeTab === 'users' ? <UserList /> : <RecipeList />
                }
            </div>
            </div>
        </div>
    );
};

export default SearchPage;
