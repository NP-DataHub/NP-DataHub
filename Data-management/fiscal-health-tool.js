const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../frontend/.env' });

/*
Note: Multiple return values are negative
All return paths of function main:

==> If user wants to compare 2 non profits:
Return value will be an array with 2 entries, [ENTRY1 , ENTRY2 ], an entry for each NP.
If the NP is not found: the entry will be - 1
Else : 
      if the NP doesn't have at least 2 consecutive years, the entry will be be an array:  [ NaN, [consecutive years available] ]
      if the NP has at least 2 consecutive years, the entry will be an array:  [ Fiscal Score, [consecutive years available] ]

==> If the user wants to compare a non profit against a sector ( either the same or different ) both on a national and state level:

// Note if its the same sector, the state and national level scores will be calculated on the same range of years

  If the NP is not found: the return value of main function will be -1
  Else :
      Return value will be an array with 2 entries, [ENTRY1 , ENTRY2]:

      If the NP has at least 2 consecutive years :
        Entry1 will be an array with 2 entries: [ Fiscal Score of Non profit, [consecutive years available] ]
        If the comparison is againt the same sector or against a different sector THAT HAS THE SAME CONSECUTIVE YEARS : 
            Entry2 will be an array with 2 entries: [National Score, State Score]
        Else if the different sector doen't have the same consecutive years:
            If the sector has at least 2 consecutive years AND there is data for THE SAME STATE in these years:
              Entry2 will be an array with 3 entries: [National Score, State Score , [consecutive years available]]
            Else:
              Entry2 will be an array with 2 entries: [NaN, [consecutive years available]]
      
      ElseIf the NP doesn't have at least 2 consecutive years:
        Entry1 will be an array with 2 entries : [ NaN, [consecutive years available] ]
            If the sector has at least 2 consecutive years AND there is data for THE SAME STATE in these years:
          Entry2 will be an array with 3 entries: [National Score, State Score , [consecutive years available]]
        Else:
          Entry2 will be an array with 2 entries: [NaN, [consecutive years available]]
*/

async function main(npVSnp, specific_sector = null) {
  const firstNp= 'SOCIETY OF COSMETIC CHEMISTS';
  const firstAddr = '33 CHESTER ST';
  const secondNp  = 'Beta Theta Pi Fraternity';
  const secondAddr = '12 Munson Road';

  if (npVSnp) {
    const firstFiscalHealthScore = await getNpFiscalHealthScore(firstNp, firstAddr);
    const secondFiscalHealthScore = await getNpFiscalHealthScore(secondNp, secondAddr);
    return [firstFiscalHealthScore, secondFiscalHealthScore];
  } else {
    const fiscalHealthScore = await getNpFiscalHealthScore(firstNp, firstAddr);
    if (fiscalHealthScore == -1) {
      return -1;
    }
    const scores = await getSectorsFiscalHealthScore(firstNp, firstAddr, specific_sector);
    return [fiscalHealthScore,scores];
  }
}

async function fetchData(Np, Addr, npVSnp, specific_sector = null) {
  const Uri = process.env.MONGODB_URI;
  const client = new MongoClient(Uri);
  try {
    await client.connect();
    const database = client.db('Nonprofitly');

    const NpData = await database.collection('NonProfitData').findOne({ Nm: Np, Addr: Addr });
    if (!NpData) {
      console.error(`${Np} not found.`);
      return -1;
    }
    const consecutiveYears = getConsecutiveYears(NpData);
    if (npVSnp) {
      return [consecutiveYears, NpData];
    } else {
      const majorGroup = !specific_sector ? NpData.NTEE[0] : specific_sector;
      const state = NpData.St;
      const regionalAndNational = await database.collection('NationalAndStateStatistics').findOne({ "MajGrp": majorGroup });
      if (!regionalAndNational) {
        console.error("Error while fetching from NationalAndStateStatistics collection");
        return -1;
      }
      return [state, consecutiveYears, regionalAndNational];
    }
  } finally {
    await client.close();
  }
}

async function getNpFiscalHealthScore(Np, Addr) {
  const values = await fetchData(Np, Addr, true);
  if (values === -1){
    return -1;
  }
  const consecutiveYears = values[0];
  const NpData = values[1];

  if (consecutiveYears.length >= 2) {
    const score = calculateNonProfitFiscalHealthScore(NpData, consecutiveYears);
    console.log(`Fiscal Health Score of ${Np} is : ${score}`);
    return [score,consecutiveYears];
  } else {
    console.error(`Error: No consecutive years found for ${Np}. Available years: ${consecutiveYears.join(' - ')}`);
    return [NaN,consecutiveYears];
  }
}

async function getSectorsFiscalHealthScore(Np, Addr, specific_sector) {
  const values = await fetchData(Np, Addr, false, specific_sector);
  if (values === -1){
    return -1;
  }
  const state = values[0];
  const consecutiveYears = values[1];
  const data = values[2];
  if (specific_sector) {

    let sectorDataExists = checkSectorDataExistence(data, consecutiveYears, state);
    if (sectorDataExists) {
      if (consecutiveYears.length >= 2) {
        const nationalScore = calculateNationalFiscalHealthScore(data, consecutiveYears);
        const stateScore = calculateStateFiscalHealthScore(data, consecutiveYears, state);
        console.log(`National Fiscal Health Score of ${Np} is : ${nationalScore}`);
        console.log(`State Fiscal Health Score of ${Np} is : ${stateScore}`);
        return [nationalScore, stateScore];
      }
      else {
          sectorDataExists = false;
      }
    }
    if (!sectorDataExists) {
      console.log('Warning, sector chosen does not have the same range of consecutive years or for the same state');
      const sectorConsecutiveYears = getConsecutiveYears(data);
      if (sectorConsecutiveYears.length >= 2) {
        sectorDataExists = checkSectorDataExistence(data, sectorConsecutiveYears, state);
        if (!sectorDataExists) {
          console.error(`Error: Sector chosen by user has no data for the same state of Non Profit`);
          return [NaN, sectorConsecutiveYears];
        }
        else {
          const nationalScore = calculateNationalFiscalHealthScore(data, sectorConsecutiveYears);
          const stateScore = calculateStateFiscalHealthScore(data, sectorConsecutiveYears, state);
          console.log(`National Fiscal Health Score is : ${nationalScore}`);
          console.log(`State Fiscal Health Score is : ${stateScore}`);
          return [nationalScore, stateScore,sectorConsecutiveYears];
        }
      }
      else {
        console.error(`Error: No consecutive years found for the specific sector of ${Np}. Available years: ${sectorConsecutiveYears.join(' - ')}`);
        return [NaN, sectorConsecutiveYears];
      }
    }
  }
  if (consecutiveYears.length >= 2) {
    const nationalScore = calculateNationalFiscalHealthScore(data, consecutiveYears);
    const stateScore = calculateStateFiscalHealthScore(data, consecutiveYears, state);
    console.log(`National Fiscal Health Score is : ${nationalScore}`);
    console.log(`State Fiscal Health Score of is : ${stateScore}`);
    return [nationalScore, stateScore];
  } else {
    console.error(`Error: No consecutive years found for the specific sector of ${Np}. Available years: ${consecutiveYears.join(' - ')}`);
    return [NaN, consecutiveYears];
  }
}

function getConsecutiveYears(data) {
  const years = [];
  for (let key of Object.keys(data)) {
    if (!isNaN(key)) {
      years.push(Number(key));
    }
  }
  years.sort((a, b) => b - a);

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
    return newValue === 0 ? 0 : (console.error("Red Flag"), newValue); // Red flag
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

function checkSectorDataExistence(data, years, state) {
  for (let i = 0; i < years.length - 1; i++) {
    const year1 = years[i];
    const year2 = years[i + 1];

  if (!data[year2] || !data[year2][state] || !data[year1] || !data[year1][state]) {
      return false;
    }
  }
  return true;
}

function calculateNationalFiscalHealthScore(data, years) {
  let totalScore = 0;
  let intervals = 0;

  for (let i = 0; i < years.length - 1; i++) {
    const year1 = years[i];
    const year2 = years[i + 1];

    const revMed2 = data[year2].NatMedRev;
    const expMed2 = data[year2].NatMedExp;
    const liaMed2 = data[year2].NatMedLia;
    const astMed2 = data[year2].NatMedAst;

    const revMed1 = data[year1].NatMedRev;
    const expMed1 = data[year1].NatMedExp;
    const liaMed1 = data[year1].NatMedLia;
    const astMed1 = data[year1].NatMedAst;

    const revDiff = calculatePercentDifference(revMed2, revMed1);
    const expDiff = calculatePercentDifference(expMed2, expMed1);
    const liaDiff = calculatePercentDifference(liaMed2, liaMed1);
    const astDiff = calculatePercentDifference(astMed2, astMed1);

    const nationalFiscalHealthScore = 0.4 * revDiff + 0.3 * expDiff + 0.2 * astDiff + 0.1 * liaDiff;
    totalScore += nationalFiscalHealthScore;
    intervals++;
  }

  return intervals > 0 ? totalScore / intervals : 0;
}
function calculateStateFiscalHealthScore(data, years, state) {
  //There is an edge case where
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

// Call the main function
main(false).then(console.log);
