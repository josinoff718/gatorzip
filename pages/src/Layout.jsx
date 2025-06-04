
import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageErrorBoundary from "../components/home/PageErrorBoundary";
import { UserContext } from "../providers/UserProvider";
import User from "../models/User";
import { createPageUrl } from "../utils/route";

export default function Layout({ children, currentPageName }) {
  const { setUserState } = useContext(UserContext);
  const navigate = useNavigate();

  const loadFromCache = () => {
    const cachedUserData = localStorage.getItem('userData');
    const cachedUserType = localStorage.getItem('user_type');

    if (cachedUserData) {
      try {
        const userData = JSON.parse(cachedUserData);
        setUserState({
          user: userData,
          userType: cachedUserType || userData.user_type || 'visitor',
          isAuthenticated: true,
          loading: false
        });
      } catch (e) {
        console.warn("Failed to parse cached user data", e);
        localStorage.removeItem('userData');
        localStorage.removeItem('user_type');
      }
    } else {
      setUserState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await User.me();
        
        // Cache the user data
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('user_type', userData.user_type || 'visitor');
        localStorage.setItem('lastAuthCheck', Date.now().toString());
        
        setUserState({
          user: userData,
          userType: userData.user_type || 'visitor',
          isAuthenticated: true,
          loading: false
        });

        // If we're on onboarding pages but already have a type, redirect to appropriate dashboard
        if (currentPageName?.toLowerCase().includes('onboarding')) {
          const userType = userData.user_type?.toLowerCase();
          if (userType) {
            switch(userType) {
              case 'parent':
                navigate(createPageUrl("ParentDashboard"));
                break;
              case 'student':
                navigate(createPageUrl("StudentDashboard"));
                break;
              case 'alumni':
                navigate(createPageUrl("AlumniDashboard"));
                break;
              default:
                // Do nothing, let them continue onboarding
                break;
            }
          }
        }
      } catch (error) {
        if (error.response?.status === 429) {
          // If rate limited, just use cached data and try again later
          console.warn('Rate limited, using cached data');
          loadFromCache();
        } else {
          console.warn("Auth check failed:", error);
          // Clear potentially invalid cache data
          localStorage.removeItem('userData');
          localStorage.removeItem('user_type');
          setUserState(prev => ({
            ...prev,
            loading: false,
            isAuthenticated: false
          }));
        }
      }
    };

    // First try to load from cache
    loadFromCache();
    
    // Then check if we need to refresh auth
    const lastCheckTime = localStorage.getItem('lastAuthCheck');
    const now = Date.now();
    
    // Only check auth if it's been more than 5 minutes since last check
    if (!lastCheckTime || (now - parseInt(lastCheckTime)) > 300000) {
      checkAuth();
    }
  }, [currentPageName, navigate, setUserState]);

  return (
    <PageErrorBoundary>
      <div>
        {/* Add fonts and global styles */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

          .font-display {
            font-family: 'Poppins', sans-serif;
          }

          .font-body {
            font-family: 'Inter', sans-serif;
          }

          /* Add any other global styles here */
          body {
            font-family: 'Inter', sans-serif;
          }

          h1, h2, h3, h4, h5, h6 {
            font-family: 'Poppins', sans-serif;
          }
        `}</style>

        {/* Main content wrapped in error boundary */}
        {children}
      </div>
    </PageErrorBoundary>
  );
}
