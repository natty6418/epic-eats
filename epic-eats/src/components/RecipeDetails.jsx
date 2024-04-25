"use client";
import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import Comment from './Comment';
import Link from 'next/link';


function RecipeDetail({ recipeId }) {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [showFullInstructions, setShowFullInstructions] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);


    useEffect(() => {
        async function fetchRecipe() {
            try {
                const response = await fetch(`/api/recipe/${recipeId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setRecipe(data);
                setUser(data.userId);
                const userResponse = await fetch(`/api/user/me`);
                const currentUserData = await userResponse.json();
                setCurrentUser(currentUserData);
                setComments(data.comments);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchRecipe();
    }, [recipeId]);
    const saveRecipe = async () => {

        const res = await fetch(`/api/user/savedRecipes/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({recipeId: recipe._id})
        })
        const data = await res.json();
        if (data.error) {
            console.log(data.error);
            return;
        }
        console.log("No error");
        setCurrentUser({...currentUser, savedRecipes: [...currentUser.savedRecipes, recipe._id]});
    }
    const removeRecipe = async () => {
        const res = await fetch(`/api/user/savedRecipes/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({recipeId: recipe._id})
        })
        const data = await res.json();
        if (data.error) {
            console.log(data.error);
            return;
        }
        setCurrentUser({...currentUser, savedRecipes: currentUser.savedRecipes.filter(id => id !== recipe._id)});
    }
    function SaveStatus() {
        if (currentUser.savedRecipes.includes(recipeId)) {
            return (
                <svg 
                onClick={removeRecipe}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                </svg>
            )
        } else {
            return (
                <svg
                onClick={saveRecipe}
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93ZM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 0 1 3.75 21Z" />
                </svg>

            )
        }
    }
    if (loading) return <Loading />;
    if (error) return <p>Error: {error}</p>;
    if (!recipe) return <p>No recipe found!</p>;


    // Function to toggle full instructions view
    const toggleInstructions = () => {
        setShowFullInstructions(!showFullInstructions);
    };

    // Function to handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipeId,
                text: newComment
            })
        });
        const data = await res.json();
        setNewComment('');
        setComments([...comments, data]);
    };

    const instructionsPreview = recipe.instructions.length > 150
        ? recipe.instructions.substring(0, 150) + '...'
        : recipe.instructions;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mx-auto max-w-4xl w-full">
            <Link href={`/profile/${user._id}`}>
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
            </Link>
            <div className='flex flex-row space-x-3 py-2 items-center'>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.title}</h2>
                <button>
                    {currentUser._id === user._id ? <Link href={`/recipe/edit/${recipeId}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-sky-700">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                        </svg>
                    </Link>
                        : <SaveStatus />}
                </button>
            </div>
            {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-md my-4" />}
            <p className="whitespace-pre-wrap mb-6 text-gray-700 bg-gray-50 p-3 rounded-lg shadow">
                {recipe.description}
            </p>
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
                    {recipe.instructions.length > 150 && showFullInstructions ? 'Show Less' : 'Show More'}
                    <i className={`fas ${showFullInstructions ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
                </button>
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-4 text-gray-800">Comments</h3>

            <form onSubmit={handleCommentSubmit} className="flex items-center bg-white p-3 rounded-lg shadow-md">
                <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-grow h-10 p-2 border-0 rounded-md focus:outline-none  resize-none"
                    placeholder="Add a comment..."
                ></input>
                <button
                    type="submit"
                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-lg transition-colors duration-200 ease-in-out py-2"
                >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
              
                </button>
            </form>


            <div
                className="bg-white mt-1 border-b-2 border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
                {
                    comments.map(comment => (
                        <Comment
                            key={comment._id}
                            comment={comment.text}
                            userId={user._id}
                            profilePic={user.profilePic}
                            username={user.username}
                            createdAt={comment.createdAt}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default RecipeDetail;
