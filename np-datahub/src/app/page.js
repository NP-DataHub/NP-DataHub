import Navbar from "./components/Navbar";

export default function Home() {

  const features = [
    {
      title: "Number of U.S. Nonprofits",
      imgSrc: "/img/concierge_1250.png",
      description: "1.7 Million"
    },
    {
      title: "Radiology Report Analyzer",
      imgSrc: "/img/concierge_1250.png",
      description: "Velocity MIPS Reporter is powered by our patent pending Velocity AI engine. By continuously analyzing radiology reports, you receive real-time feedback of your MIPS scores throughout the year."
    },
    {
      title: "MIPS Consulting",
      imgSrc: "/img/concierge_1250.png",
      description: "We host regular MACRA optimization sessions during the year to help your practice stay on track and allow faster intervention to optimize providers’ quality and financial performance."
    },
  ];
  return (
    <div className="overflow-auto h-screen">
      <Navbar/>
      <section className="flex justify-between items-center h-screen bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 px-12">
        <div className="flex-1">
          <h1 className="text-6xl font-bold text-gray-900 font-serif">
            Creating nonprofit ecosystems through data.
          </h1>
          <div className="mt-8 grid grid-cols-2 font-sans gap-4 max-w-md">
            <button className="text-lg px-6 py-2 bg-white text-gray-900 rounded-full shadow-md hover:bg-gray-200 transition">
              Data
            </button>
            <button className="text-lg px-6 py-2 bg-white text-gray-900 rounded-full shadow-md hover:bg-gray-200 transition">
              Visualize
            </button>
            <button className="col-span-2 text-lg px-6 py-2 bg-white text-gray-900 rounded-full shadow-md hover:bg-gray-200 transition">
              Ecosystem Insights
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img src="/img/static_graph.png" alt="Network Visualization" className="w-5/6 h-5/6 max-w-full max-h-full" />
        </div>
      </section>
      <section className="min-h-screen bg-gray-900 text-white px-6 md:px-12 font-serif">
        <div className="flex flex-col justify-start items-center text-center py-40">
          <h2 className="text-2xl md:text-5xl mb-4 md:mb-6">Insights for Impact</h2>
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="w-48 md:w-56 rounded-full h-1 bg-white"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="flex flex-col justify-center items-center text-center">
            <img src="/img/magnifying-graph.png" alt="Graph and Magnifying Glass" className="max-w-xs lg:max-w-xs align-center items-center" />
          </div>
          <div className="flex flex-col justify-center text-left text-lg md:text-2xl font-serif">
            <div className="mb-6 md:mb-10">
              <p className="mb-6 md:mb-8">
                NP DataHub is a cloud-based data intelligence platform for philanthropies and nonprofits that offers algorithmic-based insights for more strategic community investment.
              </p>
              <p>
                Even though there are databases that cater to donors and monitor baseline financial activity for nonprofits based on documents, there is no one resource that allows the end-user to visualize fiscal performance and examine longitudinal data for each nonprofit and an entire non-profit sector - until now.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen bg-gray-900 text-white px-6 md:px-12 font-serif">
        <div className="flex flex-col justify-start text-center">
          <h2 className="text-2xl md:text-5xl mb-4 md:mb-6">Connecting billions of data points</h2>
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="w-48 md:w-96 rounded-full h-1 bg-white"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mx-auto mt-12">
          <div className="flex flex-col items-center text-center">
            <img src="/img/non_profits.png" alt="Image 1" className="max-w-full mx-auto mt-8" />
            <h3 className="text-xl md:text-2xl mt-0">1.7 million</h3>
            <p className="text-sm md:text-xl mt-2 font-sans">Number of U.S. nonprofits</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src="/img/data_viz.png" alt="Image 2" className="max-w-full mx-auto" />
            <h3 className="text-xl md:text-2xl mt-4">3</h3>
            <p className="text-sm md:text-xl mt-2 font-sans">Data visualization platforms offered</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src="/img/algorithm.png" alt="Image 3" className="max-w-full mx-auto mt-14" />
            <h3 className="text-xl md:text-2xl mt-4">100+</h3>
            <p className="text-sm md:text-xl mt-2 font-sans">Algorithmic insights for key financial nonprofits variables</p>
          </div>
        </div>
      </section>
      <section className="flex justify-center items-center h-screen bg-white-200 px-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">New Section</h2>
          <p className="mt-4 text-lg text-gray-700">This is a new section with different background color.</p>
        </div>
      </section>      <section className="flex justify-center items-center h-screen bg-orange-200 px-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">New Section</h2>
          <p className="mt-4 text-lg text-gray-700">This is a new section with different background color.</p>
        </div>
      </section>
    </div>
  );
}
