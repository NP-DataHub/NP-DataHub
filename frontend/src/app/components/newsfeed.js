"use client"
import { useState } from 'react';
import SocialMediaMentions from './media_mentions';

export default function NewsFeedSection({ selectedSection }) {
  const [query, setQuery] = useState(""); // User's input for the simple search box
  const [searchQuery, setSearchQuery] = useState(""); // The query actually being sent to the search API for simple search
  const [advancedQuery, setAdvancedQuery] = useState(""); // User's input for advanced search box
  const [finalAdvancedQuery, setFinalAdvancedQuery] = useState(""); // The advanced query actually being sent to the search API
  const [limit, setLimit] = useState(25); // Limit for the number of posts
  const [period, setPeriod] = useState("last7days"); // Time period for the search
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false); // Show/hide advanced search options
  const [searchMode, setSearchMode] = useState('simple'); // Track if we are using simple or advanced search

  // Simple Search Handler - sets the query only when the user clicks the search button
  const handleSearchButtonClick = () => {
    setSearchMode('simple');
    setSearchQuery(query); // This triggers the search with the current query
  };

  // Advanced Search Toggle
  const handleAdvancedSearchClick = () => {
    setIsAdvancedSearch(!isAdvancedSearch); // Toggle advanced search visibility
    setSearchMode('advanced');
  };

  // Function to handle form submission for Advanced Search
  const performAdvancedSearch = (e) => {
    e.preventDefault();
    setSearchMode('advanced');
    setFinalAdvancedQuery(advancedQuery); // This triggers the search with the advanced query
  };

  return (
      <div className="p-6 bg-[#171821] rounded-lg">
        <h3 className="text-xl font-semibold text-[#FEB95A]">
          News Feeds
        </h3>
        <p className="text-white">
          A tool for understanding larger-scale problems and connecting to regional nonprofits via social media and search engines.
        </p>

        {/* Search Section */}
        <div className="grid grid-cols-2 gap-4 p-4 mt-12">
          {/* Simple Search */}
          <div className="flex items-center bg-[#34344c] text-white py-2 px-4 rounded-full">
            <input
              type="text"
              placeholder="Enter keyword for simple search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)} // This updates the input field but doesn't trigger the search
              className="w-full bg-[#34344c] text-white outline-none"
            />
            <button
              onClick={handleSearchButtonClick} // Only triggers the search when clicked
              className="ml-2 bg-[#FEB95A] px-4 py-2 rounded-full"
            >
              Search
            </button>
          </div>

          {/* Advanced Search Toggle Button */}
          <button 
            onClick={handleAdvancedSearchClick} 
            className="flex items-center justify-center bg-[#34344c] text-white py-2 px-4 rounded-full"
          >
            <span className="mr-2">🔎</span>
            {isAdvancedSearch ? "Close Advanced Search" : "Advanced Search"}
          </button>
        </div>

        {/* Advanced Search Form */}
        {isAdvancedSearch && (
          <form onSubmit={performAdvancedSearch} className="bg-[#34344c] p-4 rounded-lg mt-6">
            <h4 className="text-white text-lg mb-4">Advanced Search</h4>

            <div className="mb-4">
              <label className="text-white block mb-2">Keywords:</label>
              <input 
                type="text" 
                value={advancedQuery} 
                onChange={(e) => setAdvancedQuery(e.target.value)} // Updates the input but doesn't trigger the search yet
                className="w-full p-2 rounded" 
                placeholder="Enter keywords"
              />
            </div>

            <div className="mb-4">
              <label className="text-white block mb-2">Limit:</label>
              <input 
                type="number" 
                value={limit} 
                onChange={(e) => setLimit(e.target.value)} 
                className="w-full p-2 rounded" 
                placeholder="Number of results"
              />
            </div>

            <div className="mb-4">
              <label className="text-white block mb-2">Period:</label>
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)} 
                className="w-full p-2 rounded"
              >
                <option value="last7days">Last 7 days</option>
                <option value="last30days">Last 30 days</option>
                <option value="last3months">Last 3 months</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="bg-[#FEB95A] text-white py-2 px-4 rounded-full"
            >
              Submit Advanced Search
            </button>
          </form>
        )}

        {/* Social Media Mentions Component */}
        <div className="mt-12">
          {searchMode === 'simple' ? (
            <SocialMediaMentions
              query={searchQuery} // Use the query that was set when the user clicked "Search"
              limit={25} // Default limit for simple search
              period="last7days" // Default period for simple search
            />
          ) : (
            <SocialMediaMentions
              query={finalAdvancedQuery} // Use the advanced query set when the user submitted the advanced search form
              limit={limit}
              period={period}
            />
          )}
        </div>
      </div>
  );
}
