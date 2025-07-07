import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import PrivateRoute from "../components/PrivateRoute";
import Logout from "../components/Logout"; 
import '../CSS/Header.css';
import logoIcon from '../images2/logo.png';
import menuIcon from '../images2/menu.png';
import profileIcon from '../images2/profile.png'; 

const Header = () => {

  const [isNavVisible, setIsNavVisible] = useState(false);

  const toggleNav = () => {

    setIsNavVisible(!isNavVisible);
  };

  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuVisible(!isProfileMenuVisible);
  };

  return (
    <>

      <header className="header">
        <div className="side-nav">

          <img

            src={menuIcon}
            alt="Menu"
            className="menu-icon"
            onClick={toggleNav}

          />

          <nav className={`nav-menu ${isNavVisible ? 'visible' : ''}`}>

            <Link to="/Chat">Get Quoters</Link>
            <Link to="/places">Find Panel Beaters</Link>

          </nav>
        </div>

        <div className="logo">

          <Link to="/home">
            <img 
              src={logoIcon} alt="Logo" 
            />
          </Link>
          <PrivateRoute>
          <Logout />
          </PrivateRoute>

        </div>

        <div className="profile">

          <img

            src={profileIcon}
            alt="Profile"
            className="profile-icon"
            onClick={toggleProfileMenu}

          />
          
          {isProfileMenuVisible && (
            <div className="profile-menu">

              <Link to="/Login">Login</Link>
              <Link to="/register">Register</Link>
              
            </div>
          )}

        </div>
      </header>

    </>
  );
};

export default Header;