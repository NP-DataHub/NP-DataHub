import Navbar from "./components/Navbar";
import dynamic from 'next/dynamic';

const BasicBarChart = dynamic(() => import('./components/BasicBarChart'), { ssr: false });

export default function Home() {
  const variable = "Revenue"
  const values = [52,64,73,67,86,95];
  const style = { height: 400, width: 400 }
  return (
    <div className="overflow-auto h-screen">
      <Navbar/>
      {/* Plotly Testing !!! */}
      <section className="min-h-screen bg-white text-gray-900 px-6 md:px-12 font-serif">
        <div className="flex flex-col justify-center items-center text-center py-40">
          <h2 className="text-2xl md:text-5xl mb-4 md:mb-6">Chart Testing Page :)</h2>
          <h1>To do: add percentage functions for bar charts</h1>
          <BasicBarChart variable={variable} values={values} style={style}/>
        </div>
      </section>
    </div>
  );
}
