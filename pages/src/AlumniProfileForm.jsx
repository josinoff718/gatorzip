import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { AlumniProfile } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mail, 
  Linkedin, 
  ArrowRight, 
  MessageSquare, 
  Briefcase,
  Users,
  FileText,
  GraduationCap,
  Eye,
  EyeOff
} from "lucide-react";

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", 
  "Marketing", "Consulting", "Government", "Other"
];

export default function AlumniProfileForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    graduationYear: "",
    major: "",
    currentRole: "",
    company: "",
    industry: "",
    location: "",
    linkedinUrl: "",
    wasInGreekLife: null,
    greekAffiliation: "",
    bio: "",
    helpOptions: []
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await User.me();
      setIsAuthenticated(!!user);
      
      // Check for existing profile
      try {
        const profiles = await AlumniProfile.filter({ user_id: user.id });
        if (profiles.length > 0) {
          // Pre-populate form with existing data
          const profile = profiles[0];
          setFormData({
            graduationYear: profile.graduation_year?.toString() || "",
            major: profile.major || "",
            currentRole: profile.current_title || "",
            company: profile.current_company || "",
            industry: profile.industry || "",
            location: profile.location || "",
            linkedinUrl: profile.linkedin_url || "",
            wasInGreekLife: profile.was_in_greek_life || null,
            greekAffiliation: profile.greek_affiliation || "",
            bio: profile.bio || "",
            helpOptions: profile.help_methods || []
          });
        }
      } catch (error) {
        console.error("Error fetching alumni profile:", error);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      if (checked) {
        setFormData({
          ...formData,
          helpOptions: [...formData.helpOptions, name]
        });
      } else {
        setFormData({
          ...formData,
          helpOptions: formData.helpOptions.filter(option => option !== name)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleRadioChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get current user
      const user = await User.me();
      
      // Prepare data for API
      const profileData = {
        user_id: user.id,
        graduation_year: parseInt(formData.graduationYear),
        major: formData.major,
        current_title: formData.currentRole,
        current_company: formData.company,
        industry: formData.industry,
        location: formData.location,
        linkedin_url: formData.linkedinUrl,
        was_in_greek_life: formData.wasInGreekLife,
        greek_affiliation: formData.greekAffiliation,
        bio: formData.bio,
        help_methods: formData.helpOptions
      };
      
      // Check for existing profile
      const profiles = await AlumniProfile.filter({ user_id: user.id });
      if (profiles.length > 0) {
        await AlumniProfile.update(profiles[0].id, profileData);
      } else {
        await AlumniProfile.create(profileData);
      }
      
      // Navigate to success page
      navigate(createPageUrl("AlumniOnboardingSuccess"));
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("There was an error saving your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate(createPageUrl("AlumniOnboardingSuccess"));
  };

  const handleLinkedInImport = () => {
    // LinkedIn import logic would go here
    alert("LinkedIn import feature coming soon!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-[#0033A0] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <GraduationCap className="h-10 w-10 text-[#0033A0]" />
          </div>
          <h1 className="text-3xl font-bold mb-4 font-display">Join as an Alum</h1>
          <p className="text-gray-600 mb-8">
            Sign in to create your alumni profile and help Gators succeed.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => User.login()} 
              className="w-full bg-[#0033A0] hover:bg-[#0033A0]/90 h-12 flex items-center justify-center"
            >
              <Mail className="mr-2 h-5 w-5" />
              Continue with Email
            </Button>
            
            <div className="text-sm text-gray-500">
              Any email address works - we'll verify your UF affiliation later
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, show the full form
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 font-display">
            Welcome, Gators Giving Back! 🧡💙
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey matters — and now, you have the power to open doors for the next generation.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-[#FA4616] to-[#FF8A50] mx-auto mt-6"></div>
        </div>
        
        <Card className="shadow-md mb-8">
          <CardContent className="p-8">
            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <h2 className="text-xl font-semibold mb-3">Complete Your Profile</h2>
              <p className="text-gray-700">
                By filling this out, you'll create a public-facing alumni profile visible to students and parents
                in the College Fast Forward network.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Prefer to stay behind the scenes? No problem — you can skip creating a profile and contribute privately.
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Save Time with LinkedIn</h3>
              <p className="text-gray-600 mb-4">
                Import your basic information with one click. You can edit everything before saving.
              </p>
              
              <Button 
                className="w-full bg-[#FA4616] hover:bg-[#e04114] text-white flex items-center justify-center py-6 transition-all duration-300 transform hover:translate-y-[-2px]" 
                onClick={handleLinkedInImport}
              >
                <Linkedin className="mr-2 h-5 w-5" />
                Import from LinkedIn
              </Button>
              
              <div className="relative flex py-5 items-center mt-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Section 1: Your Gator Story */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                  </div>
                  Your Gator Story
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="graduationYear">When did you graduate?</Label>
                    <select
                      id="graduationYear"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select year</option>
                      {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year.toString()}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="major">What was your major at UF?</Label>
                    <Input
                      id="major"
                      name="major"
                      placeholder="e.g. Business Administration"
                      value={formData.major}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Section 2: Your Career Today */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <Briefcase className="h-4 w-4 text-green-600" />
                  </div>
                  Your Career Today
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currentRole">Your current role</Label>
                    <Input
                      id="currentRole"
                      name="currentRole"
                      placeholder="e.g. Senior Product Manager"
                      value={formData.currentRole}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Where do you work?</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Company name"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="industry">What field are you in?</Label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select industry</option>
                      {INDUSTRIES.map(industry => (
                        <option key={industry} value={industry.toLowerCase()}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Where are you based now?</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile URL (Optional)</Label>
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mt-6">
                  <Label className="block mb-2">Were you part of a fraternity, sorority, or team?</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="greekYes"
                        name="wasInGreekLife"
                        value="yes"
                        checked={formData.wasInGreekLife === "yes"}
                        onChange={() => handleRadioChange("wasInGreekLife", "yes")}
                        className="mr-2"
                      />
                      <Label htmlFor="greekYes">Yes</Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="greekNo"
                        name="wasInGreekLife"
                        value="no"
                        checked={formData.wasInGreekLife === "no"}
                        onChange={() => handleRadioChange("wasInGreekLife", "no")}
                        className="mr-2"
                      />
                      <Label htmlFor="greekNo">No</Label>
                    </div>
                  </div>
                </div>
                
                {formData.wasInGreekLife === "yes" && (
                  <div className="mt-4">
                    <Label htmlFor="greekAffiliation">Which organization?</Label>
                    <Input
                      id="greekAffiliation"
                      name="greekAffiliation"
                      placeholder="e.g. Delta Gamma, Sigma Chi"
                      value={formData.greekAffiliation}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
              
              <div className="mb-10">
                <Label htmlFor="bio">Tell students a bit about your journey since UF</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Share your path since graduation, what you love about your field, or advice you wish you'd had as a student..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="min-h-[120px] mb-8"
                />
              </div>
              
              {/* How You Can Help Section - Updated Styling */}
              <div className="bg-[#FFF8F2] p-8 rounded-xl mb-10">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  How You Can Help
                </h3>
                
                <p className="text-gray-700 mb-6">
                  Every Gator's journey is different, and even small gestures can change a student's path.
                  Choose what feels right for you.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="helpQuestions"
                      name="answer_questions"
                      checked={formData.helpOptions.includes("answer_questions")}
                      onChange={handleChange}
                      className="mt-1.5 mr-3 h-5 w-5"
                    />
                    <div>
                      <Label htmlFor="helpQuestions" className="font-medium">
                        <span className="flex items-center">
                          I'm open to answering occasional questions
                          <MessageSquare className="ml-2 h-6 w-6 text-gray-600" />
                        </span>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="helpCareerAdvice"
                      name="career_advice"
                      checked={formData.helpOptions.includes("career_advice")}
                      onChange={handleChange}
                      className="mt-1.5 mr-3 h-5 w-5"
                    />
                    <div>
                      <Label htmlFor="helpCareerAdvice" className="font-medium">
                        <span className="flex items-center">
                          I'm happy to offer career advice
                          <Briefcase className="ml-2 h-6 w-6 text-gray-600" />
                        </span>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="helpIntroductions"
                      name="introductions"
                      checked={formData.helpOptions.includes("introductions")}
                      onChange={handleChange}
                      className="mt-1.5 mr-3 h-5 w-5"
                    />
                    <div>
                      <Label htmlFor="helpIntroductions" className="font-medium">
                        <span className="flex items-center">
                          I'm open to introducing students to people I know
                          <Users className="ml-2 h-6 w-6 text-gray-600" />
                        </span>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="helpInternships"
                      name="internships"
                      checked={formData.helpOptions.includes("internships")}
                      onChange={handleChange}
                      className="mt-1.5 mr-3 h-5 w-5"
                    />
                    <div>
                      <Label htmlFor="helpInternships" className="font-medium">
                        <span className="flex items-center">
                          I can post internships or job leads
                          <FileText className="ml-2 h-6 w-6 text-gray-600" />
                        </span>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="helpMentorship"
                      name="mentorship"
                      checked={formData.helpOptions.includes("mentorship")}
                      onChange={handleChange}
                      className="mt-1.5 mr-3 h-5 w-5"
                    />
                    <div>
                      <Label htmlFor="helpMentorship" className="font-medium">
                        <span className="flex items-center">
                          I'm willing to offer ongoing mentorship
                          <GraduationCap className="ml-2 h-6 w-6 text-gray-600" />
                        </span>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="helpShadowing"
                      name="shadowing"
                      checked={formData.helpOptions.includes("shadowing")}
                      onChange={handleChange}
                      className="mt-1.5 mr-3 h-5 w-5"
                    />
                    <div>
                      <Label htmlFor="helpShadowing" className="font-medium">
                        <span className="flex items-center">
                          I can offer job shadowing opportunities
                          <Eye className="ml-2 h-6 w-6 text-gray-600" />
                        </span>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="helpBehindScenes"
                      name="behind_scenes"
                      checked={formData.helpOptions.includes("behind_scenes")}
                      onChange={handleChange}
                      className="mt-1.5 mr-3 h-5 w-5"
                    />
                    <div>
                      <Label htmlFor="helpBehindScenes" className="font-medium">
                        <span className="flex items-center">
                          I prefer to stay behind the scenes
                          <EyeOff className="ml-2 h-6 w-6 text-gray-600" />
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center mt-10">
                <Button 
                  type="submit"
                  className="bg-[#FA4616] hover:bg-[#e04114] hover:scale-[1.02] text-white py-6 px-10 rounded-xl text-lg flex items-center gap-2 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg w-full max-w-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save and Continue
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
                
                <button 
                  type="button"
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-[#0033A0] mt-4 text-sm transition-colors duration-200"
                >
                  Prefer not to create a profile?{' '}
                  <span className="underline">Contribute privately instead</span>
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
