import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { state, nteeCode, zip, year } = req.body;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('Nonprofitly');
    // State code mapping
    const stateToCode = {
      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
      'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
      'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
      'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
      'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
      'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
      'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
      'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
      'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
      'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
      'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
      'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
      'Wisconsin': 'WI', 'Wyoming': 'WY'
    };
    let stateCode = "";

    const filters = {};
    if (state) {
      stateCode = stateToCode[state];
      if (!stateCode){
        return res.status(404).json({ message: "No data provided with selected filters" });
      }
      filters.St = { $regex: new RegExp(`^${stateCode.trim()}$`, 'i') };
    }
    if (nteeCode) {
      filters.MajGrp = { $regex: new RegExp(`^${nteeCode.trim()}$`, 'i') };
    }
    if (zip) {
      filters.Zip = { $regex: new RegExp(`^${zip.trim()}$`, 'i') };
    }

    let npData = await db.collection('NonProfitData').find(filters).toArray();

    if (!npData || npData.length === 0) {
      return res.status(404).json({ message: "No data provided with selected filters" });
    }
    let total;
    if (!zip) {
      const sectorData = await db.collection('NationalAndStateStatistics').findOne({ MajGrp: nteeCode });
         // Use state-specific totals when state is provided
        if (!sectorData || !sectorData[year] || !sectorData[year][stateCode]) {
          return res.status(404).json({ message: "No state-level data found" });
        }
        total = {
          TotRev: sectorData[year][stateCode]["SumRev"],
          TotExp: sectorData[year][stateCode]["SumExp"],
          TotLia: sectorData[year][stateCode]["SumLia"],
          TotAst: sectorData[year][stateCode]["SumAst"]
        };
      } else {
      // If zip is provided, use the total from the `NonProfitData` collection
      const pipeline = [
        { $match: filters },
        { $group: {
          _id: null,
          totalRev: { $sum: `$${year}.TotRev` },
          totalExp: { $sum: `$${year}.TotExp` },
          totalLia: { $sum: `$${year}.TotLia` },
          totalAst: { $sum: `$${year}.TotAst` }
        } }
      ];
      const result = await db.collection('NonProfitData').aggregate(pipeline).toArray();
      if (result.length > 0) {
        total = {
          TotRev: result[0].totalRev,
          TotExp: result[0].totalExp,
          TotLia: result[0].totalLia,
          TotAst: result[0].totalAst
        };
      } else {
        total = { TotRev: 0, TotExp: 0, TotLia: 0, TotAst: 0 };
      }
    }

    // Generate response data
    const responseData = npData
      .filter(entry => entry[year] && entry[year].TotRev !== undefined) // Filter out entries with no data
      .map(entry => {
        const totRev = entry[year]["TotRev"];
        const totAst = entry[year]["TotAst"];
        const totExp = entry[year]["TotExp"];
        const totLia = entry[year]["TotLia"];
        
        const prevYear = previousYear(entry, year);
        const prevRev = prevYear ? entry[prevYear]["TotRev"] : null;
        const prevAst = prevYear ? entry[prevYear]["TotAst"] : null;
        const prevExp = prevYear ? entry[prevYear]["TotExp"] : null;
        const prevLia = prevYear ? entry[prevYear]["TotLia"] : null;

        const changeRev = prevRev !== null ? calculatePercentDifference(prevRev, totRev) : null;
        const changeAst = prevAst !== null ? calculatePercentDifference(prevAst, totAst) : null;
        const changeExp = prevExp !== null ? calculatePercentDifference(prevExp, totExp) : null;
        const changeLia = prevLia !== null ? calculatePercentDifference(prevLia, totLia) : null;

        return {
          id: entry._id,
          Name: entry.Nm,
          TotRev: totRev,
          TotAst: totAst,
          TotExp: totExp,
          TotLia: totLia,
          ChangeRev: changeRev,
          ChangeAst: changeAst,
          ChangeExp: changeExp,
          ChangeLia: changeLia,
          ecoamountRev: total.TotRev ? (totRev / total.TotRev) * 100 : 0,
          ecoamountAst: total.TotAst ? (totAst / total.TotAst) * 100 : 0,
          ecoamountExp: total.TotExp ? (totExp / total.TotExp) * 100 : 0,
          ecoamountLia: total.TotLia ? (totLia / total.TotLia) * 100 : 0,
        };
      });
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching data" });
  } finally {
    await client.close();
  }
}

const previousYear = (currentEntry, year) => {
  let prevYear = year - 1;
  while (prevYear >= 2015) {
    if (currentEntry[prevYear]) {
      return prevYear;
    }
    prevYear--;
  }
  return null;
};

function calculatePercentDifference(oldValue, newValue) {
  if (oldValue === 0) {
    return newValue === 0 ? 0 : newValue;
  }
  return ((newValue - oldValue) / oldValue) * 100;
}
