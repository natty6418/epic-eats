"use client";
import React, { useState, useEffect } from 'react';
import Loading from './Loading';

function RecipeDetail({ recipeId }) {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRecipe() {
            try {
                const response = await fetch(`/api/recipes/${recipeId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setRecipe(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchRecipe();
    }, [recipeId]);

    if (loading) return <Loading />;
    if (error) return <p>Error: {error}</p>;
    if (!recipe) return <p>No recipe found!</p>;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800">{recipe.title}</h2>
            {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-md my-4" />}
            <h3 className="text-xl font-semibold">Ingredients</h3>
            <ul className="list-disc pl-5">
                {recipe.ingredients.map((item, index) => (
                    <li key={index}>{item.ingredient} - {item.quantity}</li>
                ))}
            </ul>
            <h3 className="text-xl font-semibold">Instructions</h3>
            <p className="whitespace-pre-wrap">{recipe.instructions}</p>
            <h3 className="text-xl font-semibold mt-4">Comments</h3>
            <div className="space-y-4">
                {recipe.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg">
                        <p>{comment.text}</p>
                        <p className="text-sm text-gray-600">Posted on {new Date(comment.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecipeDetail;
