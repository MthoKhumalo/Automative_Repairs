import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Adjust the path as needed
import { useNavigate } from "react-router-dom";
import '../CSS/Logout.css';

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to the login page after logging out
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default Logout;
