"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import RecipeCard from "@/components/RecipeCard";
import Loading from "@/components/Loading";
import {
  SparklesIcon,
  FireIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const FILTERS = [
  { id: "all", label: "All Recipes", icon: SparklesIcon },
  { id: "trending", label: "Trending", icon: FireIcon },
  { id: "recent", label: "Recent", icon: ClockIcon },
];

export default function Feed() {
  const { update } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const timer = setInterval(() => update(), 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, [update]);

  useEffect(() => {
    let cancelled = false;

    async function fetchFeed() {
      try {
        const [recipesRes, userRes] = await Promise.all([
          fetch("/api/feed"),
          fetch("/api/user/me"),
        ]);

        if (cancelled) return;

        const recipesData = await recipesRes.json();
        const userData = await userRes.json();

        setRecipes(recipesData || []);
        setFilteredRecipes(recipesData || []);
        setUser(userData);
      } catch (error) {
        console.error("Failed to load feed", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchFeed();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch recipes when filter changes
  useEffect(() => {
    if (activeFilter === "all") return; // Don't refetch for "all" as it's the default

    let cancelled = false;

    async function fetchFilteredRecipes() {
      try {
        setIsLoading(true);
        const recipesRes = await fetch(`/api/feed?filter=${activeFilter}`);
        
        if (cancelled) return;

        const recipesData = await recipesRes.json();
        setRecipes(recipesData || []);
        setFilteredRecipes(recipesData || []);
      } catch (error) {
        console.error("Failed to load filtered recipes", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchFilteredRecipes();
    return () => {
      cancelled = true;
    };
  }, [activeFilter]);

  useEffect(() => {
    if (!recipes.length) {
      setFilteredRecipes([]);
      return;
    }

    const next = recipes.filter((recipe) => {
      const matchesSearch = searchQuery
        ? [
            recipe.title,
            recipe.description,
            recipe?.userId?.username,
          ]
            .filter(Boolean)
            .some((value) =>
              value.toLowerCase().includes(searchQuery.toLowerCase())
            )
        : true;

      // For trending and recent filters, we don't need additional filtering
      // as the API already returns the correctly sorted data
      const matchesFilter = 
        activeFilter === "all" || 
        activeFilter === "trending" || 
        activeFilter === "recent" ||
        recipe.category === activeFilter;

      return matchesSearch && matchesFilter;
    });

    setFilteredRecipes(next);
  }, [recipes, searchQuery, activeFilter]);

  const heroCopy = useMemo(
    () => ({
      title: "Recipe Feed",
      subtitle: "Discover amazing dishes from our passionate community of cooks.",
    }),
    []
  );

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
              <SparklesIcon className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text font-poppins">
            {heroCopy.title}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {heroCopy.subtitle}
          </p>
        </section>

        {/* Search + Filters */}
        <section className="card p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search recipes, ingredients, or chefs..."
                className="input-field pl-10"
                type="search"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors duration-200">
              <FunnelIcon className="w-5 h-5" />
              Advanced Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveFilter(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  activeFilter === id
                    ? "border-transparent bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                    : "border-gray-200 bg-white/80 text-gray-700 hover:bg-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              Share Your Culinary Creations
            </h3>
            <p className="text-gray-600">
              Have a delicious recipe to share? Join our community and inspire others!
            </p>
          </div>
          <Link href="/create" className="btn-primary inline-flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Create Recipe
          </Link>
        </section>

        {/* Feed */}
        <section className="space-y-6">
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {searchQuery
                  ? `Search Results (${filteredRecipes.length})`
                  : activeFilter === "trending"
                  ? "Trending Recipes"
                  : activeFilter === "recent"
                  ? "Recent Recipes"
                  : "Latest Recipes"}
              </h2>
              <p className="text-gray-500 text-sm">
                {filteredRecipes.length} recipe
                {filteredRecipes.length === 1 ? "" : "s"} found
                {activeFilter === "trending" && " • Sorted by most liked"}
              </p>
            </div>
          </header>

          {filteredRecipes.length === 0 ? (
            <div className="card p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full mx-auto bg-gray-100 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {searchQuery ? "No recipes matched your search" : "No recipes yet"}
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try refining your keywords or removing filters."
                  : "Be the first to share a recipe with our community!"}
              </p>
              {!searchQuery && (
                <Link href="/create" className="btn-primary inline-flex items-center gap-2">
                  <PlusIcon className="w-5 h-5" />
                  Create First Recipe
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  currentUser={user}
                  saved={user?.savedRecipes?.includes?.(recipe._id)}
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
