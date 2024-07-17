import pymongo
import os





if __name__ == "__main__":

	# Connecting to database
	client = MongoClient("mongodb+srv://Admin:Admin@np-data.fytln2i.mongodb.net/?retryWrites=true&w=majority&appName=NP-Data")
	database = client["NP-Data"]
	Ez = database["Ez"]
	Master = database["Master"]


	# Should return a cursor to the Master collection
	cursor = Matster.find();

