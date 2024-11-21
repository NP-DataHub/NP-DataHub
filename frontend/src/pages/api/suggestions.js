import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

async function connectToDatabase() {
  //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); - deprecated
  const client = new MongoClient(uri);
  await client.connect();
  return client.db('Nonprofitly');
}

export default async function handler(req, res) {
  const { method, query } = req;
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    if (method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { input, type } = query;  // Now using both 'input' and 'type'
    
    if (!input || !type) {
      return res.status(400).json({ success: false, error: 'Input and type query are required' });
    }
    

    const searchRegex = new RegExp(`^${input.trim()}`, 'i');

    await client.connect();
    const db = client.db('Nonprofitly');

    const filterField = type === 'name' ? 'Nm' : 'Addr';  // Dynamically select the field

    const suggestions = await db.collection('NonProfitData')
      .find(
        {
          [filterField]: { $regex: searchRegex }
        },
        { projection: { Nm: 1, Addr: 1 } }
      )
      .limit(10)
      .toArray();

    return res.status(200).json({
      success: true,
      data: suggestions,
    });

  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  } finally {
      await client.close();
  }
}
