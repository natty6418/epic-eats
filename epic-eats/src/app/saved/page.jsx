"use client";
import React from "react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import RecipeCard from "@/components/RecipeCard";

function SearchBar({ recipes, setRecipes }) {
    const [searchQuery, setSearchQuery] = useState("");
    function searchBarFallback() {
        return <p>Loading...</p>
    }
    async function searchRecipes() {
        const data = await fetch(`/api/user/savedRecipes?query=${searchQuery}`);
        const recipes = await data.json();
        setRecipes(recipes);
    }
    return (
        <Suspense fallback={searchBarFallback()}>
            <div className="flex justify-center items-center m-8">
                <input type="text" placeholder="Search for recipes" className="border border-gray-300 p-2 rounded-full w-1/2" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button onClick={searchRecipes} className="bg-blue-500 text-white p-2 rounded-full ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>

                </button>
            </div>
        </Suspense>
    );

}

export default function SavedRecipes() {
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function fetchSavedRecipes() {
            const res = await fetch("/api/user/savedRecipes");
            const data = await res.json();
            setRecipes(data);
            setIsLoading(false);
        }
        fetchSavedRecipes();
    }, []);
    useEffect(() => {
        async function fetchUser() {
            const res = await fetch("/api/user/me");
            const data = await res.json();
            setUser(data);
            setIsLoading(false);
        }
        setIsLoading(true);
        fetchUser();
    }
        , []);

    function RecipeFeed() {
        if (isLoading) {
            return <Loading />;
        }
        return (
            <main className="bg-gray-50 flex flex-col items-center py-8 min-h-screen">
                <section className="w-full max-w-4xl p-4 items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 mx-auto text-center">Saved Recipes</h2>
                    <SearchBar recipes={recipes} setRecipes={setRecipes} />
                    <div className="grid grid-cols-1 gap-6 m-auto max-w-md">
                        {/* Example of a Recipe Card */}
                        {
                            recipes.length > 0 && !!user ? recipes.map((recipe) => {
                                return (
                                    <RecipeCard key={recipe._id} recipe={recipe} currentUser={user} saved={true} setCurrentUser={setUser}/>
                                )
                            }) : <p className="text-gray-800">No recipes found</p>
                        }
                        {/* You can repeat the above block for each recipe in your feed */}
                    </div>
                </section>
            </main>
        )
    }
    return (
        <RecipeFeed />
    )
}

