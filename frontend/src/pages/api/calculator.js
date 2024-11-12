import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  const { mode, nonprofit, address, sector, state } = req.body;
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('Nonprofitly');

    if (mode === "Micro") {
      const npData = await getNonProfitData(db, nonprofit, address);
      if (npData === -1) {
        return res.status(404).json({ message: "No data is provided for selected non profit" });
      }
      return res.status(200).json(npData);
    }
    else {
      const sectorData = await getEntireSectorData(db, sector, state);
      if (sectorData === -1) {
        return res.status(404).json({ message: "Sector data not found" });
      }
      return res.status(200).json(sectorData);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error fetching data" });
  } finally {
    await client.close();
  }
}

async function getNonProfitData(db, nonprofit, address) {
  const filters = {};
  if (nonprofit) {
    filters.Nm = { $regex: new RegExp(`^${Np.trim()}$`, 'i') };
  }
  if (address) {
    filters.Addr = { $regex: new RegExp(`^${address.trim()}$`, 'i') };
  }

  const npData = await db.collection('NonProfitData').findOne(filters);
  if (!npData) {
    return -1;
  }

  if (npData.RetTyp !== "990") {
    return -1;
  }

  const years = [];
  for (let key of Object.keys(npData)) {
    if (!isNaN(key)) {
      years.push(Number(key));
    }
  }
  years.sort((a, b) => b - a); // first index == most recent

  const chosenYear = years[0]; // Replace with actual user choice if needed

  const yearData = npData[chosenYear];
  if (!yearData || yearData.OthSal === 0 || yearData.OffComp === 0 || yearData.TotExp === 0) {
    return -1;
  }
  const salariesToExpensesPct = 100 * (yearData.TotExp / (yearData.OffComp + yearData.OthSal));
  return [chosenYear, yearData.OthSal, yearData.OffComp, yearData.TotExp, salariesToExpensesPct];
} 

async function getEntireSectorData(db, sector, state) {
  const data = await db.collection('NationalAndStateStatistics').findOne({ MajGrp: sector });
  if (!data) {
    return -1;
  }
  const years = []
  for (let key of Object.keys(data)) {
    if (!isNaN(key)) {
      years.push(Number(key))
    }
  }
  years.sort((a, b) => b - a)
  let chosen_year = NaN;

  const national = state === '' ? true : false;

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

  const stateCode = stateToCode[state];
  if (!stateCode && !national) {
    return -1
  }

  if (national) {
    for (let i = 0; i < years.length; i += 2) {
      if (i + 1 < years.length) {
        const year1 = years[i];
        const year2 = years[i + 1];

        if (data[year1].NatCount990Np && !data[year2].NatCount990Np) {
          chosen_year = year1;
          break;
        } else if (!data[year1].NatCount990Np && data[year2].NatCount990Np) {
          chosen_year = year2;
          break;
        } else if (data[year1].NatCount990Np && data[year2].NatCount990Np) {
          chosen_year = (data[year2].NatCount990Np - data[year1].NatCount990Np > 5000) ? year2 : year1;
          break;
        }
      } else {
        const last_year = years[i];
        if (data[last_year].NatCount990Np) {
          chosen_year = last_year
        }
      }
    }
  } else {
      for (let i = 0; i < years.length; i += 2) {
        const year1 = years[i];
        const year2 = years[i + 1];
        
        if (i + 1 < years.length) {
          const hasYear1State = data[year1][stateCode];
          const hasYear2State = data[year2][stateCode];
          
          if (hasYear1State && data[year1][stateCode].Count990Np && (!hasYear2State || !data[year2][stateCode].Count990Np)) {
            chosen_year = year1;
            break;
          } else if ( (!hasYear1State || !data[year1][stateCode].Count990Np) && hasYear2State && data[year2][stateCode].Count990Np) {
            chosen_year = year2;
            break;
          } else if (hasYear1State && data[year1][stateCode].Count990Np && hasYear2State && data[year2][stateCode].Count990Np) {
            chosen_year = (data[year2][stateCode].Count990Np - data[year1][stateCode].Count990Np > 500) ? year2 : year1;
            break;
          }
        } else {
          const last_year = years[i];
          const hasLastYearState = data[last_year][stateCode];
          
          if (hasLastYearState && data[last_year][stateCode].Count990Np) {
            chosen_year = last_year;
          }
        }
      }

  }
  if (isNaN(chosen_year)) {
    return -1;
  }
  const selectedData = national ? data[chosen_year] : data[chosen_year][stateCode];
  // Another check for safety
  if (!selectedData) {
    return -1;
  }

  const TotalRevenue = national ? selectedData.NatSumRev : selectedData.SumRev;
  const TotalExpenses = national ? selectedData.NatSumExp : selectedData.SumExp;
  const TotalAssets = national ? selectedData.NatSumAst : selectedData.SumAst;
  const TotalLiabilities = national ? selectedData.NatSumLia : selectedData.SumLia;
  const NumEmployees = national ? selectedData.NatSumEmp : selectedData.SumEmp;
  const OtherSalaries = national ? selectedData.NatSumOthSal : selectedData.SumOthSal;
  const OfficerCompensation = national ? selectedData.NatSumOffComp : selectedData.SumOffComp;
  const salariesToExpensesPct = 100 * (TotalExpenses / (OfficerCompensation + OtherSalaries));
  return [
    chosen_year,
    TotalRevenue,
    TotalExpenses,
    TotalAssets,
    TotalLiabilities,
    NumEmployees,
    OtherSalaries,
    OfficerCompensation,
    salariesToExpensesPct
    ];
  }
