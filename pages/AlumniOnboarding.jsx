
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPageUrl } from '@/utils';
import { 
  Linkedin, 
  CheckCircle, 
  Loader2, 
  ArrowLeft,
  Rocket,
  Briefcase,
  School as SchoolIcon // Added SchoolIcon
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

// Import SchoolPicker and useSchool hook
import SchoolPicker from '@/components/school/SchoolPicker';
import { useSchool } from '@/components/school/SchoolContext';

const HELP_OPTIONS = [
  'Networking',
  'Career guidance',
  'Mentorship',
  'Industry insights',
  'Quick Convo'
];

export default function AlumniOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get currentSchool from context
  const { currentSchool } = useSchool();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    linkedin_url: '',
    alma_mater: currentSchool?.name || '', // Initialize with currentSchool name
    industry: '',
    help_methods: [],
    bio: '',
    graduation_year: '',
    major: ''
  });

  // Effect to sync formData.alma_mater with currentSchool from context
  useEffect(() => {
    if (currentSchool) {
      setFormData(prevData => ({
        ...prevData,
        alma_mater: currentSchool.name 
      }));
    } else {
      setFormData(prevData => ({ 
        ...prevData,
        alma_mater: "" 
      }));
    }
  }, [currentSchool]);

  useEffect(() => {
    let userFromStateOrStorage = null;

    if (location.state?.mockUser) {
      userFromStateOrStorage = location.state.mockUser;
    } else {
      const mockUserJson = localStorage.getItem('mockUser');
      if (mockUserJson) {
        try {
          userFromStateOrStorage = JSON.parse(mockUserJson);
        } catch (e) {
          console.error("Error parsing mockUser from localStorage:", e);
        }
      }
    }

    if (userFromStateOrStorage) {
      setCurrentUser(userFromStateOrStorage);
      setLoading(false);
    } else {
      toast({ title: "Authentication Required", description: "Please sign in to continue.", variant: "info" });
      navigate(createPageUrl("AuthSignin"));
    }
  }, [navigate, location.state, toast]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHelpOptionToggle = (option) => {
    setFormData(prev => {
      const currentHelpMethods = [...prev.help_methods];
      if (currentHelpMethods.includes(option)) {
        return { ...prev, help_methods: currentHelpMethods.filter(item => item !== option) };
      } else {
        return { ...prev, help_methods: [...currentHelpMethods, option] };
      }
    });
  };

  const isFormValid = () => {
    const isLinkedInValid = formData.linkedin_url.trim().startsWith('https://www.linkedin.com/in/');
    // formData.alma_mater will be populated by the SchoolPicker via context
    return formData.linkedin_url.trim() !== '' && 
           isLinkedInValid && 
           formData.alma_mater.trim() !== '' && // Check will use value from context
           formData.industry.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast({
        title: "Invalid Input",
        description: "Please provide a valid LinkedIn URL, select your Alma Mater, and enter your Industry.",
        variant: "destructive",
      });
      return;
    }
    if (!currentUser) {
        toast({ title: "Error", description: "User not found. Please try signing in again.", variant: "destructive" });
        navigate(createPageUrl("AuthSignin"));
        return;
    }
    setIsSubmitting(true);

    try {
      // Ensure alma_mater is up-to-date from context for submission
      const submissionData = {
        ...formData,
        alma_mater: currentSchool?.name || formData.alma_mater, // Prioritize context
      };
      console.log("Submitting Alumni Profile Data:", { userId: currentUser.id, ...submissionData });

      const updatedMockUser = { ...currentUser, user_type: 'alumni', alumniProfile: submissionData };
      localStorage.setItem('mockUser', JSON.stringify(updatedMockUser));
      
      localStorage.setItem('alumniOnboardingComplete', JSON.stringify({ 
        badge: "Community Helper", 
        points: 50, 
        timestamp: new Date().toISOString() 
      }));

      toast({
        title: "Profile Updated!",
        description: "Welcome! You're all set to connect.",
        variant: "success",
        duration: 5000,
      });
      
      navigate(createPageUrl("AlumniDashboard"));
    } catch (error) {
      console.error("Error submitting alumni onboarding:", error);
      toast({ 
        title: "Submission Failed", 
        description: "Could not save your profile. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Button 
            variant="ghost" 
            onClick={() => navigate(createPageUrl("Home"))} 
            className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <Rocket className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Alumni Onboarding</h1>
            <p className="text-gray-600 mt-2">
              Share your expertise and connect with your college community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* LinkedIn URL Field */}
            <div>
              <Label htmlFor="linkedin_url" className="font-medium">
                LinkedIn Profile URL*
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Linkedin className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => updateFormData("linkedin_url", e.target.value)}
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            {/* Alma Mater Field */}
            <div>
              <Label htmlFor="alma_mater_picker" className="font-medium">Alma Mater*</Label>
              <SchoolPicker 
                id="alma_mater_picker"
                className="mt-1"
              />
              <input type="hidden" name="alma_mater" value={formData.alma_mater} />
            </div>
            
            {/* Industry Field */}
            <div>
              <Label htmlFor="industry" className="font-medium">Current Industry*</Label>
               <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={(e) => updateFormData("industry", e.target.value)}
                  placeholder="e.g., Technology, Finance, Healthcare"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Help Options */}
            <div>
              <Label className="font-medium">How would you like to help?</Label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HELP_OPTIONS.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={formData.help_methods.includes(option) ? "default" : "outline"}
                    onClick={() => handleHelpOptionToggle(option)}
                    className={`
                      w-full justify-start text-left py-3 h-auto transition-all
                      ${formData.help_methods.includes(option) 
                        ? "shadow-md hover:shadow-lg hover:-translate-y-0.5 transform" 
                        : "hover:shadow-sm hover:-translate-y-0.5 transform"}
                    `}
                  >
                    {formData.help_methods.includes(option) && <CheckCircle className="w-4 h-4 mr-2" />}
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Optional Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <Label htmlFor="major" className="font-medium">Major (Optional)</Label>
                  <Input
                    id="major"
                    name="major"
                    value={formData.major}
                    onChange={(e) => updateFormData("major", e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="graduation_year" className="font-medium">Graduation Year (Optional)</Label>
                  <Input
                    id="graduation_year"
                    name="graduation_year"
                    type="number"
                    value={formData.graduation_year}
                    onChange={(e) => updateFormData("graduation_year", e.target.value)}
                    placeholder="e.g., 2018"
                    className="mt-1"
                  />
                </div>
            </div>

            {/* Bio Field */}
            <div>
              <Label htmlFor="bio" className="font-medium">Brief Bio (Optional)</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={(e) => updateFormData("bio", e.target.value)}
                placeholder="Share a bit about your experience and how you can help students."
                rows={3}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-gray-500">Max 300 characters. This will be visible to students seeking mentorship.</p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                variant="default"
                className={`
                  w-full flex items-center justify-center py-6 text-lg font-medium
                  shadow-md hover:shadow-xl transition-all duration-300 
                  hover:scale-[1.01] active:scale-[0.99] active:shadow-inner
                `}
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                ) : (
                  <Rocket className="w-6 h-6 mr-2" />
                )}
                {isSubmitting ? 'Saving Profile...' : 'Complete Onboarding'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
