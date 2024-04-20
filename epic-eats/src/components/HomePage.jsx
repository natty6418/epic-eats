"use clinet";
import React from 'react';
import Link from 'next/link';
export default function HomePage() {
  return (
    <main className="scroll-snap-y scroll-snap-mandatory overflow-y-scroll h-screen">
      <section className="scroll-snap-align start flex flex-col items-center justify-center  bg-cover bg-center h-screen" style={{ backgroundImage: "url('/images/background1.jpg')" }}>
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8 m-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome to Epic Eats!</h2>
          <p className="text-gray-600 mt-4">Discover, create, and share your favorite recipes from around the globe. Join a community of food enthusiasts who cherish the joy of cooking and eating.</p>
          <div className="mt-8 space-x-4">
            <Link href="/login" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</Link>
            <Link href="/register" className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Sign Up</Link>
          </div>
        </div>
      </section>
      <section className="scroll-snap-align start flex flex-col items-center justify-center  bg-cover bg-center h-screen" style={{
        backgroundImage: "url('/images/background2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-10 transition-all hover:shadow-2xl hover:bg-white">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Features</h3>
      <ul className="list-disc space-y-3 pl-5 text-gray-800">
          <li className="text-lg">Upload and manage your recipes easily</li>
          <li className="text-lg">Connect with fellow food lovers</li>
          <li className="text-lg">Explore recipes from a global community</li>
      </ul>
  </div>
  
      </section>
      

      <section className="scroll-snap-align start flex flex-col items-center justify-center  bg-cover bg-center h-screen" style={{
        backgroundImage: "url('/images/background4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-semibold">Testimonials</h3>
        <blockquote>"I love sharing my recipes on Epic Eats and seeing what others are cooking!"</blockquote>
      </div>
      </section>

      <footer className="scroll-snap-align start flex flex-col items-center justify-center  bg-cover bg-center h-screen" style={{
        backgroundImage: "url('/images/background2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
        © 2024 Epic Eats, Inc. | <Link href="/privacy">Privacy</Link> | <Link href="/terms">Terms</Link>
        </div>
      </footer>
    </main>
  );
}
