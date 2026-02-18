
"use client"
import React from 'react'

const GoogleMapComponents = ({ lat, lng }) => {
    // Default coordinates (Dhaka, Bangladesh or use user's request context)
    // Default lat/lng from global schema was 23.8103968, 90.41256666
    const latitude = lat || 23.8103968;
    const longitude = lng || 90.41256666;

    // Use OpenStreetMap or Google Maps embed URL
    // Google Maps Embed API (simple mode with q param)
    // q=lat,lng
    const mapSrc = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=es&z=14&output=embed`;

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
            ></iframe>
        </div>
    );
}

export default GoogleMapComponents;
