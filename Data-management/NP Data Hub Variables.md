### Note

Each row in each table below represents a column in each table in our database. Each variable represents either general information about the non-profit or financial information. Additionally, this document shows the equivalent XML fields found in the IRS database as well as the ProPublica fields equivalent to the variable.

### Table 1: Master

| Description                              | Variable name in XML files                                                              | Variable names in API for easy search |
| ---------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------- |
| Employer Identification Number           | Filer/EIN                                                                               | ein                                   |
| Tax period                               | TaxYr                                                                                   | tax_prd_yr                            |
| Name of organization                     | Filer/BusinessName/ BusinessNameLine1Txt                                                | name                                  |
| State                                    | Filer/USAddress/StateAbbreviationCd Or if no us address: Filer/ForeignAddress/CountryCd | state                                 |
| City                                     | Filer/USAddress/CityNm or if no us address : Filer/ForeignAddress/CityNm                | city                                  |
| Zip code                                 | Filer/USAddress/ZIPCd or if no us address : Filer/ForeignAddress/ForeignPostalCd        | zipcode                               |
| Ntee code                                | N/a                                                                                     | ntee_code                             |
| Major group                              | N/a                                                                                     | ntee_code[0]                          |
| Total Revenue                            | CYTotalRevenueAmt OR TotalRevenueGrp/TotalRevenueColumnAmt                              | totrevenue                            |
| Total Assets                             | TotalAssetsEOYAmt OR TotalAssetsGrp/EOYAmt                                              | totassetsend                          |
| Total Liabilities                        | TotalLiabilitiesEOYAmt OR TotalLiabilitiesGrp/EOYAmt                                    | totliabend                            |
| Total Functional Expenses                | TotalFunctionalExpensesGrp/TotalAmt OR CYTotalExpensesAmt                               | totfuncexpns                          |
| Total Contributions                      | TotalContributionsAmt                                                                   | totcntrbgfts                          |
| Program Service Revenue                  | TotalProgramServiceRevenueAmt OR CYProgramServiceRevenueAmt                             | totprgmrevnue                         |
| Investment Income                        | CYInvestmentIncomeAmt OR InvestmentIncomeGrp/TotalRevenueColumnAmt                      | invstmntinc                           |
| Gross Receipts                           | GrossReceiptsAmt                                                                        | grsrcptspublicuse                     |
| Fundraising Income                       | NetIncmFromFundraisingEvtGrp/TotalRevenueColumnAmt                                      | netincfndrsng                         |
| Fundraising Expenses                     | FundraisingDirectExpensesAmt                                                            | lessdirfndrsng                        |
| Compensation of current officers         | CompCurrentOfcrDirectorsGrp/TotalAmt                                                    | compnsatncurrofcr                     |
| Other salaries and wages                 | OtherSalariesAndWagesGrp/TotalAmt                                                       | othrsalwages                          |
| Payroll Taxes                            | PayrollTaxesGrp/TotalAmt                                                                | payrolltx                             |
| Gift Grants Membership Fees recieved 509 | GiftsGrantsContrisRcvd509Grp/TotalAmt                                                   | totgftgrntrcvd509                     |
| Number of employee                       | TotalEmployeeCnt                                                                        | N/a                                   |

### Table 2: EZ

| Description                              | Variable name in XML files                                                              | Variable names in API for easy search |
| ---------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------- |
| Employer Identification Number           | Filer/EIN                                                                               | ein                                   |
| Tax period                               | TaxYr                                                                                   | tax_prd_yr                            |
| Name of organization                     | Filer/BusinessName/ BusinessNameLine1Txt                                                | name                                  |
| State                                    | Filer/USAddress/StateAbbreviationCd Or if no us address: Filer/ForeignAddress/CountryCd | state                                 |
| City                                     | Filer/USAddress/CityNm or if no us address : Filer/ForeignAddress/CityNm                | city                                  |
| Zip code                                 | Filer/USAddress/ZIPCd or if no us address : Filer/ForeignAddress/ForeignPostalCd        | zipcode                               |
| Ntee code                                | N/a                                                                                     | ntee_code                             |
| Major group                              | N/a                                                                                     | ntee_code[0]                          |
| Total Revenue                            | TotalRevenueAmt                                                                         | totrevnue                             |
| Total Assets                             | Form990TotalAssetsGrp/EOYAmt                                                            | totassetsend                          |
| Total Liabilities                        | SumOfTotalLiabilitiesGrp/EOYAmt                                                         | totliabend                            |
| Total Expenses                           | TotalExpensesAmt                                                                        | totexpns                              |
| Program Service Revenue                  | ProgramServiceRevenueAmt                                                                | prgmservrev                           |
| Investment Income                        | InvestmentIncomeAmt                                                                     | othrinvstinc                          |
| Gift Grants Membership Fees recieved 509 | GiftsGrantsContrisRcvd509Grp/TotalAmt                                                   | totgftgrntrcvd509                     |

### Table 3: PF

| Description                                        | Variable name in XML files                                                              | Variable names in API for easy search |
| -------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------- |
| Employer Identification Number                     | Filer/EIN                                                                               | ein                                   |
| Tax period                                         | TaxYr                                                                                   | tax_prd_yr                            |
| Name of organization                               | Filer/BusinessName/ BusinessNameLine1Txt                                                | name                                  |
| State                                              | Filer/USAddress/StateAbbreviationCd Or if no us address: Filer/ForeignAddress/CountryCd | state                                 |
| City                                               | Filer/USAddress/CityNm or if no us address : Filer/ForeignAddress/CityNm                | city                                  |
| Zip code                                           | Filer/USAddress/ZIPCd or if no us address : Filer/ForeignAddress/ForeignPostalCd        | zipcode                               |
| Ntee code                                          | N/a                                                                                     | ntee_code                             |
| Major group                                        | N/a                                                                                     | ntee_code[0]                          |
| Total Revenue                                      | TotalRevAndExpnssAmt                                                                    | totrcptperbks                         |
| Total Expenses                                     | TotalExpensesRevAndExpnssAmt                                                            | totexpnspbks                          |
| Total Assets                                       | TotalAssetsEOYAmt                                                                       | totassetsend                          |
| Total Liabilities                                  | TotalLiabilitiesEOYAmt                                                                  | totliabend                            |
| Net Income (Less Deficit)                          | ExcessRevenueOverExpensesAmt                                                            | excessrcpts                           |
| Contributions Received                             | ContriRcvdRevAndExpnssAmt                                                               | grscontrgifts                         |
| Interest Revenue                                   | InterestOnSavNetInvstIncmAmt                                                            | intrstrvnue                           |
| Dividends                                          | DividendsRevAndExpnssAmt                                                                | dividndsamt                           |
| Net Gain (Sales of Assets)                         | NetGainSaleAstRevAndExpnssAmt                                                           | totexcapgn                            |
| Other Income                                       | OtherIncomeRevAndExpnssAmt                                                              | otherincamt                           |
| Compensation of Officers                           | CompOfcrDirTrstRevAndExpnssAmt                                                          | compofficers                          |
| Total Fund net worth -EOY                          | TotNetAstOrFundBalancesEOYAmt                                                           | tfundnworth                           |
| Investments in US Gov Obligations (EOY Book Value) | USGovernmentObligationsEOYAmt or USGovtObligationsEOYFMVAmt                             | invstgovtoblig                        |
| Investments in Corporate Stock (EOY Book Value)    | CorporateStockEOYAmt                                                                    | invstcorpstk                          |
| Investments in Corporate Bonds (EOY Book Value)    | CorporateBondsEOYAmt                                                                    | invstcorpbnd                          |
| Cash (Non-Interest Bearing, EOY Book Value)        | CashEOYAmt                                                                              | othrcashamt                           |
| Adjusted net income                                | TotalAdjNetIncmAmt                                                                      | adjnetinc                             |
