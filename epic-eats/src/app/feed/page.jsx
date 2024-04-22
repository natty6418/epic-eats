"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";
import Loading from "@/components/Loading";

export default function feed() {
    const [recipes, setRecipes] = useState([]);
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

    function RecipeFeed() {
        if (isLoading) {
            return <Loading />;
        }
        return (<main className="bg-gray-50 flex flex-col items-center py-8 min-h-screen">
            <section className="w-full max-w-4xl p-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recipe Feed</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {/* Example of a Recipe Card */}
                    {recipes.length > 0 ? recipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                    )) : <p className="text-gray-800">No recipes found</p>
                    }
                    {/* You can repeat the above block for each recipe in your feed */}
                </div>

            </section>
        </main>)
    }
    return (
        <RecipeFeed />
    )
}