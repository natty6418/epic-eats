"use client";
import React from "react";
import Link from 'next/link';
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
export default function RecipeCard({ recipe }) {

    const searchParams = useSearchParams()

    const createQueryString = useCallback(
        (name, value) => {
          const params = new URLSearchParams(searchParams)
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
      )


    return(
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 ease-in-out">
                <img className="w-full h-48 object-cover rounded-t-lg" src={recipe.image} alt="Recipe Image"/>
                <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800">{recipe.title}</h3>
                    <p className="text-gray-600">{recipe.instructions}</p>
                    <Link href={'/recipe' + '?' + createQueryString("id", recipe._id)} className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                        View Recipe
                    </Link>
                </div>
            </div>
    )
}