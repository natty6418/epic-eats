"use client";
import React, { useState, useCallback } from "react";
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import { 
  HeartIcon, 
  BookmarkIcon, 
  EyeIcon, 
  UserPlusIcon, 
  UserMinusIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

export default function RecipeCard({ recipe, currentUser, saved, setCurrentUser }) {
	const currentUserId = currentUser?._id;
	const [isSaved, setIsSaved] = useState(saved);
	const [user, setUser] = useState(recipe.userId);
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [isLiked, setIsLiked] = useState(recipe.likes?.includes(currentUser?._id));
	const [likesCount, setLikesCount] = useState(recipe.likes?.length || 0);
	const [isFollowing, setIsFollowing] = useState(currentUser?.following?.includes(user._id) || false);
	const [isLoading, setIsLoading] = useState(false);
	const searchParams = useSearchParams();

	const createQueryString = useCallback(
		(name, value) => {
			const params = new URLSearchParams(searchParams)
			params.set(name, value)
			return params.toString()
		},
		[searchParams]
	);

	const toggleDescription = () => {
		setShowFullDescription(!showFullDescription);
	};

	const previewDescriptions = recipe?.description.length > 120
		? recipe?.description.substring(0, 120) + '...'
		: recipe?.description;

	const formatDate = (date) => {
		const now = new Date();
		const recipeDate = new Date(date);
		const diffTime = Math.abs(now - recipeDate);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays === 1) return '1 day ago';
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
		return recipeDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
	};

	const unfollow = async () => {
		setIsLoading(true);
		const res = await fetch(`/api/user/unfollow`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentUserId,
				userToUnfollowId: user._id
			})
		});
		const data = await res.json();
		if (data.error) {
			console.log(data.error);
			setIsLoading(false);
			return;
		}
		setUser(prev => ({
			...prev,
			followers: prev.followers.filter(follower => follower !== currentUserId)
		}));
		setCurrentUser(prev => ({
			...prev,
			following: prev.following.filter(following => following !== user._id)
		}));
		setIsFollowing(false);
		setIsLoading(false);
	};

	const follow = async () => {
		setIsLoading(true);
		const res = await fetch(`/api/user/follow`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentUserId,
				userToFollowId: user._id
			})
		});
		const data = await res.json();
		if (data.error) {
			console.log(data.error);
			setIsLoading(false);
			return;
		}
		setUser(prev => ({
			...prev,
			followers: [...prev.followers, currentUserId]
		}));
		setCurrentUser(prev => ({
			...prev,
			following: [...prev.following, user._id]
		}));
		setIsFollowing(true);
		setIsLoading(false);
	};

	const saveRecipe = async () => {
		setIsLoading(true);
		const res = await fetch(`/api/user/savedRecipes/save`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({recipeId: recipe._id})
		});
		const data = await res.json();
		if (data.error) {
			console.log(data.error);
			setIsLoading(false);
			return;
		}
		setIsSaved(true);
		setIsLoading(false);
	};

	const removeRecipe = async () => {
		setIsLoading(true);
		const res = await fetch(`/api/user/savedRecipes/remove`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({recipeId: recipe._id})
		});
		const data = await res.json();
		if (data.error) {
			console.log(data.error);
			setIsLoading(false);
			return;
		}
		setIsSaved(false);
		setIsLoading(false);
	};

	const toggleLike = async () => {
		if (!currentUser) {
			// or redirect to login
			return;
		}
		setIsLoading(true);
		const url = `/api/recipe/${recipe._id}/${isLiked ? 'unlike' : 'like'}`;
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await res.json();
			if (data.error) {
				console.error('Error toggling like:', data.error);
			} else {
				setIsLiked(!isLiked);
				setLikesCount(data.likes.length);
			}
		} catch (error) {
			console.error('Network error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const FollowButton = () => {
		if (currentUserId === user._id) {
			return null;
		}

		if (isFollowing) {
			return (
				<button
					onClick={unfollow}
					disabled={isLoading}
					className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-all duration-200 disabled:opacity-50"
				>
					<UserMinusIcon className="w-4 h-4" />
					<span className="hidden sm:inline">Following</span>
				</button>
			);
		} else {
			return (
				<button
					onClick={follow}
					disabled={isLoading}
					className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-full transition-all duration-200 disabled:opacity-50"
				>
					<UserPlusIcon className="w-4 h-4" />
					<span className="hidden sm:inline">Follow</span>
				</button>
			);
		}
	};

	return (
		<div className="card group hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
			{/* Header with User Info */}
			<div className="p-4 pb-2">
				<div className="flex items-center justify-between">
					<Link href={`/profile/${user._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
						<div className="relative">
							<img
								src={user?.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
								alt={user?.username}
								className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-sm"
							/>
							<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
						</div>
						<div>
							<p className="font-semibold text-gray-800 text-sm">{user?.username}</p>
							<p className="text-xs text-gray-500">{formatDate(recipe.createdAt)}</p>
						</div>
					</Link>
					<FollowButton />
				</div>
			</div>

			{/* Recipe Image */}
			<div className="relative overflow-hidden">
				<img 
					className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
					src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"} 
					alt={recipe.title}
				/>
				<div className="absolute top-3 right-3">
					<button
						onClick={toggleLike}
						disabled={isLoading}
						className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLiked ? (
							<HeartSolidIcon className="w-5 h-5 text-red-500" />
						) : (
							<HeartIcon className="w-5 h-5 text-gray-600" />
						)}
						<span className="text-xs font-medium text-gray-700">{likesCount}</span>
					</button>
				</div>
				
				{/* Recipe Stats Overlay */}
				<div className="absolute bottom-3 left-3 right-3">
					<div className="flex items-center gap-3 text-white">
						<div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
							<ClockIcon className="w-3 h-3" />
							<span className="text-xs font-medium">{recipe.cookTime || '30'} min</span>
						</div>
						<div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
							<StarIcon className="w-3 h-3" />
							<span className="text-xs font-medium">{recipe.rating || '4.5'}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Recipe Content */}
			<div className="p-4 flex-1 flex flex-col">
				<h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
					{recipe.title}
				</h3>
				
				<p className="text-gray-600 text-sm leading-relaxed flex-1">
					{showFullDescription ? recipe.description : previewDescriptions}
					{recipe.description.length > 120 && (
						<button
							onClick={toggleDescription}
							className="text-orange-500 hover:text-orange-600 text-sm font-medium ml-1 transition-colors"
						>
							{showFullDescription ? 'Show less' : 'Show more'}
						</button>
					)}
				</p>

				{/* Recipe Tags */}
				{recipe.tags && recipe.tags.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-3">
						{recipe.tags.slice(0, 3).map((tag, index) => (
							<span
								key={index}
								className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium"
							>
								#{tag}
							</span>
						))}
						{recipe.tags.length > 3 && (
							<span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
								+{recipe.tags.length - 3}
							</span>
						)}
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className="p-4 pt-0">
				<div className="flex gap-2">
					<Link 
						href={`/recipe?${createQueryString("id", recipe._id)}`}
						className="flex-1 btn-primary text-center flex items-center justify-center gap-2 py-2.5"
					>
						<EyeIcon className="w-4 h-4" />
						View Recipe
					</Link>
					
					<button
						onClick={isSaved ? removeRecipe : saveRecipe}
						disabled={isLoading}
						className={`px-4 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 ${
							isSaved 
								? 'bg-green-100 text-green-700 hover:bg-green-200' 
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						{isSaved ? (
							<BookmarkSolidIcon className="w-4 h-4" />
						) : (
							<BookmarkIcon className="w-4 h-4" />
						)}
					</button>
					
					<button className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-all duration-200">
						<ShareIcon className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
