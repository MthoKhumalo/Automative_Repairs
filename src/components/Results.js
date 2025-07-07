import React from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Search from "../components/Search";
import Footer from "../components/Footer";

const ResultsPage = ({ places }) => {
  return (
    <>
        <Header/>
        <Search/>
        
        <div>

            {places.length === 0 ? (

                <p>No places found.</p>

            ) : (
                
                places.map((place) => (

                <div key={place.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>

                    <h2>{place.name}</h2>
                    <p>{place.address}</p>
                    <Link to={`/places/${place.id}`}>View Details</Link>
                    <Link to={`/map`}>View on Map</Link>

                </div>
                ))

            )}
        </div>

        <Footer/>
    </>
  );
};

export default ResultsPage;