"use client";
import React, { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

function EditProfileForm({ isLoading, formData, handleInputChange, handleSubmit, handleImageUpload }) {
    if (isLoading) {
        return <Loading />;
    }
    return (
        <main className="bg-gray-50 p-8 flex justify-center items-start">
            <div className="container p-8 h-[calc(100vh-9rem)] max-w-2xl">
                <div class="relative w-32 h-32 mb-4 mx-auto">
                    <img src={formData?.profilePic || "https://via.placeholder.com/150"} alt="Profile Photo" className="rounded-full w-full h-full object-cover" />
                    <CldUploadWidget signatureEndpoint="/api/sign-image" options={{ sources: ['local', 'url', 'unsplash'] }}
                        onSuccess={(response) => handleImageUpload(response)}
                    >
                        {({ open }) => (
                            <button type="button" onClick={()=> open()}  className="absolute bottom-0 right-0 p-2 bg-blue-400 rounded-full shadow-lg">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6">
                            <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                        </svg>
                        </button>
                        )}
                    </CldUploadWidget>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required minLength="3" maxLength="255" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">Bio:</label>
                        <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </div>
                    

                    <div className="mt-4">
                        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
export default function EditProfile() {
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;  // Ensure `user` and `id` exist
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
            }
            setIsLoading(false);
        }
        fetchUser();
    }, [userId]); // Only re-run the effect if `userId` changes

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        />
    );
};