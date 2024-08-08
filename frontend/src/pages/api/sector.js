
/**
 * Designed to grab sector data from the mongodb based on filters passed in the query
 * These can be NTEE codes, ZIPs, States, Cities, etc. All or none can be passed in the query
 * 
 * Probably doesn't work at all, need to talk to Yotham about this
 * 
 * Emmet W.
 */

import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { method, query } = req;

    try{
        const client = await clientPromise;
        const database = client.db("Nonprofitly");

        switch(method){
            case 'GET':

                const {NTEE1, NTEE2, NTEE3, CITY, ZIP } = query;
                const filters = {};
                if (CITY) filters.Cty = CITY;
                if (ZIP) filters.Zip = ZIP;

                console.log("Filters:", filters);

                const data = await database.collection("NonProfitData").find({
                    NTEE: { $in: [NTEE1, NTEE2, NTEE3] },
                    ...filters
                }).toArray();

                console.log("Items found:", data.length);

                // Disable caching
                res.setHeader('Cache-Control', 'no-store');
                res.setHeader('Pragma', 'no-cache');

                res.status(200).json({
                    success: true,
                    data: data
                });
                break;
            default:
                res.setHeader('Cache-Control', 'no-store');
                res.setHeader('Pragma', 'no-cache');
                res.status(405).json({ success: false, error: 'Method not allowed' });
                break;
        }
    }
    catch(error){
        console.error(error);
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}   