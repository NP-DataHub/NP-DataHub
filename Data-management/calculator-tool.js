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
}

main().then(console.log).catch(console.error);
