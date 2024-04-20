"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function CreateRecipeForm() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState([{ ingredient: '', quantity: '' }]);
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState('');
    const [error, setError] = useState(null);

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { ingredient: '', quantity: '' }]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // POST request logic here using fetch or another HTTP client
        // console.log({ title, ingredients, instructions, image });
        const res = await fetch('/api/recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, ingredients, instructions, image }),
        });
        const data = await res.json();
        if (res.ok) {
            router.push('/feed');
        } else {
            setError(data.error);
        }
    };

    return (
        <main className="bg-gray-50 p-8 items-center">
            <h2 className="text-2xl font-semibold text-gray-800 max-w-[50%] m-auto">Create Your Recipe</h2>
            <form id="recipe-form" className="space-y-6 max-w-[50%] m-auto" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Recipe Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex space-x-3 mb-4 w-a">
                            <input
                                type="text"
                                name="ingredient[]"
                                placeholder="Ingredient"
                                required
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                value={ingredient.ingredient}
                                onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                            />
                            <input
                                type="text"
                                name="quantity[]"
                                placeholder="Quantity"
                                required
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                value={ingredient.quantity}
                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                            />
                            {index === ingredients.length - 1 ? (
                                <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 w-8 rounded" onClick={addIngredient}>+</button>
                            ):(
                                <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 w-8 rounded" onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}>-</button>
                            
                            )}
                        </div>
                    ))}
                </div>
                <div className="form-group">
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        rows="8"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Recipe Image (URL)</label>
                    <input
                        type="url"
                        id="image"
                        name="recipe-img"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </div>
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Submit Recipe</button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </main>
    );
}

export default CreateRecipeForm;
