// pages/nonprofit-news.js

import axios from 'axios';

let response = ''
export async function getServerSideProps() {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  // Updated search query with multiple keywords
  const apiUrl = `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&locale=us&search=nonprofit OR "non-profit" OR "non profit"&limit=50`;

  try {
    response = await axios.get(apiUrl);
    const articles = response.data.data || [];

    return { props: { articles } };
  } catch (error) {
    console.error("Error fetching news:", error);
    return { props: { articles: [] } };
  }
}

const NonprofitNews = ({ articles }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Nonprofit News</h1>
      <div className="space-y-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.uuid} className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold text-blue-500 hover:underline">
                {article.title}
              </a>
              <p className="text-gray-600 mt-2">{article.description}</p>
              {article.image_url && (
                <img src={article.image_url} alt={article.title} className="mt-4 w-full h-48 object-cover rounded-md" />
              )}
              <p className="text-sm text-gray-400 mt-2">{new Date(article.published_at).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No news articles found on nonprofits.</p>
        )}
      </div>
    </div>
  );
};

export default NonprofitNews;
