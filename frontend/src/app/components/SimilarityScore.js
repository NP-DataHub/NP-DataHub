// This is a function that computes the similarity score between two nonprofits, for use in the COLAB component.
// Im not sure if this is the best way to implement a share function like this, but I need it to be the same across the component.
// Feel free to yell at me if this is dumb :)
// - Emmet Whitehead


/**
       *  Calculates the similarity score between two nonprofits based on some heuristics I came up with off the dome
       * 
       * @param A - the first nonprofit
       * @param B - the second nonprofit
       * 
       * Rules for scoring:
       * 
       * Score is in [0, 100]
       * 
       * 1. If the NTEE codes are the same, add 20 to the score
       * 2. For each financial metric, calculate the difference between the two nonprofits, and scale it to be in the range [0, 20], adding that to the score 
       */
const SimilarityScore = (A, B) => {

    // Need to get the revenue, expenses, assets, and liabilities for the most recent year
    const A_years = Object.keys(A).filter((key) => key.includes('TotRev') || key.includes('TotExp') || key.includes('TotAst') || key.includes('TotLia'));
    const B_years = Object.keys(B).filter((key) => key.includes('TotRev') || key.includes('TotExp') || key.includes('TotAst') || key.includes('TotLia'));
    
    const most_recent_year = Math.max(...A_years, ...B_years);

    console.log("max year of A:", Math.max(...A_years));
    console.log("max year of B:", Math.max(...B_years));

    let score = 0;

    // Check if the NTEE codes are the same
    if (A.NTEE === B.NTEE) {
      score += 20;
    }

    console.log("score after NTEE check:", score);

    // Check if the financial metrics are within 10% of each other
    const financial_metrics = ['TotRev', 'TotExp', 'TotAst', 'TotLia'];
    for (const metric of financial_metrics) {
      const A_value = A[`${metric}${most_recent_year}`];
      const B_value = B[`${metric}${most_recent_year}`];
      
      // Check if the values are null
      if (A_value === null || B_value === null) {
        continue;
      }

      // Calculate the difference between the two values
      const diff = Math.abs(A_value - B_value);

      // Scale the difference to be in the range [0, 20]
      let scaled_diff = 0;
      if (A_value !== 0) {
        scaled_diff = 20 * (diff / A_value);
      }

      // Add the scaled difference to the score
      score += 20 - scaled_diff;

    }
    return score;
  }


  export default SimilarityScore;