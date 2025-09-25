"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [suggesting, setSuggesting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const inputRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState(null);
  // Advanced filters state
  const [showFilters, setShowFilters] = useState(false);
  const [minLikes, setMinLikes] = useState(0);
  const [maxCookTime, setMaxCookTime] = useState(0); // 0 = no limit
  const [tagQuery, setTagQuery] = useState(""); // comma-separated

  useEffect(() => {
    const timer = setInterval(() => update(), 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, [update]);

  useEffect(() => {
    let cancelled = false;

    async function fetchFeed() {
      try {
        const [recipesRes, userRes] = await Promise.all([
          fetch(`/api/feed?page=${page}&limit=${limit}${activeFilter && activeFilter !== 'all' ? `&filter=${activeFilter}` : ''}`),
          fetch("/api/user/me"),
        ]);

        if (cancelled) return;

        const recipesIsJson = recipesRes.headers.get('content-type')?.includes('application/json');
        const userIsJson = userRes.headers.get('content-type')?.includes('application/json');

        const recipesData = recipesRes.ok && recipesIsJson ? await recipesRes.json() : { items: [] };
        const userData = userRes.ok && userIsJson ? await userRes.json() : null;

        const items = Array.isArray(recipesData) ? recipesData : (recipesData?.items || []);
        // Deduplicate by _id defensively
        const seen = new Set();
        const unique = items.filter(r => {
          const id = r?._id?.toString?.() ?? r?._id;
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        setRecipes(unique);
        setFilteredRecipes(unique);
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
  }, [page, limit, activeFilter]);

  // Debounced, abortable non-semantic suggestions
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setSuggesting(true);
      try {
        const res = await fetch(`/api/recipe?q=${encodeURIComponent(searchQuery)}&limit=6`, { signal: controller.signal });
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data?.items || []);
        setSuggestions(items.slice(0, 4));
        setShowDropdown(true);
      } catch (e) {
        if (e.name !== 'AbortError') {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } finally {
        setSuggesting(false);
      }
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  // Position the dropdown using fixed coordinates so it overlays all sections
  useEffect(() => {
    function updatePosition() {
      if (!showDropdown || !inputRef.current) return;
      const el = inputRef.current;
      const rect = el.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    }
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [showDropdown, suggestions]);

  // Recompute filteredRecipes when data or filters change
  useEffect(() => {
    if (!recipes.length) {
      setFilteredRecipes([]);
      return;
    }
    const tags = tagQuery
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);
    const passes = (recipe) => {
      // search terms
      // top-level filter chip
      const matchesFilter =
        activeFilter === "all" ||
        activeFilter === "trending" ||
        activeFilter === "recent" ||
        recipe.category === activeFilter;
      // advanced: likes
      const likesCount = typeof recipe.likesCount === 'number' ? recipe.likesCount : (Array.isArray(recipe.likes) ? recipe.likes.length : 0);
      const likesOK = minLikes > 0 ? likesCount >= minLikes : true;
      // advanced: cookTime
      const timeOK = maxCookTime > 0 ? (Number(recipe.cookTime) || 0) <= maxCookTime : true;
      // advanced: tags (any match)
      const tagsOK = tags.length ? (Array.isArray(recipe.tags) && recipe.tags.some(t => tags.includes(String(t).toLowerCase()))) : true;
      return matchesFilter && likesOK && timeOK && tagsOK;
    };
    setFilteredRecipes(recipes.filter(passes));
  }, [recipes, activeFilter, minLikes, maxCookTime, tagQuery]);

  function goToSearch(e){
    e?.preventDefault?.();
    const params = new URLSearchParams();
    params.set('q', searchQuery || '');
    params.set('semantic', '0'); // do not use semantic for completion/search from feed
    params.set('page', '1');
    router.push(`/search?${params.toString()}`);
  }

  function selectSuggestion(recipe){
    router.push(`/recipe?id=${recipe._id}`);
  }

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

        {/* Advanced Filters Modal */}
        {showFilters && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={()=>setShowFilters(false)}></div>
            <div className="relative z-[210] bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Advanced Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Minimum Likes</label>
                  <input type="number" min="0" value={minLikes} onChange={(e)=>setMinLikes(Number(e.target.value)||0)} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max Cook Time (min)</label>
                  <input type="number" min="0" value={maxCookTime} onChange={(e)=>setMaxCookTime(Number(e.target.value)||0)} className="input-field w-full" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Tags (comma-separated)</label>
                  <input type="text" value={tagQuery} onChange={(e)=>setTagQuery(e.target.value)} placeholder="e.g. vegan, dessert" className="input-field w-full" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-6">
                <button onClick={()=>{ setMinLikes(0); setMaxCookTime(0); setTagQuery(""); }} className="px-3 py-2 text-sm rounded-lg border">Clear</button>
                <button onClick={()=>setShowFilters(false)} className="px-4 py-2 text-sm rounded-lg text-white bg-gradient-to-r from-orange-500 to-pink-500">Apply</button>
              </div>
            </div>
          </div>
        )}

        {/* Search + Filters */}
        <section className="card p-6 space-y-6 overflow-visible relative z-[100] isolate">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative z-50 overflow-visible">
              <form onSubmit={goToSearch}>
                <div className="relative overflow-visible flex items-center">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onFocus={()=>{ if (suggestions.length>0) setShowDropdown(true); }}
                    placeholder="Search recipes, ingredients, or chefs..."
                    className="input-field pl-10 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none focus:border-orange-500 flex-1"
                    type="search"
                    ref={inputRef}
                  />
                  <button
                    type="submit"
                    className="ml-2 h-10 px-4 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md border border-transparent hover:opacity-95 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-none hover:shadow-none shrink-0"
                  >
                    Search
                  </button>
                </div>
                {showDropdown && dropdownStyle && typeof window !== 'undefined' && createPortal(
                  (
                    <div className="bg-white rounded-xl shadow-2xl text-left z-[9999] border border-gray-100"
                         style={dropdownStyle}
                    >
                      {suggesting && (
                        <div className="p-3 text-sm text-gray-500">Searching...</div>
                      )}
                      {!suggesting && suggestions.length === 0 && (
                        <div className="p-3 text-sm text-gray-500">No matches</div>
                      )}
                      {!suggesting && suggestions.map(r => (
                        <button
                          key={r._id}
                          type="button"
                          onClick={()=>selectSuggestion(r)}
                          className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <img src={r.image || 'https://via.placeholder.com/64'} alt="thumb" className="w-12 h-12 object-cover rounded" />
                          <div>
                            <div className="font-medium text-gray-800">{r.title}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{r.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ),
                  document.body
                )}
              </form>
            </div>
            <button onClick={()=>setShowFilters(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors duration-200">
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
          {activeFilter != "all" && <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {searchQuery
                  ? `Search Results (${filteredRecipes.length})`
                  : activeFilter === "trending"
                  ? "Trending Recipes"
                  : activeFilter === "recent"
                  ? "Recent Recipes"
                  : ""}
              </h2>
              <p className="text-gray-500 text-sm">
                {activeFilter === "trending" && " • Sorted by most liked"}
              </p>
            </div>
          </header>}

          

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

          {/* Pagination controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {page}</div>
            <div className="flex items-center gap-2">
              <button onClick={()=> setPage(p => Math.max(1, p-1))} disabled={page===1} className="px-3 py-1.5 rounded border text-sm disabled:opacity-50">Prev</button>
              <button onClick={()=> setPage(p => p+1)} disabled={recipes.length < limit} className="px-3 py-1.5 rounded border text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
