from pymongo import MongoClient
from dotenv import load_dotenv
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, PowerTransformer
import matplotlib.pyplot as plt
import seaborn as sns
import string 

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGODB_URI)
db = client['Nonprofitly']
collection = db['NonProfitData']
anomaly_collection = db['anomaly'] 

all_data_to_insert = []

for majgrp_letter in string.ascii_uppercase:
    print(f"Processing MajGrp '{majgrp_letter}'")

    data_cursor = collection.find({'MajGrp': majgrp_letter})

    nonprofit_data = {}

    for doc in data_cursor:
        try:
            ein = doc.get('EIN')
            ntee = doc.get('NTEE')
            state = doc.get('St')
            name = doc.get('Nm')
            majgrp = doc.get('MajGrp') 

            years = [year for year in doc.keys() if year.isdigit()]
            if not years:
                continue

            financial_data = []
            for year in years:
                data_year = str(year)
                data = doc.get(data_year, {})
                totrev = data.get('TotRev')
                totexp = data.get('TotExp')
                totast = data.get('TotAst')
                totlia = data.get('TotLia')

                if all(v is not None for v in [totrev, totexp, totast, totlia]):
                    financial_data.append({
                        'Year': int(data_year),
                        'TotRev': totrev,
                        'TotExp': totexp,
                        'TotAst': totast,
                        'TotLia': totlia
                    })

            if financial_data:
                financial_data = sorted(financial_data, key=lambda x: x['Year'])

                nonprofit_data[ein] = {
                    'EIN': ein,
                    'NTEE': ntee,
                    'State': state,
                    'Name': name,
                    'MajGrp': majgrp,
                    'FinancialData': financial_data
                }
        except Exception as e:
            print(f"Error processing document {doc.get('_id')}: {e}")

    print(f"Total nonprofits collected for MajGrp '{majgrp_letter}': {len(nonprofit_data)}")

    if not nonprofit_data:
        continue 

    records = []
    for ein, info in nonprofit_data.items():
        financial_df = pd.DataFrame(info['FinancialData'])

        features = {}

        for var in ['TotRev', 'TotExp', 'TotAst', 'TotLia']:
            features[f'{var}_mean'] = financial_df[var].mean()
            features[f'{var}_std'] = financial_df[var].std()
            features[f'{var}_min'] = financial_df[var].min()
            features[f'{var}_max'] = financial_df[var].max()

            if len(financial_df) > 1:
                y_values = financial_df[var].values
                slope = np.polyfit(financial_df['Year'], y_values, 1)[0]
                features[f'{var}_slope'] = slope
            else:
                features[f'{var}_slope'] = 0  

        features.update({
            'EIN': ein,
            'NTEE': info['NTEE'],
            'State': info['State'],
            'Name': info['Name'],
            'MajGrp': info['MajGrp']
        })

        most_recent_year_data = info['FinancialData'][-1]
        features['MostRecentYear'] = most_recent_year_data['Year']
        features['TotRev_MostRecent'] = most_recent_year_data['TotRev']
        features['TotExp_MostRecent'] = most_recent_year_data['TotExp']
        features['TotAst_MostRecent'] = most_recent_year_data['TotAst']
        features['TotLia_MostRecent'] = most_recent_year_data['TotLia']

        records.append(features)

    df = pd.DataFrame(records)
    print(f"Total nonprofits prepared for modeling for MajGrp '{majgrp_letter}': {len(df)}")

    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.dropna(inplace=True)
    print(f"Data after cleaning for MajGrp '{majgrp_letter}': {len(df)} nonprofits")

    if df.empty:
        continue  

    feature_cols = [col for col in df.columns if col.startswith(('TotRev_', 'TotExp_', 'TotAst_', 'TotLia_')) and '_MostRecent' not in col]

    X = df[feature_cols].values

    pt = PowerTransformer(method='yeo-johnson', standardize=False)
    X_transformed = pt.fit_transform(X)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_transformed)

    iso_forest = IsolationForest(random_state=42, contamination='auto')
    iso_forest.fit(X_scaled)

    anomaly_scores = iso_forest.decision_function(X_scaled)
    anomaly_labels = iso_forest.predict(X_scaled)

    df['AnomalyScore'] = anomaly_scores
    df['AnomalyLabel'] = anomaly_labels
    df['Anomaly'] = df['AnomalyLabel'].map({1: 'Normal', -1: 'Anomaly'})

    anomalies_df = df[df['AnomalyLabel'] == -1]
    print(f"Anomalies detected in MajGrp '{majgrp_letter}': {len(anomalies_df)} out of {len(df)} nonprofits.")

    data_to_insert = df[['EIN', 'NTEE', 'State', 'Name', 'MajGrp', 'MostRecentYear',
                         'TotRev_MostRecent', 'TotExp_MostRecent', 'TotAst_MostRecent', 'TotLia_MostRecent',
                         'AnomalyScore', 'AnomalyLabel']].to_dict('records')

    all_data_to_insert.extend(data_to_insert)

anomaly_collection.delete_many({})

if all_data_to_insert:
    anomaly_collection.insert_many(all_data_to_insert)
    print(f"Anomaly data successfully inserted into 'anomaly' collection. Total records: {len(all_data_to_insert)}")
else:
    print("No data to insert into 'anomaly' collection.")

client.close()
