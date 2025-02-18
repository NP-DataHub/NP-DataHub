import React, { useEffect, useRef, useState } from 'react';

const MapComponent = ({ points, lat, lng, zoom, searchResults }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!GOOGLE_KEY) {
            console.error('Google Maps API key is not defined');
            return;
        }

        const googleMapsScript = document.createElement('script');
        googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}`;
        googleMapsScript.async = true;
        googleMapsScript.defer = true;
        window.document.body.appendChild(googleMapsScript);

        googleMapsScript.addEventListener('load', () => {
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: { lat, lng },
                zoom: zoom,
            });
            setMap(mapInstance);
        });

        return () => {
            if (googleMapsScript) {
                googleMapsScript.removeEventListener('load', () => {});
                window.document.body.removeChild(googleMapsScript);
            }
        };
    }, [lat, lng, zoom]);

    useEffect(() => {
        if (map && searchResults.length > 0) {
            const geocoder = new window.google.maps.Geocoder();
            const markerPromises = searchResults.map(result => {
                return new Promise((resolve, reject) => {
                    geocoder.geocode({ address: result.Addr + ", " + result.City + ", " + result.Zip }, (results, status) => {
                        if (status === 'OK') {
                            const marker = new window.google.maps.Marker({
                                position: results[0].geometry.location,
                                map: map,
                                title: result.Nm,
                            });

                            marker.addListener('click', () => {
                                setSelectedMarker({
                                    position: results[0].geometry.location,
                                    name: result.Nm,
                                    address: result.Addr,
                                });
                            });

                            resolve(marker);
                        } else {
                            reject(`Geocode was not successful for the following reason: ${status}`);
                        }
                    });
                });
            });

            Promise.all(markerPromises)
                .then(markerResults => {
                    setMarkers(markerResults);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [map, searchResults]);

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <div ref={mapRef} style={{ height: '100%' }}></div>
            {points.length > 0 && (
                <div className="shadow-lg font-bold" style={{ position: 'absolute', top: '15%', left: 10, backgroundColor: '#d3d3d3', padding: '10px', color: 'black' }}>
                    <ul>
                        {points.map((point, index) => (
                            <li key={index}>{point.label}: {point.val}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MapComponent;