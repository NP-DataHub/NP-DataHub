    "use client";
    import Navbar from "../components/Navbar";
    import Footer from '../components/footer';

    const faqs = [
    {
        question: "FISCAL YEARS",
        answer: "Alignment is critical for nonprofits and that is why Nonprofitly uses the end of the fiscal year for baseline data analysis, especially across four key variables -- revenues, expenses, assets, and liabilities. Since some nonprofits end their fiscal year on June 30 and others on Dec. 31, a decision was made to use the end date across all insights. On the occasion an IRS document is filed for an extension or an amended 990, Nonprofitly uses the most recent document for data purposes."
    },
    {
        question: "TOOL RECOMMENDATIONS",
        answer: "In what we hope will become our most important engagement method, anyone with a pro subscription can recommend new tool development by finding the button on the left-hand rail. There, simply click the button and a small prompt will appear. Please provide your name, organization, email address, and a brief description of the digital tool, purpose, and which problem it may solve. If the team believes there is value, we will reach out for a conversation. We understand that organizations may not have the technical digital development expertise and the cost associated with development may not figure into your budget, so we encourage you to throw ideas into the universe. If it will help you, your constituents, and your community, it will help others."
    },
    {
        question: "WHAT ARE NTEE CODES?",
        answer: "The National Taxonomy of Exempt Entities (NTEE) code is a four digit code used to classify an exempt IRC 501(C)(3) organization (the selection by NTEE code is based upon the first three digits). The first digit is a letter listed in the table below which defines the general category. The second and third digits define the general type of organization within the category as listed on the table beginning on the next page. The fourth digit further divides the type of organization and is not presented here."
    },
    {
        question: "NTEE CHECK",
        answer: "Found near the Tool Recommendation button, you will also see an NTEE code button. If your NTEE code is incorrect for your organization or has changed (remember, they’re self-identified to the IRS), then click this button and a prompt will appear. Please provide your name, organization, email address, and a brief description of the correct or new NTEE code. The team will reach out for a conversation and ask for IRS documentation. This variable is essential in most of our tool development, so we strive for accuracy."
    },
    {
        question: "SUBSCRIPTION",
        answer: "Even though the platform is designed around public, nonprofit data, a nominal subscription model for pro tools has been adopted to cover the cost of digital research and development, technological enhancements, and simply to maintain a quality experience for all nonprofits, philanthropies, and governments. Some platforms incorporate a free model or charge for API access, while others opt for a much higher-end premium version. The team at Nonprofitly believes that more informed decisions can be made when all stakeholders are reviewing the same insights, so we'll meet you in the middle, hoping that organizations large and small believe in the value of an affordable subscription."
    },
    {
        question: "ORGANIZATIONS IN DATABASE",
        answer: "The data used in the Nonprofitly platform is extracted directly from the IRS portal, and includes tax-exempt organizations in each of the 26 subsections of the 501(c) section of the tax code, and which have filed a Form 990, Form 990EZ or Form 990PF. The NTEE codes used are self-reporting and are categorized in each of these 26 subsections. Private foundations that are required to file a form 990PF are also included. Nonprofitly uses data from 2017 to the current day."
    }
    ];

    export default function FAQ() {
    return (
        <div className="overflow-auto h-screen">
        <Navbar />
        <section className="bg-[#171821] text-white px-6 md:px-12 font-serif py-12">
            <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold">Frequently Asked Questions</h1>
            <div className="flex justify-center mt-4">
                <div className="w-24 md:w-96 rounded-full h-1 bg-white"></div>
            </div>
            </div>
            
            <div className="max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
                <div key={index} className="mb-8">
                <h2 className="text-xl md:text-3xl font-bold mb-4">{faq.question}</h2>
                <p className="text-md md:text-lg">{faq.answer}</p>
                </div>
            ))}
            </div>
        </section>
        <Footer />
        </div>
    );
    }
