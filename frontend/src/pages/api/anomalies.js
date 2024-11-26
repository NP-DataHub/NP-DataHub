import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function fetchAnomalies(majgrp) {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    console.log("Fetching uri:", uri);

    try {
        await client.connect();
        const database = client.db('Nonprofitly');
        const anomalies = await database.collection('anomaly')
            .find({ MajGrp: majgrp.toUpperCase(), AnomalyLabel: -1 })
            .toArray();

        console.log("Fetched anomalies:", anomalies); 
        return anomalies;
    } catch (error) {
        console.error("Error while fetching anomalies:", error);
        throw error; 
    } finally {
        await client.close();
    }
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { majgrp } = req.query;

        if (!majgrp) {
            return res.status(400).json({ success: false, message: "Major group letter is required." });
        }

        try {
            const anomalies = await fetchAnomalies(majgrp);
            return res.status(200).json({ success: true, anomalies });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to fetch anomalies." });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method not allowed." });
    }
}
