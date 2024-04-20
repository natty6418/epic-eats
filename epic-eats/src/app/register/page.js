import React from "react";
import Link from 'next/link';
import SignupForm from "@/components/SignupForm";
export default function LoginPage() {
    return (
        <div className="flex flex-col items-center bg-gray-50 min-h-[calc(100vh-78px)]">
            <SignupForm />
        </div>
    )
}