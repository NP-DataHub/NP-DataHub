# NP-DataHub
Data Visualization/ML Platform that Assesses 
Nonprofits and Sector-Based Ecosystems

OVERVIEW

Even though there are databases that cater to donors and monitor baseline financial activity for nonprofits based on documents, there is no one resource that allows the end-user to visualize fiscal performance and examine longitudinal data for each nonprofit and an entire non-profit sector, of which there are 26 as defined by the IRS. There also isn’t a sector-based platform that can produce prescriptive and predictive forecasting through algorithmic construction and other ML/AI capabilities.

Based on public IRS data, culled over eight years, we will build a platform allowing the end-user to visualize non-profit fiscal performance to help inform grantmakers, donors, and public policymakers make more accurate and efficient decisions. Essentially, this platform will be similar to the Bloomberg terminal but for nonprofits. This will be accomplished by combining public data solutions and including predictive insights and potential AI functionality. Algorithms are already created and will eventually be integrated.

Often, people search for one charity or non-profit. We want to map the ecosystems by sectors (NTEE codes - sector – and subcodes - purpose) and geography or regions while mapping the connectivity to enhance fiscal strategy. Full list below.

There are 10 major groups, 26 groups (easiest to search), and 645 common subcodes. We want to organize first by these codes, then geography. It’s how people search. Then, we can apply the visualizations and algorithms for next level analysis.

For an overview of the IRS bulk data listing, terms, and how-tos, here’s the link.
For the data from 2017-2024, click here. (xml format)
Here’s a ProPublica API tool for some guidance here if we’re creating.
Or, here’s Charity API to pump in – everything. Recommended.

MINIMUM THREE-PERSON TEAM

Scrum team should include a UI developer, UX developer, and database expert (ideally MongoDB or MySQL). React proficiency or expertise is required along with AWS credentialing. 
PROJECT TIMELINE

The project is designed to be three-month explorations and production can be remote. Virtual project meetings (no more than 45 minutes) will occur once a week with a defined agenda and three key deliverable checkpoints:

Key Date Benchmarks

May 28: Exploration begins
June 17: Functionality V1, troubleshooting, key findings, pivot, and new features
July 15: Functionality V2, troubleshooting, key findings, pivot, and new features, Q/A
August 12: Decision to publish (open source) or commercialize (launch with revenue features)

PROJECT CALENDAR (week of beginning)

PHASE ONE: BASIC DATA 
(Data Exploration | Cleaning, Wrangling)

May 28: Understanding data variables (200), the sectors (26) and subcodes (645).
June 3: Integrating the functionality for the user-interface.
June 10: Design and create a page for 1) a single nonprofit, 2) one state-based sector NTEE, and 3) NTEE subsectors, while also creating lists based on search of certain variables. Test could be easiest on four basic fiscal variables (revenues, expenses, assets, and liabilities). In total, seven pages will be created to test, assess, and deploy for duplication. 

PHASE TWO: ECOSYSTEMS 
(Data Visualization | Navigation)

June 17: Conceptualize and begin building a data dashboard for 1) a single nonprofit; 2) one state-based sector NTEE; and 3) NTEE subsector. 
June 24: Build and test data dashboard for all three views (single NP, one NTEE, one NTEE subsector).
July 1: Finalize data dashboard design and functionality and test, test, test. Begin conceptualizing duplication functionality for full ecosystem - either state or complete database.  
July 8: Project reset: 1) Understand algorithm insights for pre-built scripts; 2) Create work plan to integrate algorithms with project build; 3) Conceptualize Generative AI tools to incorporate into concept. 

PHASE THREE: ALGORITHMIC INSIGHTS 
(Algorithmic Integration)

July 15: Begin integration of algorithms into the platform on all three views (single NP, one NTEE, one NTEE subsector).
July 22: Continue to test integration of algorithms, platform, and test/training data.
July 29: Finalize functionality, integration, and begin late-stage testing on the entire platform.
August 5: Assess platform viability for commercial or open-source use.
August 12: Deployment

EXTENDED OVERVIEW

In short, the tentatively named NP DataHub is a cloud-based data intelligence platform for philanthropies and nonprofits that offers algorithmic-based insights for more strategic community investment. 

Often, nonprofits have little direction in collaborating with other organizations with similar missions based on a data-specific composition and geography. Grant-making foundations have a similar problem. Both also have few pathways to combine resources through donor engagement to holistically fund or approach a societal problem, of which public data addressing these problems is more readily and publicly accessible. Instead, these processes are piece-mealed. The objective is to create a platform that links pathways and explains the findings while building on the basic historical data that can be found on other non-profit document aggregation websites like Guidestar (Candid) and Charity Navigator. 

The intention is to create the platform and continuously build machine-learning capabilities based on the IRS database for 330,000 major nonprofits and philanthropies across the United States (API key above gets us to 1.7 million). This includes data since 2017 and more than 200 essential data fields. During the summer of 2022, the project client outlined machine-learning algorithmic tools that will offer more data-specific insight to the end-user. Data is often one year behind the fiscal year of any reporting nonprofit as the IRS offers a generous window for filing. This means that it’s essential to match public data within these years for accuracy.
Potential markets for the application include existing community/family foundations or nonprofits. In early customer- and user-discovery discussions, the platform can be strategically used by philanthropic organizations looking to connect donors or government entities which oversee budgetary decisions with desired areas of interest, and in the process, can allocate or pool resources more strategically and efficiently. Further, it allows the gathering and analysis of public data to solve problems tied to individual nonprofit missions or that of an entire nonprofit sector.
As for the total potential market, according to the Office of the New York State Comptroller, in 2017, there were more than 300,000 nonprofit organizations nationwide, an increase of nearly 29 percent from 2007. Further, New York had the second largest number of nonprofit establishments in the nation — more than 33,700. These accounted for 5.4 percent of all private sector establishments in the state and 11.3 percent of all nonprofits nationwide. This increase of more than 5,400 organizations from more than a decade ago represents growth of 19.3 percent. Given the current fiscal climate, sector contraction is possible, which may still open opportunities for collaboration. It should be noted that the lag in fuller reporting has been caused by the pandemic so a decision has been made to let the data lead in understanding the size of each NTEE sector. This means the platform can only produce results based on the readily available data.
Since this phase is very much exploratory and the first step in creating a holistic solution, the following short- and long-term objectives have been set for the developers:
SHORT-TERM OBJECTIVES
Identify one of 26 NTEE sectors within New York State, which will serve as a testing sample for algorithmic construction, platform development, and data visualization implementation. Then apply this to all NTEE codes across all states.
Establish the preliminary database foundation for the NTEE sample and associated functionality to be implemented within the V1.0 platform.
Establish the V1.0 platform with associated end-user functionality for data visualization/dashboard construction and algorithmic results.
Incorporate future NTEE sectors within the framework established by the first team of developers with a goal of including all 26 by end of summer 2024.
Begin testing phase on selected fiscal variables of individual nonprofits and associated NTEE codes and define their purpose. (What story are we trying to tell through data that will serve the public interest based on fiscal performance?) Developers can establish the quantity of algorithms with a focus on quality. 
Begin testing phase on selected fiscal variables of individual nonprofits and associated NTEE codes and define their purpose and alignment with the chosen public dataset. (What story are we trying to tell through data that will serve the public interest?) Developers can establish the quantity of algorithms with a focus on quality. This is TBD.
Finalize algorithms with an emphasis on accuracy and precision.
Incorporate findings within the chosen open-source data visualization libraries.
Construct data visualization dashboard.
 Launch V1.0 of the platform for user testing and presentation.  
LONG-TERM OBJECTIVES
Incorporate other public datasets that align with each NTEE sector within New York State after summer 2024.
Identify public database sources that align with the chosen NTEE sector to be included in advanced algorithmic construction. (Basically, what are we trying to tell the end-user or why are these results important?)
Continue the creation of algorithms that offer public-interest solutions. 
Strengthen existing algorithms through tuning, dimensionality reduction, and/or more longitudinal data.

Process Requirements

The desired deployment focuses on the development of a web-based browser application. The most universal programming solution appears to be the most intuitive and appropriate for this project and given the data-base structure and emphasis on data intelligence gathering, this is important for current and future developments as expected iterations of this language must be compatible for upgrade purposes. The project client defers to the developers to establish this framework. 

Data Source

As noted above and given this stage of the project, any open source option can be used as the focus will be more on the sample of IRS data within a certain NTEE sector in New York State, and not the full data population. As of now, based on preliminary discussions with the developers, a streamlined MongoDB or MySQL solution is more than welcomed. Since these solutions are open source and widely accepted, there is an emphasis on making strategic decisions as future developers and iterations must understand the building blocks, so to speak, for this platform. Currently, the data-wrangling aspect of the project is completed, meaning the developers can focus on algorithmic, platform, and data visualization construction, of which the last takes priority. 

POTENTIAL LIBRARIES

Beyond the chosen database structure, the following tools have been identified as a first step. There are plenty of other options as the desire of the project client is for developers to take on a degree of project ownership. (Please see Endnote below.)

https://www.tensorflow.org/
https://plotly.com/graphing-libraries/
H20: Python to AI (there’s an open-source solution in there/case studies)

LIMITATIONS

The primary challenge is more so aesthetic as data visualization solutions often reproduce in a cumbersome fashion on some browsers. A second limitation is also identifying a Javascript-based or other UI that will offer the strongest results while also reproducing in a mobile format. Some options have been identified, but an open discussion is very much welcomed. The last limitation may be the identification of reputable data sources to connect data gathered on certain issues that can connect to the NTEE sector for algorithmic construction and insight. Before this step is taken, a larger discussion is needed about the connectivity of the public data set, the availability of data, and how this may connect to the fiscal performance data of individual nonprofits and their NTEE sector. 

ENDNOTE

The data wrangling/cleaning and methodology construction has been a two-year process, therefore, the focus of this step in the project should be on platform construction and strong choices in database structure, data visualization selection and implementation, and algorithmic construction and implementation. 

As noted above, the desire of the client is for the team of developers to take ownership of this project as this is very much an iterative process with long-term objectives. Although 10 weeks is not a long time for a project of this scope, the first step is perhaps the most crucial and should mirror the ambition of the first team of developers. 

The 10 short-term objectives were set by the project client to potentially align with the 10 weeks remaining for this project. Before finalizing, developers should assess and offer solutions if objectives do not align or prove too laborious. However, given past project management situations and the expectations shared and established in preliminary meetings with the developers, this approach seems to be fairly manageable given that the scope will focus on one NTEE sector within New York State. 

Other Context/Guidance

1. Nonprofit Dynamic Algorithms: (link here for suggested algorithms or ideas)
2. Sector Health Snapshot (this link may give you ideas of how you can create a framework for NTEE sector health indicators.) For example, there are six tabs representing six different NTEE sectors of the 26 that were explored last summer on another research project. These are just for Upstate New York. There are some easy benchmarks like average/median level for a NP in let’s say the Food NTEE sector. I offer a one-year and five-year snapshot for each. How to read this? Maybe to line 41 (as an example) on the Food NTEE (EDA – exploratory data analysis). Since there are 89 Food-specific nonprofits in Upstate New York, only 17 of 89 have no liabilities for 19.10%. Or line 32. Which percentage of Upstate New York food-specific nonprofits receive government grants of more than $1 million? The answer is 8.99 percent or 8/89). If you’re feeling ambitious, maybe this can be an autofill, most commonly asked questions for a sector. I’ve given you more than 30+ options here, but it could be a nice feature.

