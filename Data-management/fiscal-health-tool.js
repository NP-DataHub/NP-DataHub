const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '../frontend/.env' })

// TO DO: HOW TO HANDLE SIGNAL OF RED FLAG

/**
 * Main function that compares either two nonprofits or a nonprofit against a sector.
 *
 * @param {string} firstNp - The name of the first nonprofit organization.
 * @param {string} firstAddr - The address of the first nonprofit.
 * @param {string} secondNp - The name of the second nonprofit (if comparing two nonprofits).
 * @param {string} secondAddr - The address of the second nonprofit (if comparing two nonprofits).
 * @param {boolean} npVSnp - Flag indicating if the comparison is between two nonprofits (true) or a nonprofit vs a sector (false).
 * @param {string|null} specific_sector - The specific sector for comparison (if applicable).
 *
 * @requires MongoDB connection, secondNp and secondAddr to be at least empty strings even if the npVSnp flag is false.
 * @effect Fetches data for nonprofit(s) and sector, calculates fiscal health scores, logs errors or warnings.
 * @modifies None
 * @throws None
 * @returns {Promise<Array|number>} Returns:
 *          - If `npVSnp` is true, an array with two entries: [ENTRY1, ENTRY2], where each entry is either:
 *             - -1 if the nonprofit is not found.
 *             - [NaN, [consecutive years available]] if the nonprofit doesn't have at least 2 consecutive years.
 *             - [Fiscal Score, [consecutive years available]] if the nonprofit has at least 2 consecutive years.
 *          - If `npVSnp` is false, either -1 if the nonprofit is not found, or an array with two entries: [Nonprofit Entry, Sector Entry], where:
 *             - Nonprofit Entry:
 *                - [NaN, [consecutive years]] if the nonprofit has fewer than 2 consecutive years.
 *                - [Fiscal Score, [consecutive years]] if the nonprofit has at least 2 consecutive years.
 *             - Sector Entry:
 *                - [National Score, State Score] if the comparison is against the same sector or a different sector **with the same consecutive years**
 *                - [National Score, State Score, [consecutive years available]] If the chosen sector from a user does not have the same consecutive years of the non profit
 *                   (or even if the non profit doesn't have at least 2 consecutive years) and that sector has at least 2 consecutive years
 *                    **and** there is data for the same state of non profit in these years.
 *                - [NaN, [consecutive years available]] if the chosen sector from a user doen't have the same consecutive years of the non profit
 *                  and that sector doesn't have at least 2 consecutive years or it doesn't have data for the same state in these years
 */
async function main (
  firstNp,
  firstAddr,
  secondNp,
  secondAddr,
  npVSnp,
  specific_sector = null
) {
  if (npVSnp) {
    const firstFiscalHealthScore = await getNpFiscalHealthScore(
      firstNp,
      firstAddr
    )
    const secondFiscalHealthScore = await getNpFiscalHealthScore(
      secondNp,
      secondAddr
    )
    return [firstFiscalHealthScore, secondFiscalHealthScore]
  } else {
    const fiscalHealthScore = await getNpFiscalHealthScore(firstNp, firstAddr)
    if (fiscalHealthScore == -1) {
      return -1
    }
    const scores = await getSectorsFiscalHealthScore(
      firstNp,
      firstAddr,
      specific_sector
    )
    return [fiscalHealthScore, scores]
  }
}
/**
 * Fetches nonprofit data from the database and retrieves relevant statistics.
 *
 * @param {string} Np - The name of the nonprofit organization.
 * @param {string} Addr - The address of the nonprofit organization.
 * @param {boolean} npVSnp - Flag indicating whether to compare a nonprofit with another or with regional/national data (false).
 * @param {string|null} specific_sector - Optional parameter specifying a specific sector for comparison.
 * @requires MongoDB must be running, and `MONGODB_URI` must be set in the environment variables.
 *           Nonprofit data must have valid NTEE codes and state fields.
 * @effect Connects to MongoDB, queries two collections, and fetches nonprofit or regional/national data.
 *         Outputs error messages to the console in case of missing data or database issues.
 * @modifies None
 * @throws None
 * @returns {Promise<Array|number>} - Returns an array containing either:
 *                                    1. The consecutive years and nonprofit data if `npVSnp` is true,
 *                                    2. The state, consecutive years, and regional/national data if `npVSnp` is false.
 *                                    Returns -1 if an error occurs.
 */
async function fetchData (Np, Addr, npVSnp, specific_sector = null) {
  const Uri = process.env.MONGODB_URI
  const client = new MongoClient(Uri)
  try {
    await client.connect()
    const database = client.db('Nonprofitly')
    // Fetch specific nonprofit data from the 'NonProfitData' collection using name and address as identifiers
    // because multiple non profits can have the same name.
    const NpData = await database
      .collection('NonProfitData')
      .findOne({ Nm: Np, Addr: Addr })
    if (!NpData) {
      console.error(`${Np} not found.`) // Log error if nonprofit is not found
      return -1 // Return -1 if nonprofit data is missing
    }
    const consecutiveYears = getConsecutiveYears(NpData)
    if (npVSnp) {
      return [consecutiveYears, NpData]
    } else {
      // The user wants to compare a non profit against a sector.
      // Use the sector of the non profit or use a user defined specific sector
      const majorGroup = !specific_sector ? NpData.NTEE[0] : specific_sector
      const state = NpData.St

      // Fetch regional and national statistics from 'NationalAndStateStatistics' collection
      const regionalAndNational = await database
        .collection('NationalAndStateStatistics')
        .findOne({ MajGrp: majorGroup })
      if (!regionalAndNational) {
        console.error(
          'Error while fetching from NationalAndStateStatistics collection'
        ) // Log error if no data found
        return -1 // Return -1 if regional/national data is missing
      }
      return [state, consecutiveYears, regionalAndNational]
    }
  } finally {
    await client.close()
  }
}
/**
 * Retrieves the fiscal health score for a nonprofit.
 *
 * @param {string} Np - The name of the nonprofit.
 * @param {string} Addr - The address of the nonprofit.
 * @requires None
 * @effect Outputs successful messages or error messages to the console
 * @modifies None
 * @throws None
 * @returns {Promise<Array|number>} Returns:
 *          - -1 if the nonprofit is not found.
 *          - [NaN, [consecutive years]] if the nonprofit has fewer than 2 consecutive years.
 *          - [Fiscal Score, [consecutive years]] if the nonprofit has at least 2 consecutive years.
 */
async function getNpFiscalHealthScore (Np, Addr) {
  const values = await fetchData(Np, Addr, true)
  if (values === -1) {
    return -1
  }
  const consecutiveYears = values[0]
  const NpData = values[1]

  if (consecutiveYears.length >= 2) {
    const score = calculateNonProfitFiscalHealthScore(NpData, consecutiveYears)
    console.log(`Fiscal Health Score of ${Np} is : ${score}`)
    return [score, consecutiveYears]
  } else {
    console.error(
      `Error: No consecutive years found for ${Np}. Available years: ${consecutiveYears.join(
        ' - '
      )}`
    )
    return [NaN, consecutiveYears]
  }
}

/**
 * Retrieves the fiscal health score for a sector on a national and state level.
 *
 * @param {string} Np - The name of the nonprofit.
 * @param {string} Addr - The address of the nonprofit.
 * @param {string|null} specific_sector - The specific sector for comparison.
 * @requires None
 * @effect Outputs successful messages or error messages to the console
 * @modifies None
 * @throws None
 * @returns {Promise<Array|number>} Returns:
 *          - -1 if the nonprofit or sector is not found.
 *          - [National Score, State Score] if the comparison is against the same sector or a different sector **with the same consecutive years**
 *          - [National Score, State Score, [consecutive years available]] If the chosen sector from a user does not have the same consecutive years of the non profit
 *            (or even if the non profit doesn't have at least 2 consecutive years) and that sector has at least 2 consecutive years
 *             **and** there is data for the same state of non profit in these years.
 *          - [NaN, [consecutive years available]] if the chosen sector from a user doen't have the same consecutive years of the non profit
 *           and that sector doesn't have at least 2 consecutive years or it doesn't have data for the same state in these years
 */
async function getSectorsFiscalHealthScore (Np, Addr, specific_sector) {
  const values = await fetchData(Np, Addr, false, specific_sector)
  if (values === -1) {
    return -1
  }
  const state = values[0]
  const consecutiveYears = values[1]
  const data = values[2]
  if (specific_sector) {
    //if a user specified a sector, check if it has data for same consecutive years as non profit and in the state of non profit
    let sectorDataExists = checkSectorDataExistence(
      data,
      consecutiveYears,
      state
    )
    if (sectorDataExists) {
      if (consecutiveYears.length >= 2) {
        const nationalScore = calculateNationalFiscalHealthScore(
          data,
          consecutiveYears
        )
        const stateScore = calculateStateFiscalHealthScore(
          data,
          consecutiveYears,
          state
        )
        console.log(
          `National Fiscal Health Score of ${Np} is : ${nationalScore}`
        )
        console.log(`State Fiscal Health Score of ${Np} is : ${stateScore}`)
        return [nationalScore, stateScore]
      } else {
        sectorDataExists = false
      }
    }
    if (!sectorDataExists) {
      console.log(
        'Warning, sector chosen does not have the same range of consecutive years or for the same state'
      )
      const sectorConsecutiveYears = getConsecutiveYears(data) // data here corresponds to the sector data and not the Np data
      // check if that sector has at least 2 consecutive years
      if (sectorConsecutiveYears.length >= 2) {
        // check if sector chosen by user has data for the same state of Non Profit
        sectorDataExists = checkSectorDataExistence(
          data,
          sectorConsecutiveYears,
          state
        )
        if (!sectorDataExists) {
          console.error(
            `Error: Sector chosen by user has no data for the same state of Non Profit`
          )
          return [NaN, sectorConsecutiveYears]
        } else {
          const nationalScore = calculateNationalFiscalHealthScore(
            data,
            sectorConsecutiveYears
          )
          const stateScore = calculateStateFiscalHealthScore(
            data,
            sectorConsecutiveYears,
            state
          )
          console.log(`National Fiscal Health Score is : ${nationalScore}`)
          console.log(`State Fiscal Health Score is : ${stateScore}`)
          return [nationalScore, stateScore, sectorConsecutiveYears]
        }
      } else {
        console.error(
          `Error: No consecutive years found for the specific sector of ${Np}. Available years: ${sectorConsecutiveYears.join(
            ' - '
          )}`
        )
        return [NaN, sectorConsecutiveYears]
      }
    }
  }
  // If we're comparing the non profit against the performance of the sector, we know for sure the sector already
  // has the same number of consecutive years as non profit
  if (consecutiveYears.length >= 2) {
    const nationalScore = calculateNationalFiscalHealthScore(
      data,
      consecutiveYears
    )
    const stateScore = calculateStateFiscalHealthScore(
      data,
      consecutiveYears,
      state
    )
    console.log(`National Fiscal Health Score is : ${nationalScore}`)
    console.log(`State Fiscal Health Score of is : ${stateScore}`)
    return [nationalScore, stateScore]
  } else {
    console.error(
      `Error: No consecutive years found for the specific sector of ${Np}. Available years: ${consecutiveYears.join(
        ' - '
      )}`
    )
    return [NaN, consecutiveYears]
  }
}

/**
 * Retrieves up to four consecutive years from the keys of an input object.
 *
 * @param {Object} data - The input object where numeric keys represent years.
 * @requires The input data object must have keys that can be converted to numbers.
 * @modifies None
 * @effect None
 * @throws None
 * @returns {Array<number>} An array of up to four consecutive years, starting from the most recent one.
 *                          If no consecutive years are found, returns an empty array.
 */
function getConsecutiveYears (data) {
  // First store valid numeric years and sort in descending order
  const years = []
  for (let key of Object.keys(data)) {
    if (!isNaN(key)) {
      years.push(Number(key))
    }
  }
  years.sort((a, b) => b - a)

  let consecutiveYears = []
  let tempYears = []
  for (let i = 0; i < years.length; i++) {
    // Check if the current year is consecutive to the previous one
    if (i === 0 || years[i] === years[i - 1] - 1) {
      tempYears.push(years[i])
    } else {
      // If the current streak of consecutive years is longer than the recorded one, update it
      if (tempYears.length > consecutiveYears.length) {
        consecutiveYears = tempYears
      }
      // Start a new streak with the current year
      tempYears = [years[i]]
    }
  }
  // Final check in case the last streak is the longest
  if (tempYears.length > consecutiveYears.length) {
    consecutiveYears = tempYears
  }
  // Return up to the first four consecutive years found
  return consecutiveYears.slice(0, 4)
}

/**
 * Calculates the percentage difference between an old value and a new value.
 *
 * @param {number} oldValue - The original value for comparison.
 * @param {number} newValue - The new value to compare against the old value.
 * @requires `oldValue` and `newValue` must be numbers.
 * @effect Logs an error to the console if the old value is 0 and the new value is not.
 * @modifies None
 * @throws None
 * @returns {number} The percentage difference between the old and new values.
 *                   If the old value is 0 and the new value is not, returns the new value as a "red flag".
 */
function calculatePercentDifference (oldValue, newValue) {
  // If both old and new values are zero, return 0 (no change).
  // If only newValue is not zero, log an error and return newValue (considered a red flag scenario).
  if (oldValue === 0) {
    return newValue === 0 ? 0 : (console.error('Red Flag'), newValue) // Red flag
  }
  return ((newValue - oldValue) / oldValue) * 100
}

/**
 * Calculates the fiscal health score for a non-profit organization across multiple years.
 *
 * @param {Object} data - The dataset containing financial information for multiple years.
 * @param {Array<number>} years - An array of years for which to calculate the fiscal health score.
 * @requires `data` should have financial metrics like `TotRev`, `TotExp`, `TotAst`, and `TotLia` for each year in `years`.
 * @effect None
 * @modifies None
 * @throws None
 * @returns {number} The average fiscal health score across the specified years.
 *                   Returns 0 if there are no intervals to calculate.
 */

function calculateNonProfitFiscalHealthScore (data, years) {
  let totalScore = 0
  let intervals = 0

  for (let i = 0; i < years.length - 1; i++) {
    const year1 = years[i]
    const year2 = years[i + 1]

    const revDiff = calculatePercentDifference(
      data[year2].TotRev,
      data[year1].TotRev
    )
    const expDiff = calculatePercentDifference(
      data[year2].TotExp,
      data[year1].TotExp
    )
    const astDiff = calculatePercentDifference(
      data[year2].TotAst,
      data[year1].TotAst
    )
    const liaDiff = calculatePercentDifference(
      data[year2].TotLia,
      data[year1].TotLia
    )

    const fiscalHealthScore =
      0.4 * revDiff + 0.3 * expDiff + 0.2 * astDiff + 0.1 * liaDiff
    totalScore += fiscalHealthScore
    intervals++
  }

  return intervals > 0 ? totalScore / intervals : 0
}

/**
 * Calculates the national fiscal health score of a sector based on median national financial data across multiple years.
 *
 * @param {Object} data - The dataset containing national median financial information for multiple years of a sector
 * @param {Array<number>} years - An array of years for which to calculate the national fiscal health score.
 * @requires `data` should have national median financial metrics like `NatMedRev`, `NatMedExp`, `NatMedAst`, and `NatMedLia` for each year in `years`
 * @effect None
 * @modifies None
 * @throws None
 * @returns {number} The average national fiscal health score across the specified years in a sector.
 *                   Returns 0 if there are no intervals to calculate.
 */
function calculateNationalFiscalHealthScore (data, years) {
  let totalScore = 0
  let intervals = 0

  for (let i = 0; i < years.length - 1; i++) {
    const year1 = years[i]
    const year2 = years[i + 1]

    const revMed2 = data[year2].NatMedRev
    const expMed2 = data[year2].NatMedExp
    const liaMed2 = data[year2].NatMedLia
    const astMed2 = data[year2].NatMedAst

    const revMed1 = data[year1].NatMedRev
    const expMed1 = data[year1].NatMedExp
    const liaMed1 = data[year1].NatMedLia
    const astMed1 = data[year1].NatMedAst

    const revDiff = calculatePercentDifference(revMed2, revMed1)
    const expDiff = calculatePercentDifference(expMed2, expMed1)
    const liaDiff = calculatePercentDifference(liaMed2, liaMed1)
    const astDiff = calculatePercentDifference(astMed2, astMed1)

    const nationalFiscalHealthScore =
      0.4 * revDiff + 0.3 * expDiff + 0.2 * astDiff + 0.1 * liaDiff
    totalScore += nationalFiscalHealthScore
    intervals++
  }

  return intervals > 0 ? totalScore / intervals : 0
}

/**
 * Calculates the fiscal health score for a sector in a specific state across multiple years.
 *
 * @param {Object} data - The dataset containing state-level financial information of a sector for multiple years
 * @param {Array<number>} years - An array of years for which to calculate the state's fiscal health score.
 * @param {string} state - The state for which the fiscal health score of a sector is being calculated.
 * @requires `data` should have state-level financial metrics like `RevMed`, `ExpMed`, `AstMed`, and `LiaMed` for each year in `years`.
 * @effect None
 * @modifies None
 * @throws None
 * @returns {number} The average fiscal health score for the specified state across the years in a sector.
 *                   Returns 0 if there are no intervals to calculate.
 */
function calculateStateFiscalHealthScore (data, years, state) {
  let totalScore = 0
  let intervals = 0

  for (let i = 0; i < years.length - 1; i++) {
    const year1 = years[i]
    const year2 = years[i + 1]

    const revMed2 = data[year2][state].RevMed
    const expMed2 = data[year2][state].ExpMed
    const liaMed2 = data[year2][state].LiaMed
    const astMed2 = data[year2][state].AstMed

    const revMed1 = data[year1][state].RevMed
    const expMed1 = data[year1][state].ExpMed
    const liaMed1 = data[year1][state].LiaMed
    const astMed1 = data[year1][state].AstMed

    const revDiff = calculatePercentDifference(revMed2, revMed1)
    const expDiff = calculatePercentDifference(expMed2, expMed1)
    const liaDiff = calculatePercentDifference(liaMed2, liaMed1)
    const astDiff = calculatePercentDifference(astMed2, astMed1)

    const stateFiscalHealthScore =
      0.4 * revDiff + 0.3 * expDiff + 0.2 * astDiff + 0.1 * liaDiff
    totalScore += stateFiscalHealthScore
    intervals++
  }

  return intervals > 0 ? totalScore / intervals : 0
}

/**
 * Checks if the sector data exists for the provided state and consecutive years.
 *
 * @param {Object} data - Sector data.
 * @param {Array<number>} years - Array of consecutive years.
 * @param {string} state - The state to check in the data.
 * @requires `data` must be an object structured with years as keys and states as sub-keys.
 * @effect None
 * @modifies None
 * @throws None
 * @returns {boolean} Returns true if data exists for the state in the provided years, false otherwise.
 */
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

// Call the main function
const firstNp = 'SOCIETY OF COSMETIC CHEMISTS'
const firstAddr = '33 CHESTER ST'
const secondNp = 'Beta Theta Pi Fraternity'
const secondAddr = '12 Munson Road'

main(firstNp, firstAddr, secondNp, secondAddr, false).then(console.log)
