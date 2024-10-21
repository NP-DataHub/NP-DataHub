"use client";
import Navbar from "../components/Navbar";
import Footer from '../components/footer';

const teamMembers = [
  {
    name: "Brett Orzechowski",
    imgSrc: "/img/prof.png",
    linkedIn: "https://www.linkedin.com/in/brettorzechowski/"
  },

  {
    name: "Macallan Ringstad",
    imgSrc: "/img/macallan.png",
    linkedIn: "https://www.linkedin.com/in/macallan-ringstad-404298251/"
  },
  {
    name: "Youssef Hassan",
    imgSrc: "/img/youssef.png",
    linkedIn: "https://en.wikipedia.org/wiki/John_Smith_(explorer)"
  },
  {
    name: "Emmet Whitehead",
    imgSrc: "/img/emmet.png",
    linkedIn: "https://en.wikipedia.org/wiki/John_Smith_(explorer)"
  },
  {
    name: "Kai Chen",
    imgSrc: "/img/kai.png",
    linkedIn: "https://www.linkedin.com/in/kaichen543/"
  },
  {
    name: "Yotham Sage",
    imgSrc: "/img/yotham.jpg",
    linkedIn: "https://www.linkedin.com/in/yothamsage"
  }
];

const missionStatement = "Our mission at Nonprofitly is to empower nonprofits, philanthropies, governments, and donors by providing data-driven insights and tools for better decision-making. We believe in leveraging technology to foster transparency, accountability, and innovation in the nonprofit sector, ultimately creating stronger ecosystems that benefit communities worldwide.";

export default function About() {
  return (
    <div className="overflow-auto h-screen">
      <Navbar />
      
      <section className="bg-[#171821] text-white px-6 md:px-12 font-serif py-12">
        {/* Who Are We? Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">Who Are We?</h1>
          <div className="flex justify-center mt-4">
            <div className="w-24 md:w-96 rounded-full h-1 bg-white"></div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="max-w-8xl grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-8 md:gap-0 md:gap-y-10 mt-12 bg-[#21222D] p-20 rounded-lg even-shadow" >
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col text-center">
              <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                <img 
                  draggable={false}
                  src={member.imgSrc} 
                  alt={`Image of ${member.name}`} 
                  className="w-80 h-80 mx-auto  border-gray-900 rounded-lg even-shadow profile"
                />
              </a>
              <h3 className="text-xl md:text-2xl mt-4">{member.name}</h3>
            </div>
          ))}
        </div>

        {/* Mission Statement Section */}
        <div className="mt-12 text-center max-w-4xl mx-auto px-4 py-8 ">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg md:text-xl">{missionStatement}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
