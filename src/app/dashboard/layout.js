'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './dashboard.css';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('=== DASHBOARD LAYOUT DEBUG ===');
    console.log('1. Current URL:', window.location.href);
    console.log('2. URL hash:', window.location.hash);
    
   // STEP 1: Check for Google OAuth tokens in URL hash
const hash = window.location.hash;
if (hash && hash.includes('access_token')) {
  console.log('3. Google OAuth redirect detected!');
  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const userDataEncoded = params.get('user');
  
  console.log('4. Access token found:', !!accessToken);
  console.log('5. Refresh token found:', !!refreshToken);
  console.log('6. User data found:', !!userDataEncoded);
  
  if (accessToken && refreshToken && userDataEncoded) {
    console.log('7. Saving tokens and user data to localStorage');
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    const userData = JSON.parse(decodeURIComponent(userDataEncoded));
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('8. User data saved:', userData);
    console.log('9. Redirecting to /dashboard');
    window.location.href = '/dashboard';
    return;
  }
}
    
    // STEP 2: Check localStorage for tokens
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    
    console.log('8. Stored token exists:', !!storedToken);
    console.log('9. Stored user exists:', !!storedUser);
    console.log('10. Stored token value:', storedToken ? storedToken.substring(0, 30) + '...' : 'null');
    
    if (!storedToken || !storedUser) {
      console.log('11. No token or user, redirecting to login');
      router.push('/login');
      return;
    }
    
    // STEP 3: Fetch fresh user data
    const fetchUser = async () => {
      console.log('12. Fetching user data from API');
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        console.log('13. API URL:', API_URL);
        
        const response = await fetch(`${API_URL}/api/user/profile`, {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        });
        
        console.log('14. API Response status:', response.status);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('15. User data received:', userData);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('16. User set, loading false');
        } else {
          console.log('17. API returned error, clearing storage');
          localStorage.clear();
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('18. Fetch error:', error);
        localStorage.clear();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const isActive = (path) => pathname === path;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="nav-top-row">
            <Link href="/dashboard" className="logo">
              🎬 Sabin Booking
            </Link>
            <div className="user-section">
              <Link href="/dashboard/profile" className="profile-link">
                <div className="profile-avatar">
                  {user?.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt="Profile" 
                      style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    user?.user_name?.charAt(0).toUpperCase()
                  )}
                </div>
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>

          <div className="nav-bottom-row">
            <Link href="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              Home
            </Link>
            <Link href="/dashboard/movies" className={`nav-link ${isActive('/dashboard/movies') ? 'active' : ''}`}>
              View Movies
            </Link>
            <Link href="/dashboard/bookings" className={`nav-link ${isActive('/dashboard/bookings') ? 'active' : ''}`}>
              My Bookings
            </Link>
            <Link href="/dashboard/blogs" className={`nav-link ${isActive('/dashboard/blogs') ? 'active' : ''}`}>
              Blogs
            </Link>
            <Link href="/dashboard/contact" className={`nav-link ${isActive('/dashboard/contact') ? 'active' : ''}`}>
              Contact Us
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}