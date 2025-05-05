import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OAuth2RedirectPage = () => {
  const { provider } = useParams();

  useEffect(() => {
    const oauthUrl = `http://localhost:8080/oauth2/authorization/${provider}`;
    window.location.href = oauthUrl;
  }, [provider]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.2rem'
    }}>
      Redirecting to {provider} authentication...
    </div>
  );
};

export default OAuth2RedirectPage; 