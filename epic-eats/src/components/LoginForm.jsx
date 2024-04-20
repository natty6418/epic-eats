"use client";
import React from "react";
import Link from "next/link";
import {signIn} from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {useState} from "react";


export default function LoginForm() {
    
    const [error, setError] = useState(null);
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        });
        if (!result.error) {
            router.push('/feed');
        } else {
            setError("Invalid email or password");
        }
    }
    return (
        <>
        <div className="bg-gray-200 p-8 max-w-[400px] mt-8 rounded" id="login-form-container">
            <h2 className="text-lg font-bold">Login</h2>
            <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" name="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <button id="login-btn" type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <p className="mt-4">Don't have an account? <Link href="/register" id="register-tag" className="text-blue-500 hover:text-blue-700">Register here</Link>.</p>
        </div>

        </>
    );
}
