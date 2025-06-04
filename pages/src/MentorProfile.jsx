
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, 
  MessageSquare, 
  Check,
  Calendar,
  Award,
  MessageCircle,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import MentorBadges from "../components/mentorship/MentorBadges";
import HelpProgressBar from "../components/mentorship/HelpProgressBar";
import MentorStreakBadge from "../components/mentorship/MentorStreakBadge";

// Mock mentor data - would normally be fetched from API
const MOCK_MENTORS = [
  {
    id: "m1",
    full_name: "Jennifer Chen",
    profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    graduation_year: 2015,
    current_title: "Senior Software Engineer",
    current_company: "Google",
    industry: "technology",
    location: "San Francisco, CA",
    linkedin_url: "https://linkedin.com/in/jchen",
    linkedin_bio: "I build scalable systems at Google and love mentoring new engineers. Previously at Microsoft and Amazon. UF CS alum passionate about helping fellow Gators break into tech.",
    mentor_status: {
      is_top_mentor: true,
      availability: "weekly",
      expertise: ["software_engineering", "interview_prep", "career_growth"]
    },
    help_types: ["quick_chat", "resume_review", "mock_interview", "career_advice"],
    help_types_completed: ["quick_chat", "resume_review"],
    campus_affiliation: {
      name: "Computer Science",
      type: "department"
    },
    badges: [
      { type: "top_10" },
      { type: "trusted" }
    ],
    response_streak: 5,
    students_helped: 15,
    last_active_date: new Date(Date.now() - 86400000)
  },
  {
    id: "m2",
    full_name: "Marcus Johnson",
    profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    graduation_year: 2012,
    current_title: "Product Manager",
    current_company: "Amazon",
    industry: "technology",
    location: "Seattle, WA",
    linkedin_url: "https://linkedin.com/in/mjohnson",
    linkedin_bio: "Product leader focused on customer-centric solutions. UF Business Administration alum with experience in tech and e-commerce. Always happy to connect with fellow Gators looking to break into product management.",
    mentor_status: {
      is_top_mentor: true,
      availability: "weekly",
      expertise: ["product_management", "interviewing", "career_transitions"]
    },
    help_types: ["quick_chat", "resume_review", "mock_interview", "career_advice"],
    help_types_completed: ["quick_chat", "career_advice"],
    campus_affiliation: {
      name: "Business Administration",
      type: "department"
    },
    badges: [
      { type: "trusted" }
    ],
    response_streak: 3,
    students_helped: 10,
    last_active_date: new Date(Date.now() - 3 * 86400000)
  },
  {
    id: "m3",
    full_name: "Sarah Martinez",
    profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    graduation_year: 2018,
    current_title: "Marketing Specialist",
    current_company: "Adobe",
    industry: "marketing",
    location: "New York, NY",
    linkedin_url: "https://linkedin.com/in/smartinez",
    linkedin_bio: "Digital marketing professional with expertise in SEO and content strategy. UF Communications graduate eager to help students navigate the marketing landscape and build their personal brand.",
    mentor_status: {
      is_top_mentor: false,
      availability: "monthly",
      expertise: ["digital_marketing", "content_strategy", "personal_branding"]
    },
    help_types: ["quick_chat", "resume_review", "career_advice"],
    help_types_completed: ["quick_chat"],
    campus_affiliation: {
      name: "Communications",
      type: "department"
    },
    badges: [],
    response_streak: 2,
    students_helped: 7,
    last_active_date: new Date(Date.now() - 5 * 86400000)
  },
  {
    id: "m4",
    full_name: "Rachel Greene",
    profile_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    graduation_year: 2010,
    current_title: "Senior Data Scientist",
    current_company: "Microsoft",
    industry: "technology",
    location: "Remote",
    linkedin_url: "https://linkedin.com/in/rgreene",
    linkedin_bio: "Experienced data scientist specializing in AI/ML solutions. UF Mathematics and Computer Science double major. Passionate about mentoring women in STEM and helping students land their first tech roles.",
    mentor_status: {
      is_top_mentor: true,
      availability: "weekly",
      expertise: ["data_science", "machine_learning", "career_development"]
    },
    help_types: ["quick_chat", "resume_review", "mock_interview", "career_advice", "project_feedback"],
    help_types_completed: ["quick_chat", "resume_review", "career_advice"],
    campus_affiliation: {
      name: "Mathematics",
      type: "department"
    },
    badges: [
      { type: "top_10" },
      { type: "trusted" }
    ],
    response_streak: 8,
    students_helped: 20,
    last_active_date: new Date(Date.now() - 1 * 86400000)
  }
];

export default function MentorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from API. Here we use mock data.
    const fetchMentor = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundMentor = MOCK_MENTORS.find(m => m.id === id);
        if (foundMentor) {
          setMentor(foundMentor);
        } else {
          console.error(`Mentor with ID ${id} not found`);
        }
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMentor();
    }
  }, [id]);

  const formatHelpType = (type) => {
    const typeMap = {
      quick_chat: "Quick chat",
      resume_review: "Resume review",
      mock_interview: "Mock interview",
      career_advice: "Career advice",
      project_feedback: "Project feedback",
      introductions: "Personal introductions",
      job_shadowing: "Job shadowing",
      ongoing_mentorship: "Ongoing mentorship"
    };
    return typeMap[type] || type.replace(/_/g, ' ');
  };

  const handleMessage = () => {
    console.log(`Messaging mentor: ${mentor?.full_name}`);
    // Implement messaging functionality
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-24 bg-gray-200 rounded mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Mentor Not Found</h1>
        <p className="mb-6">The mentor you're looking for doesn't exist or has been removed.</p>
        <Button onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button 
        variant="outline" 
        className="mb-6" 
        onClick={handleGoBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mentors
      </Button>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          {/* Header with Avatar and Badges */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
              <AvatarImage src={mentor.profile_image} alt={mentor.full_name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                {mentor.full_name?.charAt(0) || "M"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{mentor.full_name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <MentorBadges badges={mentor.badges} size="sm" />
                <MentorStreakBadge streak={mentor.response_streak} />
              </div>
              <p className="text-gray-600 text-sm">
                {mentor.current_title} at {mentor.current_company}
              </p>
            </div>

            {mentor.linkedin_url && (
              <a
                href={mentor.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0021A5] hover:bg-blue-50 p-2 rounded-full transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>
              </a>
            )}
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-600">
            {mentor.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{mentor.location}</span>
              </div>
            )}
            {mentor.mentor_status?.availability && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{mentor.mentor_status.availability} availability</span>
              </div>
            )}
            {mentor.campus_affiliation && (
              <Badge variant="outline" className="text-gray-600">
                {mentor.campus_affiliation.name} • Class of '{mentor.graduation_year.toString().slice(-2)}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Bio */}
          {mentor.linkedin_bio && (
            <div>
              <h2 className="font-medium mb-2">About Me</h2>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700">{mentor.linkedin_bio}</p>
              </div>
            </div>
          )}

          {/* How I Can Help */}
          {mentor.help_types && mentor.help_types.length > 0 && (
            <div>
              <h2 className="font-medium mb-2">How I Can Help</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mentor.help_types.map((helpType, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>{formatHelpType(helpType)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Activity Stats */}
          <div className="bg-gray-50 rounded-lg p-3">
            <HelpProgressBar 
              completedTypes={mentor.help_types_completed || []}
              totalTypes={mentor.help_types || []}
            />
            <div className="mt-3 flex flex-wrap gap-4">
              <div>
                <span className="text-sm text-gray-600">Students Helped</span>
                <p className="font-medium">{mentor.students_helped}</p>
              </div>
              {mentor.response_streak > 0 && (
                <div>
                  <span className="text-sm text-gray-600">Response Streak</span>
                  <p className="font-medium">{mentor.response_streak} weeks</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full bg-[#0021A5] hover:bg-[#0021A5]/90"
            onClick={handleMessage}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message {mentor.full_name.split(' ')[0]}
          </Button>
        </div>
      </div>
    </div>
  );
}
