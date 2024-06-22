"use client"
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardNavbar from "../components/dashboardNav";
import React, { useState } from 'react';

export default function Dashboard() {
    const [state, setState] = useState('');
    const [nteeCode, setNteeCode] = useState('');
    const [subNteeCode, setSubNteeCode] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    const indicators = [
        { value: '$245K', label: 'REVENUES', barColor: 'bg-[#FCB859]', ranking: '74%', diff: '+6.5%', diffColor: 'border-2 border-[#029F04] bg-[#171821]' },
        { value: '$222K', label: 'EXPENSES', barColor: 'bg-[#A9DFD8]', ranking: '61%', diff: '+5.4%', diffColor: 'border-2 border-[#029F04]  bg-[#171821]' },
        { value: '$546K', label: 'ASSETS', barColor: 'bg-[#28AEF3]', ranking: '47%', diff: '-1.9%', diffColor: 'border-2 border-[#6A1701] bg-[#171821]' },
        { value: '$511K', label: 'LIABILITIES', barColor: 'bg-[#EA1701]', ranking: '23%', diff: '-2.9%', diffColor: 'border-2 border-[#6A1701] bg-[#171821]' },
      ];
    const handleSearch = () => {
      // Implement your search logic here
      console.log('Searching with:', { state, nteeCode, subNteeCode });
  
      // Mock search results data
      const results = [
        {
          nonprofitName: 'ALBANY MEDICAL NETWORK',
          address: '123 Main Street',
          city: 'Albany',
          state: 'NY',
          zip: '12345',
          annualRev: '$17,564,456.12',
          annualExpenses: '$16,567,435.21'
        },
        {
            nonprofitName: 'ALBANY MEDICAL NETWORK',
            address: '123 Main Street',
            city: 'Albany',
            state: 'NY',
            zip: '12345',
            annualRev: '$17,564,456.12',
            annualExpenses: '$16,567,435.21'
        }
        // Add more results as needed
      ];
  
      setSearchResults(results);
    };
  
    return(
        <div>
            <div className = "flex dashboard-color text-white font-sans">
                <Sidebar/>
                <div className = "flex-col w-screen">
                    <DashboardNavbar/>
                    <div className = "flex-col px-10 bg-[#21222D] rounded-md mx-10 p-10 font-sans">
                        <h1 className = "text-2xl font-semibold">COMMUNITY FOUNDATION OF TROY</h1>
                        <span className = "text-sm text-[#A0A0A0]">123 Main Street, Troy, New York  12180</span>
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.1994 7.09144L11.2237 1.22339L1.24802 7.09144V18.8276L11.2237 24.6956L21.1994 18.8276V7.09144Z" stroke="#FEB95A" stroke-width="1.95" stroke-linejoin="round"/>
                                    <path d="M6.52927 14.1332V16.4804M11.2237 11.7859V16.4804V11.7859ZM15.9182 9.43872V16.4804V9.43872Z" stroke="#FEB95A" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>

                                <h2 className="text-xl font-semibold mb-2">NTEE CODE</h2>
                                <p className = "text-md">E (Health Care)</p>
                                <p className="text-sm text-[#FEB95A]">E21 Health Systems</p>
                            </div>
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.1844 2.69312H17.9502C18.2466 2.69312 18.5309 2.81201 18.7404 3.02364C18.95 3.23527 19.0677 3.5223 19.0677 3.8216V22.4415C19.0677 22.7408 18.95 23.0278 18.7404 23.2395C18.5309 23.4511 18.2466 23.57 17.9502 23.57H2.30525C2.00887 23.57 1.72463 23.4511 1.51506 23.2395C1.30548 23.0278 1.18775 22.7408 1.18775 22.4415V3.8216C1.18775 3.5223 1.30548 3.23527 1.51506 3.02364C1.72463 2.81201 2.00887 2.69312 2.30525 2.69312H6.2165V4.38584H14.039V2.69312H15.1844Z" stroke="#A9DFD8" stroke-width="1.5" stroke-linejoin="round"/>
                                    <path d="M11.8044 9.4636L7.3344 13.9781H12.9241L8.4519 18.492M6.2169 1H14.0394V4.38544H6.2169V1Z" stroke="#A9DFD8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>

                                <h2 className="text-xl font-semibold mb-2">$54,137</h2>
                                <p className = "text-md">Operation Diff.</p>
                                <p className = "text-sm text-[#A9DFD8]">+8% from 2022</p>
                            </div>
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.3429 6.24471H20.9482C21.1663 6.24493 21.3765 6.32607 21.5381 6.47243C21.6998 6.61879 21.8013 6.81993 21.8231 7.0369L22.3601 12.4062H20.5891L20.149 8.00513H17.3429V10.6458C17.3429 10.8792 17.2501 11.1031 17.0851 11.2682C16.92 11.4332 16.6961 11.526 16.4627 11.526C16.2292 11.526 16.0053 11.4332 15.8403 11.2682C15.6752 11.1031 15.5825 10.8792 15.5825 10.6458V8.00513H8.5408V10.6458C8.5408 10.8792 8.44806 11.1031 8.28299 11.2682C8.11792 11.4332 7.89404 11.526 7.66059 11.526C7.42715 11.526 7.20326 11.4332 7.03819 11.2682C6.87312 11.1031 6.78038 10.8792 6.78038 10.6458V8.00513H3.97252L2.56418 22.0885H12.0616V23.8489H1.59067C1.46773 23.8488 1.34618 23.8229 1.23385 23.7729C1.12152 23.723 1.0209 23.65 0.938471 23.5588C0.856045 23.4676 0.793641 23.3601 0.755281 23.2433C0.71692 23.1265 0.703452 23.003 0.715746 22.8806L2.30012 7.0369C2.32193 6.81993 2.42349 6.61879 2.58513 6.47243C2.74678 6.32607 2.95699 6.24493 3.17505 6.24471H6.78038V5.63032C6.78038 2.57776 9.1323 0.083252 12.0616 0.083252C14.991 0.083252 17.3429 2.57776 17.3429 5.63032V6.24647V6.24471ZM15.5825 6.24471V5.63032C15.5825 3.52839 13.9946 1.84367 12.0616 1.84367C10.1287 1.84367 8.5408 3.52839 8.5408 5.63032V6.24647H15.5825V6.24471ZM21.1225 19.3422C21.2028 19.2548 21.2999 19.1846 21.4081 19.1357C21.5162 19.0869 21.6331 19.0604 21.7517 19.0578C21.8703 19.0553 21.9883 19.0768 22.0984 19.121C22.2085 19.1652 22.3086 19.2312 22.3925 19.315C22.4765 19.3988 22.5426 19.4988 22.587 19.6089C22.6313 19.7189 22.653 19.8368 22.6506 19.9555C22.6482 20.0741 22.6219 20.191 22.5732 20.2992C22.5245 20.4074 22.4544 20.5046 22.3671 20.5851L18.8463 24.1059C18.6812 24.2709 18.4574 24.3636 18.224 24.3636C17.9906 24.3636 17.7667 24.2709 17.6017 24.1059L14.0808 20.5851C13.9968 20.5039 13.9297 20.4067 13.8836 20.2994C13.8374 20.192 13.8132 20.0765 13.8121 19.9596C13.8111 19.8427 13.8334 19.7268 13.8777 19.6186C13.9219 19.5105 13.9873 19.4122 14.0699 19.3295C14.1526 19.2469 14.2508 19.1815 14.359 19.1373C14.4672 19.093 14.5831 19.0708 14.7 19.0718C14.8168 19.0728 14.9323 19.0971 15.0397 19.1432C15.1471 19.1893 15.2442 19.2564 15.3254 19.3405L17.3429 21.3596V15.0468C17.3429 14.8133 17.4356 14.5895 17.6007 14.4244C17.7658 14.2593 17.9896 14.1666 18.2231 14.1666C18.4565 14.1666 18.6804 14.2593 18.8455 14.4244C19.0106 14.5895 19.1033 14.8133 19.1033 15.0468V21.3596L21.1225 19.3405V19.3422Z" fill="#F2C8ED"/>
                                </svg>


                                <h2 className="text-xl font-semibold mb-2">$145,111</h2>
                                <p className = "text-md">Services Expenses</p>
                                <p className = "text-sm text-[#F2C8ED]">+2% from 2022</p>
                            </div>
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.0394 12.0001C14.0733 12.0001 16.5328 9.57496 16.5328 6.58341C16.5328 3.59187 14.0733 1.16675 11.0394 1.16675C8.00543 1.16675 5.54593 3.59187 5.54593 6.58341C5.54593 9.57496 8.00543 12.0001 11.0394 12.0001Z" stroke="#20AEF3" stroke-width="1.5"/>
                                    <path d="M15.4344 16.3335H22.0266M16.5331 22.8335H3.6411C3.32949 22.8336 3.02143 22.7683 2.73736 22.642C2.4533 22.5157 2.19973 22.3313 1.99347 22.1009C1.78722 21.8706 1.63301 21.5997 1.54106 21.3061C1.44912 21.0125 1.42156 20.703 1.4602 20.3982L1.88869 17.0138C1.98833 16.2276 2.37586 15.5043 2.9784 14.98C3.58094 14.4557 4.35698 14.1665 5.16058 14.1668H5.54622L16.5331 22.8335ZM18.7305 13.0835V19.5835V13.0835Z" stroke="#20AEF3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>

                                <h2 className="text-xl font-semibold mb-2">57</h2>
                                <p className = "text-md">Employees</p>
                                <p className = "text-sm text-[#20AEF3]">+3% from 2023</p>
                            </div>
                        </div>
                    </div>
                    <div className = "flex-col mx-10 font-sans ">
                        <div className="grid grid-cols-3 gap-4 mt-10">

                        <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ">
                                // add chart here box size will update with chart
                            </div>
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300  ">

                                // add chart here box size will update with chart
                            </div>
                            <div className = "bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ">
                                // add chart here box size will update with chart
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-10">

                        <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 col-span-2">
                                // add chart here box size will update with chart
                            </div>
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300  ">

                                // add chart here box size will update with chart
                            </div>

                        </div>
                        </div>

                </div>
            </div>
        </div>
    );
}
