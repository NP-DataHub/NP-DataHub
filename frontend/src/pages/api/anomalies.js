import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function fetchAnomalies(majgrp) {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('Nonprofitly');
        const anomalies = await database.collection('anomaly')
            .find({ MajGrp: majgrp.toUpperCase(), AnomalyLabel: -1 })
            .toArray();

        return anomalies;
    } catch (error) {
        console.error("Error while fetching anomalies:", error);
        throw error; 
    } finally {
        await client.close();
    }
}
async function getStats(majgrp) {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('Nonprofitly');
        const stats = await database.collection('AnomalyStats').findOne({ MajGrp: majgrp.toUpperCase() });

        if (!stats) {
            throw new Error("No stats found for the specified MajGrp.");
        }

        // Extract National and top 5 states
        const national = stats.National || 0;
        const topStates = Object.entries(stats)
            .filter(([key, value]) => key !== 'MajGrp' && key !== 'National' && key !== '_id')
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .slice(0, 5); // Get top 5 states
        return [national, Object.fromEntries(topStates)];
    } catch (error) {
        console.error("Error while fetching stats:", error);
        throw error;
    } finally {
        await client.close();
    }
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { majgrp, mode } = req.query;

        if (!majgrp) {
            return res.status(400).json({ success: false, message: "Major group letter is required." });
        }

        try {
            if (mode === 'Nonprofits') {
                const anomalies = await fetchAnomalies(majgrp);
                return res.status(200).json({ success: true, anomalies });
            } else if (mode === 'Stats') {
                const stats = await getStats(majgrp);
                return res.status(200).json({ success: true, stats });
            } else {
                return res.status(400).json({ success: false, message: "Invalid mode parameter." });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to fetch data." });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method not allowed." });
    }
}
