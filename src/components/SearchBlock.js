// SearchBlock (Leaflet + OpenStreetMap Version with Real-Time Routing)
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "../CSS/SearchBlock.css";

const defaultCenter = [-26.2041, 28.0473];
const defaultRadius = 5000;

const Recenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng]);
  return null;
};

const RoutingMachine = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      lineOptions: { styles: [{ color: "blue", weight: 4 }] },
      createMarker: () => null,
      routeWhileDragging: false,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [from, to, map]);

  return null;
};

const SearchBlock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: defaultCenter[0], lng: defaultCenter[1] });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [typePlaces, setTypePlaces] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [showNearby, setShowNearby] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [placeTypes, setPlaceTypes] = useState([]);
  const [radius, setRadius] = useState(defaultRadius);
  const [routeDestination, setRouteDestination] = useState(null);
  const [remainingDistance, setRemainingDistance] = useState(null);
  const distanceIntervalRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/places/types")
      .then((res) => setPlaceTypes(res.data))
      .catch((err) => console.error("Failed to fetch place types", err));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("Detected location:", userLocation);
          setCurrentLocation(userLocation);
          setMapCenter(userLocation);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setMapCenter({ lat: defaultCenter[0], lng: defaultCenter[1] });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation not supported.");
      setMapCenter({ lat: defaultCenter[0], lng: defaultCenter[1] });
    }

    return () => {
      if (distanceIntervalRef.current) clearInterval(distanceIntervalRef.current);
    };
  }, []);

  const handleShowCurrentLocation = () => {
    if (currentLocation) {
      setMapCenter(currentLocation);
    } else {
      alert("Current location not available.");
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: searchTerm, format: "json" },
      });
      const result = response.data[0];
      const location = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
      setSearchedLocation(location);
      setMapCenter(location);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleFindNearbyPlaces = async () => {
    if (!currentLocation) return;
    if (showNearby) {
      setShowNearby(false);
      setPlaces([]);
      return;
    }
    try {
      const response = await axios.get("http://localhost:5000/api/places/nearby", {
        params: { latitude: currentLocation.lat, longitude: currentLocation.lng, radius },
      });
      if (response.data.length === 0) {
        alert("No nearby car services found within " + radius / 1000 + " km.");
      }
      const enriched = response.data.map((p) => ({
        ...p,
        distance: calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          parseFloat(p.latitude),
          parseFloat(p.longitude)
        ),
      }));
      setPlaces(enriched);
      setShowNearby(true);
    } catch (err) {
      console.error("Nearby error:", err);
    }
  };

  const handleSearchByType = async () => {
    if (!selectedType) return;
    try {
      const response = await axios.get("http://localhost:5000/api/places/type", {
        params: { type: selectedType },
      });
      setTypePlaces(response.data);
      if (response.data.length > 0) {
        setMapCenter({
          lat: parseFloat(response.data[0].latitude),
          lng: parseFloat(response.data[0].longitude),
        });
      }
    } catch (err) {
      console.error("Type search error:", err);
    }
  };

  const handleRouteToPlace = (place) => {
    if (!currentLocation) {
      alert("Current location not available.");
      return;
    }
    const destination = {
      lat: parseFloat(place.latitude),
      lng: parseFloat(place.longitude),
    };
    setRouteDestination(destination);
    calculateAndUpdateDistance(destination);

    if (distanceIntervalRef.current) clearInterval(distanceIntervalRef.current);
    distanceIntervalRef.current = setInterval(() => {
      calculateAndUpdateDistance(destination);
    }, 5000);
  };

  const calculateAndUpdateDistance = (destination) => {
    if (!currentLocation) return;
    const dist = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      destination.lat,
      destination.lng
    );
    setRemainingDistance(dist);
  };

  return (
    <div className="search-block">
      <div>
        <input type="text" placeholder="Search for a place..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={handleSearch}>Search</button>

        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">Select Place Type</option>
          {placeTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>
        <button onClick={handleSearchByType}>Search by Type</button>

        <button onClick={handleFindNearbyPlaces} style={{ marginLeft: '32%' }}>Nearby Car Services</button>
        <button onClick={handleShowCurrentLocation}>Show Current Location</button>

        <div style={{ marginTop: '10px' }}>
          <input type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))} min="100" step="100" style={{ marginRight: '10px' }} />
          <button onClick={handleFindNearbyPlaces}>Apply Radius</button>
        </div>
      </div>

      {remainingDistance && (
        <div style={{ marginTop: '10px' }}>
          <strong>Distance to Destination:</strong> {remainingDistance} km
        </div>
      )}

      <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={13} style={{ height: "600px", width: "100%" }}>
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {currentLocation && (
          <>
            <Marker position={[currentLocation.lat, currentLocation.lng]} icon={L.icon({ iconUrl: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" })}>
              <Popup>Your current location</Popup>
            </Marker>
            <Circle center={[currentLocation.lat, currentLocation.lng]} radius={radius} />
          </>
        )}

        {places.map((place, idx) => (
          <Marker key={idx} position={[parseFloat(place.latitude), parseFloat(place.longitude)]} icon={L.icon({ iconUrl: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" })}>
            <Popup>
              {place.name} - {place.distance} km
              <br />
              <button onClick={() => handleRouteToPlace(place)}>Route to Here</button>
            </Popup>
          </Marker>
        ))}

        {typePlaces.map((place, idx) => (
          <Marker key={idx} position={[parseFloat(place.latitude), parseFloat(place.longitude)]} icon={L.icon({ iconUrl: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png" })}>
            <Popup>
              {place.name}
              <br />
              <button onClick={() => handleRouteToPlace(place)}>Route to Here</button>
            </Popup>
          </Marker>
        ))}

        {searchedLocation && (
          <Marker position={[searchedLocation.lat, searchedLocation.lng]} icon={L.icon({ iconUrl: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" })}>
            <Popup>Searched location</Popup>
          </Marker>
        )}

        <Recenter lat={mapCenter.lat} lng={mapCenter.lng} />

        {currentLocation && routeDestination && (
          <RoutingMachine from={currentLocation} to={routeDestination} />
        )}
      </MapContainer>
    </div>
  );
};

export default SearchBlock;
