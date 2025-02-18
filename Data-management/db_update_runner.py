from WebScraper import WebScraper
from Database import Database
from Cleanup import Cleanup
from NationalAndStateStatistics import NationalAndStateStatistics

if __name__ == "__main__":
    i = 0
    while i < 1: # Increase this if you want to process multiple zip folders ( it will download one folder at a time )
        flag = True # only process one new release.
        webscraper = WebScraper()
        webscraper.check_already_parsed_folders()
        webscraper.check_missing_zip_folders(flag)
        webscraper.download_missing_zip_folders()
        if webscraper.created_folders:
            db = Database()
            cleanup = Cleanup()
            cleanup.restore_missing_nonprofits() # Comment this if running multiple files
            cleanup.drop_all_indices() # Comment this if running multiple files
            for folder in webscraper.created_folders:
                db.process_all_xml_files(folder)
                db.output_duplicates(folder[5:]) # basically remove /tmp
            # Deleted download zip files, move back incomplete rows to their own table, add back indices
            cleanup.delete_created_files_and_folders(webscraper.created_files, webscraper.created_folders)
            cleanup.move_missing_nonprofits() # Comment this if running multiple files
            cleanup.create_indices() # Comment this if running multiple files
            # Rebuild ntee table
            ntee_table = NationalAndStateStatistics() # Comment this if running multiple files
            ntee_table.build_collection() # Comment this if running multiple files
        i += 1
