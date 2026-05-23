'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);

    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Crovo
          </h1>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Welcome, {user.name}!
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {user ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome to Crovo!
            </h2>

            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Name:</strong> {user.name}
              </p>

              <p className="text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>

              <p className="text-gray-700">
                <strong>ID:</strong> {user.id}
              </p>
            </div>

            <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              ✓ Successfully connected to backend and logged in!
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Crovo
            </h2>

            <p className="text-gray-700 mb-6">
              Please log in or sign up to get started.
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}