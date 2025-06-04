import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';

// This component serves as a hub to redirect users to their appropriate dashboard
// based on their user type after login
export default function DashboardRedirect() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const redirectToDashboard = async () => {
      try {
        // Get current user data
        const userData = await User.me();
        
        // Based on user type, redirect to appropriate dashboard
        switch(userData.user_type?.toLowerCase()) {
          case 'student':
            navigate(createPageUrl("StudentDashboard"));
            break;
          case 'parent':
            navigate(createPageUrl("ParentDashboard"));
            break;
          case 'alumni':
            navigate(createPageUrl("AlumniDashboard"));
            break;
          case 'company':
            navigate(createPageUrl("CompanyDashboard"));
            break;
          default:
            // If user type is not set, redirect to onboarding
            navigate(createPageUrl("Onboarding"));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Unable to determine your user type. Redirecting to home page...");
        // If there's an error, redirect to home after a brief delay
        setTimeout(() => {
          navigate(createPageUrl("Home"));
        }, 3000);
      }
    };
    
    redirectToDashboard();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {error ? (
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600">Redirecting to your dashboard...</p>
        </div>
      )}
    </div>
  );
}