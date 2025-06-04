
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { User } from "@/api/entities";

export default function AuthSignin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(null);

  // Function to check if a user is already signed in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await User.me();
        if (user && user.user_type) {
          setUserType(user.user_type); // This might trigger redirect below
        }
      } catch (error) {
        console.log("User not authenticated for initial check");
      }
    };
    
    checkAuthStatus();
  }, []);


  useEffect(() => {
    if (userType) { // This effect runs if userType is set by the above useEffect
      console.log("User type found:", userType, "navigating to dashboard...");
      switch(userType.toLowerCase()) {
        case 'student':
          navigate(createPageUrl("StudentDashboard"));
          break;
        case 'alumni':
          navigate(createPageUrl("AlumniDashboard"));
          break;
        case 'parent':
          navigate(createPageUrl("ParentDashboard"));
          break;
        case 'company':
          navigate(createPageUrl("CompanyDashboard"));
          break;
        case 'admin': // Added admin case for redirection
          navigate(createPageUrl("AdminDashboard"));
          break;
        default:
          // If user_type is something else or not recognized, go to role selection
          navigate(createPageUrl("OnboardingRole")); 
      }
    }
  }, [userType, navigate]);

  const handleRealLogin = async () => {
    setLoading(true);
    try {
      await User.login();
      // Google redirect will happen, then the useEffects above will handle post-login navigation
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  const handleDevLogin = async (type) => {
    setLoading(true);
    try {
      console.log(`Attempting dev login as ${type}...`);
      localStorage.setItem('user_type_override', type); // Use a distinct key for dev override
      
      let targetPage = "OnboardingRole"; // Default if type not recognized
      
      // Attempt to update user data only if a user might be logged in
      try {
        const u = await User.me(); // Check if user is logged in
        if (u) {
          await User.updateMyUserData({ user_type: type });
          console.log(`User data updated with type: ${type} for user ${u.email}`);
        } else {
          console.warn("No user logged in, cannot update User.me(). Dev login will rely on localStorage override if app logic supports it.");
        }
      } catch (error) {
         // This error is expected if no user is logged in.
        console.warn("Could not update user data (User.me likely failed):", error.message);
      }
      
      // Navigate to the appropriate dashboard after attempting update
      switch(type.toLowerCase()) {
        case 'student':
          targetPage = "StudentDashboard";
          break;
        case 'alumni':
          targetPage = "AlumniDashboard";
          break;
        case 'parent':
          targetPage = "ParentDashboard";
          break;
        case 'company':
          targetPage = "CompanyDashboard";
          break;
        case 'admin':
          targetPage = "AdminDashboard";
          break;
        default:
          targetPage = "OnboardingRole"; 
      }
      navigate(createPageUrl(targetPage));

    } catch (error) {
      console.error(`Dev login as ${type} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6d6d49_collegefastforwardlogo.png" 
            alt="College Fast Forward" 
            className="mx-auto h-12 w-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sign In
          </h1>
          <p className="text-gray-600 mb-8">
            Access your personalized dashboard.
          </p>
        </div>

        <div className="space-y-4 mt-8">
          <Button
            onClick={handleRealLogin}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          
          {/* Dev login options */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500 mb-4">Development Options</p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleDevLogin('student')}
                variant="outline"
                className="py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                disabled={loading}
              >
                Student User
              </Button>
              <Button
                onClick={() => handleDevLogin('alumni')}
                variant="outline"
                className="py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                disabled={loading}
              >
                Alumni User
              </Button>
              <Button
                onClick={() => handleDevLogin('parent')}
                variant="outline"
                className="py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                disabled={loading}
              >
                Parent User
              </Button>
              <Button
                onClick={() => handleDevLogin('company')}
                variant="outline"
                className="py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                disabled={loading}
              >
                Company User
              </Button>
              <Button
                onClick={() => handleDevLogin('admin')}
                variant="outline"
                className="py-3 col-span-2 bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 transition" // Spans 2 columns and styled for admin
                disabled={loading}
              >
                Admin (Dev)
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate(createPageUrl('Home'))}
              className="mt-6 text-sm text-gray-600 hover:text-gray-700"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
