import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, X, Loader2 } from "lucide-react";
import MentorCard from "../components/mentorship/MentorCard";
import MentorDetail from "../components/mentorship/MentorDetail";
import TopMentorsLeaderboard from '../components/mentorship/TopMentorsLeaderboard';
// useNavigate is not used directly in this file currently, but Link is.
// import { useNavigate } from 'react-router-dom'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MentorshipPage() {
  // const navigate = useNavigate(); // Not used
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState([]);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    industry: 'all',
    jobFunction: 'all',
    location: 'all',
    activeNow: false
  });

  // Filter options
  const filterOptions = {
    industry: ['Technology', 'Marketing', 'Data Science', 'Finance', 'Healthcare'],
    jobFunction: ['Software Engineer', 'Product Manager', 'Marketing Specialist', 'Data Scientist', 'Business Analyst'],
    location: ['San Francisco, CA', 'Seattle, WA', 'New York, NY', 'Remote', 'Austin, TX']
  };

  // Fetch mentors data
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        
        // Use hardcoded mentors data instead of API for now
        const mockMentors = [
          {
            id: "m1",
            full_name: "Jennifer Chen",
            profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
            graduation_year: 2015,
            current_title: "Senior Software Engineer",
            current_company: "Google",
            industry: "Technology",
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
            industry: "Technology",
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
            industry: "Marketing",
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
            industry: "Technology",
            location: "Remote",
            linkedin_url: "https://linkedin.com/in/rgreene",
            linkedin_bio: "Experienced data scientist specializing in AI/ML solutions. UF Mathematics and Computer Science double major. Passionate about mentoring women in STEM.",
            mentor_status: {
              is_top_mentor: true,
              availability: "weekly",
              expertise: ["data_science", "machine_learning", "career_transitions"]
            },
            help_types: ["resume_review", "mock_interview", "career_advice", "quick_chat"],
            help_types_completed: ["resume_review", "mock_interview", "career_advice"],
            campus_affiliation: {
              name: "Mathematics",
              type: "department"
            },
            badges: [
              { type: "trusted" },
              { type: "mvp" }
            ],
            response_streak: 12,
            students_helped: 25,
            last_active_date: new Date(Date.now() - 1 * 86400000)
          }
        ];

        setMentors(mockMentors);
        
      } catch (error) {
        console.error('Error fetching mentors:', error);
        toast({
          title: "Error loading mentors",
          description: "We're having trouble loading mentors. Using sample data instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [toast]); // Added toast to dependency array as it's used in useEffect

  // Memoized filtered mentors
  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const nameMatch = mentor.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const titleMatch = mentor.current_title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = searchTerm === "" || nameMatch || titleMatch;

      const matchesIndustry = filters.industry === 'all' || mentor.industry === filters.industry;
      const matchesJobFunction = filters.jobFunction === 'all' || mentor.current_title?.includes(filters.jobFunction);
      const matchesLocation = filters.location === 'all' || mentor.location === filters.location;
      
      // Corrected activeNow filter logic
      const isActive = mentor.last_active_date && (new Date() - new Date(mentor.last_active_date)) < (7 * 24 * 60 * 60 * 1000); // Active within last 7 days
      const matchesActive = !filters.activeNow || isActive;


      return matchesSearch && matchesIndustry && matchesJobFunction && matchesLocation && matchesActive;
    });
  }, [mentors, searchTerm, filters]);

  const handleViewProfile = useCallback((mentor) => {
    setSelectedMentor(mentor);
    setShowDetailDialog(true);
  }, []);

  const handleMessageMentor = useCallback((mentor) => {
    setSelectedMentor(mentor);
    setShowMessageDialog(true);
  }, []);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsSendingMessage(true);
    try {
      // Simulated API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: `Message sent to ${selectedMentor.full_name}`,
      });
      
      setShowMessageDialog(false);
      setMessageContent("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Updated Dashboard Link */}
        <div className="mb-6">
          <Link 
            to={createPageUrl("StudentDashboard")}
            className="inline-flex items-center text-gray-600 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1 py-0.5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Mentor Match: Connect with Gator Alumni
          </h1>
          <p className="text-gray-600 text-lg">
            Find experienced Gator alumni to guide your career journey. Choose your industry, role, or location, and get personalized advice, interview prep, or insights to kickstart your success.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search mentors by name, title..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label htmlFor="industry-filter">Industry</Label>
                <Select
                  value={filters.industry}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger id="industry-filter">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {filterOptions.industry.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="job-function-filter">Job Function</Label>
                <Select
                  value={filters.jobFunction}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, jobFunction: value }))}
                >
                  <SelectTrigger id="job-function-filter">
                    <SelectValue placeholder="Select Job Function" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Job Functions</SelectItem>
                    {filterOptions.jobFunction.map(job => (
                      <SelectItem key={job} value={job}>{job}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="location-filter">Location</Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger id="location-filter">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {filterOptions.location.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end pb-1"> {/* Adjusted alignment for checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active-now"
                    checked={filters.activeNow}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, activeNow: !!checked }))
                    }
                  />
                  <Label htmlFor="active-now" className="font-normal">Active Recently</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onViewProfile={handleViewProfile}
                onMessage={handleMessageMentor}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No mentors found matching your criteria.</p>
          </div>
        )}

        {/* Profile Dialog */}
        <Dialog 
          open={showDetailDialog} 
          onOpenChange={setShowDetailDialog}
        >
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-0">
            <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-white z-10 border-b">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl">Mentor Profile</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
                  onClick={() => setShowDetailDialog(false)}
                  aria-label="Close mentor profile"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </Button>
              </div>
            </DialogHeader>
            <div className="px-6 pb-6 pt-4"> {/* Content padding */}
              {selectedMentor && <MentorDetail mentor={selectedMentor} />}
            </div>
          </DialogContent>
        </Dialog>

        {/* Message Dialog */}
        <Dialog
          open={showMessageDialog}
          onOpenChange={setShowMessageDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Message {selectedMentor?.full_name}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowMessageDialog(false);
                  setMessageContent("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={isSendingMessage || !messageContent.trim()}
              >
                {isSendingMessage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
