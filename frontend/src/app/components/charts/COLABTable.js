'use client';

import React from 'react';
import SimilarityScore from '@/app/components/SimilarityScore';
import { useRouter } from 'next/navigation';
import ntee_codes from '../ntee';


/**
 * 
 * This is the table component for the COLAB page. It will display the nonprofits, filtered by the user, based on the similarity score. 
 * It shows the name of the nonprofit that has been selected, and the similarity score between the selected nonprofit and the other nonprofits.
 */
const COLABTable = ({ similarityList, selectedNonprofit, isDarkMode }) => {

    //console.log("COLAB Table inputs:", similarityList, selectedNonprofit);

    // Check for invalid/empty inputs
    if (!Array.isArray(similarityList)) {
        return <div>ERROR: chart arg must be an array. This should never appear - please report to developers if you encounter this!</div>;
    }
    if (similarityList.length === 0) {
        return <div>No data to display, womp womp.</div>;
    }


    // Check if there is a selected nonprofit. If there isn't, simply return a stylized div indicating that there is no nonprofit selected.
    if (selectedNonprofit === null || selectedNonprofit === undefined || selectedNonprofit.length <= 1) {
        return <div>ERROR: selectedNonprofit cannot be null. This should never appear - please report to developers if you encounter this!</div>;
    }


    // Function to handle the click event on the table - this will navigate to the selected nonprofit's page
    const router = useRouter();
    const handleSelectedNonprofitClick = (nonprofit) => {
        router.push(`/nonprofit/${nonprofit._id}`);
    };

    // Get the NTEE code description for the selected nonprofit

    const selectedNTEE = ntee_codes[selectedNonprofit.MajGrp] || 'N/A';

    return (
        <div className='h-full'>
            <div className={`${isDarkMode ? 'bg-[#171821] text-white' : 'bg-white text-black'} rounded-lg p-2 mb-4`}>
                <div style={{ padding: '10px', borderRadius: '5px',  marginBottom: '10px' }}>
                    <h3 className='text-2xl'>{selectedNonprofit.Nm}</h3>
                    <p>{`${selectedNonprofit.Addr}, ${selectedNonprofit.Cty}, ${selectedNonprofit.St} ${selectedNonprofit.Zip}`}</p>
                    <p>{`NTEE Code: ${selectedNonprofit.MajGrp} - ${selectedNTEE ? selectedNTEE : 'No description'}`}</p>
                    <p>{`EIN: ${selectedNonprofit.EIN}`}</p>
                    <p>
                        <a href="#" onClick={() => handleSelectedNonprofitClick(selectedNonprofit)} style={{ color: '#0099ff' }}>
                            Learn more.
                        </a>
                    </p>
                </div>
            </div>
            <div className={`${isDarkMode ? 'bg-[#171821] text-white' : 'bg-white text-black'} rounded-lg p-6`} style={{ padding: '10px', borderRadius: '5px', height: '700px', overflowY: 'scroll' }}>
                <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Similarity Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {similarityList.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td>{item.nonprofit.Nm }</td>
                                    <td>{`${item.nonprofit.Addr}, ${item.nonprofit.Cty}, ${item.nonprofit.St} ${item.nonprofit.Zip}`}</td>
                                    <td>{item.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );



}

export default COLABTable;