### Building Database from Scratch (Skip if you already have the database setup)

1. **Ensure MongoDB is Running:**
   - Verify MongoDB is running and accessible.

2. **Prepare Environment:**
   - Place the `.env` file in the frontend folder. **Do not commit this file.**

3. **Download CSV Files:**
   - Download all 4 CSV files by region from [IRS EO BMF Extract](https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf).

4. **Run DatabaseStarter.py:**
   - Ensure the directory specified in `DatabaseStarter.py` contains the 4 CSV files.
   - Execute `DatabaseStarter.py` (it takes about 8 minutes to run).

   **Note:** `DatabaseStarter.py` initializes the main table with EIN, NTEE, and subsection codes. This is important because the XML files lack NTEE codes. The CSV files contain most non-profits declared in the XML files, which will make any database updates faster.

### Running Database.py (XML Parser for Financial and General Information)

**Case 1: Full Database Rebuild or Updating Database**

1. **Download Missing Folders:**
   - Download the necessary folders from [IRS Form 990 Downloads](https://www.irs.gov/charities-non-profits/form-990-series-downloads).
   - Rename (i.e. 2023-1) and unzip them, then place them in the `/tmp` directory.

2. **Update execute_parser.sh:**
   - Modify the list of directories in `execute_parser.sh` to match the new folders.

3. **Prepare Environment:**
   - Place the `.env` file in the frontend folder. **Do not commit this file.**

4. **Run the Parser:**
   - Execute `./execute_parser.sh` in its directory.
   - If you encounter a permission error, run `chmod u+x execute_parser.sh`.
   - The execution time depends on the folder size (typically a few minutes per folder).

### Running National&StateStatistics.py for the Second Table

1. **Prepare for Update:**
   - If you recently updated the NonProfitData table (latest data is from 2024-6A), delete all documents from the existing NationalAndStateStatistics collection.

2. **Prepare Environment:**
   - Place the `.env` file in the frontend folder. **Do not commit this file.**

3. **Run National&StateStatistics.py:**
   - This script will take up to 30 minutes if run on a complete database.

### Additional Scripts

1. **Cleanup Incomplete Rows:**
   - Ensure the `.env` file is in the frontend folder. **Do not commit this file.**
   - Run `cleanup.py`  **(this will delete incomplete rows permanently).**

2. **Check Data Statistics:**
   - Ensure the `.env` file is in the frontend folder. **Do not commit this file.**
   - Run `percentage_check.py` (takes about a minute).
   - Note: Everytime the IRS releases folders for new years (2025,2026...), increment the starting value of `x` in the `count_years_per_row` function.
