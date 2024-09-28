## Overview
The following irregularities have been identified in our database:

### 1. Nonprofits with Zero NTEE Code
- **Issue:** 7 nonprofit organizations have an NTEE code value of zero.
- **Explanation:** This appears to be a filing error, as the NTEE code should likely be either "Z" or the letter "O".
- **Resolution:** We will allow the user to correct this error.

### 2. Incomplete Rows in the Database
- **Issue:** Several rows in the nonprofit table are incomplete.
- **Explanation:** These rows only contain the NTEE code, EIN, and subsection code, with no other data. They have no current use, but we retain them in case new IRS data completes them.

### 3. Nonprofits with Restricted Contribution Data
- **Issue:** Some nonprofits do not disclose the amounts of contributions they receive.
- **Explanation:** These entries are marked as "RESTRICTED" and, in our database, this is represented as "R" in the `TotCon` field.
- **Resolution:** Ensure that any code involving total contributions correctly handles the "R" (restricted) value in the `TotCon` field.
