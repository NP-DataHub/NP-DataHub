"use client";
import Navbar from "../components/Navbar";
import Footer from '../components/footer';

const aboutContent = [
  {
    title: "ABOUT",
    content: "More than a decade ago, Nonprofitly co-founder Brett Orzechowski entered the world of mission-driven organizations and philanthropies and although he saw the best and worst of humanity trying to solve societal issues, he recognized that a silo effect had formed geographically and systemically. \n\nIn short, there was no connective tissue that allowed nonprofits to work collaboratively both in terms of mission and most of all, in terms of resources.\n\nEnter data.\n\nRecognizing the power of data and now the reliance on 0s and 1s in decision making, the idea of one centralized digital platform that allows nonprofits, philanthropies, and government to analyze and follow the same path, seemed more relevant than ever. There are other meaningful resources that share nonprofit public data and documents, however, deeper and more valuable insights beyond static information now seem essential rather than supplementary to help resource-dependent organizations and grantmakers alike make stronger data-driven decisions to serve the people that matter the most -- their constituencies."
  },
  {
    title: "OUR MISSION",
    content: "Our mission at Nonprofitly is to empower nonprofits, philanthropies, governments, and donors by providing data-driven insights and tools for better decision-making. We believe in leveraging technology to foster transparency, accountability, and innovation in the nonprofit sector, ultimately creating stronger ecosystems that benefit communities worldwide."
  },
  {
    title: "THE TEAM",
    content: "The team – composed of Rensselaer Polytechnic Institute graduates and undergraduates – has now evolved into what you see with Nonprofitly.\n\nAnd they're open to ideas."
  },
  {
    title: "SUBSCRIPTION",
    content: "The nominal annual subscription fee is set at a level that allows all nonprofits -- big and small -- to explore public datasets, but also allows all mission-driven individuals to find those meaningful insights mostly in their backyard. Place-based problems still exist and the work carried out by these organizations can be more nuanced and efficient across a number of sectors. The tools created by the team allow these groups to dig deeper across historical data, which also is the engine that drives machine-learning algorithms which you'll find within the platform."
  },
  {
    title: "OUR VISION",
    content: "Behind the subscription and the foundational tools developed for the platform's launch, users can make recommendations on tool development, followed by an assessment by the developer team. The guiding philosophy is that if data and increasingly more sophisticated technology can solve a problem for one nonprofit or philanthropy, it will have the potential to help others across the country. The emphasis is on geography and sector, and combined, data can create more in-roads into helping others.\n\nThis drives mission-driven work, and in turn, Nonprofitly."
  }
];

export default function About() {
  return (
    <div className="overflow-auto h-screen">
      <Navbar />
      <section className="bg-[#171821] text-white px-6 md:px-12 font-serif py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">About Us</h1>
          <div className="flex justify-center mt-4">
            <div className="w-24 md:w-96 rounded-full h-1 bg-white"></div>
          </div>
        </div>
        <div className="mt-20 mb-12">
      <div className="flex justify-center items-center flex-wrap gap-8">
        {[
          {
            name: "Brett Orzechowski",
            role: "Co-Founder",
            borderColor: "skyblue",
            imgSrc: "/img/pics/prof.png", // Add the correct image path
          },
          {
            name: "Yotham Sage",
            role: "Co-Founder",
            borderColor: "skyblue",
            imgSrc: "/img/pics/yotham.jpeg", // Add the correct image path
          },
          {
            name: "Youssef Hassan",
            role: "Software Engineer",
            borderColor: "skyblue",
            imgSrc: "/img/pics/youssef.png", // Add the correct image path
          },
          {
            name: "Emmet Whitehead",
            role: "Software Engineer",
            borderColor: "skyblue",
            imgSrc: "/img/pics/emmet.jpg", // Add the correct image path
          },
          {
            name: "Macallan Ringstad",
            role: "Software Engineer",
            borderColor: "skyblue",
            imgSrc: "/img/pics/cal.png", // Add the correct image path
          },
        ].map((member, index) => {
          const [firstName, lastName] = member.name.split(" ");
          return (
            <div
              key={index}
              className="text-center flex flex-col items-center space-y-4"
            >
              {/* Circle with the image */}
              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 overflow-hidden"
                style={{ borderColor: member.borderColor }}
              >
                <img
                  src={member.imgSrc}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Name and Role */}
              <div>
                <p className="text-lg md:text-xl font-semibold">
                  <span className="block">{firstName}</span>
                  <span className="block">{lastName}</span>
                </p>
                <p className="text-sm md:text-md">{member.role}</p>
              </div>
            </div>
          );
        })}
      </div>
      </div>


        <div className="max-w-6xl mx-auto">
          {aboutContent.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl md:text-3xl font-bold mb-4">{section.title}</h2>
              <p className="text-md md:text-lg">{section.content}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
