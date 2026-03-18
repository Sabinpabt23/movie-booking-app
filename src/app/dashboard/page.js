'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        setUser(JSON.parse(userData));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            <div className="navbar bg-base-100 shadow-lg">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Movie Booking</a>
                </div>
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                                {user.user_name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li><a>Profile</a></li>
                            <li><a>My Bookings</a></li>
                            <li><a onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6">
                <div className="hero bg-base-100 rounded-lg shadow-lg p-8">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <h1 className="text-3xl font-bold">Welcome, {user.user_name}!</h1>
                            <p className="py-4">
                                Your email: {user.user_email}
                            </p>
                            <p className="text-sm text-gray-500">
                                You are now logged in. Start booking your favorite movies!
                            </p>
                            <button className="btn btn-primary mt-4">Browse Movies</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}