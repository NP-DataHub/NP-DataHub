import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { method, query } = req;
  try {
    const client = await clientPromise;
    const db = client.db('Nonprofitly');

    switch (method) {
      case 'GET':
        // the sector to pull averages for
        const { MajGrp } = query;

        const filters = {};
        if (MajGrp) {
          filters.MajGrp = { $regex: new RegExp(MajGrp, 'i') };
        }

        console.log("Filters:", filters); // Log filters for debugging

        const items = await db.collection('NationalAndStateStatistics')
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
