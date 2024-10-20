import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  const { firstNp, firstAddr, secondNp, secondAddr, npVSnp, specific_sector } = req.body;

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('Nonprofitly');

    if (npVSnp) {
      // If comparing two nonprofits
      const firstFiscalHealthScore = await getNpFiscalHealthScore(db, firstNp, firstAddr);
      const secondFiscalHealthScore = await getNpFiscalHealthScore(db, secondNp, secondAddr);
      return res.status(200).json([firstFiscalHealthScore, secondFiscalHealthScore]);
    } else {
      // If fetching a single nonprofit
      const fiscalHealthScore = await getNpFiscalHealthScore(db, firstNp, firstAddr);
      if (fiscalHealthScore === -1) {
        return res.status(404).json({ message: "Nonprofit not found" });
      }

      // Fetch sector scores for national and state comparison
      const scores = await getSectorsFiscalHealthScore(db, firstNp, firstAddr, specific_sector);
      return res.status(200).json([fiscalHealthScore, scores]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching fiscal health data" });
  }
}

async function fetchData(db, Np, Addr, npVSnp, specific_sector = null) {
  const filters = {};

  if (Np) {
    filters.Nm = { $regex: new RegExp(`^${Np.trim()}$`, 'i') };
  }
  if (Addr) {
    filters.Addr = { $regex: new RegExp(`^${Addr.trim()}$`, 'i') };
  }

  const NpData = await db.collection('NonProfitData').findOne(filters);

  if (!NpData) {
    return -1;
  }

  const consecutiveYears = getConsecutiveYears(NpData);
  if (npVSnp) {
    return [consecutiveYears, NpData];
  } else {
    const majorGroup = !specific_sector ? NpData.NTEE[0] : specific_sector;
    const state = NpData.St;

    const regionalAndNational = await db.collection('NationalAndStateStatistics').findOne({ MajGrp: majorGroup });
    if (!regionalAndNational) {
      return -1;
    }
    return [state, consecutiveYears, regionalAndNational];
  }
}

async function getNpFiscalHealthScore(db, Np, Addr) {
  const values = await fetchData(db, Np, Addr, true);
  if (values === -1) return -1;

  const consecutiveYears = values[0];
  const NpData = values[1];

  if (consecutiveYears.length >= 2) {
    const score = calculateNonProfitFiscalHealthScore(NpData, consecutiveYears);
    return [score, consecutiveYears];
  } else {
    return [NaN, consecutiveYears];
  }
}

async function getSectorsFiscalHealthScore(db, Np, Addr, specific_sector) {
  const values = await fetchData(db, Np, Addr, false, specific_sector);
  if (values === -1) return -1;

  const state = values[0];
  const consecutiveYears = values[1];
  const data = values[2];

  if (consecutiveYears.length >= 2) {
    const nonprofitScore = calculateNonProfitFiscalHealthScore(data, consecutiveYears);
    const nationalScore = calculateNationalFiscalHealthScore(data, consecutiveYears);
    const stateScore = calculateStateFiscalHealthScore(data, consecutiveYears, state);

    return [nationalScore, stateScore];  // Return national and state score separately
  } else {
    return [NaN, consecutiveYears];
  }
}

function getConsecutiveYears(data) {
  const years = Object.keys(data).filter(key => !isNaN(key)).map(Number).sort((a, b) => b - a);
  let consecutiveYears = [];
  let tempYears = [];

  for (let i = 0; i < years.length; i++) {
    if (i === 0 || years[i] === years[i - 1] - 1) {
      tempYears.push(years[i]);
    } else {
      if (tempYears.length > consecutiveYears.length) {
        consecutiveYears = tempYears;
      }
      tempYears = [years[i]];
    }
  }

  if (tempYears.length > consecutiveYears.length) {
    consecutiveYears = tempYears;
  }

  return consecutiveYears.slice(0, 4);
}

function calculatePercentDifference(oldValue, newValue) {
  if (oldValue === 0) {
    return newValue === 0 ? 0 : newValue;
  }
  return ((newValue - oldValue) / oldValue) * 100;
}

function calculateNonProfitFiscalHealthScore(data, years) {
  let totalScore = 0;
  let intervals = 0;

  for (let i = 0; i < years.length - 1; i++) {
    const year1 = years[i];
    const year2 = years[i + 1];

    const revDiff = calculatePercentDifference(data[year2].TotRev, data[year1].TotRev);
    const expDiff = calculatePercentDifference(data[year2].TotExp, data[year1].TotExp);
    const astDiff = calculatePercentDifference(data[year2].TotAst, data[year1].TotAst);
    const liaDiff = calculatePercentDifference(data[year2].TotLia, data[year1].TotLia);

    const fiscalHealthScore = 0.4 * revDiff + 0.3 * expDiff + 0.2 * astDiff + 0.1 * liaDiff;
    totalScore += fiscalHealthScore;
    intervals++;
  }

  return intervals > 0 ? totalScore / intervals : 0;
}

function calculateNationalFiscalHealthScore(data, years) {
  let totalScore = 0;
  let intervals = 0;

  for (let i = 0; i < years.length - 1; i++) {
    const year1 = years[i];
    const year2 = years[i + 1];

    const revDiff = calculatePercentDifference(data[year2].NatMedRev, data[year1].NatMedRev);
    const expDiff = calculatePercentDifference(data[year2].NatMedExp, data[year1].NatMedExp);
    const liaDiff = calculatePercentDifference(data[year2].NatMedLia, data[year1].NatMedLia);
    const astDiff = calculatePercentDifference(data[year2].NatMedAst, data[year1].NatMedAst);

    const nationalFiscalHealthScore = 0.4 * revDiff + 0.3 * expDiff + 0.2 * astDiff + 0.1 * liaDiff;
    totalScore += nationalFiscalHealthScore;
    intervals++;
  }

  return intervals > 0 ? totalScore / intervals : 0;
}

function calculateStateFiscalHealthScore(data, years, state) {
  let totalScore = 0;
  let intervals = 0;

  for (let i = 0; i < years.length - 1; i++) {
    const year1 = years[i];
    const year2 = years[i + 1];

    const revMed2 = data[year2][state].RevMed;
    const expMed2 = data[year2][state].ExpMed;
    const liaMed2 = data[year2][state].LiaMed;
    const astMed2 = data[year2][state].AstMed;

    const revMed1 = data[year1][state].RevMed;
    const expMed1 = data[year1][state].ExpMed;
    const liaMed1 = data[year1][state].LiaMed;
    const astMed1 = data[year1][state].AstMed;

    const revDiff = calculatePercentDifference(revMed2, revMed1);
    const expDiff = calculatePercentDifference(expMed2, expMed1);
    const liaDiff = calculatePercentDifference(liaMed2, liaMed1);
    const astDiff = calculatePercentDifference(astMed2, astMed1);

    const stateFiscalHealthScore = 0.4 * revDiff + 0.3 * expDiff + 0.2 * astDiff + 0.1 * liaDiff;
    totalScore += stateFiscalHealthScore;
    intervals++;
  }

  return intervals > 0 ? totalScore / intervals : 0;
}
