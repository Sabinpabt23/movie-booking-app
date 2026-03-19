import BlogsContent from '@/components/BlogsContent';
import Link from 'next/link';
import './blogs.css';

export default function PublicBlogsPage() {
  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-orange-500">
              <Link href="/">Sabin Booking</Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-orange-500 transition font-medium">
                Home
              </Link>
              <Link href="/blogs" className="text-orange-500 font-medium">
                Blogs
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-orange-500 transition font-medium">
                Contact Us
              </Link>
            </div>
            <div className="space-x-4">
              <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-orange-500 transition">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <BlogsContent />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 Sabin Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}