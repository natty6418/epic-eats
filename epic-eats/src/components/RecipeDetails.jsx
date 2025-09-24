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
    const [showAllIngredients, setShowAllIngredients] = useState(false);
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
        const savedList = currentUser?.savedRecipes || [];
        if (savedList.includes(recipeId)) {
            return (
                <svg 
                onClick={removeRecipe}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500">
                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                </svg>
            )
        } else {
            return (
                <svg
                onClick={saveRecipe}
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500">
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

    // Build normalized ingredient labels for display
    const ingredientLabels = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map((item) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            const left = item.ingredient || '';
            const right = item.quantity ? ` – ${item.quantity}` : '';
            return `${left}${right}`.trim();
          }
          return '';
        }).filter(Boolean)
      : [];

    const visibleIngredients = showAllIngredients ? ingredientLabels : ingredientLabels.slice(0, 8);

    return (
        <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="card p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text font-poppins leading-tight">
                {recipe.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="chip">{recipe.cookTime || '30'} min</span>
                {recipe.rating && (
                  <span className="chip bg-yellow-100 text-yellow-800">★ {recipe.rating}</span>
                )}
                {recipe.category && <span className="chip">{recipe.category}</span>}
                {Array.isArray(recipe.tags) &&
                  recipe.tags.slice(0, 3).map((t, i) => (
                    <span key={i} className="chip">#{t}</span>
                  ))}
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                <Link href={`/profile/${user?._id}`} className="flex items-center gap-2 hover:text-orange-600">
                  <img
                    src={user?.profilePic || "https://via.placeholder.com/150"}
                    alt="Profile Picture"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-medium">{user?.username}</span>
                </Link>
                <span className="text-gray-400">•</span>
                <span>
                  {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {currentUser?._id === user?._id ? (
                <Link href={`/recipe/edit/${recipeId}`} className="text-gray-500 hover:text-orange-600 transition-colors" title="Edit recipe">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                  </svg>
                </Link>
              ) : (
                <button className="focus:outline-none" title="Save recipe">
                  <SaveStatus />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Image */}
            {recipe.image && (
              <div className="relative overflow-hidden rounded-2xl shadow-lg h-72 sm:h-80 md:h-96">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Description</h2>
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Ingredients + Instructions balanced */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ingredients */}
              <div className="card p-6 h-full min-h-[380px] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
                <ul className="space-y-3 overflow-auto pr-1 flex-1">
                  {visibleIngredients.map((label, index) => (
                    <li key={index} className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="font-medium text-gray-800">{label}</span>
                    </li>
                  ))}
                </ul>
                {ingredientLabels.length > 8 && (
                  <button
                    className="mt-4 text-orange-600 hover:text-orange-700 font-semibold"
                    onClick={() => setShowAllIngredients(!showAllIngredients)}
                  >
                    {showAllIngredients ? 'Show Less' : `Show More (${ingredientLabels.length - 8} more)`}
                  </button>
                )}
              </div>

              {/* Instructions */}
              <div className="card p-6 h-full min-h-[380px] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed flex-1 overflow-auto pr-1">
                  <p className="whitespace-pre-wrap">
                    {showFullInstructions ? recipe.instructions : instructionsPreview}
                  </p>
                </div>
                {recipe.instructions.length > 150 && (
                  <button
                    className="text-orange-600 hover:text-orange-700 font-semibold mt-4 self-start"
                    onClick={toggleInstructions}
                  >
                    {showFullInstructions ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Sticky Comments */}
          <aside className="lg:col-span-4">
            <div className="card p-6 lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>
              <form onSubmit={handleCommentSubmit} className="flex gap-3 items-center mb-5">
                <img
                  src={currentUser?.profilePic || "https://via.placeholder.com/150"}
                  alt="Your profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="input-field flex-grow"
                  placeholder="Share your thoughts..."
                />
                <button type="submit" className="btn-primary">Post</button>
              </form>
              <div className="space-y-5 max-h-[460px] overflow-auto pr-1">
                {comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment.text}
                    userId={user._id}
                    profilePic={user.profilePic}
                    username={user.username}
                    createdAt={comment.createdAt}
                  />
                ))}
                {comments.length === 0 && (
                  <p className="text-sm text-gray-500">Be the first to comment!</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
    );
}

export default RecipeDetail;

