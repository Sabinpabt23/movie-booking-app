import Link from 'next/link';
import './blogs.css';

export default function BlogsPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Movies to Watch in 2026",
      excerpt: "From Hollywood blockbusters to Nepali cinema, here's your ultimate watchlist for this year.",
      category: "Movie Reviews",
      date: "March 15, 2026",
      readTime: "5 min read",
      image: "/images/blogs/movie-review.webp",
      featured: true,
      linkUrl: "https://www.imdb.com/list/ls540889736/" // IMDb Top 250 list
    },
    {
      id: 2,
      title: "Behind the Scenes: How Movies Are Made",
      excerpt: "An exclusive look at the filmmaking process and what goes into creating your favorite movies.",
      category: "Industry Insights",
      date: "March 12, 2026",
      readTime: "8 min read",
      image: "/images/blogs/behind-scenes.webp",
      linkUrl: "https://www.aiu.edu.kw/news/behind-the-scenes--how-movies-are-made"
    },
    {
      id: 3,
      title: "The Rise of Nepali Cinema",
      excerpt: "How Nepali movies are gaining international recognition and what it means for local filmmakers.",
      category: "Local Spotlight",
      date: "March 10, 2026",
      readTime: "6 min read",
      image: "/images/blogs/nepali-cinema.webp",
      linkUrl: "https://en.wikipedia.org/wiki/Cinema_of_Nepal" 
    },
    {
      id: 4,
      title: "Movie Theater Etiquette: A Guide",
      excerpt: "Everything you need to know about being a considerate moviegoer.",
      category: "Tips & Tricks",
      date: "March 8, 2026",
      readTime: "4 min read",
      image: "/images/blogs/etiquette.webp",
      linkUrl: "https://www.rd.com/list/movie-theater-etiquette/" 
    },
    {
      id: 5,
      title: "Best Popcorn Combinations",
      excerpt: "Elevate your movie experience with these delicious popcorn recipes.",
      category: "Food & Fun",
      date: "March 5, 2026",
      readTime: "3 min read",
      image: "/images/blogs/popcorn.webp",
      linkUrl: "https://www.reddit.com/r/Cooking/comments/hnw58i/lets_talk_popcorn_toppings/" 
    },
    {
      id: 6,
      title: "Upcoming Movie Releases in Nepal",
      excerpt: "Your complete guide to movies releasing this month in theaters near you.",
      category: "News",
      date: "March 1, 2026",
      readTime: "4 min read",
      image: "/images/blogs/upcoming.webp",
      linkUrl: "https://www.showtimenepal.com/movie/upcoming"
    }
  ];

  return (
    <div>
      {/* Navigation - same as before */}
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

      {/* Blogs Hero Section */}
      <section className="blogs-hero">
        <div className="featured-badge">
          <span>📝</span> Latest Updates from Sabin Booking
        </div>
        <h1 className="blogs-title">Our Blogs</h1>
        <p className="blogs-subtitle">
          Stay updated with the latest movie news, reviews, and behind-the-scenes stories from the world of cinema.
        </p>
      </section>

      {/* Blogs Grid */}
      <div className="blogs-grid">
        {blogPosts.map((post) => (
          <article key={post.id} className="blog-card">
            <img 
              src={post.image || "https://via.placeholder.com/400x200?text=Blog+Post"} 
              alt={post.title}
              className="blog-image"
            />
            <div className="blog-content">
              <span className="blog-category">{post.category}</span>
              <h2 className="blog-post-title">{post.title}</h2>
              <p className="blog-excerpt">{post.excerpt}</p>
              <div className="blog-meta">
                <span className="blog-date">
                  <span>📅</span> {post.date}
                </span>
                <span>{post.readTime}</span>
              </div>
              {/* IMPORTANT: Link now uses the post.linkUrl property */}
              <a 
                href={post.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="blog-read-more"
              >
                Read More →
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter Section and Footer remain the same */}
    </div>
  );
}