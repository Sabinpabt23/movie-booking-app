import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-orange-500">
              <Link href="src/app/page.js">Sabin Booking</Link>
            </div>
            
            {/* Center Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-orange-500 transition font-medium">
                Home
              </Link>
              <Link href="/blogs" className="text-gray-600 hover:text-orange-500 transition font-medium">
                Blogs
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-orange-500 transition font-medium">
                Contact Us
              </Link>
            </div>
            
            {/* Auth Buttons */}
            <div className="space-x-4">
              <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-orange-500 transition">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Sign Up
              </Link>
            </div>
          </div>
          
          {/* Mobile Navigation (for smaller screens) */}
          <div className="md:hidden flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-100">
            <Link href="/" className="text-gray-600 hover:text-orange-500 transition text-sm font-medium">
              Home
            </Link>
            <Link href="/blogs" className="text-gray-600 hover:text-orange-500 transition text-sm font-medium">
              Blogs
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-orange-500 transition text-sm font-medium">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Book Your Favorite
              <span className="text-orange-500"> Movies</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience the best cinema in Nepal. Book seats at Kumari Cinemas, QFX Civil Mall, Big Movies and more.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register" className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-lg font-medium">
                Get Started
              </Link>
              <Link href="#movies" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-orange-500 hover:text-orange-500 transition text-lg font-medium">
                Browse Movies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section id="movies" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Now Showing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Movie Card 1 */}
<div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
  <div className="h-64 relative">
    <img 
      src="/images/movies/AvengersEndgame.webp" 
      alt="AvengersEndgame"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    <div className="absolute bottom-4 left-4 text-white">
      <span className="bg-orange-500 text-xs px-2 py-1 rounded">Now Showing</span>
    </div>
  </div>
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-2">Avengers: Endgame</h3>
    <p className="text-gray-600 text-sm mb-4">Action, Adventure • 3h 2m</p>
    <div className="flex justify-between items-center">
      <span className="text-orange-500 font-bold">Rs 400</span>
      <Link href="/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm transition">
        Book Now
      </Link>
    </div>
  </div>
</div>

{/* Movie Card 2 */}
<div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
  <div className="h-64 relative">
    <img 
      src="/images/movies/One piece Film Red.webp" 
      alt="One piece Film Red"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    <div className="absolute bottom-4 left-4 text-white">
      <span className="bg-orange-500 text-xs px-2 py-1 rounded">Now Showing</span>
    </div>
  </div>
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-2">One piece Film Red</h3>
    <p className="text-gray-600 text-sm mb-4">Action, Adventure, Comedy • 90m</p>
    <div className="flex justify-between items-center">
      <span className="text-orange-500 font-bold">Rs 350</span>
      <Link href="/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm transition">
        Book Now
      </Link>
    </div>
  </div>
</div>

{/* Movie Card 3 */}
<div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
  <div className="h-64 relative">
    <img 
      src="/images/movies/kantara.webp" 
      alt="Kantara"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    <div className="absolute bottom-4 left-4 text-white">
      <span className="bg-orange-500 text-xs px-2 py-1 rounded">Now Showing</span>
    </div>
  </div>
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-2">Kantara</h3>
    <p className="text-gray-600 text-sm mb-4">Drama • 2h 30m</p>
    <div className="flex justify-between items-center">
      <span className="text-orange-500 font-bold">Rs 500</span>
      <Link href="/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm transition">
        Book Now
      </Link>
    </div>
  </div>
</div>

{/* Movie Card 4 */}
<div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
  <div className="h-64 relative">
    <img 
      src="/images/movies/Deadpool and Wolverine.webp" 
      alt="Deadpool and Wolverine"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    <div className="absolute bottom-4 left-4 text-white">
      <span className="bg-orange-500 text-xs px-2 py-1 rounded">Coming Soon</span>
    </div>
  </div>
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-2">Deadpool and Wolverine </h3>
    <p className="text-gray-600 text-sm mb-4">Action, Comedy • 2h 10m</p>
    <div className="flex justify-between items-center">
      <span className="text-gray-400 font-bold">TBA</span>
      <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm cursor-not-allowed" disabled>
        Coming Soon
      </button>
    </div>
  </div>
</div>
          </div>
        </div>
      </section>

     {/* Theaters Section */}
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
      Partner Theaters
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Kumari Cinemas */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
        <div className="h-48 relative">
          <img 
            src="/images/theaters/Kumari Cinemas.webp" 
            alt="Kumari Cinemas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <span className="bg-orange-500 text-xs px-2 py-1 rounded">Premium</span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Kumari Cinemas</h3>
          <p className="text-gray-600 mb-3">Putalisadak, Kathmandu</p>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span>2 Halls • 250 Seats</span>
          </div>
        </div>
      </div>

      {/* QFX Civil Mall */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
        <div className="h-48 relative">
          <img 
            src="/images/theaters/QFX Civil Mall.webp" 
            alt="QFX Civil Mall"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <span className="bg-orange-500 text-xs px-2 py-1 rounded">IMAX</span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">QFX Civil Mall</h3>
          <p className="text-gray-600 mb-3">Sundhara, Kathmandu</p>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span>4 Halls • 165 Seats</span>
          </div>
        </div>
      </div>

      {/* Big Movies */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
        <div className="h-48 relative">
          <img 
            src="/images/theaters/Big Movies.webp" 
            alt="Big Movies"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <span className="bg-orange-500 text-xs px-2 py-1 rounded">Budget</span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Big Movies</h3>
          <p className="text-gray-600 mb-3">Chabahil, Kathmandu</p>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span>2 Halls • 50 Seats</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 MovieTicket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}