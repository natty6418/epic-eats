"use client";
import React from "react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import RecipeCard from "@/components/RecipeCard";
import { 
  BookmarkIcon, 
  MagnifyingGlassIcon, 
  HeartIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  PlusIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

function SearchBar({ recipes, setRecipes, searchQuery, setSearchQuery }) {
    const [isSearching, setIsSearching] = useState(false);
    
    function searchBarFallback() {
        return <p>Loading...</p>
    }
    
    async function searchRecipes() {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const data = await fetch(`/api/user/savedRecipes?query=${searchQuery}`);
            const json = await data.json();
            const items = Array.isArray(json) ? json : (json?.items || []);
            setRecipes(items);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchRecipes();
        }
    };
    
    return (
        <Suspense fallback={searchBarFallback()}>
            <div className="max-w-3xl mx-auto mb-8">
              <div className="card p-6 shadow-xl">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your saved recipes..."
                    className="w-full pl-12 pr-32 py-4 border border-gray-200 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-orange-400 focus:shadow-lg focus:outline-none transition-all duration-200 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    onClick={searchRecipes} 
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                  >
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <MagnifyingGlassIcon className="w-4 h-4" />
                    )}
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
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchSavedRecipes() {
            try {
                const res = await fetch("/api/user/savedRecipes");
                const json = await res.json();
                const items = Array.isArray(json) ? json : (json?.items || []);
                setRecipes(items);
            } catch (error) {
                console.error('Failed to fetch saved recipes:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSavedRecipes();
    }, []);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/user/me");
                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        }
        fetchUser();
    }, []);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                {/* Hero Section */}
                <section className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg">
                            <BookmarkSolidIcon className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text font-poppins">
                        Your Saved Recipes
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        All your bookmarked favorites in one beautiful collection
                    </p>
                </section>

                {/* Stats Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <BookmarkSolidIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{recipes.length}</h3>
                        <p className="text-gray-600">Saved Recipes</p>
                    </div>
                    <div className="card p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <HeartIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {recipes.reduce((total, recipe) => total + (recipe.likes?.length || 0), 0)}
                        </h3>
                        <p className="text-gray-600">Total Likes</p>
                    </div>
                    <div className="card p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <ClockIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {recipes.reduce((total, recipe) => total + parseInt(recipe.cookTime || 30), 0)}
                        </h3>
                        <p className="text-gray-600">Total Cook Time (min)</p>
                    </div>
                </section>

                {/* Search Section */}
                <SearchBar recipes={recipes} setRecipes={setRecipes} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {/* CTA Section */}
                <section className="card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            Discover More Recipes
                        </h3>
                        <p className="text-gray-600">
                            Explore our community's amazing creations and find your next favorite dish!
                        </p>
                    </div>
                    <Link href="/feed" className="btn-primary inline-flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5" />
                        Browse Feed
                    </Link>
                </section>

                {/* Recipes Grid */}
                <section className="space-y-6">
                    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {searchQuery ? `Search Results (${recipes.length})` : "Your Collection"}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {recipes.length} recipe{recipes.length === 1 ? "" : "s"} saved
                            </p>
                        </div>
                    </header>

                    {recipes.length === 0 ? (
                        <div className="card p-12 text-center space-y-6">
                            <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center">
                                <BookmarkIcon className="w-12 h-12 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {searchQuery ? "No recipes found" : "No saved recipes yet"}
                                </h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    {searchQuery 
                                        ? "Try adjusting your search terms or browse our feed to discover amazing recipes."
                                        : "Start building your collection by saving recipes you love from our community!"
                                    }
                                </p>
                            </div>
                            {!searchQuery && (
                                <Link href="/feed" className="btn-primary inline-flex items-center gap-2">
                                    <PlusIcon className="w-5 h-5" />
                                    Explore Recipes
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe._id}
                                    recipe={recipe}
                                    currentUser={user}
                                    saved={true}
                                    setCurrentUser={setUser}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}