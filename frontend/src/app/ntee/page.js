    "use client";
    import Navbar from "../components/Navbar";
    import Footer from '../components/dashboard_footer';

    const ntees = [
    {
        question: "THE IMPORTANCE OF NTEE CODES",
        answer: "From a geographical and policy perspective, National Taxonomy of Exempt Entities (NTEE) Codes are essential for mapping the distribution of nonprofit activities across regions. They enable researchers and policymakers to identify service gaps, allocate resources efficiently, and develop strategies to address community needs. \n\nFor instance, by analyzing the prevalence of specific codes within a region, stakeholders can determine whether certain areas are underserved in critical sectors like healthcare, education, or housing. As a result, NTEE Codes not only help individual organizations thrive but also contribute to more effective planning and development within communities. \n\nThis is why most of Nonprofitly's data-driven insights focus on the activity of nonprofit ecosystems in your backyard."
    },
    {
        question: "WHAT ARE NTEE CODES?",
        answer: "By definition, NTEE Codes are a classification system developed by the National Center for Charitable Statistics (NCCS) to categorize nonprofit organizations in the United States based on their missions, activities, and programs. The system consists of 26 major groups, divided into 10 broad categories, such as Arts, Education, Health, and Human Services, with additional subcategories for more granular classification.\n\nHowever, they serve a great purpose for multiple stakeholders. These codes are widely used by the IRS, researchers, grantmakers, and policymakers to analyze and compare nonprofit organizations across different sectors and geographic areas. They provide a standardized framework that helps stakeholders understand the focus and scope of nonprofits' work. For nonprofit organizations, NTEE Codes are particularly important because they help define their identity and mission within the broader nonprofit sector. By assigning a specific code, nonprofits can effectively communicate their purpose to funders, regulators, and the public. These codes also play a crucial role in grant application processes, as many funding agencies use them to assess eligibility and allocate resources to specific causes or needs.\n\nAdditionally, NTEE Codes facilitate benchmarking and performance evaluation by allowing nonprofits to compare themselves with others in the same category. The insights you will find here driven by strong visual design and algorithmic construction are built based on this thinking."
    },
    {
        question: "THERE ARE CAVEATS",
        answer: "Nonprofit data, while valuable for understanding the sector, must be viewed as a guide rather than an absolute answer due to its inherent limitations.\n\nMuch of this data is self-reported by organizations, leading to variability in accuracy and completeness. Factors such as inconsistent reporting practices, outdated information, or errors in classification can result in a margin of error. For instance, a nonprofit might misclassify its mission or activities when submitting filings to the IRS, potentially skewing analyses based on these data. Consequently, researchers, policymakers, and funders should approach nonprofit data critically, using it to identify trends and inform decisions rather than drawing definitive conclusions.\n\nNTEE Codes exemplify how nonprofit data can provide valuable insights while reflecting these limitations. These codes classify nonprofits by their missions and activities, offering a standardized framework for analysis. However, because the codes rely on self-reported information, misclassifications or omissions can lead to incomplete or misleading pictures of the sector. Despite these challenges, NTEE Codes remain indispensable tools for guiding resource allocation, fostering collaboration, and addressing community needs effectively."
    }
    ];

    export default function NTEE() {
    return (
        <div className="overflow-auto h-screen">
        <Navbar />
        <section className="bg-[#171821] text-white px-6 md:px-12 font-serif py-12">
            <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold">NTEE CODES</h1>
            <div className="flex justify-center mt-4">
                <div className="w-24 md:w-96 rounded-full h-1 bg-white"></div>
            </div>
            </div>
            
            <div className="max-w-6xl mx-auto">
            {ntees.map((ntee, index) => (
                <div key={index} className="mb-8">
                <h2 className="text-xl md:text-3xl font-bold mb-4">{ntee.question}</h2>
                <p className="text-md md:text-lg">
                    {ntee.answer.split('\n').map((line, i) => (
                    <span key={i}>
                        {line}
                        <br />
                    </span>
                    ))}
                </p>
                </div>
            ))}
            </div>

        </section>
        <Footer />
        </div>
    );
    }
