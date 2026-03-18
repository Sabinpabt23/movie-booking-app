'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        admin_email: '',
        admin_password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/admin/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Store admin token separately
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('admin', JSON.stringify(data.admin));
                router.push('/admin');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
                    <p className="text-gray-600 mt-2">Access the admin dashboard</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                name="admin_email"
                                value={formData.admin_email}
                                onChange={handleChange}
                                placeholder="Enter admin email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-900 bg-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="admin_password"
                                value={formData.admin_password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-900 bg-white"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login to Admin Panel'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Secure admin access only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}