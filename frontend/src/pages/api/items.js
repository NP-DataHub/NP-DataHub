import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { method, query } = req;
  try {
    const client = await clientPromise;
    const db = client.db('Nonprofitly');

    switch (method) {
      case 'GET':
        const { state, city, nteeCode, Name, _id } = query;

        const filters = {};
        if (Name) {
          const lowername = Name.trim().toLowerCase()
          filters.Nm = { $regex: new RegExp(`^${lowername}$`, 'i') }; 
        }
        if (city) {
          // Extract city name if it includes state
          const cityParts = city.split(',');
          const cityName = cityParts[0].trim().toLowerCase();
          filters.Cty = { $regex: new RegExp(`^${cityName}$`, 'i') }; // Case-insensitive exact match
        }
        if (state) {
          filters.St = state;
        }
        if (nteeCode) {
          filters.MajGrp = { $regex: new RegExp(nteeCode, 'i') };
        }
        if (_id) {
          try {
            filters._id = new ObjectId(_id);
          } catch (err) {
            return res.status(400).json({ success: false, error: 'Invalid ID format' });
          }
        }

        console.log("Filters:", filters); // Log filters for debugging

        const items = await db.collection('NonProfitData')
          .find(filters) // Include relevant fields for debugging
          .toArray();

        

        console.log("Items found:", items.length); // Log the number of items found for debugging

        // Disable caching
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');

        res.status(200).json({
          success: true,
          data: items,
        });
        break;
      default:
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');
        res.status(405).json({ success: false, error: 'Method not allowed' });
        break;
    }
  } catch (error) {
    console.error(error);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
