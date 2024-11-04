import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

async function connectToDatabase() {
  const client = new MongoClient(uri); // Says these will be depricated soon { useNewUrlParser: true, useUnifiedTopology: true }
  await client.connect();
  return client.db('Nonprofitly');
}

export default async function handler(req, res) {
    const { method, query } = req;

    try {
    if (method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { input, type } = query;  // Now using both 'input' and 'type'

    if (!input || !type) {
        return res.status(400).json({ success: false, error: 'Input and type query are required' });
    }

    const searchRegex = new RegExp(input.trim(), 'i');

    const db = await connectToDatabase();

    const filterField = type === 'name' ? 'Nm' : 'Zip';  // Dynamically select the field

    const results = await db.collection('NonProfitData')
        .find(
            {
                [filterField]: { $regex: searchRegex }
            },
        )
        .toArray();

    return res.status(200).json({
        success: true,
        data: results,
    });


    } catch (error) {
    console.error("Error fetching suggestions:", error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};