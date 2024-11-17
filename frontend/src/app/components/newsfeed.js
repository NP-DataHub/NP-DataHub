"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import SocialMediaMentions from './media_mentions';

export default function NewsFeedSection({isDarkMode}) {
  const [articles, setArticles] = useState([]); // State to hold news articles
  const [query, setQuery] = useState("nonprofit OR \"non-profit\" OR \"non profit\""); // Initial query
  const [searchQuery, setSearchQuery] = useState(""); // State for user's search input, starts empty
  const [limit, setLimit] = useState(25);
  const [period, setPeriod] = useState("last7days");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState("news"); // Track selected content: 'news' or 'socialMedia'

  // Function to fetch news articles
  const fetchNewsArticles = async (searchText = query) => {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    const apiUrl = `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&locale=us&search=${encodeURIComponent(searchText)}&limit=${limit}`;

    setIsLoading(true);
    try {
      const response = await axios.get(apiUrl);
      setArticles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch articles on component mount with the initial query
  useEffect(() => {
    if (selectedContent === "news") {
      fetchNewsArticles();
    }
  }, [selectedContent]);

  // Search submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNewsArticles(searchQuery); // Search with the user's input
  };

  const LoadingComponent = () => (
    <div className="flex items-center justify-center h-full w-full">
      <svg className="animate-spin h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );

  return (
    <div className={`p-6 ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"} rounded-lg`}>
      <h3 className="text-xl font-semibold text-[#FEB95A]">News Feeds</h3>
      <p className="">
        A tool for understanding larger-scale problems and connecting to regional nonprofits via social media and search engines.
      </p>

      {/* Search Section */}
      <form onSubmit={handleSearchSubmit} className="mt-6 flex items-center">
        <input
          type="text"
          placeholder="Search for news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full p-2 rounded-l-lg ${isDarkMode ? "bg-[#34344c] text-white" : "bg-[#c9c9c9] text-black" } outline-none`}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-r-lg bg-[#FEB95A] text-white"
        >
          Search
        </button>
      </form>

      <div className="grid gap-4 mt-12 align-left">
        {/* Selector for News or Social Media */}
        <div className="flex items-center justify-start m-0">
          <button
            onClick={() => setSelectedContent("news")}
            className={`mr-2 px-4 py-2 rounded-full ${selectedContent === "news" ? "bg-[#FEB95A] text-white" : "bg-[#34344c] text-white"}`}
          >
            News
          </button>

          {/* Social Media Button with Disabled Style and Tooltip */}
        </div>
      </div>

      {/* Content Display */}
      <div className="mt-12">
        {selectedContent === "socialMedia" ? (
          <SocialMediaMentions query={searchQuery} limit={limit} period={period} />
        ) : isLoading ? (
          <div className = "mb-12">
          <LoadingComponent />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div
                  key={article.uuid}
                  className={`border rounded-lg overflow-hidden shadow-md ${ isDarkMode ? "bg-[#1E1F29] hover:bg-[#2A2B3C] border-gray-700 ": "bg-white border-gray-200"} transition-colors duration-300`}
                >
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-[#FEB95A] hover:underline"
                    >
                      {article.title}
                    </a>
                    <p className="text-gray-400 mt-2 text-sm">{article.description}</p>
                    <p className="text-xs text-gray-500 mt-4">
                      {new Date(article.published_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No news articles found for &quot;{searchQuery}&quot;.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// With loading in the page
// "use client";
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import SocialMediaMentions from './media_mentions';

// export default function NewsFeedSection() {
//   const [articles, setArticles] = useState([]); // State to hold news articles
//   const [query, setQuery] = useState("nonprofit OR \"non-profit\" OR \"non profit\""); // Initial query
//   const [searchQuery, setSearchQuery] = useState(""); // State for user's search input, starts empty
//   const [limit, setLimit] = useState(25);
//   const [period, setPeriod] = useState("last7days");
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedContent, setSelectedContent] = useState("news"); // Track selected content: 'news' or 'socialMedia'
//   const [iframeUrl, setIframeUrl] = useState(null); // State to hold URL for iframe display

//   // Function to fetch news articles
//   const fetchNewsArticles = async (searchText = query) => {
//     const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
//     const apiUrl = `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&locale=us&search=${encodeURIComponent(searchText)}&limit=${limit}`;

//     setIsLoading(true);
//     try {
//       const response = await axios.get(apiUrl);
//       setArticles(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching news:", error);
//       setArticles([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch articles on component mount with the initial query
//   useEffect(() => {
//     if (selectedContent === "news") {
//       fetchNewsArticles();
//     }
//   }, [selectedContent]);

//   // Search submit handler
//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     fetchNewsArticles(searchQuery); // Search with the user's input
//   };

//   const openIframeModal = (url) => {
//     setIframeUrl(url);
//   };

//   const closeIframeModal = () => {
//     setIframeUrl(null);
//   };

//   const LoadingComponent = () => (
//     <div className="flex items-center justify-center h-full w-full">
//       <svg className="animate-spin h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//       </svg>
//     </div>
//   );

//   return (
//     <div className="p-6 bg-[#171821] rounded-lg">
//       <h3 className="text-xl font-semibold text-[#FEB95A]">News Feeds</h3>
//       <p className="text-white">
//         A tool for understanding larger-scale problems and connecting to regional nonprofits via social media and search engines.
//       </p>

//       {/* Search Section */}
//       <form onSubmit={handleSearchSubmit} className="mt-6 flex items-center">
//         <input
//           type="text"
//           placeholder="Search for news..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full p-2 rounded-l-lg bg-[#34344c] text-white outline-none"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 rounded-r-lg bg-[#FEB95A] text-white"
//         >
//           Search
//         </button>
//       </form>

//       <div className="grid gap-4 mt-12 align-left">
//         {/* Selector for News or Social Media */}
//         <div className="flex items-center justify-start m-0">
//           <button
//             onClick={() => setSelectedContent("news")}
//             className={`mr-2 px-4 py-2 rounded-full ${selectedContent === "news" ? "bg-[#FEB95A] text-white" : "bg-[#34344c] text-white"}`}
//           >
//             News
//           </button>

//           {/* Social Media Button with Disabled Style and Tooltip */}
//           <div className="relative group">
//             <button className="px-4 py-2 rounded-full bg-gray-500 text-white cursor-not-allowed">
//               Social Media
//             </button>
//             {/* Tooltip */}
//             <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full mt-1 w-max bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               Feature currently under construction
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Content Display */}
//       <div className="mt-12">
//         {selectedContent === "socialMedia" ? (
//           <SocialMediaMentions query={searchQuery} limit={limit} period={period} />
//         ) : isLoading ? (
//           <LoadingComponent />
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {articles.length > 0 ? (
//               articles.map((article) => (
//                 <div
//                   key={article.uuid}
//                   className="border border-gray-700 rounded-lg overflow-hidden shadow-md bg-[#1E1F29] hover:bg-[#2A2B3C] transition-colors duration-300"
//                 >
//                   {article.image_url && (
//                     <img
//                       src={article.image_url}
//                       alt={article.title}
//                       className="w-full h-56 object-cover"
//                     />
//                   )}
//                   <div className="p-4">
//                     <button
//                       onClick={() => openIframeModal(article.url)}
//                       className="text-lg font-semibold text-[#FEB95A] hover:underline"
//                     >
//                       {article.title}
//                     </button>
//                     <p className="text-gray-400 mt-2 text-sm">{article.description}</p>
//                     <p className="text-xs text-gray-500 mt-4">
//                       {new Date(article.published_at).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 text-center">No news articles found for "{searchQuery}".</p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Iframe Modal */}
//       {iframeUrl && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//           <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-3xl h-3/4">
//             <iframe
//               src={iframeUrl}
//               className="w-full h-full"
//               title="Article"
//               sandbox="allow-scripts allow-same-origin"
//             />
//             <button
//               onClick={closeIframeModal}
//               className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
