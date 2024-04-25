"use client";
import React from 'react'
import { useSearchParams } from 'next/navigation'
import Loading from '@/components/Loading';
import RecipeDetail from '@/components/RecipeDetails';
export default function RecipePage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    return (
        <RecipeDetail recipeId={id} />
    )
}