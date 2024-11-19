// Table component for the COLAB page
// - Emmet Whitehead

'use client';

import React from 'react';
import SimilarityScore from '@/app/components/SimilarityScore';
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

    console.log("COLAB Table inputs:", nonprofits, selectedNonprofit);

    // Check for invalid/empty inputs
    if (!Array.isArray(nonprofits)) {
        return <div>ERROR: chart arg must be an array. This should never appear - please report to developers if you encounter this!</div>;
    }
    if (nonprofits.length === 0) {
        return <div>No data to display, womp womp.</div>;
    }


    // Check if there is a selected nonprofit. If there isn't, simply return a stylized div indicating that there is no nonprofit selected.
    if (selectedNonprofit === null || selectedNonprofit === undefined || selectedNonprofit.length <= 1) {
        return (
            <div style={{ position: 'relative', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    <h2 className="text-center text-3xl">No Nonprofit Selected</h2>
                    <p>Search for a nonprofit, or click on a nonprofit from the graph to find similar nonprofits!</p>
                </div>
            </div>
        );
    }
    else{
        selectedNonprofit = selectedNonprofit.data[0];
    }


    // Need to compute the similarity score between the selected nonprofit and the other nonprofits and store them in a list
    const similarityList = [];

    // Loop through each nonprofit and compute the similarity score
    for (const nonprofit of nonprofits) {
        // Skip the selected nonprofit
        if (nonprofit.Nm === selectedNonprofit.Nm) {
            continue;
        }

        const score = SimilarityScore(selectedNonprofit, nonprofit);
        similarityList.push({ nonprofit: nonprofit, score: score });
    }

    // Sort the list by the similarity score, highest to lowest
    similarityList.sort((a, b) => b.score - a.score);


    //console.log("Similarity List:", similarityList);





    

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