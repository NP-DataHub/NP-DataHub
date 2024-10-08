> **IMPORTANT:**  
> The following instructions are for **manually updating the database**.  
> The process is now automated via a GitHub Action, which runs every month. If the GitHub Action is not working, you can either manually trigger it from the Actions tab, or follow the instructions below.
> 
> Before proceeding manually, ensure the `zip_files_processed.txt` file is up to date. This file contains links to all processed zip folders. If you wish to reprocess specific folders, remove their links from `zip_files_processed.txt`. The file will automatically update after running the script.

---

### A. Building Database from Scratch (Skip to point B if you already have the database setup)

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

---

### B. Updating Database

1. **Prepare Environment:**
   - Ensure the `.env` file is in the frontend folder. **Do not commit this file.**

2. **Run db_update_runner.py:**
   - The script will handle fetching, processing, and updating the database automatically. It typically takes about a minute to fetch any new missing data, 2-3 minutes to process each folder, and about 30 minutes to rebuild the NationalAndStateStatistics table.

   **Note:** See the **IMPORTANT** note above about updating the `zip_files_processed.txt` file.

---

### Additional Script

3. **Check Data Statistics:**
   - Ensure the `.env` file is in the frontend folder. **Do not commit this file.**
   - Run `percentage_check.py` (takes about a minute).
   - **Note:** Every time the IRS releases folders for new years (2025, 2026...), increment the starting value of `x` in the `count_years_per_row` function.