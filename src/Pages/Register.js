import React from 'react';
import '../CSS/Form.css';
import Header from '../components/Header';

const Register = () => {
  return (
    <>
      <Header />

      <div className="forms-container">
        <form className="forms-form">

          <h2>Register</h2>
          <div className="form-group">
            <label htmlFor="name"> FirstName </label>
            <input type="text" 
                    id="name" 
                    name="name" 
                    required />
          </div>

          <div className="form-group">
            <label htmlFor="surname"> LastName </label>
            <input type="text" 
                    id="surname" 
                    name="surname" 
                    required />
          </div>

          <div className="form-group">
            <label htmlFor="email"> Email </label>
            <input type="email" 
                    id="email" 
                    name="email" 
                    required />
          </div>

          <div className="form-group">
            <label htmlFor="password"> Password </label>
            <input type="password" 
                    id="password" 
                    name="password" 
                    placeholder='8 characters, include a non-character(e.g ?,$,8)'
                    required />
          </div>

          <div className="form-group">
            <label htmlFor="phone"> Phone Number </label>
            <input type="tel" 
                    id="phone" 
                    name="phone" 
                    required />
          </div>

          <button type="submit"> Register </button>
          
          <p>
            Already have an account? <a href="/login"> Sign In </a>
          </p>

        </form>
      </div>
    </>
  );
};

export default Register;