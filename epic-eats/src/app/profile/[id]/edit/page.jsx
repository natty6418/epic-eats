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
        <div className="px-4 py-10 flex justify-center items-start">
            <div className="w-full max-w-2xl">
                <div className="card p-8">
                    <div className="relative w-32 h-32 mb-6 mx-auto">
                        <img src={formData?.profilePic || "https://via.placeholder.com/150"} alt="Profile Photo" className="rounded-full w-full h-full object-cover" />
                        <CldUploadWidget signatureEndpoint="/api/sign-image" options={{ sources: ['local', 'url', 'unsplash'] }}
                            onSuccess={(response) => handleImageUpload(response)}
                        >
                            {({ open }) => (
                                <button type="button" onClick={()=> open()} className="absolute bottom-0 right-0 btn-secondary px-3 py-2 rounded-full">
                                    Upload
                                </button>
                            )}
                        </CldUploadWidget>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                            <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required minLength="3" maxLength="255" className="input-field" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="input-field" />
                        </div>
                        <div>
                            <label htmlFor="bio" className="block text-gray-700 text-sm font-medium mb-2">Bio</label>
                            <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="input-field" rows="4"></textarea>
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="btn-primary w-full">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
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
