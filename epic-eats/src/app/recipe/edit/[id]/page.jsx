"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import Loading from '@/components/Loading';


function EditRecipeForm({params}) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState([{ ingredient: '', quantity: '' }]);
    const [instructions, setInstructions] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState("https://via.placeholder.com/800");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const {id} = params;
    useEffect(() => {
        const fetchRecipe = async () => {
            const res = await fetch(`/api/recipe/${id}`);
            const data = await res.json();
            if (data.error) {
                console.log("error", data.error);
                return;
            }
            setTitle(data.title);
            setIngredients(data.ingredients);
            setInstructions(data.instructions);
            setDescription(data.description);
            setImage(data.image);
            setLoading(false);
        };
        fetchRecipe();
    }, [id]);


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
        const res = await fetch(`/api/recipe/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, ingredients, instructions, image, description }),
        });
        const data = await res.json();
        if (res.ok) {
            router.push('/profile/me');
        } else {
            setError(data.error);
        }
    };
    if(loading){
        return <Loading />
    }
    return (
        <main className="bg-gray-50 p-8 flex justify-center items-start">
        <div className="space-y-6 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 text-center">Edit Recipe</h2>
            <form id="recipe-form" className="space-y-6" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Recipe Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                    {
                        ingredients.map((ingredient, index) => (
                            <div key={index} className="flex flex-wrap space-x-3 mb-4">
                            <input
                                type="text"
                                name="ingredient[]"
                                placeholder="Ingredient"
                                required
                                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:flex-auto sm:w-auto"
                                value={ingredient.ingredient}
                                onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                            />
                            <input
                                type="text"
                                name="quantity[]"
                                placeholder="Quantity"
                                required
                                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:flex-auto sm:w-auto"
                                value={ingredient.quantity}
                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                            />
                            <button 
                                type="button" 
                                className={`text-white font-bold py-1 px-2 rounded focus:outline-none ${index === ingredients.length - 1 ? 'bg-blue-500 hover:bg-blue-700' : 'bg-red-500 hover:bg-red-700'}`}
                                onClick={index === ingredients.length - 1 ? addIngredient : () => setIngredients(ingredients.filter((_, i) => i !== index))}
                                style={{ minWidth: '2rem' }}  // Ensure button has a minimum width
                            >
                                {index === ingredients.length - 1 ? '+' : '-'}
                            </button>
                        </div>
                        
                        ))
                    }
                
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        rows="8"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    ></textarea>
                </div>
                <div className="relative">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Recipe Image</label>
                    <img src={image} className={` relative mt-1 block w-full h-24 rounded-md focus:ring-blue-500 focus:border-blue-500 opacity-20 object-cover`} />
                    <CldUploadWidget signatureEndpoint={'/api/sign-image'} options={{sources: ['local', 'url', 'unsplash']}}
                        onSuccess={(response) => setImage(response.info.secure_url)}
                    >
                    {({open}) =>(
                        <button type="button" onClick={open} 
                         className='absolute top-1/2 left-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded-full focus:outline-none focus:shadow-outline opacity-100 '
                         style={{opacity: 1}}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
</svg>

                        </button>
                    )}
                    </CldUploadWidget>
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Edit Recipe</button>
                {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
        </div>
    </main>
    
    );
}

export default EditRecipeForm;
