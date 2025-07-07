import React, { useContext, useState } from "react";
import "../CSS/Form.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const Login = () => {

  const { login } = useContext(AuthContext);
  console.log("AuthContext in Login:", login);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {

    e.preventDefault();

    fetch("http://localhost:5000/api/login", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    .then((res) => res.json())
    .then((data) => {
  
      if (data.error) {

        alert(data.error);
      
      } else {
        login(data);
        navigate("/");
      }
    })
    .catch((err) => console.error("Login error:", err));
    
  };

  return (
    <>
      <Header />
      <div className="forms-container">
        <form className="forms-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Email"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="8 characters, include a non-character(e.g ?,$,8)"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Login</button>
          <p>
            Don't have an account? <a href="/register"> SignUp </a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
