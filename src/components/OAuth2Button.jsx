// src/components/OAuth2Button.jsx
import React from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

const OAuth2Button = ({ provider }) => {
    const handleClick = () => {
        // Use Spring Security's OAuth2 endpoint
        const authUrl = `http://localhost:8080/oauth2/authorization/${provider}`;
        console.log('OAuth2 auth URL:', authUrl);
        
        // Simple page redirect
        window.location.href = authUrl;
    };

    const getButtonStyle = () => {
        switch (provider) {
            case 'github':
                return 'oauth-button oauth-btn-github';
            case 'google':
                return 'oauth-button oauth-btn-google';
            default:
                return 'oauth-button';
        }
    };

    const getIcon = () => {
        switch (provider) {
            case 'github':
                return <FaGithub className="oauth-icon" />;
            case 'google':
                return <FaGoogle className="oauth-icon" />;
            default:
                return null;
        }
    };

    return (
        <button 
            className={getButtonStyle()}
            onClick={handleClick}
        >
            {getIcon()}
            <span>Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}</span>
        </button>
    );
};

export default OAuth2Button;