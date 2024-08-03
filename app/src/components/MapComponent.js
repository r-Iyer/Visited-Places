// src/components/MapComponent.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import '.././styles.css'; // Import your custom styles

const MapComponent = () => {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        fetch('/places.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(csvText => {
                console.log('CSV content:', csvText); // Debug CSV content
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    delimiter: ",",
                    complete: (results) => {
                        console.log('Parsed results:', results); // Debug parsing results
                        setPlaces(results.data);
                    },
                    error: (error) => {
                        console.error('Error parsing CSV:', error);
                    }
                });
            })
            .catch(error => console.error('Error loading CSV file:', error));
    }, []);

    const customIcon = new L.Icon({
        iconUrl: '/icons/marker.png', // Update with your icon path
        iconSize: [22, 22],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    return (
        <MapContainer center={[22.57339112, 88.350074]} zoom={4} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {places.map((place, index) => (
                <Marker
                    key={index}
                    position={[parseFloat(place.latitude), parseFloat(place.longitude)]}
                    icon={customIcon}
                >
                    <Popup>
                        <div>
                            <b>{place.town}</b><br />
                            {place.state}<br />
                            <img 
                                src={place.picture} 
                                alt={place.town} 
                                style={{ width: '100px', height: 'auto', marginTop: '5px' }}
                            />
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
