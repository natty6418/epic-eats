"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
    const [showMobileNav, setShowMobileNav] = useState(false);
    const navRef = useRef();
    const router = useRouter();

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
    const handleResize = () => {
        if (window.innerWidth > 768) {
            setShowMobileNav(false);
        } else {
            setShowMobileNav(true);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        const search = e.target[0].value;
        router.push(`/search?q=${search}`);
    }

    function NavItems() {
        if (!showMobileNav) {
        return (
            <ul className="flex space-x-4">
                <li>
                    <Link href="/" className="text-base font-medium text-gray-500 hover:text-gray-900">
                        Home
                    </Link>
                </li>
                
                <li>
                    <Link href="/create" className="text-base font-medium text-gray-500 hover:text-gray-900">
                        Create Recipe
                    </Link>
                </li>
                <li>
                    <Link href="/saved" className="text-base font-medium text-gray-500 hover:text-gray-900">
                        Saved Recipes
                    </Link>
                </li>
                <li className="relative">
                <form 
                onSubmit={handleSubmit}
                action="" method="get">
            <input
              className="pl-3 pr-10 py-1 text-gray-700 leading-tight focus:outline-none rounded-md"
              type="text"
              placeholder="Search..."
              style={{ maxWidth: '160px' }} // Adjust width as needed
            />
            <button
              className="absolute right-0 top-0 mt-1 mr-1"
              type="submit"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-4.35-4.35m2.65-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            </form>
          </li>
                <li>
                    <Link href={`/profile/me`} className="text-base font-medium text-gray-500 hover:text-gray-900">
                        Profile
                    </Link>
                </li>
            </ul>
        );
    } else {
        return (
            <>
            

          {/* Navigation Links - sliding effect */}
          
            </>
        )
    }
    }

  return (
    <header className="bg-white shadow-md z-10 sticky top-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link href="/">
            <h1 className="text-lg font-bold text-gray-900">Epic Eats</h1>
            </Link>
          </div>
          <NavItems />

          <div className="-mr-2 -my-2 ">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Open menu</span>
            {/* Icon */}
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <nav 
        ref={navRef}
        className={`${isOpen ? 'translate-x-0' : 'translate-x-full'} transform top-0 right-0 w-64 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30`}>
        <ul className="flex flex-col space-y-6 p-6">
          <li>
            <Link href="/" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Home
            </Link>
          </li>
          <li>
            <Link href="/feed" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Feed
            </Link>
          </li>
          <li>
            <Link href="/create" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Create Recipe
            </Link>
          </li>
          <li>
            <Link href="/search" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Search
            </Link>
          </li>
          <li>
            <Link href={`/profile/me`} className="text-base font-medium text-gray-500 hover:text-gray-900">
              Profile
            </Link>
          </li>
          <li>
          <Link href={`/api/auth/signout`} className="text-base font-medium text-red-400 hover:text-red-500">
            Sign Out
            </Link>
          </li>
        </ul>
      </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
