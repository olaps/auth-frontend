import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGitHubUser, setIsGitHubUser] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log('Fetching user info with token:', token);
        
        // First try the GitHub endpoint
        try {
          const githubResponse = await axios.get('http://localhost:8080/api/github/user', {
            headers: {
              Authorization: token
            }
          });
          console.log("githubResponse", githubResponse)

          if (githubResponse.data) {
            console.log('GitHub user info:', githubResponse.data);
            setUserInfo({
              username: githubResponse.data.login,
              email: githubResponse.data.email,
              name: githubResponse.data.name,
              avatar_url: githubResponse.data.avatar_url,
              bio: githubResponse.data.bio,
              location: githubResponse.data.location,
              company: githubResponse.data.company,
              blog: githubResponse.data.blog,
              followers: githubResponse.data.followers,
              following: githubResponse.data.following
            });
            setIsGitHubUser(true);
            setLoading(false);
            return;
          }
        } catch (githubError) {
          console.log('GitHub endpoint error:', githubError);
        }

        // If GitHub endpoint fails, try the protected endpoint
        const protectedResponse = await axios.get('http://localhost:8080/api/protected/user', {
          headers: {
            Authorization: token
          }
        });
        
        console.log('Protected endpoint response:', protectedResponse.data);
        setUserInfo(protectedResponse.data);
        setIsGitHubUser(false);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Failed to fetch user information. Please try logging in again.');
        setLoading(false);
      }
    };

    if (token) {
      fetchUserInfo();
    } else {
      setError('No authentication token found. Please log in.');
      setLoading(false);
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">{userInfo?.email}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            Welcome back, {userInfo?.name || userInfo?.username}
          </h2>
          <p className="mt-2 text-base text-gray-600">
            {isGitHubUser ? 'Your GitHub profile information' : 'Here\'s what\'s happening with your account today.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isGitHubUser ? (
            <>
              {/* GitHub Profile Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-500 transition-colors duration-200">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">GitHub Profile</p>
                  <p className="text-lg font-medium text-gray-900">{userInfo?.username}</p>
                  {userInfo?.bio && <p className="text-sm text-gray-600">{userInfo.bio}</p>}
                </div>
              </div>

              {/* GitHub Stats Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-500 transition-colors duration-200">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">GitHub Stats</p>
                  <div className="flex space-x-4">
                    <div>
                      <p className="text-lg font-medium text-gray-900">{userInfo?.followers}</p>
                      <p className="text-sm text-gray-600">Followers</p>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">{userInfo?.following}</p>
                      <p className="text-sm text-gray-600">Following</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Info Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-500 transition-colors duration-200">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Additional Info</p>
                  {userInfo?.location && <p className="text-sm text-gray-600">📍 {userInfo.location}</p>}
                  {userInfo?.company && <p className="text-sm text-gray-600">🏢 {userInfo.company}</p>}
                  {userInfo?.blog && (
                    <a href={userInfo.blog} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800">
                      🌐 {userInfo.blog}
                    </a>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Regular User Cards */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-500 transition-colors duration-200">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Profile Status</p>
                  <p className="text-lg font-medium text-gray-900">Active</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-500 transition-colors duration-200">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Last Login</p>
                  <p className="text-lg font-medium text-gray-900">Today</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-500 transition-colors duration-200">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Account Type</p>
                  <p className="text-lg font-medium text-gray-900">Standard</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 tracking-tight mb-4">
            {isGitHubUser ? 'GitHub Activity' : 'Recent Activity'}
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-5 py-4">
              <div className="space-y-2">
                <p className="text-base font-medium text-gray-900">
                  {isGitHubUser ? 'Successfully connected to GitHub' : 'Successfully logged in'}
                </p>
                <p className="text-sm text-gray-500">
                  Just now
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 