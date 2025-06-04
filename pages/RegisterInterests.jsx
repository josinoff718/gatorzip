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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Upload, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import confetti from 'canvas-confetti';

const CAREER_INTERESTS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Marketing",
  "Engineering",
  "Business",
  "Art & Design",
  "Education",
  "Science",
  "Law",
  "Media & Communication"
];

const CURRENT_YEAR = new Date().getFullYear();
const GRADUATION_YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR + i);

export default function RegisterInterests() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    major: '',
    graduationYear: CURRENT_YEAR + 4,
    interests: [],
    location: '',
    bio: '',
    photo: null
  });
  const [step1Data, setStep1Data] = useState(null);
  const [step2Data, setStep2Data] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(75);
  const [saveTimeout, setSaveTimeout] = useState(null);
  
  // Load previous steps data
  useEffect(() => {
    const loadPreviousData = () => {
      const step1 = localStorage.getItem('registrationStep1');
      const step2 = localStorage.getItem('registrationStep2');
      
      if (step1) {
        setStep1Data(JSON.parse(step1));
      } else {
        // If no step 1 data, redirect back
        navigate(createPageUrl('Register'));
      }
      
      if (step2) {
        setStep2Data(JSON.parse(step2));
      } else {
        // If no step 2 data, redirect back
        navigate(createPageUrl('RegisterSchool'));
      }
    };
    
    const loadSavedData = () => {
      const savedData = localStorage.getItem('registrationStep3');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          if (parsedData.photo) {
            setPreviewImage(parsedData.photo);
          }
        } catch (e) {
          console.error("Error parsing saved data", e);
        }
      }
    };
    
    loadPreviousData();
    loadSavedData();
  }, [navigate]);

  // Auto-save after changes
  const autoSave = (data) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    
    const timeoutId = setTimeout(() => {
      localStorage.setItem('registrationStep3', JSON.stringify(data));
      toast({
        title: "Progress saved",
        description: "Your information has been saved",
        duration: 2000,
      });
    }, 800);
    
    setSaveTimeout(timeoutId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    autoSave(updatedData);
  };
  
  const handleInterestToggle = (interest) => {
    let newInterests;
    if (formData.interests.includes(interest)) {
      newInterests = formData.interests.filter(i => i !== interest);
    } else {
      newInterests = [...formData.interests, interest];
    }
    
    const updatedData = { ...formData, interests: newInterests };
    setFormData(updatedData);
    autoSave(updatedData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const dataUrl = fileReader.result;
        setPreviewImage(dataUrl);
        
        const updatedData = { ...formData, photo: dataUrl };
        setFormData(updatedData);
        autoSave(updatedData);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    navigate(createPageUrl('RegisterSchool'));
  };

  // Confetti animation for completion
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save interests data
      localStorage.setItem('registrationStep3', JSON.stringify(formData));
      
      // Get current user
      const user = await User.me();
      
      // Create/update student profile
      const profileData = {
        user_id: user.id,
        major: formData.major,
        graduation_year: formData.graduationYear,
        career_interest: formData.interests.join(','),
        location: formData.location,
        bio: formData.bio,
        photo_url: formData.photo // In a real implementation, you would upload this to storage first
      };
      
      // Check if profile already exists
      const existingProfiles = await StudentProfile.filter({ user_id: user.id });
      
      if (existingProfiles.length > 0) {
        await StudentProfile.update(existingProfiles[0].id, profileData);
      } else {
        await StudentProfile.create(profileData);
      }
      
      // Clean up local storage
      localStorage.removeItem('registrationStep1');
      localStorage.removeItem('registrationStep2');
      localStorage.removeItem('registrationStep3');
      
      // Set onboarding complete flag
      localStorage.setItem('onboardingComplete', 'true');
      
      // Trigger confetti animation
      triggerConfetti();
      
      // Show success message
      toast({
        title: "Registration complete!",
        description: "Your profile has been created successfully",
        variant: "success",
      });
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate(createPageUrl('StudentDashboard'));
      }, 1500);
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "There was a problem completing your registration. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  const handleSkip = () => {
    navigate(createPageUrl('StudentDashboard'));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Progress Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tell us about your interests
          </h1>
          <p className="text-gray-600 text-sm mb-4">Step 3 of 3 (Optional)</p>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Major */}
            <div>
              <Label htmlFor="major" className="block text-sm font-medium text-gray-700">
                Major / Field of Study
              </Label>
              <Input
                id="major"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                placeholder="e.g., Computer Science, Business"
                className="mt-1"
              />
            </div>

            {/* Graduation Year */}
            <div>
              <Label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
                Expected Graduation Year
              </Label>
              <select
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleInputChange}
                className="w-full h-10 mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {GRADUATION_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Career Interests */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Career Interests
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {CAREER_INTERESTS.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={`interest-${interest}`}
                      checked={formData.interests.includes(interest)}
                      onCheckedChange={() => handleInterestToggle(interest)}
                    />
                    <label
                      htmlFor={`interest-${interest}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {interest}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State"
                className="mt-1"
              />
              <p className="text-gray-500 text-xs mt-1">
                Where you're based or looking to work after graduation
              </p>
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Quick Introduction
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us a bit about yourself..."
                className="mt-1 h-24"
              />
            </div>

            {/* Photo */}
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Profile Photo
              </Label>
              <div className="flex items-center mt-2">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xl">?</span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-sm"
                  onClick={() => document.getElementById('photo').click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Optional. Max 5MB.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-600"
                >
                  Skip for now
                </Button>
                
                <Button 
                  type="submit"
                  className="bg-[#0021A5] hover:bg-[#001A84]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Complete
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}