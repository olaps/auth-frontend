// src/components/OAuth2RedirectHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // If already authenticated, just go to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
  

    if (token) {
      // Store token and redirect to dashboard
      login(token);
      // Use replace instead of navigate to prevent going back to this page
      navigate("/dashboard", { replace: true });
    } else {
      // If no token, go back to login
      navigate("/login", { replace: true });
    }
  }, [navigate, login, isAuthenticated]);

  return <div>Loading...</div>;
};

export default OAuth2RedirectHandler;