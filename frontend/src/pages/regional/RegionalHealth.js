"use client";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from 'react';
import '@/app/globals.css';

const RegionalHealth = () => {
  useEffect(() => {

  });

  return (
    <div className="flex dashboard-color text-white font-sans">
        <Sidebar />
          <div className="flex-col w-10/12 mx-auto dashboard-color ">
              <DashboardNavbar />
          </div>
    </div>
  );
}

export default RegionalHealth;