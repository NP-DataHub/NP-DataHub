import Navbar from "./components/Navbar";
import dynamic from 'next/dynamic';

const MyBarChart = dynamic(() => import('../components/MyBarChart'), { ssr: false });

export default function Home() {
  return (
    <div className="overflow-auto h-screen">
      <Navbar/>
      {/* Plotly Testing !!! */}
      <section className="min-h-screen bg-white text-gray-900 px-6 md:px-12 font-serif">
        <div className="flex flex-col justify-center items-center text-center py-40">
          <h2 className="text-2xl md:text-5xl mb-4 md:mb-6">Second Chance Inc.</h2>
          <h1>My Nivo Bar Chart</h1>
          <div style={{ height: '500px' }}>
            <MyBarChart />
          </div>
        </div>
      </section>
    </div>
  );
}
