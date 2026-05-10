// Card.jsx

import React, { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { getDistance } from "geolib";
import OpenNowBadge from "../../../pages/pharmacy/OpenNowBadge";

export default function PharmacyCard({
  name,
  address,
  image,
  isOpen,
  latitude,
  longitude,
}) {
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const calculatedDistance = getDistance(
          {
            latitude: userLat,
            longitude: userLng,
          },
          {
            latitude,
            longitude,
          }
        );

        setDistance(calculatedDistance);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [latitude, longitude]);

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200">
      
   
      <div className="relative h-44 w-full">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />

     
        <div className="absolute top-3 right-3">
          <OpenNowBadge isOpen={isOpen} />
        </div>
      </div>

   
      <div className="space-y-3 p-4">
        
    
        <h2 className="text-xl font-semibold text-gray-900">
          {name}
        </h2>

       
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} />
          <span>{address}</span>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
          <Navigation size={16} />

          <span>{(distance / 1000).toFixed(2)} km</span>
        </div>
      </div>
    </div>
  );
}