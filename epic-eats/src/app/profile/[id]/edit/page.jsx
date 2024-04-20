"use client";
import React, { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

const EditProfile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user.id;
    const [formData, setFormData] = useState({
        username: session?.user.username ||'',
        email: session?.user.email ||'',
        bio: '',
        profilePic: ''
    });
    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`/api/user/${userId}`);
            const data = await res.json();
            if (data.error) {
                console.log(data.error);
                return;
            }
            setFormData(data);
            setIsLoading(false);
        };
        fetchUser();
    }, [session]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.error) {
            console.log(data.error);
            return;
        }
        router.push(`/profile/${userId}`);
        // Here you would typically handle the form submission to the backend
    };

    const handleImageUpload = (response) => {
        setFormData(prev => ({
            ...prev,
            profilePic: response.info.secure_url
        }));
    };
    const editProfileForm = () =>{
        if (isLoading) {
            return <Loading />;
        }
        return (<div className="container mx-auto p-8">
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
            <CldUploadWidget signatureEndpoint="/api/sign-image" options={{ sources: ['local', 'url', 'unsplash'] }}
                onSuccess={(response) => handleImageUpload(response)}
            >
                {({ open }) => (
                    <button type="button" onClick={() => open()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Upload Image
                    </button>
                )}
            </CldUploadWidget>
            {formData.profilePic && <img src={formData.profilePic} alt="Profile" className="mt-4 w-32 h-32 rounded-full object-cover" />}
            <div className="mt-4">
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Save Changes
                </button>
            </div>
        </form>
    </div>)
    }

    return (
        <>
            {editProfileForm()}
        </>
    );
};

export default EditProfile;
