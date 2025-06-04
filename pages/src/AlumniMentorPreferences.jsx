
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import OnboardingStepIndicator from "../components/onboarding/OnboardingStepIndicator";
import { toast } from "../components/ui/use-toast";

export default function AlumniMentorPreferences() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    is_mentor: true,
    availability: "ad_hoc",
    expertise_areas: [],
    mentorship_topics: [],
    preferred_formats: ["virtual"],
    time_commitment: "15-30min",
    preferred_frequency: "as_needed",
    additional_preferences: ""
  });
  
  // Load existing user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const user = await User.me();
        if (!user) {
          navigate(createPageUrl("Home")); // Changed from AlumniProfileForm to Home
          return;
        }
        setUserData(user);
        
        // Check if user has completed the profile form
        if (!user.user_type || user.user_type !== "alumni") {
          navigate(createPageUrl("Home")); // Changed to redirect to Home
          return;
        }
        
        // If user already has mentor preferences, pre-populate the form
        if (user.mentor_preferences) {
          setFormData(prev => ({
            ...prev,
            ...user.mentor_preferences
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        navigate(createPageUrl("Home")); // Changed from AlumniProfileForm to Home
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);
  
  const availabilityOptions = [
    { value: "ad_hoc", label: "As needed (respond when I can)" },
    { value: "monthly", label: "Monthly (1-2 times per month)" },
    { value: "bi_weekly", label: "Bi-weekly (every other week)" },
    { value: "weekly", label: "Weekly (more committed engagement)" }
  ];
  
  const expertiseAreas = [
    "Career Planning",
    "Resume/LinkedIn Review",
    "Interview Preparation",
    "Technical Skills",
    "Industry Knowledge",
    "Leadership Development",
    "Work-Life Balance",
    "Graduate School Advice",
    "Job Search Strategies",
    "Networking Skills"
  ];
  
  const mentorshipTopics = [
    "First job preparation",
    "Career transitions",
    "Further education planning",
    "Salary negotiation",
    "Personal branding",
    "Entrepreneurship",
    "Workplace challenges",
    "Building professional relationships",
    "Internship advice",
    "Industry-specific knowledge"
  ];
  
  const formatOptions = [
    { value: "virtual", label: "Virtual meetings (Zoom, Teams, etc.)" },
    { value: "phone", label: "Phone calls" },
    { value: "email", label: "Email exchanges" },
    { value: "in_person", label: "In-person (if geographically possible)" }
  ];
  
  const timeCommitmentOptions = [
    { value: "15min", label: "15 minutes" },
    { value: "15-30min", label: "15-30 minutes" },
    { value: "30-60min", label: "30-60 minutes" },
    { value: "60min+", label: "60+ minutes" }
  ];
  
  const frequencyOptions = [
    { value: "as_needed", label: "As needed (student-initiated)" },
    { value: "one_time", label: "One-time session" },
    { value: "weekly", label: "Weekly check-ins" },
    { value: "bi_weekly", label: "Bi-weekly check-ins" },
    { value: "monthly", label: "Monthly check-ins" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCheckboxChange = (field, option) => {
    setFormData(prev => {
      const currentOptions = [...prev[field]];
      
      if (currentOptions.includes(option)) {
        return {
          ...prev,
          [field]: currentOptions.filter(item => item !== option)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentOptions, option]
        };
      }
    });
  };
  
  const handleRadioChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await User.updateMyUserData({
        mentor_preferences: formData
      });
      
      // Navigate to success page
      navigate(createPageUrl("AlumniOnboardingSuccess"));
    } catch (error) {
      console.error("Error saving mentor preferences:", error);
      toast({
        title: "Error saving preferences",
        description: "There was an error saving your mentorship preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBack = () => {
    navigate(createPageUrl("AlumniProfileForm"));
  };
  
  const handleSkip = () => {
    navigate(createPageUrl("AlumniOnboardingSuccess"));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0033A0] mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress tracker */}
      <OnboardingStepIndicator currentStep={2} totalSteps={3} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Mentorship Preferences (Optional)
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Help us understand how you prefer to mentor students. All of these settings can be changed later.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Mentorship Availability */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Availability</h2>
          
          <div className="mb-6">
            <label className="block font-medium mb-3">
              Would you like to be available for mentorship?
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="mentor_yes"
                  name="is_mentor"
                  value="true"
                  checked={formData.is_mentor === true}
                  onChange={() => handleInputChange("is_mentor", true)}
                  className="mr-2"
                />
                <label htmlFor="mentor_yes">Yes, I'm open to mentoring students</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="mentor_no"
                  name="is_mentor"
                  value="false"
                  checked={formData.is_mentor === false}
                  onChange={() => handleInputChange("is_mentor", false)}
                  className="mr-2"
                />
                <label htmlFor="mentor_no">No, not at this time</label>
              </div>
            </div>
          </div>
          
          {formData.is_mentor && (
            <>
              <div className="mb-6">
                <label className="block font-medium mb-3">
                  How often are you available to connect with students?
                </label>
                <div className="space-y-2">
                  {availabilityOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`availability_${option.value}`}
                        name="availability"
                        value={option.value}
                        checked={formData.availability === option.value}
                        onChange={() => handleRadioChange("availability", option.value)}
                        className="mr-2"
                      />
                      <label htmlFor={`availability_${option.value}`}>{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block font-medium mb-3">
                  Areas of expertise you're willing to share (select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {expertiseAreas.map((area, index) => (
                    <div key={index} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`expertise_${index}`}
                        checked={formData.expertise_areas.includes(area)}
                        onChange={() => handleCheckboxChange("expertise_areas", area)}
                        className="mt-1 mr-2"
                      />
                      <label htmlFor={`expertise_${index}`}>{area}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block font-medium mb-3">
                  Specific topics you're comfortable discussing (select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mentorshipTopics.map((topic, index) => (
                    <div key={index} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`topic_${index}`}
                        checked={formData.mentorship_topics.includes(topic)}
                        onChange={() => handleCheckboxChange("mentorship_topics", topic)}
                        className="mt-1 mr-2"
                      />
                      <label htmlFor={`topic_${index}`}>{topic}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block font-medium mb-3">
                  Preferred mentorship formats (select all that apply)
                </label>
                <div className="space-y-2">
                  {formatOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`format_${option.value}`}
                        checked={formData.preferred_formats.includes(option.value)}
                        onChange={() => handleCheckboxChange("preferred_formats", option.value)}
                        className="mr-2"
                      />
                      <label htmlFor={`format_${option.value}`}>{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block font-medium mb-3">
                  Preferred session length
                </label>
                <div className="space-y-2">
                  {timeCommitmentOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`time_${option.value}`}
                        name="time_commitment"
                        value={option.value}
                        checked={formData.time_commitment === option.value}
                        onChange={() => handleRadioChange("time_commitment", option.value)}
                        className="mr-2"
                      />
                      <label htmlFor={`time_${option.value}`}>{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block font-medium mb-3">
                  Preferred session frequency
                </label>
                <div className="space-y-2">
                  {frequencyOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`frequency_${option.value}`}
                        name="preferred_frequency"
                        value={option.value}
                        checked={formData.preferred_frequency === option.value}
                        onChange={() => handleRadioChange("preferred_frequency", option.value)}
                        className="mr-2"
                      />
                      <label htmlFor={`frequency_${option.value}`}>{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="additional_preferences" className="block font-medium mb-2">
                  Any additional mentorship preferences? (Optional)
                </label>
                <textarea
                  id="additional_preferences"
                  placeholder="Share any other preferences or limitations regarding mentorship..."
                  className="w-full p-3 border border-gray-300 rounded-md h-24"
                  value={formData.additional_preferences}
                  onChange={(e) => handleInputChange("additional_preferences", e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
          <div className="flex gap-4 order-2 sm:order-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
            >
              Skip for now
            </Button>
          </div>
          
          <Button 
            type="submit"
            className="bg-[#0033A0] hover:bg-[#0033A0]/90 w-full sm:w-auto order-1 sm:order-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
