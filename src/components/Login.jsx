// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import OAuth2Button from "./OAuth2Button";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
      
      if (response.data && response.data.token) {
        // Let AuthContext handle the Bearer prefix
        login(response.data.token);
        navigate("/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="username"
          placeholder="Username" 
          onChange={handleChange}
          required 
        />
        <input
          name="password"
          type="password"
          placeholder="Password" 
          onChange={handleChange}
          required 
        />
        <button type="submit">Sign In</button>
      </form>

      <div className="divider">
        <span>OR</span>
      </div>

      <div className="oauth-buttons">
        <OAuth2Button provider="github" />
        <OAuth2Button provider="google" />
      </div>

      <p className="auth-footer">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;