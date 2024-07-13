import pandas as pd
def count_none_ntee_by_filing_req(file_path):
    filing_req_codes = [0, 1, 2, 3, 4, 5, 6, 7, 13, 14]
    
    counts = {code: 0 for code in filing_req_codes}
    pf_counts = {code: 0 for code in ["Public", "Private"]}
    total_rows = 0

    files = ['eo1.csv', 'eo2.csv', 'eo3.csv', 'eo4.csv']
    
    for file in files:
        df = pd.read_csv(file_path + file)
        total_rows += df.shape[0]
        
        for code in filing_req_codes:
            count = len(df[(df['FILING_REQ_CD'] == code) & (df['NTEE_CD'].isna())])
            counts[code] += count  # Accumulate the counts across files
        
        pf_counts["Public"] += len(df[(df['PF_FILING_REQ_CD'] == 0) & (df['NTEE_CD'].isna())])
        pf_counts["Private"] += len(df[(df['PF_FILING_REQ_CD'] == 1) & (df['NTEE_CD'].isna())])
    
    return counts, pf_counts, total_rows

if __name__ == "__main__":
    file_path = '/Users/mr.youssef/Desktop/'
    counts, pf_counts,total_rows = count_none_ntee_by_filing_req(file_path)
    total_percentage = 0
    for code, count in counts.items():
        total_percentage += 100*(count/total_rows)
        print(f'FILING_REQ_CD = {code}: {100 * (count / total_rows):.2f}% rows with NTEE_CD as None')
    print(f"Total percentage is {total_percentage:.2f}")
    print(f'Private: {100*(pf_counts["Private"]/total_rows):.2f}% rows with NTEE_CD as None')
