"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { 
  SparklesIcon, 
  PhotoIcon,
  DocumentTextIcon,
  ListBulletIcon,
  ClockIcon,
  FireIcon,
  CheckCircleIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function CreateRecipeForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cookTime, setCookTime] = useState('');
  const [tags, setTags] = useState('');

  const handleIngredientChange = (index, value) => {
    const next = [...ingredients];
    next[index] = value;
    setIngredients(next);
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, '']);
  };

  const removeIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
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
          // Send as comma-separated string per requirement
          ingredients: ingredients.map(i => i.trim()).filter(Boolean).join(', '), 
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
      <div className="max-w-7xl mx-auto px-4 py-10">
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-orange-400 focus:shadow-lg focus:outline-none transition-all duration-200 text-lg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Ingredients */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <ListBulletIcon className="w-5 h-5 text-orange-500" />
                    Ingredients
                  </label>
                  <div className="space-y-3">
                    {ingredients.map((ing, index) => (
                      <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl">
                        <input
                          type="text"
                          placeholder="e.g., 2 cups flour"
                          required
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-0 focus:ring-offset-0 focus:border-orange-400 focus:shadow-md focus:outline-none transition-all duration-200"
                          value={ing}
                          onChange={(e) => handleIngredientChange(index, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={index === ingredients.length - 1 ? addIngredient : () => removeIngredient(index)}
                          className={`p-2 rounded-lg text-white transition-all duration-200 ${index === ingredients.length - 1 ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600' : 'bg-red-500 hover:bg-red-600'}`}
                          aria-label={index === ingredients.length - 1 ? 'Add ingredient' : 'Remove ingredient'}
                        >
                          {index === ingredients.length - 1 ? <PlusIcon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <DocumentTextIcon className="w-5 h-5 text-orange-500" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    required
                    placeholder="Tell us about your recipe - what makes it special?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-orange-400 focus:shadow-lg focus:outline-none transition-all duration-200 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <label htmlFor="instructions" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <ListBulletIcon className="w-5 h-5 text-orange-500" />
                    Step-by-Step Instructions
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    rows="8"
                    required
                    placeholder="Walk us through your cooking process step by step..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-orange-400 focus:shadow-lg focus:outline-none transition-all duration-200 resize-none"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  ></textarea>
                </div>

                {/* Recipe Image */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <PhotoIcon className="w-5 h-5 text-orange-500" />
                    Recipe Image
                  </label>
                  <div className="relative group">
                    <div className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-orange-400 transition-all duration-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      {image ? (
                        <img 
                          src={image} 
                          className="w-full h-full object-cover" 
                          alt="Recipe preview"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm font-medium">Click to upload recipe image</p>
                            <p className="text-gray-400 text-xs mt-1">PNG, JPG up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <CldUploadWidget signatureEndpoint={'/api/sign-image'} options={{ sources: ['local', 'url', 'unsplash'] }}
                        onSuccess={(response) => setImage(response.info.secure_url)}
                      >
                        {({ open }) => (
                          <button
                            type="button"
                            onClick={open}
                            className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 shadow-lg"
                          >
                            <PhotoIcon className="w-5 h-5" />
                            {image ? 'Change Image' : 'Upload Image'}
                          </button>
                        )}
                      </CldUploadWidget>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="cookTime" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <ClockIcon className="w-5 h-5 text-orange-500" />
                      Cook Time (minutes)
                    </label>
                    <input
                      type="number"
                      id="cookTime"
                      name="cookTime"
                      placeholder="30"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-orange-400 focus:shadow-lg focus:outline-none transition-all duration-200"
                      value={cookTime}
                      onChange={(e) => setCookTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tags" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <FireIcon className="w-5 h-5 text-orange-500" />
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      placeholder="italian, pasta, comfort food"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-orange-400 focus:shadow-lg focus:outline-none transition-all duration-200"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Recipe...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Publish Recipe
                      </>
                    )}
                  </button>
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-center font-medium">{error}</p>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Tips Card */}
              <div className="card p-6 bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-orange-500" />
                  Pro Tips
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use descriptive titles that make your recipe stand out</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Include specific measurements for better results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Add helpful cooking tips in your instructions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use relevant tags to help others discover your recipe</span>
                  </li>
                </ul>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRecipeForm;
