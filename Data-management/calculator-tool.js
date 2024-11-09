const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../frontend/.env' });

async function getNonProfitData(nameofnonprofit, Addr) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('Nonprofitly');
    const collection = database.collection('NonProfitData');
    
    const npData = await collection.findOne({ Nm: nameofnonprofit, Addr: Addr });
    if (!npData) {
      console.error(`${nameofnonprofit} not found.`);
      return -1;
    }

    if (npData.RetTyp !== "990") {
      console.error(`No data is provided for ${nameofnonprofit}.`);
      return -1;
    }

    const years = [];
    for (let key of Object.keys(npData)) {
      if (!isNaN(key)) {
        years.push(Number(key));
      }
    }
    years.sort((a, b) => b - a); // first index == most recent

    const chosenYear = years[5]; // Replace with actual user choice if needed

    const yearData = npData[chosenYear];
    if (!yearData || yearData.OthSal === 0 || yearData.OffComp === 0 || yearData.TotExp === 0) {
      console.error(`No data is provided for ${nameofnonprofit} in ${chosenYear}.`);
      return -1;
    }

    const result = 100 * (yearData.TotExp / (yearData.OffComp + yearData.OthSal));
    return [chosenYear, yearData.OthSal, yearData.OffComp, yearData.TotExp, result];

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

async function getEntireSectorData(majorGroup, national, state) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db('Nonprofitly');
    const data = await database
      .collection('NationalAndStateStatistics')
      .findOne({ MajGrp: majorGroup });
    
    if (!data) {
      console.error('Error: No data found in NationalAndStateStatistics collection.');
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
      console.error('Error: No data found.');
      return -1;
    }

    const selectedData = national ? data[chosen_year] : data[chosen_year][state];

    const TotalRevenue = selectedData?.NatSumRev || selectedData?.SumRev;
    const TotalExpenses = selectedData?.NatSumExp || selectedData?.SumExp;
    const TotalAssets = selectedData?.NatSumAst || selectedData?.SumAst;
    const TotalLiabilities = selectedData?.NatSumLia || selectedData?.SumLia;
    const NumEmployees = selectedData?.NatSumEmp || selectedData?.SumEmp;
    const OtherSalaries = selectedData?.NatSumOthSal || selectedData?.SumOthSal;
    const OfficerCompensation = selectedData?.NatSumOffComp || selectedData?.SumOffComp;
    const result = 100 * (TotalExpenses / (OfficerCompensation + OtherSalaries));
    console.log(`Sector National Result: ${result}`);
    return [
      chosen_year,
      TotalRevenue,
      TotalExpenses,
      TotalAssets,
      TotalLiabilities,
      NumEmployees,
      OtherSalaries,
      OfficerCompensation,
      result
    ];

  } catch (error) {
    console.error('Error connecting to database or fetching data:', error);
    return -1;
  } finally {
    await client.close();
  }
}

 async function main() {
  const nameofnonprofit = "AMERICAN LEGION POST 5 BOURQUE-LANIGAN";
  const Addr = "120 DRUMMOND AVENUE SUITE 3";
  const ret = await getNonProfitData(nameofnonprofit, Addr);

  if (ret !== -1) {
    const [year, othSal, offComp, totExp, result] = ret;
    console.log(`Year: ${year}`);
    console.log(`Other Salary: ${othSal}`);
    console.log(`Officer Compensation: ${offComp}`);
    console.log(`Total Expenses: ${totExp}`);
    console.log(`Result: ${result}`);
  } else {
    console.log('No data available for this nonprofit.');
  }

  const ntee = await getEntireSectorData("Z", true, "")
}

main().then(console.log).catch(console.error);
