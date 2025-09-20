"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { 
  SparklesIcon, 
  PlusIcon, 
  PhotoIcon,
  DocumentTextIcon,
  ListBulletIcon,
  ClockIcon,
  FireIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function CreateRecipeForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([{ ingredient: '', quantity: '' }]);
  const [instructions, setInstructions] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState("https://via.placeholder.com/800");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cookTime, setCookTime] = useState('');
  const [tags, setTags] = useState('');

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredient: '', quantity: '' }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          ingredients, 
          instructions, 
          image, 
          description,
          cookTime: cookTime || '30',
          tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/feed');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to create recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text font-poppins mb-4">
            Create Your Masterpiece
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Share your culinary creativity with our amazing community of food lovers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Basic Info</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Details</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Publish</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card p-8 shadow-xl">
              <form id="recipe-form" className="space-y-8" onSubmit={handleSubmit}>
                {/* Recipe Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <DocumentTextIcon className="w-5 h-5 text-orange-500" />
                    Recipe Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    placeholder="What's your delicious creation called?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-lg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex flex-wrap gap-3 mb-3">
                  <input
                    type="text"
                    name="ingredient[]"
                    placeholder="Ingredient"
                    required
                    className="input-field flex-1 min-w-0 sm:flex-auto sm:w-auto"
                    value={ingredient.ingredient}
                    onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                  />
                  <input
                    type="text"
                    name="quantity[]"
                    placeholder="Quantity"
                    required
                    className="input-field flex-1 min-w-0 sm:flex-auto sm:w-auto"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={index === ingredients.length - 1 ? addIngredient : () => removeIngredient(index)}
                    className={`rounded-lg px-3 py-2 text-white ${index === ingredients.length - 1 ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' : 'bg-red-500 hover:bg-red-600'}`}
                    style={{ minWidth: '2rem' }}
                    aria-label={index === ingredients.length - 1 ? 'Add ingredient' : 'Remove ingredient'}
                  >
                    {index === ingredients.length - 1 ? '+' : '-'}
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                className="input-field"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              <textarea
                id="instructions"
                name="instructions"
                rows="8"
                required
                className="input-field"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              ></textarea>
            </div>

            <div className="relative">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Recipe Image</label>
              <img src={image} className="relative mt-1 block w-full h-32 rounded-lg object-cover opacity-20" />
              <CldUploadWidget signatureEndpoint={'/api/sign-image'} options={{ sources: ['local', 'url', 'unsplash'] }}
                onSuccess={(response) => setImage(response.info.secure_url)}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={open}
                    className='btn-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2'
                  >
                    <PlusIcon className="w-5 h-5" /> Upload Image
                  </button>
                )}
              </CldUploadWidget>
            </div>

            <button type="submit" className="btn-primary w-full">Submit Recipe</button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateRecipeForm;
