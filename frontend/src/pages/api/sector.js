/**
 *  This is a general search for the mongodb. It will take in a query object and return all the items that match the query object.
 * 
 *  Example usage:
 *      let response = await fetch(`/api/sector?Cty=${CITY}`);
        let filtered_sector_data = await response.json();
    
        This will return all the nonprofits in the city of Santa Cruz.
 * 
 *  ***Importantly, when you build your query, it should have key names that match the field names in the database.
 *      So, dont call "CITY={some_city}" in the query object, instead call it "Cty={some_city}"
 *  
 *  Some frequent key names are:
 * "EIN": "010055140",
 * "NTEE": "Z",
 * "SubCode": "13",
 * "Addr": "10 LITCHFIELD ROAD",
 * "Cty": "HALLOWELL",
 * "Nm": "HALLOWELL CENTENNIAL BURIAL GROUND ASSOCIATION INC",
 * "RetTyp": "990",
 * "St": "ME",
 * "Zip": "04347"
 * 
 *  The result will be an array of nonprofit objects that match the query object. 
 * 
 *  If you find any issues, let me know!
 * 
 *  - Emmet Whitehead
 */


        import clientPromise from "@/app/lib/mongodb";
        import { ObjectId } from "mongodb";
        
        export default async function handler(req, res) {
            const { method, query } = req;
        
            try{
                const client = await clientPromise;
                const database = client.db("Nonprofitly");
        
                switch(method){
                    case 'GET':
                        const filters = {};
                        const nteeCodes = [];
        
                        console.log("Query:", query);
        
                        // From the passed in query, extract all the filters
                        for (const [key, value] of Object.entries(query)) {
                            if (value != 'null' && value != '') {
                                // If the value is an NTEE code, we need to handle it with an $or query
                                if (key.includes('NTEE')) {
                                    // add the NTEE code to the list
                                    nteeCodes.push(key);
                                } else {
                                    // If the key is CITY, use a regex for case-insensitive matching
                                    if (key === 'Cty') {
                                        filters[key] = { $regex: new RegExp(value, 'i') };
                                    } else {
                                        filters[key] = value;
                                    }
                                }
                            }
                        }
        
                        // Build the query object
                        const queryObject = {
                            ...filters
                        };
        
                        // If there are NTEE codes, add them to the query using $or
                        if (nteeCodes.length > 0) {
                            queryObject.$or = nteeCodes.map(code => ({
                                ["MajGrp"]: query[code]
                            }));
                        }
        
                        console.log("Query Object:", queryObject);
                        const data = await database.collection("NonProfitData").find(queryObject).toArray();
        
                        console.log("Items found:", data.length);
        
                        // Disable caching
                        res.setHeader('Cache-Control', 'no-store');
                        res.setHeader('Pragma', 'no-cache');
        
                        res.status(200).json({
                            success: true,
                            data: data
                        });
                        break;
                    default:
                        res.setHeader('Cache-Control', 'no-store');
                        res.setHeader('Pragma', 'no-cache');
                        res.status(405).json({ success: false, error: 'Method not allowed' });
                        break;
                }
            }
            catch(error){
                console.error(error);
                res.setHeader('Cache-Control', 'no-store');
                res.setHeader('Pragma', 'no-cache');
                res.status(500).json({ success: false, error: 'Internal Server Error' });
            }
        }   