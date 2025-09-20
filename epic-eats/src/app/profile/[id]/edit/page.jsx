"use client";
import React, { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import { 
  PencilIcon, 
  PhotoIcon, 
  UserIcon, 
  EnvelopeIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

function EditProfileForm({ isLoading, formData, handleInputChange, handleSubmit, handleImageUpload, error }) {
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50">
                <Loading />
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
            <div className="max-w-4xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg">
                            <PencilIcon className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text font-poppins mb-4">
                        Edit Profile
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Update your profile information and let others know more about you
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="card p-8 shadow-xl">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Profile Picture Section */}
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <PhotoIcon className="w-5 h-5 text-orange-500" />
                                        Profile Picture
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <img 
                                                src={formData?.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"} 
                                                alt="Profile Photo" 
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" 
                                            />
                                        </div>
                                        <div>
                                            <CldUploadWidget 
                                                signatureEndpoint="/api/sign-image" 
                                                options={{ sources: ['local', 'url', 'unsplash'] }}
                                                onSuccess={(response) => handleImageUpload(response)}
                                            >
                                                {({ open }) => (
                                                    <button 
                                                        type="button" 
                                                        onClick={open} 
                                                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                                                    >
                                                        <PhotoIcon className="w-5 h-5" />
                                                        Change Photo
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                            <p className="text-gray-500 text-sm mt-2">JPG, PNG up to 10MB</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Username */}
                                <div className="space-y-2">
                                    <label htmlFor="username" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <UserIcon className="w-5 h-5 text-orange-500" />
                                        Username
                                    </label>
                                    <input 
                                        type="text" 
                                        id="username" 
                                        name="username" 
                                        value={formData.username} 
                                        onChange={handleInputChange} 
                                        required 
                                        minLength="3" 
                                        maxLength="255" 
                                        placeholder="Choose a unique username"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-orange-400 focus:shadow-lg focus:outline-none transition-all duration-200 text-lg"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <EnvelopeIcon className="w-5 h-5 text-orange-500" />
                                        Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        required 
                                        placeholder="your.email@example.com"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-orange-400 focus:shadow-lg focus:outline-none transition-all duration-200 text-lg"
                                    />
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <label htmlFor="bio" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <DocumentTextIcon className="w-5 h-5 text-orange-500" />
                                        Bio
                                    </label>
                                    <textarea 
                                        id="bio" 
                                        name="bio" 
                                        value={formData.bio} 
                                        onChange={handleInputChange} 
                                        rows="4"
                                        placeholder="Tell others about yourself, your cooking style, or what you love to make..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-orange-400 focus:shadow-lg focus:outline-none transition-all duration-200 resize-none"
                                    />
                                    <p className="text-gray-500 text-sm">Share a bit about yourself to help others connect with you</p>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <button 
                                        type="submit" 
                                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                    >
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Save Changes
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
                        <div className="sticky top-8 space-y-6">
                            {/* Tips Card */}
                            <div className="card p-6 bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <PencilIcon className="w-5 h-5 text-orange-500" />
                                    Profile Tips
                                </h3>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Choose a clear, friendly profile picture</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Pick a memorable username that reflects your style</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Write a bio that showcases your cooking passion</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Keep your email updated for notifications</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Preview Card */}
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <UserIcon className="w-5 h-5 text-orange-500" />
                                    Preview
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={formData?.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"} 
                                            alt="Preview" 
                                            className="w-12 h-12 rounded-full object-cover" 
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">{formData.username || "Username"}</p>
                                            <p className="text-sm text-gray-600">{formData.email || "email@example.com"}</p>
                                        </div>
                                    </div>
                                    {formData.bio && (
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            {formData.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EditProfile() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;
    
    const [formData, setFormData] = useState({
        username: session?.user?.username || '',
        email: session?.user?.email || '',
        bio: '',
        profilePic: ''
    });

    useEffect(() => {
        async function fetchUser() {
            if (!userId) {
                console.log('User ID is undefined');
                setIsLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/user/me`);
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setFormData(data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setError('Failed to load profile data');
            }
            setIsLoading(false);
        }
        fetchUser();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            const res = await fetch(`/api/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            router.push(`/profile/${userId}`);
        } catch (error) {
            console.error('Failed to update user:', error);
            setError(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (response) => {
        setFormData(prev => ({
            ...prev,
            profilePic: response.info.secure_url
        }));
    };

    return (
        <EditProfileForm
            isLoading={isLoading}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleImageUpload={handleImageUpload}
            error={error}
        />
    );
}