import React from 'react';
import { useContext } from "react";
import Header from '../components/Header';
import Slide from '../components/Slider';
import Testimonal from '../components/QuoteBlock';
import Features from '../components/Features';
import SearchBlock from '../components/SearchBlock';
import { AuthContext } from "../context/AuthContext";
//import PrivateRoute from "../components/PrivateRoute";
//import Content from '../components/Content';
import Footer from '../components/Footer';
import '../App.css';


function Home (){

    const { user } = useContext(AuthContext);

    return (
        <>
        
            <div className="App">

                <Header/>
                <Slide/>
                <Testimonal/>
                <Features/>

                {user?.role !== "pb" && <SearchBlock />}

                {/*<Content />*/}
                <Footer />

            </div>
            
        </>
    );
}

export default Home;