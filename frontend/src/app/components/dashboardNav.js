import React, { useEffect, useState } from 'react';
import { IoIosNotificationsOutline } from "react-icons/io";
import { useAuth } from './context';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const DashboardNavbar = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (!userData) {
    return null; 
  }

  return (
    <div className="dashboard-color flex items-center justify-between p-10 font-sans">
      <div className="flex items-center w-3/4">
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Search for nonprofits ..." 
            className="w-full bg-[#21222D] shadow-lg text-gray-300 rounded-md py-4 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#A9DFD8]"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.9166 11.4166L9.35884 8.85422L11.9166 11.4166ZM10.7763 5.42974C10.7763 6.71511 10.2657 7.94784 9.35679 8.85673C8.4479 9.76562 7.21517 10.2762 5.9298 10.2762C4.64443 10.2762 3.41171 9.76562 2.50282 8.85673C1.59392 7.94784 1.08331 6.71511 1.08331 5.42974C1.08331 4.14437 1.59392 2.91165 2.50282 2.00276C3.41171 1.09386 4.64443 0.583252 5.9298 0.583252C7.21517 0.583252 8.4479 1.09386 9.35679 2.00276C10.2657 2.91165 10.7763 4.14437 10.7763 5.42974V5.42974Z" stroke="#ABABAB" strokeWidth="1.14035" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative">
          <div className='text-2xl'><IoIosNotificationsOutline /></div>
          <span className="absolute top-0 right-0 block h-2 w-2 transform translate-x-1 -translate-y-1 rounded-full bg-red-600"></span>
        </button>
        <div className="flex items-center space-x-2">
          <img src={userData.image || 'https://via.placeholder.com/150'} alt="User" className="w-10 h-10 rounded-full object-cover" />
          <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
