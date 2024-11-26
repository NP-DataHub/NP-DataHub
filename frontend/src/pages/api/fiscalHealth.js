import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  const { mode, nonprofit, address, sector } = req.body;
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('Nonprofitly');
    if (mode === "NonProfit") {
      const score_and_years = await getSingleNpFiscalHealthScore(db, nonprofit, address);
      if (score_and_years === -1) {
        return res.status(404).json({ message: `No data is provided for selected nonprofit: ${nonprofit}` });
      }
      return res.status(200).json(score_and_years); //score might be NaN
    } else {
      const result = await getSectorComparisonFiscalHealthScore(db, nonprofit, address, sector);
      if (result === -1){
        return res.status(404).json({ message: `No data is provided for selected nonprofit: ${nonprofit}` });
      }
      else if (result === -2) {
        return res.status(404).json({ message: `Error fetching sector data` });
      }
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching fiscal health data" });
  } finally {
    await client.close();
  }
}

async function fetchData(db, Np, Addr, mode, specific_sector) {
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
  if (mode === "NonProfit") {
    return [consecutiveYears, NpData];
  } else {
    const majorGroup = !specific_sector ? NpData.MajGrp : specific_sector;
    const state = NpData.St;
    const regionalAndNational = await db.collection('NationalAndStateStatistics').findOne({ MajGrp: majorGroup });
    if (!regionalAndNational) {
      return -2;
    }
    return [state, consecutiveYears, regionalAndNational, NpData];
  }
}

async function getSingleNpFiscalHealthScore(db, Np, Addr) {
  const values = await fetchData(db, Np, Addr, "NonProfit");
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

async function getSectorComparisonFiscalHealthScore(db, Np, Addr, specific_sector) {
  const values = await fetchData(db, Np, Addr, "SectorComparison", specific_sector);
  if (values === -1 || values === -2) return values;
  
  const state = values[0];
  const consecutiveYears = values[1];
  const sectorData = values[2];
  const NpData = values[3];
  
  if (consecutiveYears.length < 2) {
    return [NaN, consecutiveYears]; // no need to get sector data if non profit doesnt have valid data
  }
  if (!specific_sector) {
    const score = calculateNonProfitFiscalHealthScore(NpData, consecutiveYears);
    const national_score = calculateNationalFiscalHealthScore(sectorData, consecutiveYears);
    const state_score = calculateStateFiscalHealthScore(sectorData, consecutiveYears, state);
    return [score, national_score, state_score, consecutiveYears];
  }
  //if a user specified a sector, check if it has data for same consecutive years as non profit and in the state of non profit
  let sectorDataExists = checkSectorDataExistence(sectorData, consecutiveYears, state);
  if (sectorDataExists) {
    const score = calculateNonProfitFiscalHealthScore(NpData, consecutiveYears);
    const national_score = calculateNationalFiscalHealthScore(sectorData, consecutiveYears);
    const state_score = calculateStateFiscalHealthScore(sectorData, consecutiveYears, state);
    return [score, national_score, state_score, consecutiveYears];
  }
  // if the sector doesn't have data for the same consecutive years, get the available years of sector
  const sectorConsecutiveYears = getConsecutiveYears(sectorData);
  if (sectorConsecutiveYears.length < 2) {
    const score = calculateNonProfitFiscalHealthScore(NpData, consecutiveYears);
    return [score, consecutiveYears, sectorConsecutiveYears];
  }
  // check if sector chosen by user has data for the same state of Non Profit
  sectorDataExists = checkSectorDataExistence(sectorData, sectorConsecutiveYears, state);
  if (!sectorDataExists) {
    const score = calculateNonProfitFiscalHealthScore(NpData, consecutiveYears);
    const nationalScore = calculateNationalFiscalHealthScore(sectorData, sectorConsecutiveYears);
    return [ [score, consecutiveYears, national_score, sectorConsecutiveYears] ];
  }
  const score = calculateNonProfitFiscalHealthScore(NpData, consecutiveYears);
  const nationalScore = calculateNationalFiscalHealthScore(sectorData, sectorConsecutiveYears);
  const stateScore = calculateStateFiscalHealthScore(sectorData, sectorConsecutiveYears, state);
  return [score, nationalScore, stateScore, consecutiveYears, sectorConsecutiveYears];
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
  let score = intervals > 0 ? totalScore / intervals : 0;
  return roundToDecimal(score, 1);
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

  let score = intervals > 0 ? totalScore / intervals : 0;
  return roundToDecimal(score, 1);
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

  let score = intervals > 0 ? totalScore / intervals : 0;
  return roundToDecimal(score, 1);
}

function checkSectorDataExistence (data, years, state) {
  for (let i = 0; i < years.length - 1; i++) {
    const year1 = years[i]
    const year2 = years[i + 1]
    if (
      !data[year2] ||
      !data[year2][state] ||
      !data[year1] ||
      !data[year1][state]
    ) {
      return false
    }
  }
  return true
}

function roundToDecimal(num, decimals){
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

