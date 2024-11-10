import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  const { mode, nameofnonprofit, Addr, majorGroup, national, state } = req.body;

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('Nonprofitly');

    if (mode === "Micro") {
      const npData = await getNonProfitData(db, nameofnonprofit, Addr);
      if (npData === -1) {
        return res.status(404).json({ message: "No data is provided for selected non profit" });
      }
      return res.status(200).json(npData);
    }
    else {
      const sectorData = await getEntireSectorData(db, majorGroup, national, state);
      if (sectorData === -1) {
        return res.status(404).json({ message: "Sector data not found" });
      }
      return res.status(200).json(sectorData);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error fetching data" });
  } finally {
    await client.close();
  }
}

async function getNonProfitData(db, nameofnonprofit, Addr) {
  const filters = {};
  if (nameofnonprofit) {
    filters.Nm = { $regex: new RegExp(`^${Np.trim()}$`, 'i') };
  }
  if (Addr) {
    filters.Addr = { $regex: new RegExp(`^${Addr.trim()}$`, 'i') };
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

async function getEntireSectorData(db, majorGroup, national, state) {
  const data = await db.collection('NationalAndStateStatistics').findOne({ MajGrp: majorGroup });
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
          const hasYear1State = data[year1][state];
          const hasYear2State = data[year2][state];
          
          if (hasYear1State && data[year1][state].Count990Np && (!hasYear2State || !data[year2][state].Count990Np)) {
            chosen_year = year1;
            break;
          } else if ( (!hasYear1State || !data[year1][state].Count990Np) && hasYear2State && data[year2][state].Count990Np) {
            chosen_year = year2;
            break;
          } else if (hasYear1State && data[year1][state].Count990Np && hasYear2State && data[year2][state].Count990Np) {
            chosen_year = (data[year2][state].Count990Np - data[year1][state].Count990Np > 500) ? year2 : year1;
            break;
          }
        } else {
          const last_year = years[i];
          const hasLastYearState = data[last_year][state];
          
          if (hasLastYearState && data[last_year][state].Count990Np) {
            chosen_year = last_year;
          }
        }
      }

  }
  if (isNaN(chosen_year)) {
    return -1;
  }
  const selectedData = national ? data[chosen_year] : data[chosen_year][state];
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
