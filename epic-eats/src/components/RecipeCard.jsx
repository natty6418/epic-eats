"use client";
import React, {useState} from "react";
import Link from 'next/link';
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
export default function RecipeCard({ recipe }) {
    const [user, setUser] = useState(recipe.userId);
    const [showFullInstructions, setShowFullInstructions] = useState(false);
    const searchParams = useSearchParams()
    const createQueryString = useCallback(
        (name, value) => {
          const params = new URLSearchParams(searchParams)
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
      )
      const toggleInstructions = () => {
        setShowFullInstructions(!showFullInstructions);
    };


    const previewInstructions = recipe.instructions.length > 150
        ? recipe.instructions.substring(0, 150) + '...'
        : recipe.instructions;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div className="flex items-center mb-2">
                <img
                    src={user?.profilePic || "https://via.placeholder.com/150"}
                    alt="Profile Picture"
                    className="w-10 h-10 object-cover rounded-full border-2 border-white relative top-0"
                />
                <div className="flex items-center space-x-2 ml-2">
    <p className="text-gray-800 font-semibold">{user?.username}</p>
    <p className="text-sm text-gray-600">{new Date(recipe.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
</div>
            </div>
            <img className="w-full h-48 object-cover rounded-t-lg" src={recipe.image} alt="Recipe Image" />
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">{recipe.title}</h3>
                <p className="text-gray-600">
                    {showFullInstructions ? recipe.instructions : previewInstructions}
                    {recipe.instructions.length > 150 &&
                        <span
                        onClick={toggleInstructions}
                        className="text-blue-500 hover:text-blue-700 text-sm font-semibold mt-2 cursor-pointer">
                        {showFullInstructions ? 'Show Less' : 'Show More'}
                        </span>
                    }
                </p>
                <Link href={'/recipe' + '?' + createQueryString("id", recipe._id)} className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    View Recipe
                </Link>
            </div>
        </div>
    );

}