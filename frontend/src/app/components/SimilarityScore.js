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
       * - If the NTEE codes are the same, add 1 to the score
       * - For each financial metric (Rev, Exp, Asts, Liabs) that is within 10% of the other, add 1 to the score
       * - If the city or ZIP is the same, add 1 to the score
       */
const SimilarityScore = (A, B) => {

    // Need to get the revenue, expenses, assets, and liabilities for the most recent year
    const A_years = Object.keys(A).filter((key) => key.includes('TotRev') || key.includes('TotExp') || key.includes('TotAst') || key.includes('TotLia'));
    const B_years = Object.keys(B).filter((key) => key.includes('TotRev') || key.includes('TotExp') || key.includes('TotAst') || key.includes('TotLia'));
    
    const most_recent_year = Math.max(...A_years, ...B_years);
    let score = 0;

    // Check if the NTEE codes are the same
    if (A.NTEE === B.NTEE) {
      score += 1;
    }
    // Check if they are in the same city or ZIP
    if (A.Cty === B.Cty || A.Zip === B.Zip) {
      score += 1;
    }

    // Check if the financial metrics are within 10% of each other
    const financial_metrics = ['TotRev', 'TotExp', 'TotAst', 'TotLia'];
    for (const metric of financial_metrics) {
      const A_value = A[`${metric}${most_recent_year}`];
      const B_value = B[`${metric}${most_recent_year}`];
      if (Math.abs(A_value - B_value) / A_value < 0.1) {
        score += 1;
      }
    }
    return score;
  }


  export default SimilarityScore;