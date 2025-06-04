import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { AlumniStory } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadFile } from "@/api/integrations";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Upload,
  ArrowLeft,
  HelpCircle,
  Lightbulb,
  Briefcase,
  GraduationCap,
  AlertCircle,
} from "lucide-react";

const STORY_TYPES = [
  { 
    id: "career_transition", 
    label: "Career Transition",
    description: "Share how you navigated a major career change or transition",
    icon: Briefcase
  },
  { 
    id: "professional_development", 
    label: "Professional Development",
    description: "Highlight key milestones or learning experiences in your career",
    icon: GraduationCap
  },
  { 
    id: "industry_insight", 
    label: "Industry Insight",
    description: "Provide insights and trends about your industry",
    icon: Lightbulb
  },
  { 
    id: "advice", 
    label: "Advice for Students",
    description: "Share guidance, tips, and lessons learned with current students",
    icon: HelpCircle
  }
];

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Engineering",
  "Marketing",
  "Consulting",
  "Entertainment",
  "Government",
  "Non-profit",
  "Retail",
  "Manufacturing",
  "Other"
];

export default function ShareStoryPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    story_type: "",
    industry: "",
    image_url: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        
        if (userData.type !== "alumni") {
          navigate(createPageUrl("Alumni"));
        }
      } catch (error) {
        console.error("Error loading user:", error);
        navigate(createPageUrl("Home"));
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, [navigate]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    
    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }
    
    if (!formData.story_type) {
      errors.story_type = "Story type is required";
    }
    
    if (!formData.industry) {
      errors.industry = "Industry is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    try {
      await AlumniStory.create({
        ...formData,
        user_id: user.id
      });
      
      navigate(createPageUrl("Alumni"));
    } catch (error) {
      console.error("Error saving story:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--primary]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(createPageUrl("Alumni"))}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Alumni
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[--secondary]" />
            <CardTitle>Share Your Story</CardTitle>
          </div>
          <CardDescription>
            Your career journey can inspire current students and fellow alumni
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Story Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. My Journey from UF to Silicon Valley"
                className={formErrors.title ? "border-red-500" : ""}
              />
              {formErrors.title && (
                <p className="text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="story-type">Story Type</Label>
                <Select
                  value={formData.story_type}
                  onValueChange={(value) => setFormData({ ...formData, story_type: value })}
                >
                  <SelectTrigger className={formErrors.story_type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select story type" />
                  </SelectTrigger>
                  <SelectContent>
                    {STORY_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.story_type && (
                  <p className="text-sm text-red-500">{formErrors.story_type}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger className={formErrors.industry ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.industry && (
                  <p className="text-sm text-red-500">{formErrors.industry}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Your Story</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your experience, insights, challenges and advice..."
                className={`min-h-[250px] ${formErrors.content ? "border-red-500" : ""}`}
              />
              {formErrors.content && (
                <p className="text-sm text-red-500">{formErrors.content}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Cover Image (Optional)</Label>
              <div className="border rounded-md p-4">
                {formData.image_url ? (
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-md overflow-hidden">
                      <img 
                        src={formData.image_url} 
                        alt="Story cover" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Image uploaded successfully</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({ ...formData, image_url: "" })}
                      >
                        Replace
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500 mb-3">Upload a cover image for your story</p>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload").click()}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Before submitting</h4>
                  <p className="text-blue-700 text-sm">
                    Your story will be reviewed before being published. Please ensure it aligns with 
                    UF's values and guidelines. Stories that provide specific, actionable advice and 
                    authentic experiences are most valuable to the community.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate(createPageUrl("Alumni"))}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-[--secondary] hover:bg-[--secondary]/90"
          >
            {isSaving ? "Submitting..." : "Submit Story"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}