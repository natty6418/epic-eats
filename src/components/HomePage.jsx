"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HeartIcon, 
  ShareIcon, 
  SparklesIcon, 
  UserGroupIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const images = [
  '/images/background1.jpg',
  '/images/background2.jpg',
  '/images/background3.jpg',
  '/images/background4.jpg',
];

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {images.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="glass-effect p-12 max-w-3xl mx-auto rounded-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white font-poppins">
              Epic Eats
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed text-balance">
              Discover, create, and share amazing recipes from around the world. 
              Join a vibrant community of food enthusiasts who celebrate the art of cooking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="btn-primary flex items-center gap-2 group">
                Get Started
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text font-poppins">
              Why Choose Epic Eats?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
              Experience the future of recipe sharing with our innovative platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                <BookOpenIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Discover Recipes</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore thousands of recipes from home cooks and professional chefs worldwide. 
                Find your next favorite dish with our smart search and recommendation system.
              </p>
            </div>
            
            <div className="card p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                <ShareIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Share Your Creations</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your own recipes with photos, step-by-step instructions, and cooking tips. 
                Build your reputation in the culinary community.
              </p>
            </div>
            
            <div className="card p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Connect & Learn</h3>
              <p className="text-gray-600 leading-relaxed">
                Join a passionate community of food lovers. Get feedback, share tips, 
                and learn from experienced cooks and culinary experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Feature */}
      <section className="py-20 px-4 gradient-bg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text font-poppins">
              AI-Powered Cooking Assistant
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed text-balance">
              Get instant help with your cooking questions, ingredient substitutions, 
              and recipe modifications from our intelligent AI assistant.
            </p>
            
            <Link href="/chat" className="btn-primary inline-flex items-center gap-2 group">
              Try AI Assistant
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text font-poppins">
              What Our Community Says
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Home Cook",
                content: "Epic Eats has transformed how I cook! The AI assistant helped me perfect my grandmother's dumpling recipe.",
                rating: 5
              },
              {
                name: "Marcus Rodriguez",
                role: "Food Blogger",
                content: "The community here is incredible. I've learned so much from other passionate cooks and made lasting friendships.",
                rating: 5
              },
              {
                name: "Emily Johnson",
                role: "Professional Chef",
                content: "As a chef, I love sharing my techniques here. The platform makes it easy to connect with food enthusiasts worldwide.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="card p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text font-poppins">
              Ready to Start Your Culinary Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed text-balance">
              Join thousands of food lovers who are already sharing, discovering, and creating amazing recipes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="btn-primary flex items-center gap-2 group">
                Join Epic Eats
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
