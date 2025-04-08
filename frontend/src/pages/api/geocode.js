require('dotenv').config();


export default async function addrToLatLong(nonprofit) {
    if (!nonprofit) return null;
    const addr = [nonprofit.Addr, nonprofit.Cty, nonprofit.St]
      .filter(Boolean)
      .join(", ") // Properly format into a single string
  
    try {
        // Geocoding endpoint, constructs API call and fetches result
        const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
        const url = `${baseUrl}?address=${encodeURIComponent(addr)}&key=${process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY}`;
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`Geocoding HTTP error: ${response.status}`);
        }
        const data = await response.json();
        console.log( `data: ${data}`)
        if(data.status === 'OK'){
            const location = data.results[0].geometry.location;
            return location;
        } else {
            console.error(`Geocoding error: ${data.status}`);
            return null;
        }
    } catch (error){
        console.error( `Fetch error: ${error}`);
        return null;
    }
}
  