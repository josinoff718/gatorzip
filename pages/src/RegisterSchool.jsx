
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { StudentProfile } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function RegisterSchool() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [lookingFor, setLookingFor] = useState([]);
  const [quickIntro, setQuickIntro] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressValue, setProgressValue] = useState(50); // Start at 50% since step 1 is complete
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  
  // Step 1 data
  const [step1Data, setStep1Data] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load step 1 data
        const savedDataStr = localStorage.getItem('studentVerificationStepData');
        if (!savedDataStr) {
          // If no step 1 data, redirect back to step 1
          navigate(createPageUrl('Register'));
          return;
        }

        const savedData = JSON.parse(savedDataStr);
        setStep1Data(savedData);

        // Load any previously saved step 2 data
        const savedStep2Str = localStorage.getItem('studentProfileDetailsStepData');
        if (savedStep2Str) {
          const savedStep2 = JSON.parse(savedStep2Str);
          if (savedStep2.lookingFor) setLookingFor(savedStep2.lookingFor);
          if (savedStep2.quickIntro) setQuickIntro(savedStep2.quickIntro);
          if (savedStep2.location) setLocation(savedStep2.location);
          if (savedStep2.photoUrl) setPhotoUrl(savedStep2.photoUrl);
          if (savedStep2.resumeUrl) setResumeUrl(savedStep2.resumeUrl);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        toast({
          title: "Error",
          description: "There was an error loading your previous information. Please try again.",
          variant: "destructive"
        });
        navigate(createPageUrl('Register'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate, toast]);

  const handleLookingForChange = (value) => {
    setLookingFor(prev => {
      const newLookingFor = prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value];
      return newLookingFor;
    });
    setTouched(prev => ({ ...prev, lookingFor: true }));
  };

  const isFormValid = () => {
    return lookingFor.length > 0; // At minimum, we need what they're looking for
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!step1Data) {
      toast({
        title: "Error",
        description: "Please complete step 1 first",
        variant: "destructive"
      });
      navigate(createPageUrl('Register'));
      return;
    }

    if (!isFormValid()) {
      setTouched({ lookingFor: true });
      toast({
        title: "Missing Information",
        description: "Please select what you're looking for",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the profile data combining both steps
      const profileData = {
        full_name: step1Data.fullName,
        school_domain: step1Data.schoolDomain,
        school_email: step1Data.schoolEmail,
        student_id: step1Data.studentId || "",
        verification_method: step1Data.verificationMethod,
        // Convert array to comma-separated string for looking_for
        looking_for: lookingFor.join(', '),
        quick_intro: quickIntro || "",
        location: location || "",
        photo_url: photoUrl || "",
        resume_url: resumeUrl || "",
        graduation_year: new Date().getFullYear() + 4, // Default to 4 years from now
        // Add required major field
        major: "Not specified", // This is required by the schema
      };

      // Create/update profile
      const user = await User.me();
      if (!user) throw new Error("No user found");

      await StudentProfile.create({
        ...profileData,
        user_id: user.id
      });

      // Clear stored data
      localStorage.removeItem('studentVerificationStepData');
      localStorage.removeItem('studentProfileDetailsStepData');
      
      // Mark onboarding as complete
      localStorage.setItem('onboardingComplete', 'true');

      // Navigate to dashboard
      navigate(createPageUrl('Dashboard'));
      
      toast({
        title: "Success!",
        description: "Your profile has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Failed to create your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    // Save current progress
    const dataToSave = {
      lookingFor,
      quickIntro,
      location,
      photoUrl,
      resumeUrl
    };
    localStorage.setItem('studentProfileDetailsStepData', JSON.stringify(dataToSave));
    navigate(createPageUrl('Register'));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 text-sm">Step 2 of 2: Tell us what you're looking for</p>
          <Progress value={progressValue} className="h-2 mt-2" />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3">
                What are you looking for? <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2">
                {['Mentorship', 'Internship', 'Career Advice', 'Networking'].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.toLowerCase()}
                      checked={lookingFor.includes(option)}
                      onChange={() => handleLookingForChange(option)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={option.toLowerCase()} className="ml-2 block text-sm text-gray-900">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              {touched.lookingFor && lookingFor.length === 0 && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />Please select at least one option
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="quickIntro">Quick intro (optional)</Label>
              <Textarea
                id="quickIntro"
                value={quickIntro}
                onChange={(e) => setQuickIntro(e.target.value)}
                placeholder="Tell us a bit about yourself..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, NY"
                className="mt-1"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                type="submit"
                className="flex-1 bg-[#FA4616] hover:bg-[#E03A04]"
                disabled={isSubmitting || !isFormValid()}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Creating Profile...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
