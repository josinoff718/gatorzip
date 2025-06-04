
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fix URL parameter handling
  const searchParams = new URLSearchParams(location.search);
  const prefRole = searchParams.get('prefRole');
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await User.me();
        
        // If user already has a type, redirect to the appropriate dashboard
        if (userData.user_type) {
          redirectToDashboard(userData.user_type);
        } else {
          // Redirect to role selection page with proper query parameter
          navigate(createPageUrl(`OnboardingRole${prefRole ? '?prefRole=' + prefRole : ''}`));
        }
      } catch (error) {
        console.error("User not authenticated:", error);
        // Redirect to login
        navigate(createPageUrl("AuthSignin"));
      }
    };
    
    checkAuth();
  }, [prefRole, navigate]);

  const redirectToDashboard = (userType) => {
    switch(userType.toLowerCase()) {
      case 'student':
        // Check if onboarding is complete
        const onboardingComplete = localStorage.getItem('onboardingComplete');
        if (onboardingComplete === 'true') {
          navigate(createPageUrl("StudentDashboard"));
        } else {
          // Resume onboarding
          navigate(createPageUrl("Register"));
        }
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
        // If type doesn't match, let them select a role
        navigate(createPageUrl("OnboardingRole"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
    </div>
  );
}
