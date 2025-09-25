"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  HomeIcon,
  PlusCircleIcon,
  BookmarkIcon,
  UserCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const search = e.target.elements.search.value;
    if (search) {
      router.push(`/search?q=${search}`);
      e.target.elements.search.value = '';
    }
  };

  const navLinks = [
    { href: '/feed', text: 'Home', icon: HomeIcon },
    { href: '/create', text: 'Create', icon: PlusCircleIcon },
    { href: '/saved', text: 'Saved', icon: BookmarkIcon },
    { href: '/profile/me', text: 'Profile', icon: UserCircleIcon },
    { href: '/chat', text: 'Ask AI', icon: ChatBubbleLeftEllipsisIcon, isPrimary: true },
  ];

  return (
    <header className="bg-white shadow-lg fixed top-0 left-0 right-0 w-full z-[10000] border-b border-gray-100 isolate h-16 md:h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex justify-start items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h1 className="text-2xl font-bold gradient-text font-poppins">Epic Eats</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-medium transition-colors ${
                  link.isPrimary
                    ? 'gradient-text hover:opacity-80'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                {link.text}
              </Link>
            ))}
            <form onSubmit={handleSubmit} className="relative">
              <input
                name="search"
                className="input-field pl-4 pr-10 py-2 rounded-full text-sm w-48"
                type="text"
                placeholder="Search..."
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </form>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-orange-600 hover:bg-gray-100"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        ref={navRef}
        className={`md:hidden fixed top-16 md:top-20 right-0 w-72 h-[calc(100%-4rem)] md:h-[calc(100%-5rem)] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[1500] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="relative mb-6">
            <input
              name="search"
              className="input-field w-full pl-4 pr-10 py-2 rounded-full"
              type="text"
              placeholder="Search..."
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </form>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  link.isPrimary
                    ? 'text-orange-600 hover:bg-orange-50'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <link.icon className="w-6 h-6" />
                <span className="font-semibold">{link.text}</span>
              </Link>
            ))}
            {session && (
              <Link
                href="/api/auth/signout"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                <span className="font-semibold">Sign Out</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
