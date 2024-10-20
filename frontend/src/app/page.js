"use client"
import Navbar from "./components/Navbar";
import { HiOutlineMail } from "react-icons/hi";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router

const features = [
  {
    title: "FOUNDATIONS",
    imgSrc: "/img/icons/philanthropies.png",
    description: "Assess the financial health of nonprofits to maximize ROI while directing funds and grants to those that need the infusion the most to make a difference."
  },
  {
    title: "NONPROFITS",
    imgSrc: "/img/icons/nonprofits.png",
    description: "Gain valuable insights to strengthen financial standing and find collaborators within and across different sectors."
  },
  {
    title: "DONORS",
    imgSrc: "/img/icons/donors.png",
    description: "Find pathways for strategic investments and ROI strategies for you, your company, or your client."
  },
  {
    title: "GOVERNMENT",
    imgSrc: "/img/icons/government.png",
    description: "Foster relationships with mission-driven foundations and nonprofits looking to partner with local, state, and federal agencies."
  },
  {
    title: "FISCAL HEALTH",
    imgSrc: "/img/icons/fiscal_health.png",
    description: "Assess a nonprofit’s fiscal health based on a weighted score of various data variables. Compare the scores side-by-side with other nonprofits."
  },
  {
    title: "REGIONAL HEALTH",
    imgSrc: "/img/icons/regional_health.png",
    description: "Compare NTEE code sectors against public data that align with the mission of various regional nonprofits."
  },
  {
    title: "CO:LAB",
    imgSrc: "/img/icons/collaborate.png",
    description: "Search and find nonprofits from other sectors in your backyard that may be strong partners."
  },
  {
    title: "NEWSFEED",
    imgSrc: "/img/icons/newsfeed.png",
    description: "A tool to understanding larger scale problems and connecting to regional nonprofits via social media and search engines."
  }
];
export default function Home() {
  const router = useRouter();
  return (
    <div className="overflow-auto h-screen">
      <Navbar/>
      <section className="flex flex-col lg:flex-row justify-between items-center min-h-screen bg-cover bg-center bg-[url('/img/gradient_back_one.png')] px-6 lg:px-12 py-40">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl lg:text-6xl font-bold text-gray-900 font-serif ">
            Creating nonprofit ecosystems through data.
          </h1>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-1 gap-4 max-w-md mx-auto lg:mx-0">
            <button
                className="text-lg px-6 py-4 bg-white text-gray-900 rounded-full shadow-md hover:bg-gray-200 transitionntransition-duration-300"
                onClick={() => router.push('/dashboard')}
              >
                Explore Data
            </button>
            <button className="text-lg px-6 py-4 bg-white text-gray-900 rounded-full shadow-md hover:bg-gray-200 transition transition-duration-300">
              Explore Premium Tools
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center mt-8 lg:mt-[-12]">
          <img draggable = {false} src="/img/node_edge_final.png" alt="Network Visualization" className="w-5/6 h-5/6 max-w-full max-h-full" />
        </div>
      </section>
      <section className=" bg-[#171821]  text-white px-6 md:px-12 font-serif py-12">
        <div className="flex flex-col justify-start items-center text-center py-10 ">
          <h2 className="text-2xl md:text-5xl mb-4 md:mb-6">Insights for Impact</h2>
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="w-24 md:w-72 rounded-full h-1 bg-white"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="flex flex-col items-center text-center">
            <img draggable = {false} src="/img/four_bar_final.png" alt="Graph and Magnifying Glass" className="w-96" />
          </div>
          <div className="flex flex-col justify-center text-left text-lg md:text-2xl mt-6 font-serif">
            <div className="mb-6 md:mb-10">
              <p className="mb-6 md:mb-8">
                Nonprofitly is a cloud-based data intelligence platform for philanthropies and nonprofits that offers algorithmic-based insights for more strategic community investment.
              </p>
              <p>
                Even though there are databases that cater to donors and monitor baseline financial activity for nonprofits based on documents, there is no one resource that allows the end-user to visualize fiscal performance and examine longitudinal data for each nonprofit and an entire nonprofit sector - until now.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className=" bg-[#171821]  text-white px-6 md:px-12 font-serif py-10">
        <div className="flex flex-col justify-start text-center">
          <h2 className="text-2xl md:text-5xl mb-4 md:mb-6">Connecting billions of data points</h2>
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="w-24 md:w-4/12 rounded-full h-1 bg-white"></div>
          </div>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mx-auto mt-12">
          <div className="flex flex-col items-center text-center">
            <img draggable = {false} src="/img/graph_final.png" alt="Image 1" className="w-1/3 max-w-full mx-auto" />
            <h3 className="text-2xl md:text-4xl mt-4">1.7 million</h3>
            <p className="text-lg md:text-xl mt-2 font-sans">Number of U.S. nonprofits</p>
          </div>
          <div className="flex flex-col items-center text-center mt-8 sm:mt-0">
            <img draggable = {false} src="/img/stack_final.png" alt="Image 2" className="w-1/3 max-w-full mx-auto" />
            <h3 className="text-2xl md:text-4xl mt-4">3</h3>
            <p className="text-lg md:text-xl mt-2 font-sans">Data visualization platforms offered</p>
          </div>
          <div className="flex flex-col items-center text-center  mt-8 sm:mt-0 pb-24 sm:pb-0">
            <img draggable = {false} src="/img/dash_final.png" alt="Image 3" className="w-1/3 max-w-full mx-auto" />
            <h3 className="text-2xl md:text-4xl mt-4">100+</h3>
            <p className="text-lg md:text-xl mt-2 font-sans">Algorithmic insights for key financial nonprofits variables</p>
          </div>
        </div> */}
      </section>
      {/* <section className="min-h-screen bg-white text-gray-900 px-6 md:px-12 py-20 lg:py-40 font-serif sm:py-40">
        <div className="flex flex-col justify-start text-center">
          <h2 className="text-2xl md:text-5xl mb-4 md:mb-6">The NP Data Hub Team</h2>
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="w-24 md:w-96 rounded-full h-1 bg-gray-900"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 gap-y-8 md:gap-4 md:gap-y-10 mx-auto mt-12">
          <div className="flex flex-col items-center text-center">
            <a href="https://www.linkedin.com/in/brettorzechowski/" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/profo.png" alt="Image 1" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile " />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">Brett Orzechowski</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://www.linkedin.com/in/troy-schipf-75388624a/" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/troy.png" alt="Image 2" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">Troy Schipf</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://www.linkedin.com/in/thomasorifici/" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/thomas.jpg" alt="Image 3" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">Thomas Orifici</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://www.linkedin.com/in/macallan-ringstad-404298251/" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/macallan.jpeg" alt="Image 4" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">Macallan Ringstad</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://en.wikipedia.org/wiki/John_Smith_(explorer)" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/youssef.JPG" alt="Image 5" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">    Hassan</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://en.wikipedia.org/wiki/John_Smith_(explorer)" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/emmet.jpg" alt="Image 6" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">Emmet Whitehead</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://www.linkedin.com/in/kaichen543/" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/john_smith.jpg" alt="Image 7" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">Kai Chen</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://www.linkedin.com/in/yothamsage" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/yotham.jpg" alt="Image 8" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">Yotham Sage</h3>
          </div>
        </div>
      </section>    */}


                <div className="flex justify-center bg-[#171821] text-white px-6 md:px-12 font-serif pb-20 ">
                  <div className="max-w-10xl px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-36">
                      {/* Dynamically generate flip cards for each feature */}
                      {features.map((feature, index) => (
                        <div key={index} className="flip-card"  style={{ userSelect: 'none' }}>
                          <div className="flip-card-inner rounded-lg">
                            <div className="flip-card-front rounded-lg flex items-center justify-center flex-col primary-color p-4">
                              <img src={feature.imgSrc} alt={feature.title} className="w-20 md:w-20 lg:w-14 mb-4" draggable = "false" />
                              <h3 className="text-lg font-medium">{feature.title}</h3>
                            </div>
                            <div className="flip-card-back rounded-lg flex items-center justify-center text-lg primary-color font-medium">
                              <p>{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
      <section className="flex flex-col lg:flex-row justify-between items-center min-h-screen bg-cover bg-center bg-[url('/img/gradient_two.png')] px-6 lg:px-12  py-40">
        <div className="flex-grow text-center lg:text-left">
          <h1 className="text-3xl lg:text-6xl font-bold text-gray-900 font-serif">
            Ready to collaborate?
          </h1>
          <p className="text-lg md:text-2xl mt-2 font-sans">Try our platform today.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-1 gap-4 max-w-md mx-auto lg:mx-0">
            <button className="text-lg px-6 py-4 bg-white text-gray-900 rounded-full shadow-md hover:bg-gray-200 transition">
              Explore Data
            </button>
            <button className="col-span-1  text-lg px-6 py-4 bg-white text-gray-900 rounded-full shadow-md hover:bg-gray-200 transition">
              Explore Premium Tools
            </button>
          </div>
          <div className="flex justify-center md:justify-start items-center mt-8 lg:mt-0 pt-12 md:px-10">
          <img draggable = {false} src="/img/node_edge_final.png" alt="Network Visualization" className="w-80 " />
        </div>
        </div>
        <div className="flex-grow mt-8 lg:mt-0 text-center lg:text-left lg:px-40">
          <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 font-serif">
            Contact Us
          </h3>
          <div className="flex flex-col items-center lg:flex-row lg:items-start lg:space-x-2 mt-2">
            <div className="text-2xl md:text-4xl mt-2">
              <HiOutlineMail />
            </div>
            <p className="text-sm md:text-2xl mt-2 font-sans">recs@nonprofitly.co</p>
          </div>
          {/* <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 font-serif mt-10">
            Social
          </h3>
          <div className="flex justify-center lg:justify-start gap-2 mt-2">
            <FaFacebook className="text-2xl md:text-4xl text-gray-900" />
            <FaTwitter className="text-2xl md:text-4xl text-gray-900" />
            <FaInstagramSquare className="text-2xl md:text-4xl text-gray-900" />
          </div> */}
        </div>
      </section>
    </div>
  );
}
