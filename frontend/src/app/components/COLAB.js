/*
    This is the COLAB component. It shows a graph of nonprofits in an area, and shows the "similarity" between them in a table on the right.
    Let me know if you see anything messed up with the code.

    - Emmet Whitehead
*/


'use client';


import { useState, useEffect, useCallback, useMemo, use } from 'react';
import '@/app/globals.css';
import Autosuggest from "react-autosuggest/dist/Autosuggest";
import COLABGraph from '@/app/components/charts/COLABGraph';
import COLABTable from './charts/COLABTable';
import SimilarityScore from '@/app/components/SimilarityScore';
import debounce from 'lodash.debounce';


export default function COLAB({isDarkMode}) {


    // Data, selection state vars
    const [areaData, setareaData] = useState(null);
    const [nonprofit, setNonprofit] = useState('');
    const [nonprofitData, setNonprofitData] = useState([0]);

    // Is there data state var for loading div
    const [dataIsLoading, setDataIsLoading] = useState(false);

    // State var for threshold set in slider by user
    const [threshold, setThreshold] = useState(60);
    
    // Fetch suggestions for nonprofit names 

    const [nameSuggestions, setNameSuggestions] = useState([]); // Suggestions for name autocomplete
    const [lastFetchedNameInput, setLastFetchedNameInput] = useState('');

    const [firstNp, setFirstNp] = useState('');


    const fetchSuggestions = useCallback( debounce(async (value, type) => {
        if (type === 'name' && value === lastFetchedNameInput) return;
    
        try {
        const response = await fetch(`/api/suggestions?input=${value}&type=${type}`);
        const data = await response.json();
    
        if (data.success) {
            if (type === 'name') {
            setNameSuggestions(data.data);
            setLastFetchedNameInput(value); // Update last fetched value for names
            }
        } else {
            if (type === 'name') setNameSuggestions([]);
        }
        } catch (error) {
        console.error("Error fetching suggestions:", error);
        }
    }, 250), // 250 ms delay
    [lastFetchedNameInput]);
    

    // Autosuggest configuration
    // Get suggestion value for name
    const getNameSuggestionValue = (suggestion) => suggestion.Nm || '';



    
    // Render function for names
    const renderNameSuggestion = (suggestion) => {
        return (
            <div
              className={`px-4 py-2 cursor-pointer ${
                isDarkMode
                  ? "hover:bg-[#F2C8ED] hover:text-black"
                  : "hover:bg-[#DB7093] hover:text-black"
              }`}
            >
              {suggestion.Nm}
            </div>
        );
    };

    const onNameSuggestionsFetchRequested = ({ value }) => {
        fetchSuggestions(value, 'name');
    };

    const onSuggestionsClearRequested = () => {
        setNameSuggestions([]);
    };

    const onNameSuggestionSelected = (event, { suggestion }) => {
        //console.log("Selected suggestion:", suggestion);


        // clear all current filters and data
        setareaData(null);
        setNonprofitData(null);

        // Set the selected nonprofit name
        setNonprofit(suggestion.Nm);
        
    };



        

        
    // Handle the click event on a nonprofit from the colab graph component
    const handleNonprofitClick = useCallback((clickedNonprofit) => {
        //console.log("clicked on nonprofit:", clickedNonprofit.Nm);
        setNonprofit(clickedNonprofit.Nm);
        setNonprofitData(clickedNonprofit); 
        setFirstNp(clickedNonprofit.Nm);
    }, []);


    const fetchData = async () => {

        setDataIsLoading(true);

        if (nonprofit && nonprofit.trim().length > 0) {
            // If the user has entered a nonprofit name, fetch nonprofits in the same area (city or zip code)
            const NAME = nonprofit;

            // Fetch the data
            let response = await fetch(`/api/sector?Nm=${NAME}`);
            let nonprofitData = await response.json();

            if(nonprofitData !== null && nonprofitData.data !== undefined){
                setNonprofitData(nonprofitData.data[0]);
            }
            else{
                //console.error("No data found for the selected nonprofit");
                setNonprofitData(null);
            }

            // Get the area data for the selected nonprofit
            if (nonprofitData !== null && nonprofitData.data.length > 0) {
                //console.log("Nonprofit data:", nonprofitData.data);
                // Extract the city and zip code of the selected nonprofit
                let CITY = null;
                let ZIP = null;
                if(nonprofitData.data[0].Cty !== null){
                    CITY = nonprofitData.data[0].Cty;
                }
                if(nonprofitData.data[0].Zip !== null){
                    ZIP = nonprofitData.data[0].Zip;
                }

                // Set the area data with the city and zip code of the selected nonprofit
                let response = await fetch(`/api/sector?Cty=${CITY}&Zip=${ZIP}`);
                let fetched_data = await response.json();

                setareaData(fetched_data.data);

            } else {
                console.error("False data fetch - all inputs are null, check where you are calling fetchData()");
            }
        }

        setDataIsLoading(false);

    };

     const handleSearch = () => {
        fetchData();
        //console.log("computing similarity network");
        computeSimilarityNetwork();
    };



    // Implement the similarity score functionality to be passed into componenets. By computing once here, we can avoid recomputing it in each component
    /**
     *  The idea is as follows:
     *  1. User selects a nonprofit -> data for the whole area (same city and or zip code) is fetched
     *  2. The similarity score is computed between the selected nonprofit and all other nonprofits in the area. This is saved as the similarity list to be passed into the COLABTable component
     *  3. A second list is created of only the nonprofits that have a similarity score above the threshold. This is passed into the COLABGraph component
     *  
     *  TODO: Implement a recursive graph search that will return a list of the nonprofits that are connected to the selected nonprofit.
     *        Currently, only nonprofits that are directly connected to the selected nonprofit are shown. I want to add functionality to show nonprofits that are connected to the connected nonprofits, with turtles all the way down.
     * 
     * 
     *  @returns - nothing, state vars are set within the function
     */

    const [similarityList, setSimilarityList] = useState([]); // List of all nonprofits in the area and their similarity scores
    const [thresholdedList, setThresholdedList] = useState([]); // List of nonprofits that have a similarity score above the threshold

    const updateThresholdedList = useCallback(() => {
        if(similarityList.length === 0){
            //console.error("Cannot update thresholded list - similarity list is empty");
            return;
        }
        
        // Clear the thresholded list
        setThresholdedList([]);

        // Filter the similarity list to only include nonprofits that have a similarity score above the threshold
        const thresholded = similarityList.filter((item) => item.score >= threshold);

        // Add the selected nonprofit to the list
        thresholded.unshift({ nonprofit: nonprofitData, score: 100 });

        // Set the thresholded list
        setThresholdedList(thresholded);
    }, [similarityList, threshold]);





    const computeSimilarityNetwork = useCallback(() => {
        // Could take a while to compute, so show loading spinner
        //setDataIsLoading(true);


        // Check that we have the necessary data
        if (areaData === null || nonprofitData === null) {
            console.error("Cannot compute similarity network - missing data");
            return;
        }

        // Clear the lists
        setSimilarityList([]);
        setThresholdedList([]);

        // Loop through each nonprofit and compute the similarity score, adding it to the similarity list
        const newSimilarityList = [];
        for (const nonprofit of areaData) {
            // Skip the selected nonprofit
            if (nonprofit.Nm === nonprofitData.Nm) {
                continue;
            }

            const score = SimilarityScore(nonprofitData, nonprofit);
            newSimilarityList.push({ nonprofit: nonprofit, score: score });
        }

        // Sort the list by the similarity score, highest to lowest
        newSimilarityList.sort((a, b) => b.score - a.score);

        // Set the similarity list
        setSimilarityList(newSimilarityList)

        // Set the thresholded list
        updateThresholdedList();

        // Done computing, hide loading spinner
        //setDataIsLoading(false);
    }, [areaData, nonprofitData]);


    // ----- Data updaters -----

    // Update the thresholded list when the threshold changes
    useEffect(() => {
        updateThresholdedList();
    }, [threshold, similarityList, updateThresholdedList]);

    // Compute the similarity network when the area data or selected nonprofit changes
    useEffect(() => {
        computeSimilarityNetwork();
    }, [areaData, nonprofitData, computeSimilarityNetwork]);

    // Update data when the user selects a new nonprofit
    // useEffect(() => {
    //     if (nonprofit) {
    //         fetchData();
    //     }
    // }, [nonprofit]);



    // Loading component to show while data is being fetched
    const SearchLoadingComponent = () => (
        <div className="flex items-center justify-center h-full w-full">
            <svg className="animate-spin h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );


    // Slider component to set the threshold for similarity score
    const ThresholdSlider = ({ threshold, setThreshold, isDarkMode }) => (
        <div
            className={`flex items-center h-full gap-4 p-2 rounded-lg w-full ${
                isDarkMode ? "bg-[#34344c]" : "bg-[#F1F1F1]"
            }`}
        >
            <label
                className={`flex flex-col w-1/3 whitespace-normal text-ellipsis ${
                    isDarkMode ? "text-white" : "text-black"
                }`}
            >
                Similarity Threshold:
            </label>
            <input
                type="range"
                min="1"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
                className={`w-2/3 border ${
                    isDarkMode
                        ? "bg-[#34344c] text-white border-gray-600"
                        : "bg-[#F1F1F1] text-black border-gray-200"
                } rounded-lg focus:outline-none`}
                style={{ accentColor: isDarkMode ? "#F2C8ED" : "#DB7093" }}
            />
            <span className={`${isDarkMode ? "text-white" : "text-black"}`}>
                {threshold}
            </span>
        </div>
    );
    return (

        <div className={`w-full h-full p-6 ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"} rounded-lg`}>
        {/* Title and description */}
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-[#F2C8ED]" : "text-[#DB7093]"}`} >
            COLLAB:LAB
            </h3>
            <div className='grid grid-cols-3 gap-4 mb-4'>
                <div className={`col-span-1 p-4 rounded-lg w-full ${isDarkMode ? "bg-[#34344c] text-white"   : "bg-[#F1F1F1] text-black"} `}>
                    <h2 className='text-2xl mb-1'>Similarity Score</h2>
                    <p>The similarity score is a measure of how similar a nonprofit is to other organizations within their zip code. By comparing the sectors in which the nonprofits operate, you can gauge how similar they are financially after the similarity score is computed. This includes a weighted score on revenues, expenses, assets, and liabilities.</p>
                </div>
                <div className={`col-span-1 p-4 rounded-lg w-full ${isDarkMode ? "bg-[#34344c] text-white"   : "bg-[#F1F1F1] text-black"} `}>
                    <h2 className='text-2xl mt-2 mb-1'>Nonprofit Network</h2>
                    <p>Visualize highly similar nonprofits through a network of nonprofits, connected by their score. Then, click on a nonprofit to see their similarity table. Choose the size of the network by adjusting the similarity threshold - how similar nonprofits must be to connect. Low thresholds are not recommended but adjust accordingly.</p>
                </div>
                <div className={`col-span-1 p-4 rounded-lg w-full ${isDarkMode ? "bg-[#34344c] text-white"   : "bg-[#F1F1F1] text-black"} `}>
                    <h2 className='text-2xl mt-2 mb-1'>Similarity Table</h2>
                    <p>Choose and compare a nonprofit against all other nonprofits in the same zip code. See what other nonprofits in the area are most similar, and use to analyze the potential of collaboration or strategically to ensure fiscal viability for a specific funding opportunity. Click learn more to visit the selected nonprofit&apos;s profile page.</p>
                </div>
            </div>
        {/* Name search, threshold slider */}
        <div className="grid grid-cols-2 gap-4 mb-4 w-full">
            {/* Name search autosuggest */}
            <div className='relative w-full h-full'>
                <Autosuggest
                    suggestions={nameSuggestions}
                    onSuggestionsFetchRequested={onNameSuggestionsFetchRequested}
                    onSuggestionSelected={onNameSuggestionSelected}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getNameSuggestionValue}
                    renderSuggestionsContainer={({ containerProps, children }) => (
                        <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 overflow-y-auto rounded z-10 ${
                            nameSuggestions.length > 0
                              ? isDarkMode
                                ? 'bg-[#171821] text-white border border-[#F2C8ED]'
                                : 'bg-white text-black border border-[#DB7093]'
                              : ''
                          }`}
                        >
                          {children}
                        </div>
                    )}
                    renderSuggestion={renderNameSuggestion}
                    inputProps={{
                        placeholder: 'Search for a nonprofit',
                        value: firstNp,
                        onChange: (_, { newValue }) => {
                            setFirstNp(newValue);
                            setNonprofit(newValue);
                        },
                        className: `p-4 border h-[52px] ${isDarkMode 
                            ? "bg-[#34344c] text-white border-gray-600" 
                            : "bg-[#F1F1F1] text-black border-gray-200"} 
                            rounded-lg w-full focus:outline-none`,
                    }}
                />
            </div>

            {/* Search button and slider */}
            <div className="flex items-center w-full gap-4 h-[52px]">
                {/* Search button */}
                <div className="flex items-center w-1/3 h-full">
                    <button
                        onClick={handleSearch}                      
                        className={`w-full h-full text-black p-2 rounded-lg focus:outline-none focus:ring-1  ${
                            !nonprofit || dataIsLoading
                              ? isDarkMode
                                ? "bg-gray-700 cursor-not-allowed"
                                : "bg-[#D8D8D8] cursor-not-allowed"
                              : isDarkMode
                              ? 'bg-[#c1a0bd] hover:bg-[#F2C8ED] transition duration-300'
                              : 'bg-[#f9e3ee] hover:bg-[#f4c7dd] transition duration-300'
                            }
                        `}
                    >
                        Search
                    </button>
                </div>
                {/* Threshold slider */}
                <div className='flex items-center w-2/3 h-full'>
                    <ThresholdSlider 
                        threshold={threshold} 
                        setThreshold={setThreshold} 
                        isDarkMode={isDarkMode} 
                    />
                </div>
            </div>
        </div>

        {/* Graph and table */}
        <div className="h-full w-full">
            {/* Conditionally render in the components once data has loaded in */}
            {dataIsLoading ? (
                <SearchLoadingComponent />
            ) : areaData ? (
                <div className="grid grid-cols-2 gap-4 h-full">
                    {/* Graph */}
                    <div className={`flex flex-col p-4 rounded-lg ${isDarkMode ? "bg-[#34344c]" : "bg-[#F1F1F1]"}`}>
                        <h2 className="text-center text-3xl">Nonprofit Network</h2>
                        <COLABGraph data={thresholdedList} filters={[]} onNonprofitClick={handleNonprofitClick} isDarkMode={isDarkMode}  threshold={threshold}/>
                    </div>
                    {/* Table */}
                    <div className={`flex flex-col justify-between h-full p-4 rounded-lg ${isDarkMode ? "bg-[#34344c]" : "bg-[#F1F1F1]"}`}>
                            <COLABTable similarityList={similarityList} selectedNonprofit={nonprofitData} isDarkMode={isDarkMode} />
                    </div>
                </div>
            ) : (
                <div className={`col-span-2 h-full p-4 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#34344c] text-white' : 'bg-[#F1F1F1] text-black'}`}>
                    <span className="text-center text-3xl">Select a Nonprofit to get started.</span>
                </div>
            )}
            
        </div>
    </div>

    );

};
