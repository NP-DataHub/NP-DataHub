// pages/api/nonprofit-names.js

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
async function listAllNonProfitNames() {
    const Uri = process.env.MONGODB_URI;
    const client = new MongoClient(Uri);
  
    try {
      await client.connect();
      const database = client.db('Nonprofitly');
  
      // Fetch limited results and log them
      const nonProfits = await database.collection('NonProfitData')
        .find({}, { projection: { Nm: 1, _id: 0 } })
        .limit(50) // Limit to 50
        .toArray();
  
      console.log("Nonprofit data fetched:", nonProfits);  // Log the fetched data
  
      // Filter out undefined or invalid names
      const nonProfitNames = nonProfits
        .filter(np => np.Nm && np.Nm.trim() !== '')  // Only keep records with valid 'Nm'
        .map(np => np.Nm);  // Extract the names
  
      console.log("Extracted Names:", nonProfitNames);  // Log the extracted names
      return nonProfitNames;
  
    } catch (error) {
      console.error("Error while fetching nonprofit names:", error);
      return [];
    } finally {
      await client.close();
    }
  }
  

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const nonProfitNames = await listAllNonProfitNames();
      return res.status(200).json(nonProfitNames);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching nonprofit names" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
