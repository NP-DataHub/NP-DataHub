import React, { useEffect, useRef } from 'react';

const MapComponent = ({points, lat, lng, zoom }) => {
    const mapRef = useRef(null);

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
            const map = new window.google.maps.Map(mapRef.current, {
                center: {lat, lng},
                zoom: zoom,
            });
        });

        return () => {
            if (googleMapsScript) {
                googleMapsScript.removeEventListener('load', () => {});
                window.document.body.removeChild(googleMapsScript);
            }
        };
    }, [points, lat, lng, zoom]);

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <div ref={mapRef} style={{ height: '100%' }}></div>
            {points.length > 0 && (
            <div style={{ position: 'absolute', top: '10%', left: 0, backgroundColor: 'white', padding: '10px', color: 'black' }}>
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