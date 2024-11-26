// SocialMediaMention.js
'use client'
import { useState, useEffect } from 'react';

export default function SocialMediaMentions({ query, limit = 50, period = 'last7days' }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const allowedNetworks = ['instagram', 'twitter', 'reddit', 'facebook', 'youtube']; // Only allow these networks

  const fetchMentions = async () => {
    try {
      const res = await fetch(`/api/social-searcher?limit=${limit}&period=${period}&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const filteredPosts = (data.posts || []).filter(post => post.image).filter(post => allowedNetworks.includes(post.network.toLowerCase()));; // Only display posts with media (image/video)
      setPosts(filteredPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching social media mentions:', error);
      setError('Failed to load mentions.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentions();
  }, [query, limit, period]);

  // Function to determine if the media is a video
  const isVideo = (url) => {
    return url && (url.includes('.video') || url.includes('.mp4') || url.includes('.webm') || url.includes('.mov'));
  };

  return (
    <div>
      {/* <h2 className="text-lg font-bold mb-4">Social Media Mentions</h2> */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={index} className="post bg-white shadow-sm hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden">
                {/* Display media (image or video) */}
                <div className="media-preview aspect-square bg-gray-100 overflow-hidden">
                  {isVideo(post.image) ? (
                    <video 
                      controls 
                      className="w-full h-full object-cover"
                    >
                      <source src={post.image} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src={post.image} 
                      alt="Post media" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Minimal post info */}
                <div className="p-2">
                  {/* Display platform */}
                  <small className="block text-gray-500 text-xs">
                    Platform: {post.network.charAt(0).toUpperCase() + post.network.slice(1)}
                  </small>
                  
                  {/* Display date */}
                  <small className="block text-gray-500 text-xs">
                    Date: {new Date(post.posted.replace(' +00000', '')).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) || 'Unknown date'}
                  </small>
                  
                  {/* Display a subset of the post text */}
                  <p className="text-gray-700">
                    {post.text.length > 100 ? `${post.text.slice(0, 100)}...` : post.text}
                  </p>
                  
                  {/* Display post URL */}
                  {post.url && (
                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs hover:underline">
                      View Post
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No posts with images or videos found for the search query.</p>
          )}
        </div>
      )}
    </div>
  );
}
