"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function SignupForm() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            })
            const data = await res.json()
            if (data.error) {
                setError(data.error)
            } else {
                router.push('/login');
            }
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <div className="bg-gray-200 max-w-[400px] p-8 mt-8 rounded" id="register-form-container">
    <h2 className="text-lg font-bold">Register</h2>
    <form id="register-form" method="POST" action="" className="space-y-6">
        <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input 
            type="text" 
            id="username" 
            name="username" 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            onChange={
                (e) => setUsername(e.target.value)
            }/>
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            onChange={
                (e) => setEmail(e.target.value)
            }
            />
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" name="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            onChange={
                (e) => setPassword(e.target.value)
            }
            />
        </div>
        <button id="register-btn" type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={
            handleRegister
        }>Register</button>
    </form>
    {error && <p className="text-red-500">{error}</p>}
    <p className="mt-4">Already have an account? <Link href="/login" id="login-tag" className="text-blue-500 hover:text-blue-700">Login here</Link>.</p>
</div>
    )
}