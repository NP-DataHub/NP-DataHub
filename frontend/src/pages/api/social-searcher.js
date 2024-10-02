import axios from 'axios';

export default async function handler(req, res) {
  const { limit, page, period, q } = req.query; // Extract 'q' for dynamic queries

  const key = process.env.SOCIAL_SEARCHER_API_KEY || '07841ec91f93e9375805d9657bfd8969'; // Use your API key here or in .env.local
  const baseUrl = `https://api.social-searcher.com/v2/search`;

  // Constructing the API request URL
  const params = {
    key,
    limit: limit || 20,
    page: page || 0,
    period: period || 'last7days',
    q: q || '', // Use the query parameter if provided, otherwise fallback to saved search
  };

  let url;
  
  // If there's a user-defined search query ('q'), we use that
  if (params.q) {
    // Dynamic search based on user input
    url = `${baseUrl}?key=${params.key}&q=${encodeURIComponent(params.q)}&limit=${params.limit}&page=${params.page}&period=${params.period}`;
  } else {
    // Static search using the saved search ID
    const searchId = '66fc72472cbe005342cf839e'; // Your saved search ID
    url = `https://api.social-searcher.com/v2/searches/${searchId}/posts?key=${params.key}&limit=${params.limit}&page=${params.page}&period=${params.period}`;
  }

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data); // Send back the data received from the API
  } catch (error) {
    console.error('Error fetching data from Social Searcher API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Social Searcher API' });
  }
}
