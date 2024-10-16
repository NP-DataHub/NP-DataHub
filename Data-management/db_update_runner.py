from WebScraper import WebScraper
from Database import Database
from Cleanup import Cleanup
from NationalAndStateStatistics import NationalAndStateStatistics

if __name__ == "__main__":
    #First Call webscraper to check for any recent data available from the IRS
    flag = True # only process one new release.
    webscraper = WebScraper()
    webscraper.check_already_parsed_folders()
    webscraper.check_missing_zip_folders(flag)
    webscraper.download_missing_zip_folders()
    if webscraper.unprocessed_folders:
        # if there is new data to get, add it to our database
        db = Database()
        cleanup = Cleanup()
        cleanup.restore_missing_nonprofits()
        cleanup.drop_all_indices()
        for folder in webscraper.created_folders:
            db.process_all_xml_files(folder)
            db.output_duplicates(folder[5:]) # basically remove /tmp
        # Deleted download zip files, move back incomplete rows to their own table, add back indices and reset ntee table
        cleanup.delete_created_files_and_folders(webscraper.created_files, webscraper.created_folders)
        cleanup.move_missing_nonprofits()
        cleanup.create_indices()
        cleanup.reset_ntee_table()
        # Rebuild ntee table
        ntee_table = NationalAndStateStatistics()
        ntee_table.build_collection()