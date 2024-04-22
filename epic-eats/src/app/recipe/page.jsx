"use client";
import React from 'react'
import { useSearchParams } from 'next/navigation'
import Loading from '@/components/Loading';
import RecipeDetail from '@/components/RecipeDetails';
export default function RecipePage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    
    // function RecipePageContent() {
    //     return (
    //     <div className="container mx-auto p-8">
    //         <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center md:items-start">
    //             <img src={recipe?.image} alt="Recipe Image" className="w-full md:w-1/3 rounded-lg mb-4 md:mb-0 md:mr-6"/>
    //             <div className="w-full md:w-2/3">
    //                 <h1 className="text-2xl font-bold text-gray-800 mb-2">{recipe?.title}</h1>
    //                 <p className="text-gray-600 mb-4">Published on: {recipe?.createdAt.split("T")[0]}</p>
    //                 <h2 className="font-semibold text-gray-800">Ingredients:</h2>
    //                 {//<ul className="list-disc list-inside text-gray-600 mb-4">
    //                 //     <li>Ingredient 1 - Quantity</li>
    //                 //     <li>Ingredient 2 - Quantity</li>
    //                 // </ul>
    //             }   
    //                 {recipe && recipe.ingredients.map((ingredient, index) => (
    //                     <p key={index} className="text-gray-600">{ingredient.ingredient} - {ingredient.quantity}</p>
    //                 ))
    //             }

    //                 <h2 className="font-semibold text-gray-800">Instructions:</h2>
    //                 <p className="text-gray-600">{recipe?.instructions}</p>
    //             </div>
    //         </div>

    //         <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
    //             <h2 className="font-semibold text-gray-800 mb-2">Comments</h2>
    //             <div className="space-y-4">
    //                 <div className="border-b pb-4">
    //                     <p className="text-gray-600">"This is a comment." - Username, Date</p>
    //                 </div>
    //                 <div className="border-b pb-4">
    //                     <p className="text-gray-600">"Another comment." - Username, Date</p>
    //                 </div>
    //             </div>
    //         </div>

    //         <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
    //             <h2 className="font-semibold text-gray-800 mb-2">Leave a Comment</h2>
    //             <form action="" method="POST">
    //                 <textarea className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" rows="4" placeholder="Add a comment..."></textarea>
    //                 <button type="submit" disabled className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Post Comment</button>
    //             </form>
    //         </div>
    //     </div>

    //     )
    // }
    return (
        <RecipeDetail recipeId={id} />
    )
}