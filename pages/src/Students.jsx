
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  LogIn,
  Filter,
  SlidersHorizontal,
  Users,
  Building2,
  GraduationCap,
  Calendar,
  ArrowLeft
} from "lucide-react";
import StudentCard from "../components/students/StudentCard";
import StudentFilters from "../components/students/StudentFilters";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageRecord } from "@/api/entities"; // We'll create this entity

// Enhanced demo data with more details and properly set dates for "new" indicator testing
const DEMO_STUDENTS = [
  {
    id: "demo1",
    full_name: "Jill Parker",
    created_date: new Date(), // Today (new student)
    profile: {
      major: "Computer Science",
      minor: "Business Administration",
      graduation_year: 2025,
      profile_image: "https://images.unsplash.com/photo-1597004897768-c503055a3c54?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      looking_for: "Seeking summer internship in software development or product management",
      created_date: new Date(),
      updated_date: new Date(),
      career_preferences: {
        locations: ["New York", "San Francisco", "Remote"],
        job_types: ["internship", "mentorship"],
        industries: ["Technology", "Finance", "Consulting"]
      },
      skills: ["Python", "React", "JavaScript", "SQL", "UI/UX Design", "Agile"],
      resume_url: "https://example.com/jill_parker_resume.pdf"
    }
  },
  {
    id: "demo2",
    full_name: "Jordan Lee",
    created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (still new)
    profile: {
      major: "Marketing",
      minor: "Digital Media",
      graduation_year: 2024,
      profile_image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      looking_for: "Seeking full-time marketing role with focus on digital strategy",
      created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updated_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      career_preferences: {
        locations: ["Los Angeles", "Miami", "Atlanta"],
        job_types: ["full_time", "networking"],
        industries: ["Marketing", "Media", "Entertainment"]
      },
      skills: ["Social Media Strategy", "Content Creation", "Adobe Creative Suite", "Google Analytics", "SEO"]
    }
  },
  {
    id: "demo3",
    full_name: "Maria Garcia",
    created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (still new)
    profile: {
      major: "Finance",
      minor: "Economics",
      graduation_year: 2023,
      profile_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      looking_for: "Entry-level financial analyst position at investment bank or financial services firm",
      created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updated_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      career_preferences: {
        locations: ["New York", "Chicago", "Boston"],
        job_types: ["full_time", "advice"],
        industries: ["Finance", "Banking", "Investment Management"]
      },
      skills: ["Financial Modeling", "Valuation", "Bloomberg Terminal", "Excel", "PowerPoint", "VBA"]
    }
  },
  {
    id: "demo4",
    full_name: "Alex Chen",
    created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (new)
    profile: {
      major: "Data Science",
      minor: "Statistics",
      graduation_year: 2024,
      profile_image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      looking_for: "Looking for internship opportunities in data science and machine learning",
      created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updated_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      career_preferences: {
        locations: ["San Francisco", "Seattle", "Boston", "Remote"],
        job_types: ["internship", "mentorship"],
        industries: ["Technology", "AI/ML", "Consulting"]
      },
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Data Visualization", "R"]
    }
  },
  {
    id: "demo5",
    full_name: "Sarah Johnson",
    created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (new)
    profile: {
      major: "Mechanical Engineering",
      graduation_year: 2025,
      profile_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      looking_for: "Seeking internship in renewable energy or aerospace engineering",
      created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updated_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      career_preferences: {
        locations: ["Houston", "Denver", "Seattle"],
        job_types: ["internship", "networking"],
        industries: ["Aerospace", "Energy", "Manufacturing"]
      },
      skills: ["CAD", "MATLAB", "3D Printing", "Simulation", "Project Management"]
    }
  },
  {
    id: "demo6",
    full_name: "Chris Thompson",
    created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago (not new)
    profile: {
      major: "Environmental Science",
      graduation_year: 2023,
      profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      looking_for: "Entry-level position in sustainability consulting or environmental policy",
      created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updated_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      career_preferences: {
        locations: ["Washington DC", "New York", "Portland"],
        job_types: ["full_time", "mentorship"],
        industries: ["Environmental", "Consulting", "Government"]
      },
      skills: ["Policy Analysis", "GIS", "Environmental Impact Assessment", "Sustainability Reporting"]
    }
  }
];

export default function StudentsPage() {
  const [students, setStudents] = useState(DEMO_STUDENTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    graduationYear: "all",
    major: "all",
    jobTypes: [],
    industries: [],
    location: "all"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showReferDialog, setShowReferDialog] = useState(false);
  const [referEmail, setReferEmail] = useState("");
  const [referMessage, setReferMessage] = useState("");
  const [messageRecords, setMessageRecords] = useState([]); // Track message records
  const navigate = useNavigate();

  // Enhanced search function with fuzzy matching
  const searchStudent = (student, searchTerm) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const profile = student.profile || {};
    
    // Helper function for fuzzy matching
    const fuzzyMatch = (str, search) => {
      if (!str) return false;
      str = str.toLowerCase();
      search = search.toLowerCase();
      let searchIndex = 0;
      for (let i = 0; i < str.length && searchIndex < search.length; i++) {
        if (str[i] === search[searchIndex]) {
          searchIndex++;
        }
      }
      return searchIndex === search.length;
    };

    // Check all searchable fields
    return (
      fuzzyMatch(student.full_name, searchTerm) ||
      fuzzyMatch(profile.major, searchTerm) ||
      (profile.skills || []).some(skill => fuzzyMatch(skill, searchTerm)) ||
      (profile.career_preferences?.industries || []).some(industry => fuzzyMatch(industry, searchTerm)) ||
      fuzzyMatch(profile.graduation_year?.toString(), searchTerm) ||
      (profile.career_preferences?.job_types || []).some(type => fuzzyMatch(type, searchTerm))
    );
  };

  // Debounced search handler
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter students with enhanced search
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchStudent(student, debouncedSearchTerm);
    
    const matchesGradYear = filters.graduationYear === "all" || 
      student.profile?.graduation_year === parseInt(filters.graduationYear);

    const matchesMajor = filters.major === "all" || 
      student.profile?.major === filters.major;

    const matchesJobTypes = filters.jobTypes.length === 0 || 
      student.profile?.career_preferences?.job_types?.some(type => 
        filters.jobTypes.includes(type));

    const matchesIndustries = filters.industries.length === 0 ||
      student.profile?.career_preferences?.industries?.some(industry =>
        filters.industries.includes(industry));

    const matchesLocation = filters.location === "all" ||
      student.profile?.career_preferences?.locations?.includes(filters.location);

    return matchesSearch && matchesGradYear && matchesMajor && 
           matchesJobTypes && matchesIndustries && matchesLocation;
  });

  // Handle message student
  const handleMessage = (student) => {
    setSelectedStudent(student);
    setShowMessageDialog(true);
  };

  // Update handleSendMessage to record the message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    setIsSendingMessage(true);
    
    try {
      const user = await User.me(); // This is the company user
      const conversationId = [user.id, selectedStudent.id].sort().join('_');

      await MessageRecord.create({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_name: user.full_name || "Your Company",
        sender_type: 'company',
        recipient_id: selectedStudent.id,
        recipient_name: selectedStudent.full_name,
        recipient_type: 'student', // Assuming selectedStudent is always a student
        message: messageText,
        student_profile_snapshot: JSON.stringify(selectedStudent.profile || {}),
        status: 'application_pending' // Mark this initial outreach
      });
      
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${selectedStudent.full_name}. You can continue this conversation in your Inbox.`,
        duration: 5000,
        action: (
          <Button variant="outline" size="sm" onClick={() => navigate(createPageUrl('Messages'))}>
            Go to Inbox
          </Button>
        )
      });

      setShowMessageDialog(false);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Handle refer student
  const handleRefer = (student) => {
    setSelectedStudent(student);
    setShowReferDialog(true);
  };

  // Handle sending referral
  const handleSendReferral = async (e) => {
    e.preventDefault();
    if (!referEmail.trim()) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Shared",
        description: `You've shared ${selectedStudent.full_name}'s profile with ${referEmail}.`,
      });

      setShowReferDialog(false);
      setReferEmail("");
      setReferMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share profile. Please try again.",
      });
    }
  };

    // Load message history
    useEffect(() => {
      const loadMessageHistory = async () => {
        try {
          // Try to load previous messages sent by this company
          const user = await User.me();
          const records = await MessageRecord.filter({ sender_id: user.id });
          setMessageRecords(records);
        } catch (error) {
          console.error("Error loading message history:", error);
        }
      };
  
      loadMessageHistory();
    }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back to Dashboard Link */}
      <div className="mb-6">
        <Link 
          to={createPageUrl("CompanyDashboard")} 
          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Talent</h1>
          <p className="text-gray-600 mt-2">
            Connect with talented Gators and build your future team.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="hidden md:flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Enhanced Search and Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, major, skills, industry..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-lg font-semibold">{students.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <GraduationCap className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Graduating Soon</p>
            <p className="text-lg font-semibold">
              {students.filter(s => s.profile?.graduation_year === 2024).length}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6">
          <StudentFilters
            filters={filters}
            onFilterChange={setFilters}
            students={students}
          />
        </div>
      )}

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <StudentCard
            key={student.id}
            student={student}
            onMessage={handleMessage}
            onRefer={handleRefer}
          />
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No students found matching your search.</p>
        </div>
      )}

      {/* Message Dialog with Resume Download Option */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Message {selectedStudent?.full_name}</DialogTitle>
          </DialogHeader>
          
          {/* Form takes remaining space and handles internal scrolling */}
          <form onSubmit={handleSendMessage} className="flex flex-col flex-grow overflow-hidden">
            
            {/* Scrollable content area */}
            <div className="px-6 py-4 flex-grow overflow-y-auto space-y-4">
              {/* Show resume download if available */}
              {selectedStudent?.profile?.resume_url && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="font-medium text-sm text-blue-800">Resume Available</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Download student's resume</span>
                    <a 
                      href={selectedStudent.profile.resume_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      download
                      className="inline-flex items-center px-3 py-1 rounded-md bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      Download Resume
                    </a>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Hi there! I noticed your profile and..."
                  className="min-h-[100px] w-full"
                  required
                />
                <p className="text-sm text-gray-500">
                  Be specific about what you'd like to discuss or ask.
                </p>
              </div>
            </div>
            
            {/* Buttons section (footer of the form) */}
            <div className="px-6 py-3 border-t flex justify-end gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMessageDialog(false)}
                disabled={isSendingMessage}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSendingMessage || !messageText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Refer Dialog (structure remains similar, apply if needed) */}
      <Dialog open={showReferDialog} onOpenChange={setShowReferDialog}>
        <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Share {selectedStudent?.full_name}'s Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendReferral} className="flex flex-col flex-grow overflow-hidden">
            <div className="px-6 py-4 flex-grow overflow-y-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referEmail">Email Address</Label>
                <Input
                  id="referEmail"
                  type="email"
                  placeholder="colleague@example.com"
                  value={referEmail}
                  onChange={(e) => setReferEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referMessage">Optional Message</Label>
                <Textarea
                  id="referMessage"
                  value={referMessage}
                  onChange={(e) => setReferMessage(e.target.value)}
                  placeholder="I thought you might be interested in this candidate..."
                  className="min-h-[100px] w-full"
                />
              </div>
            </div>
            <div className="px-6 py-3 border-t flex justify-end gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReferDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!referEmail.trim()}
                 className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Share Profile
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
