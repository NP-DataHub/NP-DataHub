// Table component for the COLAB page
// - Emmet Whitehead

'use client';

import React from 'react';
import SimilarityScore from '@/app/components/similarityScore';
import { Link } from 'react-router-dom';

/**
 * 
 * This is the table component for the COLAB page. It will display the nonprofits, filtered by the user, based on the similarity score. 
 * It shows the name of the nonprofit that has been selected, and the similarity score between the selected nonprofit and the other nonprofits.
 * 
 * 
 * @param data - a list of nonprofits that have been filtered by the user. This MUST BE THE SAME DATA that is passed to the COLABGraph component
 */
const COLABTable = ({ nonprofits, selectedNonprofit }) => {

    // Check for invalid/empty inputs
    if (!Array.isArray(nonprofits)) {
        return <div>ERROR: chart arg must be an array</div>;
    }
    if (nonprofits.length === 0) {
        return <div>No data to display, womp womp.</div>;
    }
    if (selectedNonprofit === null) {
        return <div>No nonprofit selected</div>;
    }

    selectedNonprofit = selectedNonprofit[0];


    console.log("COLAB Table inputs:", nonprofits, selectedNonprofit);




    // Check for invalid inputs
    if (!Array.isArray(nonprofits)) {
        return <div>ERROR: chart arg must be an array</div>;
    }

    // Check for empty data
    if (nonprofits.length === 0) {
        return <div>No data to display, womp womp.</div>;
    }

    // Check if the selected nonprofit is null
    if (selectedNonprofit === null) {
        return <div>No nonprofit selected</div>;
    }

    // Need to compute the similarity score between the selected nonprofit and the other nonprofits and store them in a list
    const similarityList = [];

    // Loop through each nonprofit and compute the similarity score
    for (const nonprofit of nonprofits) {
        const score = SimilarityScore(selectedNonprofit, nonprofit);
        similarityList.push({ nonprofit: nonprofit, score: score });
    }

    console.log("Similarity List:", similarityList);





    

    return (
        <div className='relative'>
            <div style={{ padding: '10px',  borderRadius: '5px', height: '700px', overflowY: 'scroll' }}>
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