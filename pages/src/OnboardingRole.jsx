
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { UserTypeCard } from '../components/onboarding/UserTypeCard';
import { Loader2 } from 'lucide-react';

export default function OnboardingRolePage() {
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const prefRole = searchParams.get('prefRole');
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await User.me();
        
        if (prefRole) {
          setSelectedRole(prefRole);
        } else if (userData.user_type) {
          // If user already has a type, redirect to the appropriate dashboard
          redirectToDashboard(userData.user_type);
          return;
        }
        
        setLoading(false);
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
        // If type doesn't match, let them select a role
        setLoading(false);
    }
  };

  const handleRoleSelect = async (roleId) => {
    setSelectedRole(roleId);
    try {
      // Update user's role in the database
      await User.updateMyUserData({ user_type: roleId });
      
      // Navigate to the appropriate onboarding flow or dashboard
      switch(roleId) {
        case 'student':
          navigate(createPageUrl(`Register?type=${roleId}`));
          break;
        case 'parent':
          navigate(createPageUrl("ParentOnboarding"));
          break;
        case 'alumni':
          navigate(createPageUrl("AlumniOnboarding"));
          break;
        case 'company':
          navigate(createPageUrl("CompanyOnboarding"));
          break;
        default:
          console.error("Invalid role selected");
      }
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const roles = [
    {
      id: 'student',
      title: "I'm a Student",
      description: "Find mentors, roommates, and job opportunities to launch my career",
      icon: "GraduationCap",
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'parent',
      title: "I'm a Parent",
      description: "Support your student and connect with resources they need to succeed",
      icon: "User",
      color: 'bg-orange-100 text-orange-700'
    },
    {
      id: 'alumni',
      title: "I'm an Alumni",
      description: "Give back by mentoring students and build your professional network",
      icon: "Users",
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'company',
      title: "I'm a Company",
      description: "Connect with top talent and build your campus recruiting pipeline",
      icon: "Building2",
      color: 'bg-green-100 text-green-700'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFF] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Welcome to College Fast Forward</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select your role to help us personalize your experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map(role => (
            <UserTypeCard
              key={role.id}
              role={role}
              isSelected={selectedRole === role.id}
              onSelect={() => handleRoleSelect(role.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
