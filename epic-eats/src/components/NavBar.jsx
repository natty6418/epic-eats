"use client";

import React from "react";
import Link from 'next/link';
import { useSession } from "next-auth/react";

export default function NavBar() {
    const { data: session } = useSession();

    return (
      <header className="bg-white shadow-md z-10 sticky top-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                  <h1 className="text-lg font-bold text-gray-900">Epic Eats</h1>
              </div>
              <nav className="md:flex space-x-10">
                  <ul className="flex space-x-4">
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
                          <Link href={`/profile/${session?.user?.id}`} className="text-base font-medium text-gray-500 hover:text-gray-900">
                              Profile
                          </Link>
                      </li>
                  </ul>
              </nav>
          </div>
      </div>
  </header>
  
    )
}
