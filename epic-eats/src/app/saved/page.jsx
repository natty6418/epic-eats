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
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search saved recipes..."
                    className="input-field pr-28"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button onClick={searchRecipes} className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2">
                    Search
                  </button>
                </div>
              </div>
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
        if (isLoading) return <Loading />;
        return (
            <div className="min-h-screen px-4 py-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold gradient-text font-poppins">Saved Recipes</h1>
                  <p className="text-gray-600 mt-2">Your bookmarked favorites in one place</p>
                </div>
                <SearchBar recipes={recipes} setRecipes={setRecipes} />
                <div className="grid grid-cols-1 gap-6 m-auto max-w-md">
                  {recipes.length > 0 && !!user ? (
                    recipes.map((recipe) => (
                      <RecipeCard key={recipe._id} recipe={recipe} currentUser={user} saved={true} setCurrentUser={setUser} />
                    ))
                  ) : (
                    <p className="text-gray-600 text-center">No recipes found</p>
                  )}
                </div>
              </div>
            </div>
        )
    }
    return (
        <RecipeFeed />
    )
}
