"use client";
import React, { useState, useEffect } from 'react';
import Loading from './Loading';

function RecipeDetail({ recipeId }) {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [showFullInstructions, setShowFullInstructions] = useState(false);
    const [newComment, setNewComment] = useState('');
    
    useEffect(() => {
        async function fetchRecipe() {
            try {
                const response = await fetch(`/api/recipe/${recipeId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                console.log("data", data);
                setRecipe(data);
                setUser(data.userId);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchRecipe();
    }, [recipeId]);

    useEffect(() => {
        console.log("Recipe", recipe?.userId);
    }, [recipe]);

    if (loading) return <Loading />;
    if (error) return <p>Error: {error}</p>;
    if (!recipe) return <p>No recipe found!</p>;


    // Function to toggle full instructions view
    const toggleInstructions = () => {
        setShowFullInstructions(!showFullInstructions);
    };

    // Function to handle comment submission
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        // Implement the logic to submit the comment to your backend
        console.log(newComment); // Example action
        setNewComment(''); // Reset input field after submission
    };

    const instructionsPreview = recipe.instructions.length > 150
        ? recipe.instructions.substring(0, 150) + '...'
        : recipe.instructions;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mx-auto max-w-4xl w-full">

            <div className="flex items-center mb-4">
                <img
                    src={user?.profilePic || "https://via.placeholder.com/150"}
                    alt="Profile Picture"
                    className="w-14 h-14 object-cover rounded-full border-2 border-white"
                />
                <div className="flex items-center space-x-2 ml-2">
    <p className="text-gray-800 font-semibold">{user?.username}</p>
    <p className="text-sm text-gray-600">{new Date(recipe.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
</div>

            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.title}</h2>
            {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-md my-4" />}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h3>
<ul className="list-disc pl-5 mb-6 text-gray-700 bg-gray-50 p-3 rounded-lg shadow">
    {recipe.ingredients.map((item, index) => (
        <li key={index} className="mb-1 hover:bg-gray-200 rounded p-1 flex justify-between">
    <span className="font-medium">{item.ingredient}</span>
    <span className="text-sm font-light text-gray-600">{item.quantity}</span>
</li>

    ))}
</ul>

<h3 className="text-xl font-semibold mb-4">Instructions</h3>
<p className="whitespace-pre-wrap mb-6 text-gray-700 bg-gray-50 p-3 rounded-lg shadow">
    {showFullInstructions ? recipe.instructions : instructionsPreview}
    <button 
        className="text-blue-500 hover:text-blue-700 cursor-pointer transition duration-300 ease-in-out ml-2"
        onClick={toggleInstructions}
    >
        {showFullInstructions ? 'Show Less' : 'Show More'}
        <i className={`fas ${showFullInstructions ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
    </button>
</p>

<h3 className="text-xl font-semibold mt-4 mb-4 text-gray-800">Comments</h3>
<div className="space-y-4 mb-6">
    {recipe.comments?.map((comment, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
            <div className="flex items-center space-x-3 mb-2">
                <img src={comment.user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full" />
                <p className="font-semibold">{comment.user.name}</p>
                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
            </div>
            <p>{comment.text}</p>
        </div>
    ))}
</div>
<form onSubmit={handleCommentSubmit} className="space-y-4">
    <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        placeholder="Add a comment..."
    ></textarea>
    <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
        Post Comment
    </button>
</form>

        </div>
    );
}

export default RecipeDetail;
