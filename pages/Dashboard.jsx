
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { StudentProfile } from "@/api/entities";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Users, 
  Search, 
  HelpCircle, 
  Building2,
  ArrowRight,
  UserCheck,
  Home,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [firstVisit, setFirstVisit] = useState(false);
  
  useEffect(() => {
    loadUserData();
    
    // Check if this is the first dashboard visit after onboarding
    const isFirstVisit = sessionStorage.getItem('firstDashboardVisit');
    if (isFirstVisit !== 'false') {
      setFirstVisit(true);
      sessionStorage.setItem('firstDashboardVisit', 'false');
    }
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await User.me();
      setUser(userData);
      
      // Check for existing profile
      try {
        const profiles = await StudentProfile.filter({ user_id: userData.id });
        setProfile(profiles.length > 0 ? profiles[0] : null);
      } catch (err) {
        console.log("No student profile found or error:", err);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to home page
  const handleHomeClick = () => {
    navigate(createPageUrl("Home"));
  };

  // Change any profile references to go to onboarding
  const handleProfileClick = () => {
    navigate(createPageUrl("Onboarding"));
  };

  // Get a personalized greeting
  const getGreeting = () => {
    const firstName = user?.full_name ? user.full_name.split(' ')[0] : '';
    if (profile?.major) {
      return `Welcome ${firstName}! Ready to advance your ${profile.major} journey?`;
    }
    return `Welcome${firstName ? ', ' + firstName : ''}! 🎉`;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0033A0] mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getGreeting()}
            </h1>
            <p className="text-gray-600">
              Your Gator network is ready. Choose a service below to get started!
            </p>
          </div>
          
          <Button 
            onClick={handleProfileClick}
            className="inline-flex items-center px-4 py-2 bg-[#0033A0] border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-[#002280] transition-all duration-200 hover:translate-y-[-2px]"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* First Visit Success Message */}
        {firstVisit && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-center">
            <div className="bg-green-100 rounded-full p-2 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-1">You're all set!</h3>
              <p className="text-green-700">Your dashboard is ready. Start exploring opportunities below.</p>
            </div>
            <button 
              onClick={() => setFirstVisit(false)} 
              className="ml-auto text-green-600 hover:text-green-800"
              aria-label="Dismiss message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        {/* 4 Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Card 1: Find a Mentor */}
          <div className="bg-purple-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-5">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Find a Mentor</h3>
            <p className="text-gray-700 mb-6 min-h-[80px]">
              {profile?.major 
                ? `Connect with Gator alumni in ${profile.major} who can offer advice and industry insights.`
                : "Connect with inspiring Gator alumni ready to offer career advice, mentorship, and real-world insights."}
            </p>
            <Link 
              to={createPageUrl("Mentorship")} 
              className="inline-flex items-center text-purple-700 font-medium hover:text-purple-800"
            >
              Explore Mentors
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Card 2: Find a Roommate */}
          <div className="bg-green-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-5">
              <Search className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Find a Roommate</h3>
            <p className="text-gray-700 mb-6 min-h-[80px]">
              Match with fellow Gators heading where you're headed — across town or across campus.
            </p>
            <Link 
              to={createPageUrl("GatorMate")} 
              className="inline-flex items-center text-green-700 font-medium hover:text-green-800"
            >
              Start Searching
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Card 3: Tap Into 6° Degrees */}
          <div className="bg-blue-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-5">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Tap Into 6° Degrees</h3>
            <p className="text-gray-700 mb-6 min-h-[80px]">
              Not sure who to ask? Post your question — the Gator community is listening and ready to help.
            </p>
            <Link 
              to={createPageUrl("Network")} 
              className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800"
            >
              Ask a Question
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Card 4: Explore Resources */}
          <div className="bg-amber-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-5">
              <Building2 className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Explore Resources</h3>
            <p className="text-gray-700 mb-6 min-h-[80px]">
              {profile?.major
                ? `Find ${profile.major}-related career resources, guides and helpful materials.`
                : "Access career guides, templates, and resources to help you succeed."}
            </p>
            <Link 
              to={createPageUrl("Resources")} 
              className="inline-flex items-center text-amber-700 font-medium hover:text-amber-800"
            >
              View Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
