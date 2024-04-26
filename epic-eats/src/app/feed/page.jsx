"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";
import Loading from "@/components/Loading";

export default function feed() {
    const [recipes, setRecipes] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function fetchRecipes() {
            const res = await fetch("/api/feed");
            const data = await res.json();
            setRecipes(data);
            setIsLoading(false);
        }
        fetchRecipes();
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
    }, []);

    function RecipeFeed() {
        if (isLoading) {
            return <Loading />;
        }
        return (<main className="bg-gray-50 flex flex-col items-center py-8 min-h-screen">
            <section className="w-full max-w-4xl p-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recipe Feed</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {recipes.length > 0 ? recipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} currentUser={user} saved={user?.savedRecipes?.includes(recipe._id)} setCurrentUser={setUser}/>
                    )) : <p className="text-gray-800">No recipes found</p>
                    }
                </div>

            </section>
        </main>)
    }
    return (
        <RecipeFeed />
    )
}