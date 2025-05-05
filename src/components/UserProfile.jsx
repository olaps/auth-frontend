import React, { useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        {userData.avatarUrl && (
          <img 
            src={userData.avatarUrl} 
            alt="Profile" 
            className="profile-avatar"
          />
        )}
        <div className="profile-info">
          <h2>{userData.name || userData.login}</h2>
          {userData.email && <p>{userData.email}</p>}
          {userData.githubUrl && (
            <a 
              href={userData.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
            >
              <FaGithub /> View GitHub Profile
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 