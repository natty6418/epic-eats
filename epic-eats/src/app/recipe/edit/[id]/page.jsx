"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import Loading from '@/components/Loading';
import Dialog from '@mui/material/Dialog';



function EditRecipeForm({ params }) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState("https://via.placeholder.com/800");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [owner, setOwner] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const { id } = params;
    useEffect(() => {
        const fetchRecipe = async () => {
            const res = await fetch(`/api/recipe/${id}`);
            const data = await res.json();
            if (data.error) {
                console.log("error", data.error);
                return;
            }
            setTitle(data.title);
            setIngredients(Array.isArray(data.ingredients) ? data.ingredients.join(', ') : '');
            setInstructions(data.instructions);
            setDescription(data.description);
            setImage(data.image);
            setLoading(false);
            setOwner(data.userId);
        };
        fetchRecipe();
    }, [id]);
    useEffect(() => {
        setLoading(true);
        const fetchUser = async () => {
            const res = await fetch('/api/user/me');
            const data = await res.json();
            setCurrentUser(data);
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleDelete = async () => {
        const res = await fetch(`/api/recipe/${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            router.push('/profile/me');
        } else {
            const data = await res.json();
            setError(data.error);
            console.log(data.error);
        }
    };
    const handleIngredientsInput = (value) => {
        setIngredients(value);
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
    if (loading) {
        return <Loading />
    }
    return (
        <main className="bg-gray-50 p-8 flex justify-center items-start">
            <div className="space-y-6 w-full max-w-2xl">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 text-center">Edit Recipe</h2>
                    <p className='text-center text-red-500 font-light underline cursor-pointer' onClick={() => setDeleteModalOpen(true)}>Delete Recipe</p>
                </div>
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
                        <label className="block text-sm font-medium text-gray-700">Ingredients (comma-separated)</label>
                        <input
                            type="text"
                            placeholder="e.g., Flour, Eggs, Milk, Sugar"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={ingredients}
                            onChange={(e) => handleIngredientsInput(e.target.value)}
                        />
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
                        <CldUploadWidget signatureEndpoint={'/api/sign-image'} options={{ sources: ['local', 'url', 'unsplash'] }}
                            onSuccess={(response) => setImage(response.info.secure_url)}
                        >
                            {({ open }) => (
                                <button type="button" onClick={open}
                                    className='absolute top-1/2 left-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded-full focus:outline-none focus:shadow-outline opacity-100 '
                                    style={{ opacity: 1 }}
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
            <Dialog
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex justify-center items-center border-none rounded-lg shadow-lg"
            >
                <div className="mt-6 flex flex-col mx-auto w-[400px] border-none">
                    <div className="bg-white rounded-lg shadow-lg pb-3 text-center items-center px-6">
                        <h2 className="font-semibold text-gray-800 mb-2">Are you sure you want to delete this recipe?</h2>
                        <div className="block center space-x-4 mx-auto">
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </main>

    );
}

export default EditRecipeForm;
