> **IMPORTANT:**  
> The following instructions are for **manually updating the database**.  
> The process is now automated via a GitHub Action, which runs three times a month. If the GitHub Action is not working, you can either manually trigger it from the Actions tab, or follow the instructions below.
> 
> Before proceeding manually, ensure the `zip_files_processed.txt` file is up to date. This file contains links to all processed zip folders. If you wish to reprocess specific folders, remove their links from `zip_files_processed.txt`. The file will automatically update after running the script.
> 
> **Note on Runtime:**  
> The time it takes to run the process depends on factors like internet speed and the local environment where it's being executed. For reference, the GitHub Action takes around 2 hours to complete when run on GitHub, but on an M1 MacBook with a high-speed connection, it only takes a few minutes. If you're building the database from scratch or running an update and aren't sure how long it will take, it's recommended to start the process at night while you're sleeping. Make sure to leave your laptop open to track how long it takes.
> 
> **Note on Running the Files:**  
> All files should be run from the root directory of the repository and not from inside the `Data-management` directory. If you're interested in timing the process, you can use the `time` command before running Python. For example:
> 
> ```bash
> time python3 Data-management/db_update_runner.py
> ```
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
   - Execute `DatabaseStarter.py`

   **Note:** `DatabaseStarter.py` initializes the main table with EIN, NTEE, Major Groups and subsection codes. This is important because the XML files lack NTEE codes. The CSV files contain most non-profits declared in the XML files, which will make any database updates faster.

---

### B. Updating Database

1. **Prepare Environment:**
   - Ensure the `.env` file is in the frontend folder. **Do not commit this file.**

2. **Run db_update_runner.py:**
   - The script will handle fetching, processing, and updating the database automatically.
   **Note:** See the **IMPORTANT** note above about updating the `zip_files_processed.txt` file.

---

### Additional Script

3. **Check Data Statistics:**
   - Ensure the `.env` file is in the frontend folder. **Do not commit this file.**
   - Run `percentage_check.py`
   - **Note:** Every time the IRS releases folders for new years (2025, 2026...), increment the starting value of `x` in the `count_years_per_row` function.