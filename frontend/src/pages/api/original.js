import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }

    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    if (!process.env.MONGODB_URI) {
        throw new Error("Please define MONGODB_URI in your environment variables");
    }

    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Only GET requests are allowed" });
    }

    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ success: false, error: "The 'name' query parameter is required." });
    }

    try {
        const client = await connectToDatabase();
        const db = client.db("Nonprofitly");
        const collection = db.collection("NonProfitData");

        const nonprofit = await collection.findOne({ Nm: new RegExp(`^${name}$`, "i") });

        if (nonprofit) {
            return res.status(200).json({
                success: true,
                nonprofit: {
                    _id: nonprofit._id,
                    Name: nonprofit.Nm,
                },
            });
        } else {
            return res.status(404).json({ success: false, error: "Nonprofit not found." });
        }
    } catch (error) {
        console.error("Error fetching nonprofit data:", error);
        res.status(500).json({ success: false, error: "Internal server error." });
    }
}
