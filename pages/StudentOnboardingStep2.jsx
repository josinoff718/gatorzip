
import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@/api/entities';
import { StudentProfile } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useToast } from "@/components/ui/use-toast";
import { GraduationCap, Loader2, Rocket, Upload, CheckCircle, Camera, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";

const CURRENT_YEAR = new Date().getFullYear();
const GRADUATION_YEARS = Array.from(
  { length: 7 }, 
  (_, i) => ({ value: String(CURRENT_YEAR + i), label: String(CURRENT_YEAR + i) })
);

const MAJORS = [
  { value: "accounting", label: "Accounting" },
  { value: "aerospace_engineering", label: "Aerospace Engineering" },
  { value: "agricultural_sciences", label: "Agricultural Sciences" },
  { value: "anthropology", label: "Anthropology" },
  { value: "architecture", label: "Architecture" },
  { value: "art_history", label: "Art History" },
  { value: "biochemistry", label: "Biochemistry" },
  { value: "biomedical_engineering", label: "Biomedical Engineering" },
  { value: "business_admin", label: "Business Administration" },
  { value: "chemical_engineering", label: "Chemical Engineering" },
  { value: "chemistry", label: "Chemistry" },
  { value: "civil_engineering", label: "Civil Engineering" },
  { value: "communications", label: "Communications" },
  { value: "computer_engineering", label: "Computer Engineering" },
  { value: "computer_science", label: "Computer Science" },
  { value: "construction_management", label: "Construction Management" },
  { value: "criminology", label: "Criminology" },
  { value: "data_science", label: "Data Science" },
  { value: "economics", label: "Economics" },
  { value: "education", label: "Education" },
  { value: "electrical_engineering", label: "Electrical Engineering" },
  { value: "english", label: "English" },
  { value: "environmental_science", label: "Environmental Science" },
  { value: "finance", label: "Finance" },
  { value: "food_science", label: "Food Science" },
  { value: "graphic_design", label: "Graphic Design" },
  { value: "health_sciences", label: "Health Sciences" },
  { value: "history", label: "History" },
  { value: "industrial_engineering", label: "Industrial Engineering" },
  { value: "information_systems", label: "Information Systems" },
  { value: "international_relations", label: "International Relations" },
  { value: "journalism", label: "Journalism" },
  { value: "linguistics", label: "Linguistics" },
  { value: "management", label: "Management" },
  { value: "marketing", label: "Marketing" },
  { value: "mathematics", label: "Mathematics" },
  { value: "mechanical_engineering", label: "Mechanical Engineering" },
  { value: "microbiology", label: "Microbiology" },
  { value: "music", label: "Music" },
  { value: "nursing", label: "Nursing" },
  { value: "nutrition", label: "Nutrition" },
  { value: "philosophy", label: "Philosophy" },
  { value: "physics", label: "Physics" },
  { value: "political_science", label: "Political Science" },
  { value: "psychology", label: "Psychology" },
  { value: "public_health", label: "Public Health" },
  { value: "public_relations", label: "Public Relations" },
  { value: "real_estate", label: "Real Estate" },
  { value: "sociology", label: "Sociology" },
  { value: "software_engineering", label: "Software Engineering" },
  { value: "spanish", label: "Spanish" },
  { value: "sports_management", label: "Sports Management" },
  { value: "statistics", label: "Statistics" },
  { value: "theatre", label: "Theatre" },
  { value: "other", label: "Other" }
];

const CAREER_INTEREST_OPTIONS = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "law", label: "Law & Public Policy" },
  { value: "media", label: "Media/Entertainment" },
  { value: "business", label: "Business & Entrepreneurship" },
  { value: "education", label: "Education" },
  { value: "nonprofit", label: "Nonprofit/Social Impact" },
  { value: "finance_banking", label: "Finance & Banking" },
  { value: "engineering", label: "Engineering" },
  { value: "research", label: "Research & Innovation" },
  { value: "sports", label: "Sports Management" },
  { value: "marketing_adv", label: "Marketing & Advertising" }
];

const OPPORTUNITIES_OPTIONS = [
  { value: "full_time_job", label: "Full-time Job" },
  { value: "internship", label: "Internship" }
];

const SUPPORT_OPTIONS = [
  { value: "mentorship", label: "Mentorship" },
  { value: "general_advice", label: "General advice" },
  { value: "connections", label: "Connections" }
];

const CAMPUS_AFFILIATIONS = [
  { value: "greek_fraternity", label: "Fraternity" },
  { value: "greek_sorority", label: "Sorority" },
  { value: "sports_team", label: "Sports Team" },
  { value: "club_academic", label: "Academic Club/Organization" },
  { value: "club_cultural", label: "Cultural Club/Organization" },
  { value: "club_professional", label: "Professional Club/Organization" },
  { value: "honors", label: "Honors Program" },
  { value: "student_government", label: "Student Government" },
  { value: "other", label: "Other" }
];

export default function StudentOnboardingStep2() {
  const [formData, setFormData] = useState({
    major: '',
    graduation_year: '',
    career_interests: [],
    resume_file_name: '',
    resume_url: '',
    profile_image_name: '',
    profile_image_url: '',
    career_goal: '',
    looking_for: [],
    just_exploring: false,

    student_id_number: '',
    location: '',
    quick_intro: '',
    step1_photo_url: '',
  });

  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const step1DataString = localStorage.getItem('onboardingStep1Data');
    if (step1DataString) {
      try {
        const step1Data = JSON.parse(step1DataString);
        setFormData(prev => ({
          ...prev,
          student_id_number: step1Data.studentId || '',
          location: step1Data.location || '',
          quick_intro: step1Data.quickIntro || '',
          step1_photo_url: step1Data.photo || '',
        }));
      } catch (e) {
        console.error("Error parsing Step 1 data from localStorage", e);
        toast({ title: "Error", description: "Could not load previous step data.", variant: "destructive"});
      }
    }
  }, [toast]);

  const getCareerInterests = () => Array.isArray(formData.career_interests) ? formData.career_interests : [];
  const getLookingFor = () => Array.isArray(formData.looking_for) ? formData.looking_for : [];
  
  const { requiredCompletedCount, isAllRequiredFilled } = useMemo(() => {
    const majorFilled = Boolean(formData.major);
    const gradYearFilled = Boolean(formData.graduation_year);
    const careerInterestsFilled = getCareerInterests().length > 0;
    const lookingForFilled = formData.just_exploring || getLookingFor().length > 0;

    // --- DEBUGGING LOGS ---
    console.log("--- Onboarding Step 2 Validation Check ---");
    console.log("Full formData:", JSON.parse(JSON.stringify(formData))); // Deep copy for reliable logging
    console.log("1. Major Filled:", majorFilled, "(Value: '", formData.major, "')");
    console.log("2. Grad Year Filled:", gradYearFilled, "(Value: '", formData.graduation_year, "')");
    console.log("3. Career Interests Filled:", careerInterestsFilled, "(Count:", getCareerInterests().length, ", Values:", getCareerInterests(), ")");
    console.log("4. Looking For/Exploring Filled:", lookingForFilled, "(Just Exploring:", formData.just_exploring, ", Looking For Count:", getLookingFor().length, ", Values:", getLookingFor(), ")");
    // --- END DEBUGGING LOGS ---

    const conditions = [
      majorFilled,
      gradYearFilled,
      careerInterestsFilled,
      lookingForFilled
    ];
    const count = conditions.filter(Boolean).length;
    return { requiredCompletedCount: count, isAllRequiredFilled: count === 4 };
  }, [formData.major, formData.graduation_year, formData.career_interests, formData.looking_for, formData.just_exploring]);

  const progressValue = useMemo(() => {
    const totalRequiredFields = 4; // Ensure this matches the number of conditions above
    return Math.round((requiredCompletedCount / totalRequiredFields) * 100);
  }, [requiredCompletedCount]);

  const handleCareerInterestsChange = (values) => {
    setFormData(prev => ({
      ...prev,
      career_interests: Array.isArray(values) ? values : []
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid File Type", description: "Please upload a JPEG or PNG image.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Photo must be under 5MB.", variant: "destructive" });
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const previewUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        profile_image_name: file.name,
        profile_image_url: previewUrl
      }));
      
      toast({ title: "Photo Selected", description: "Your profile photo is ready for submission.", variant: "success" });
    } catch (error) {
      console.error("Photo selection/preview error:", error);
      toast({ title: "Photo Error", description: "Could not process your photo. Please try again.", variant: "destructive" });
      setFormData(prev => ({ ...prev, profile_image_name: '', profile_image_url: '' }));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, profile_image_name: '', profile_image_url: '' }));
    toast({ title: "Photo Removed", description: "Your profile photo has been removed." });
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid File Type", description: "Please upload a PDF or Word document.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Resume must be under 5MB.", variant: "destructive" });
      return;
    }

    setIsUploadingResume(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormData(prev => ({
        ...prev,
        resume_file_name: file.name,
        resume_url: `placeholder/path/to/${file.name}`
      }));
      toast({ title: "Resume Uploaded", description: `${file.name} has been uploaded.`, variant: "success" });
    } catch (error) {
      console.error("Resume upload error:", error);
      toast({ title: "Upload Failed", description: "Could not upload your resume. Please try again.", variant: "destructive" });
      setFormData(prev => ({ ...prev, resume_file_name: '', resume_url: '' }));
    } finally {
      setIsUploadingResume(false);
    }
  };
  
  const handleLookingForChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentLookingFor = Array.isArray(prev.looking_for) ? [...prev.looking_for] : [];
      let newLookingFor;
      
      if (checked) {
        newLookingFor = [...currentLookingFor, value];
      } else {
        newLookingFor = currentLookingFor.filter(item => item !== value);
      }
      
      return { 
        ...prev, 
        looking_for: newLookingFor, 
        just_exploring: false 
      };
    });
  };

  const handleJustExploringChange = (e) => {
    const isExploring = e.target.checked;
    setFormData(prev => ({
      ...prev,
      just_exploring: isExploring,
      looking_for: isExploring ? [] : (Array.isArray(prev.looking_for) ? prev.looking_for : [])
    }));
  };

    const handleMajorChange = (newMajorValue) => {
        setFormData(prev => ({ ...prev, major: newMajorValue }));
    };

    const handleGraduationYearChange = (newYearValue) => {
        setFormData(prev => ({ ...prev, graduation_year: newYearValue }));
    };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await User.me();
        if (!userData) {
          console.log("No user data found, redirecting to login");
          navigate(createPageUrl("AuthSignin", { 
            callbackUrl: "StudentOnboardingStep2" 
          }));
          return;
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        if (!window.location.pathname.includes('AuthSignin')) {
          navigate(createPageUrl("AuthSignin", { 
            callbackUrl: "StudentOnboardingStep2" 
          }));
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!isAllRequiredFilled) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      let userData;
      try {
        userData = await User.me();
        if (!userData?.id) {
          throw new Error("User authentication failed");
        }
      } catch (authError) {
        console.error("Authentication error:", authError);
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive"
        });
        navigate(createPageUrl("AuthSignin"));
        return;
      }

      await User.updateMyUserData({ user_type: "student" });

      const finalProfileImageUrl = formData.profile_image_url || formData.step1_photo_url || null;

      const profileData = {
        user_id: userData.id,
        major: formData.major,
        graduation_year: parseInt(formData.graduation_year),
        career_interests: getCareerInterests(),
        resume_url: formData.resume_url || null,
        profile_image_url: finalProfileImageUrl,
        career_goal: formData.career_goal || null,
        looking_for_options: formData.just_exploring ? [] : getLookingFor(),
        is_just_exploring: formData.just_exploring,
        student_id_number: formData.student_id_number || null,
        location: formData.location || null,
        quick_intro: formData.quick_intro || null,
      };

      await StudentProfile.create(profileData);

      localStorage.setItem('onboardingComplete', 'true');
      sessionStorage.setItem('firstDashboardVisit', 'true');
      localStorage.removeItem('onboardingStep1Data');


      toast({ 
        title: "Profile Created!", 
        description: "Your student profile is ready. Redirecting to dashboard...",
        variant: "success" 
      });

      navigate(createPageUrl("StudentDashboard"));

    } catch (error) {
      console.error("Error saving profile:", error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again to continue.",
          variant: "destructive"
        });
        navigate(createPageUrl("AuthSignin"));
        return;
      }

      toast({
        title: "Save Error",
        description: `Failed to save your profile. ${error.message || ''}`.trim(),
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const displayPhoto = formData.profile_image_url || formData.step1_photo_url;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="h-7 w-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile (Step 2/2)</h1>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Profile Completion</span>
              <span className="font-medium text-blue-600">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
             <p className="text-xs text-gray-500 mt-1 text-right">
                {requiredCompletedCount}/4 required fields completed
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="major" className="font-medium">Major / Field of Study <span className="text-red-500">*</span></Label>
              <Select
                id="major"
                value={formData.major}
                onValueChange={handleMajorChange}
                aria-label="Select your major"
              >
                <SelectItem value={""} disabled>
                  Select your major
                </SelectItem>
                {MAJORS.map((major) => (
                  <SelectItem key={major.value} value={major.value}>
                    {major.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="graduation_year" className="font-medium">Expected Graduation Year <span className="text-red-500">*</span></Label>
              <Select
                id="graduation_year"
                value={formData.graduation_year}
                onValueChange={handleGraduationYearChange}
                aria-label="Select graduation year"
              >
                <SelectItem value={""} disabled>
                  Select graduation year
                </SelectItem>
                {GRADUATION_YEARS.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div>
              <Label htmlFor="career_interests" className="font-medium">
                Primary Career Interest(s) <span className="text-red-500">*</span>
              </Label>
              <Combobox
                id="career_interests"
                multiple
                options={CAREER_INTEREST_OPTIONS}
                value={getCareerInterests()}
                onChange={handleCareerInterestsChange}
                placeholder="Select career interests"
                className="mt-1"
              />
            </div>
            
             <div>
              <Label htmlFor="photo-upload" className="font-medium">Profile Photo (Optional)</Label>
              <div className="mt-3 flex gap-4 items-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                  {displayPhoto ? (
                    <>
                      <img 
                        src={displayPhoto}
                        alt="Profile preview" 
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-opacity"
                        aria-label="Remove photo"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                
                <div>
                  <Button asChild variant="outline" size="sm" className="mb-1">
                    <label htmlFor="photo-upload" className="cursor-pointer flex items-center">
                      <Camera className="h-4 w-4 mr-2" />
                      {displayPhoto ? 'Change Photo' : 'Upload Photo'}
                    </label>
                  </Button>
                  <input
                    type="file"
                    id="photo-upload"
                    accept=".jpg,.jpeg,.png"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500">
                    JPEG or PNG. Max 5MB.
                  </p>
                  {isUploadingPhoto && (
                    <div className="mt-1 flex items-center text-sm text-blue-600">
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="resume-upload" className="font-medium">Resume (Optional)</Label>
              <div className="mt-1 flex items-center gap-3">
                <Button asChild variant="outline" size="sm">
                  <label htmlFor="resume-upload" className="cursor-pointer flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resume
                  </label>
                </Button>
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="hidden"
                  aria-describedby="resume-status"
                />
                {isUploadingResume && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                {!isUploadingResume && formData.resume_file_name && (
                  <p id="resume-status" className="text-sm text-green-600 flex items-center">
                    {formData.resume_file_name} <CheckCircle className="ml-1.5 h-4 w-4" />
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX. Max 5MB.</p>
            </div>

            <div>
              <Label htmlFor="career_goal" className="font-medium">
                Career Goals (Optional)
              </Label>
              <Textarea
                id="career_goal"
                value={formData.career_goal}
                onChange={(e) => setFormData(prev => ({ ...prev, career_goal: e.target.value }))}
                placeholder="Share your dream role, target industry, or any specific companies you're interested in..."
                className="min-h-[100px] mt-1"
              />
            </div>
            
            <div>
              <Label className="font-medium">I'm looking for (Select all that apply) <span className="text-red-500">*</span></Label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1.5">Opportunities</p>
                  {OPPORTUNITIES_OPTIONS.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 mb-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={getLookingFor().includes(option.value)}
                        onChange={handleLookingForChange}
                        disabled={formData.just_exploring}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className={`text-sm ${formData.just_exploring ? 'text-gray-400' : 'text-gray-700'}`}>{option.label}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1.5">Support</p>
                  {SUPPORT_OPTIONS.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 mb-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={getLookingFor().includes(option.value)}
                        onChange={handleLookingForChange}
                        disabled={formData.just_exploring}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className={`text-sm ${formData.just_exploring ? 'text-gray-400' : 'text-gray-700'}`}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.just_exploring}
                    onChange={handleJustExploringChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">I'm just exploring my options right now</span>
                </label>
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                disabled={saving || !isAllRequiredFilled} // This logic remains the same
                className="w-full text-base py-3"
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Finishing Up...
                  </>
                ) : (
                  <>
                    Finish & Launch Profile
                    <Rocket className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              {!saving && !isAllRequiredFilled && (
                 <p className="text-xs text-red-500 mt-2 text-center">
                    Please complete all {4 - requiredCompletedCount} remaining required sections (marked with <span className="text-red-500">*</span>) to enable this button.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
