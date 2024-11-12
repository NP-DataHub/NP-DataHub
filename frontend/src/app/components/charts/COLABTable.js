// Table component for the COLAB page
// - Emmet Whitehead

'use client';

import React from 'react';

/**
 * @param data - a list of nonprofits that have been filtered by the user. This MUST BE THE SAME DATA that is passed to the COLABGraph component
 */
const COLABTable = ({ data }) => {


    // Check for invalid inputs
    if (!Array.isArray(data)) {
        return <div>ERROR: chart arg must be an array</div>;
    }

    // Check for empty data
    if (data.length === 0) {
        return <div>No data to display, womp womp.</div>;
    }

    

    return (
        <div> section for ballers and players and the like</div>
    );



}

export default COLABTable;