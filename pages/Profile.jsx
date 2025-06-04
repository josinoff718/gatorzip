import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';

export default function ProfileRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToProperPage = async () => {
      try {
        const userData = await User.me();
        const userType = userData?.user_type?.toLowerCase();
        
        switch (userType) {
          case 'student':
            navigate(createPageUrl("StudentOnboarding"), { replace: true });
            break;
          case 'alumni':
            navigate(createPageUrl("AlumniOnboarding"), { replace: true });
            break;
          case 'parent':
            navigate(createPageUrl("ParentOnboarding"), { replace: true });
            break;
          case 'company':
            navigate(createPageUrl("CompanyOnboarding"), { replace: true });
            break;
          default:
            // Default to regular onboarding if no specific type
            navigate(createPageUrl("Onboarding"), { replace: true });
        }
      } catch (error) {
        console.error("Error determining user type:", error);
        // If not authenticated or error, go to Onboarding
        navigate(createPageUrl("Onboarding"), { replace: true });
      }
    };
    
    redirectToProperPage();
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#0021A5] mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-700 mb-2">Redirecting...</h1>
        <p className="text-gray-500">Taking you to your profile page</p>
      </div>
    </div>
  );
}