"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'
import RecipeCard from '@/components/RecipeCard';
import Loading from '@/components/Loading';
import UserCard from '@/components/UserCard';
import { MagnifyingGlassIcon, UsersIcon, SparklesIcon } from '@heroicons/react/24/outline';


const SearchPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const search = searchParams.get('q') || '';
    const semanticParamInit = searchParams.get('semantic');
    const initialSemantic = semanticParamInit !== null ? (semanticParamInit === '1' || semanticParamInit === 'true') : true;
    const pageParamInit = Number(searchParams.get('page'));
    const initialPage = (!Number.isNaN(pageParamInit) && pageParamInit > 0) ? pageParamInit : 1;
    const [searchQuery, setSearchQuery] = useState(search);
    const [activeTab, setActiveTab] = useState('recipes'); // Default to recipes
    const [results, setResults] = useState({ users: [], recipes: [] });
    const [semantic, setSemantic] = useState(initialSemantic);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(12);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch('/api/user/me');
            const data = await res.json();
            setUser(data);
        }
        fetchUser();
        // Run search immediately with explicit opts based on initialized state
        (async () => {
          await performSearch({ semantic: initialSemantic, page: initialPage, query: search });
          setInitialized(true);
        })();
    },
    []);
    

    // Submit handler resets to first page then performs search
    function handleSubmit(evt){
        evt.preventDefault();
        const nextPage = 1;
        setPage(nextPage);
        performSearch({ semantic, page: nextPage, query: searchQuery });
        // Reflect query + semantic + page in URL
        const params = new URLSearchParams();
        params.set('q', searchQuery || '');
        params.set('semantic', semantic ? '1' : '0');
        params.set('page', '1');
        router.push(`/search?${params.toString()}`);
    }

    // Function to handle search (uses explicit options to avoid stale state)
    async function performSearch(opts = {}) {
        const effectiveSemantic = typeof opts.semantic === 'boolean' ? opts.semantic : semantic;
        const effectivePage = typeof opts.page === 'number' ? opts.page : page;
        const effectiveQuery = typeof opts.query === 'string' ? opts.query : searchQuery;
        setIsLoading(true);
        const userSearch = await fetch(`/api/user?q=${encodeURIComponent(effectiveQuery)}`);
        const users = await userSearch.json();
        let recipes = [];
        if (effectiveSemantic) {
            // Let the backend vector route handle either vector or text fallback
            // Fetch a larger batch to enable client-side pagination
            const fetchLimit = limit * 10;
            const vecRes = await fetch('/api/recipe/vector', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ q: effectiveQuery, limit: fetchLimit })
            });
            const vecData = await vecRes.json();
            // Ensure no duplicate items by _id on client side
            if (Array.isArray(vecData)) {
                const seen = new Set();
                recipes = vecData.filter(r => {
                    const id = r?._id?.toString?.() ?? r?._id;
                    if (!id || seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });
            } else if (vecData && Array.isArray(vecData.items)) {
                const seen = new Set();
                const items = vecData.items.filter(r => {
                    const id = r?._id?.toString?.() ?? r?._id;
                    if (!id || seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });
                recipes = { ...vecData, items };
            } else {
                recipes = vecData;
            }
        } else {
            const recipeSearch = await fetch(`/api/recipe?q=${encodeURIComponent(effectiveQuery)}&page=${effectivePage}&limit=${limit}`);
            const data = await recipeSearch.json();
            const base = Array.isArray(data) ? data : (data?.items || []);
            const seen = new Set();
            const deduped = base.filter(r => {
                const id = r?._id?.toString?.() ?? r?._id;
                if (!id || seen.has(id)) return false;
                seen.add(id);
                return true;
            });
            recipes = Array.isArray(data) ? deduped : { ...(data || {}), items: deduped };
        }
        setResults({ users, recipes });
        setIsLoading(false);
    };
    
    // Reset page when switching tabs
    useEffect(()=>{
        setPage(1);
    }, [activeTab]);

    // When not using semantic search, refetch recipes whenever page changes (after initialized)
    useEffect(() => {
        if (initialized && !semantic) {
            performSearch({ semantic, page });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, semantic, initialized]);
    function UserList(){
        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
                {results.users.length>0 ? results.users.map(el => (
                    <div key={el._id} className="card p-4">
                      <UserCard user={el} currentUserId={user?._id}/>
                    </div>
                )) :
                <p className="text-center text-gray-600 col-span-full">No users found</p>}
            </div>
        );
    }
    function RecipeList(){
        const recipesArray = Array.isArray(results.recipes) ? results.recipes : (results.recipes?.items || []);
        const start = (page - 1) * limit;
        const pageItems = semantic ? recipesArray.slice(start, start + limit) : recipesArray;
        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full'>
                {pageItems.length>0 ?
                  pageItems.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={{...recipe}} currentUser={user} saved={user?.savedRecipes?.includes(recipe._id)} setCurrentUser={setUser}/>
                  )) : <p className="text-center text-gray-600 col-span-full">No recipes found</p>}
            </div>
        );
    }

    return (
        isLoading ? 
        <Loading /> :
        <div className="min-h-screen px-4 py-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold gradient-text font-poppins">Search</h1>
              <p className="text-gray-600 mt-2">Find chefs and recipes across the community</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-6 w-full">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chefs or recipes..."
                    className="input-field pl-10 pr-28"
                  />
                  <button type="submit" className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2">Search</button>
                </div>
              </div>
            </form>

            {/* Tabs */}
            <div className="flex justify-center mt-2 gap-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'users' ? 'gradient-bg text-white shadow' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                <span className="inline-flex items-center gap-2"><UsersIcon className="w-5 h-5"/> Users</span>
              </button>
              <button
                onClick={() => setActiveTab('recipes')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'recipes' ? 'gradient-bg text-white shadow' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                Recipes
              </button>
              <label className="ml-2 inline-flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={semantic} onChange={(e)=>{ 
                  const next = e.target.checked; 
                  const nextPage = 1;
                  setSemantic(next); 
                  setPage(nextPage); 
                  performSearch({ semantic: next, page: nextPage, query: searchQuery }); 
                  const params = new URLSearchParams();
                  params.set('q', searchQuery || '');
                  params.set('semantic', next ? '1' : '0');
                  params.set('page', String(nextPage));
                  router.push(`/search?${params.toString()}`);
                }} />
                Semantic
              </label>
            </div>

            {/* Results */}
            <div className="mt-6 flex flex-col max-w-7xl w-full mx-auto">
              <div className="card p-6 w-full">
                {activeTab === 'users' ? <UserList /> : <RecipeList />}
              </div>
              {/* Unified pagination controls */}
              {activeTab === 'recipes' && (() => {
                const recipesArray = Array.isArray(results.recipes) ? results.recipes : (results.recipes?.items || []);
                const canPrev = page > 1;
                const canNext = semantic ? (page * limit) < recipesArray.length : (recipesArray.length === limit);
                const goPrev = () => {
                  if (!canPrev) return;
                  const next = page - 1;
                  setPage(next);
                  performSearch({ semantic, page: next, query: searchQuery });
                  const params = new URLSearchParams();
                  params.set('q', searchQuery || '');
                  params.set('semantic', semantic ? '1' : '0');
                  params.set('page', String(next));
                  router.push(`/search?${params.toString()}`);
                };
                const goNext = () => {
                  if (!canNext) return;
                  const next = page + 1;
                  setPage(next);
                  performSearch({ semantic, page: next, query: searchQuery });
                  const params = new URLSearchParams();
                  params.set('q', searchQuery || '');
                  params.set('semantic', semantic ? '1' : '0');
                  params.set('page', String(next));
                  router.push(`/search?${params.toString()}`);
                };
                return (
                  <div className="flex items-center justify-between mt-4">
                    <button onClick={goPrev} disabled={!canPrev} className="px-3 py-1.5 rounded border text-sm disabled:opacity-50">Prev</button>
                    <div className="text-sm text-gray-600">Page {page}</div>
                    <button onClick={goNext} disabled={!canNext} className="px-3 py-1.5 rounded border text-sm disabled:opacity-50">Next</button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
    );
};

export default SearchPage;
