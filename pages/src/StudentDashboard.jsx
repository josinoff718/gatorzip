
import React, { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  BookOpen,
  Briefcase,
  Users,
  MessageCircle,
  Bell,
  Search,
  Calendar,
  Bookmark,
  GraduationCap,
  Star,
  ChevronUp,
  ChevronDown,
  Filter,
  SortDesc,
  CheckCircle2,
  Circle,
  Info,
  ArrowUpRight,
  Menu,
  X,
  Sliders,
  Clock,
  Loader2,
  Video,
  FileText,
  Link as LinkIcon,
  Activity,
  UserCheck,
  ArrowRight,
  HelpCircle,
  Building2,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User, StudentProfile } from '@/api/models';
import { Progress } from "@/components/ui/progress";

// Skeleton loading component - MODIFIED
const Skeleton = ({ className, ...props }) => (
  <div
    className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className || ''}`.trim()} // Replaced cn()
    {...props}
  />
);

export default function StudentDashboard() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Fix message handling if it uses queryParams
  // Replace:
  // const queryParamsString = searchParams.get('queryParams');
  // const { message, type } = queryParamsString ? JSON.parse(queryParamsString) : {};

  // With:
  const message = searchParams.get('message');
  const messageType = searchParams.get('type') || 'info';

  const [profileExpanded, setProfileExpanded] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortOption, setSortOption] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(2); // For the notification bell

  // Profile completion tasks
  const profileTasks = [
    { id: 1, label: "Upload resume", complete: true, link: createPageUrl("Profile") },
    { id: 2, label: "Add work experience", complete: true, link: createPageUrl("Profile") },
    { id: 3, label: "Add education details", complete: true, link: createPageUrl("Profile") },
    { id: 4, label: "Add skills", complete: false, link: createPageUrl("Profile") },
    { id: 5, label: "Set career preferences", complete: false, link: createPageUrl("Profile") },
    { id: 6, label: "Add profile photo", complete: true, link: createPageUrl("Profile") }
  ];

  const completedTasksCount = profileTasks.filter(task => task.complete).length;
  const completionPercentage = Math.round((completedTasksCount / profileTasks.length) * 100);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const addFilter = (type, value) => {
    const newFilter = { type, value };
    if (!activeFilters.some(f => f.type === type && f.value === value)) {
      setActiveFilters([...activeFilters, newFilter]);
    }
    setFilterVisible(false);
  };

  const removeFilter = (index) => {
    const newFilters = [...activeFilters];
    newFilters.splice(index, 1);
    setActiveFilters(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  // Mock Job data
  const jobData = [
    {
      id: "job1",
      title: "Software Engineering Intern",
      company: "Google",
      location: "Mountain View, CA",
      posted: "2 days ago",
      logo: "https://logo.clearbit.com/google.com",
      match: 95
    },
    {
      id: "job2",
      title: "Marketing Intern",
      company: "Meta",
      location: "Menlo Park, CA",
      posted: "3 days ago",
      logo: "https://logo.clearbit.com/meta.com",
      match: 87
    },
    {
      id: "job3",
      title: "Data Science Intern",
      company: "Amazon",
      location: "Seattle, WA",
      posted: "1 week ago",
      logo: "https://logo.clearbit.com/amazon.com",
      match: 82
    }
  ];

  // Mock Mentor data
  const mentorData = [
    {
      id: "mentor1",
      name: "Sarah Johnson",
      role: "Engineering Manager",
      company: "Microsoft",
      topics: ["Career Growth", "Technical Interviews"],
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      affinity: 92,
      lastActive: "Online now"
    },
    {
      id: "mentor2",
      name: "Michael Chen",
      role: "Product Manager",
      company: "Apple",
      topics: ["Product Management", "UX Design"],
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      affinity: 87,
      lastActive: "Active 2h ago"
    }
  ];

  // Mock Event data
  const eventData = [
    { id: "event1", title: "Tech Career Fair", date: "Apr 15", time: "1-4 PM", type: "career fair" },
    { id: "event2", title: "Resume Workshop", date: "Apr 22", time: "2 PM", type: "workshop" }
  ];

  // Mock Resource data
  const resourceData = [
    {
      id: "res1",
      title: "Resume Templates",
      category: "Job Search",
      type: "document",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      url: "resources?id=resume-templates"
    },
    {
      id: "res2",
      title: "Interview Prep Guide",
      category: "Job Search",
      type: "document",
      icon: <FileText className="h-5 w-5 text-green-600" />,
      thumbnail: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      url: "resources?id=interview-prep"
    },
    {
      id: "res3",
      title: "Career Planning Course",
      category: "Career Development",
      type: "video",
      icon: <Video className="h-5 w-5 text-purple-600" />,
      thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      url: "resources?id=career-planning"
    },
    {
      id: "res4",
      title: "Networking Masterclass",
      category: "Skill Building",
      type: "video",
      icon: <Video className="h-5 w-5 text-red-600" />,
      thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      url: "resources?id=skill-development"
    }
  ];

  // Calculate dynamic top offset for sticky elements
  const profileBarHeight = completionPercentage < 100 ? 56 : 0; // Approx height of profile bar
  const headerHeight = 72; // Approx height of main header
  const jobsToolbarStickyTop = headerHeight + profileBarHeight;

  // Scroll to section when clicking on a metric card
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -headerHeight - profileBarHeight - 20; // Additional offset for better positioning
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [firstVisit, setFirstVisit] = useState(false);

  useEffect(() => {
    loadUserData();

    const isFirstVisit = sessionStorage.getItem('firstDashboardVisit');
    if (isFirstVisit !== 'false') {
      setFirstVisit(true);
      sessionStorage.setItem('firstDashboardVisit', 'false');
    }
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await User.me();
      setUser(userData);

      try {
        const profiles = await StudentProfile.filter({ user_id: userData.id });
        setProfile(profiles.length > 0 ? profiles[0] : null);
      } catch (err) {
        console.log("No student profile found or error:", err);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    navigate(createPageUrl("Onboarding"));
  };

  const getGreeting = () => {
    const firstName = user?.full_name ? user.full_name.split(' ')[0] : '';
    if (profile?.major) {
      return `Welcome ${firstName}! Ready to advance your ${profile.major} journey?`;
    }
    return `Welcome${firstName ? ', ' + firstName : ''}! 🎉`;
  };

  const quickLinks = [
    { name: 'Find Mentors', href: createPageUrl('Mentorship'), icon: Users, description: 'Connect with alumni for guidance.' },
    { name: 'Explore Jobs', href: createPageUrl('Jobs'), icon: Briefcase, description: 'Discover internships and jobs.' },
    { name: 'GatorMate Finder', href: createPageUrl('GatorMatePage'), icon: Users, description: 'Find your next roommate.' },
    { name: '6 Degrees Network', href: createPageUrl('Network'), icon: Users, description: 'Ask questions and get help.' },
  ];

  const profileCompletionPercentage = () => {
    if (!profile) return 20; // Base for just having a User record
    let completed = 20;
    if (profile.major) completed += 10;
    if (profile.graduation_year) completed += 10;
    if (profile.career_interests?.length > 0) completed += 15;
    if (profile.profile_image_url) completed += 15;
    if (profile.resume_url) completed += 15;
    if (profile.quick_intro) completed += 15;
    return Math.min(100, completed);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0033A0] mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getGreeting()}
            </h1>
            <p className="text-gray-600">
              Your Gator network is ready. Choose a service below to get started!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleProfileClick}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-[#0033A0] border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-[#002280] transition-all duration-200 hover:translate-y-[-2px]"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* ... keep existing code (rest of dashboard content) ... */}
        {firstVisit && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-center">
            <div className="bg-green-100 rounded-full p-2 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-1">You're all set!</h3>
              <p className="text-green-700">Your dashboard is ready. Start exploring opportunities below.</p>
            </div>
            <button
              onClick={() => setFirstVisit(false)}
              className="ml-auto text-green-600 hover:text-green-800"
              aria-label="Dismiss message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Card 1: Find a Mentor */}
          <div className="bg-purple-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-5">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Find a Mentor</h3>
            <p className="text-gray-700 mb-6 min-h-[80px]">
              {profile?.major
                ? `Connect with Gator alumni in ${profile.major} who can offer advice and industry insights.`
                : "Connect with inspiring Gator alumni ready to offer career advice, mentorship, and real-world insights."}
            </p>
            <Link
              to={createPageUrl("Mentorship")}
              className="inline-flex items-center text-purple-700 font-medium hover:text-purple-800"
            >
              Explore Mentors
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Card 2: Find a Roommate */}
          <div className="bg-green-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-5">
              <Search className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Find a Roommate</h3>
            <p className="text-gray-700 mb-6 min-h-[80px]">
              Match with fellow Gators heading where you're headed — across town or across campus.
            </p>
            <Link
              to={createPageUrl("GatorMate")}
              className="inline-flex items-center text-green-700 font-medium hover:text-green-800"
            >
              Start Searching
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Card 3: Tap Into 6° Degrees */}
          <div className="bg-blue-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-5">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Tap Into 6° Degrees</h3>
            <p className="text-gray-700 mb-6 min-h-[80px]">
              Not sure who to ask? Post your question — the Gator community is listening and ready to help.
            </p>
            <Link
              to={createPageUrl("Network")}
              className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800"
            >
              Ask a Question
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Card 4: Explore Resources */}
          <div className="bg-amber-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-5">
              <Building2 className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Explore Resources</h3>
            <p className="text-gray-700 mb-6 min-h-[80px]">
              {profile?.major
                ? `Find ${profile.major}-related career resources, guides and helpful materials.`
                : "Access career guides, templates, and resources to help you succeed."}
            </p>
            <Link
              to={createPageUrl("Resources")}
              className="inline-flex items-center text-amber-700 font-medium hover:text-amber-800"
            >
              View Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Profile Completion & GatorPoints */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Profile Completion</h2>
                  <p className="text-sm text-gray-500">Keep your profile updated for best matches.</p>
                </div>
                <div className="text-2xl font-bold text-[#0033A0]">
                  {profileCompletionPercentage()}%
                </div>
              </div>
              <Progress value={profileCompletionPercentage()} className="mt-3 h-2.5" />
              {profileCompletionPercentage() < 100 && (
                <Button
                  size="sm"
                  variant="link"
                  className="mt-3 px-0 text-[#0033A0] hover:text-blue-700"
                  onClick={() => navigate(createPageUrl('Profile'))}
                >
                  Complete Your Profile <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">GatorPoints</h2>
                  <p className="text-sm text-gray-500">Earn points by engaging.</p>
                </div>
                <div className="text-2xl font-bold text-[#FA4616]">
                  125 {/* Placeholder */}
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <Badge className="bg-[#FA4616] hover:bg-orange-600 text-white">Rising Gator</Badge>
                 {/* Placeholder */}
              </div>
               <Button
                  size="sm"
                  variant="link"
                  className="mt-3 px-0 text-[#FA4616] hover:text-orange-700"
                  onClick={() => {/* TODO: Navigate to GatorPoints details page */}}
                >
                  View Your Badges <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickLinks.map((link) => (
            <Link to={link.href} key={link.name}>
              <Card className="h-full shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group bg-gradient-to-br from-blue-50 via-white to-orange-50 border-gray-200">
                <CardContent className="p-6 flex flex-col items-start justify-between h-full">
                  <div>
                    <div className="p-3 bg-white rounded-full shadow-md inline-block mb-3 border border-gray-100">
                       <link.icon className="h-6 w-6 text-[#0033A0] group-hover:text-[#FA4616] transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#0033A0] transition-colors">{link.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 mb-4">{link.description}</p>
                  </div>
                  <Button variant="link" className="p-0 text-[#0033A0] group-hover:text-[#FA4616] font-medium">
                    Go to {link.name} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recently Matched Mentors (Placeholder) */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Resume Review with Sarah P.', industry: 'Tech Recruiter @ Google', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' },
              { title: 'Career Chat with John B.', industry: 'Marketing Director @ Nike', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' },
              { title: 'Networking with Alumni in NYC', industry: 'Finance Chapter', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' }
            ].map(item => (
              <Card key={item.title} className="shadow-sm hover:shadow-md transition-shadow">
                <img src={item.img} alt={item.title} className="w-full h-32 object-cover rounded-t-lg" />
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-700">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.industry}</p>
                  <Button variant="outline" size="sm" className="mt-3 w-full">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

         {/* First Visit Tour Modal (Placeholder) */}
         {firstVisit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0033A0]">Welcome to Your Dashboard!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  This is your central hub for connecting with mentors, finding jobs, and more.
                  Complete your profile to get the best recommendations!
                </p>
                <div className="space-y-2">
                    <p><strong>Quick Links:</strong> Easily access key features.</p>
                    <p><strong>Profile Completion:</strong> Track your progress.</p>
                    <p><strong>Recommendations:</strong> Discover relevant mentors and opportunities.</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => setFirstVisit(false)} className="bg-[#FA4616] hover:bg-orange-600 text-white">
                  Got it!
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}


// Helper component for Right Column Content (Events & Resources)
const RightColumnContent = ({ isLoading, eventData, resourceData }) => (
  <>
    <Card id="events-section" className="bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link to={createPageUrl("Events")}>View all</Link>
          </Button>
        </div>
        <div className="space-y-3">
          {isLoading ? (
            [1, 2].map(i => (
              <div key={i} className="flex items-start rounded-lg p-2.5 gap-2.5">
                <Skeleton className="h-10 w-12 rounded-md flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-1.5" />
                  <Skeleton className="h-3 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-1/3 rounded-full" />
                </div>
              </div>
            ))
          ) : eventData.length > 0 ? (
            eventData.map((event) => (
              <Link
                key={event.id}
                to={createPageUrl(`EventDetail?id=${event.id}`)}
                className="group flex items-start rounded-lg p-2.5 hover:bg-blue-50/70 transition-colors border border-transparent hover:border-blue-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                aria-label={`View details for ${event.title}`}
              >
                <Badge
                  variant="outline"
                  className="flex-shrink-0 h-10 w-12 flex flex-col items-center justify-center bg-orange-50 text-orange-700 border-orange-200 font-medium rounded-md text-xs"
                >
                  <span>{event.date.split(" ")[0]}</span>
                  <span className="text-sm font-bold">{event.date.split(" ")[1]}</span>
                </Badge>
                <div className="ml-2.5 flex-1">
                  <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-700 leading-tight">{event.title}</h3>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />{event.time}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      {event.type.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-5 py-0 px-2 text-blue-600 hover:bg-blue-50"
                      aria-label={`Register for ${event.title}`}
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <h3 className="text-sm font-medium text-gray-800">No Upcoming Events</h3>
              <p className="mt-1 text-xs text-gray-500">Check back soon for new events.</p>
              <Button size="sm" variant="outline" asChild className="mt-3 text-xs">
                <Link to={createPageUrl("Events")}>Browse All Events</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    <Card id="resources-section" className="bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Featured Resources</h2>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link to={createPageUrl("Resources")}>Explore all</Link>
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-20 w-full mb-1.5" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : resourceData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resourceData.map((resource) => (
              <Link
                key={resource.id}
                to={createPageUrl(resource.url)}
                className="group rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 transform hover:scale-[1.02]"
                aria-label={`View resource: ${resource.title}`}
              >
                <div className="h-20 bg-gray-100 relative overflow-hidden">
                  <img
                    src={resource.thumbnail}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 right-1.5 bg-white/80 backdrop-blur-sm p-1 rounded-full shadow">
                    {React.cloneElement(resource.icon, { className: "h-3.5 w-3.5" })}
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 mb-0.5">{resource.category}</p>
                  <h3 className="text-xs font-medium text-gray-800 group-hover:text-blue-700 leading-tight line-clamp-2">
                    {resource.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <h3 className="text-sm font-medium text-gray-800">No Resources Available</h3>
            <p className="mt-1 text-xs text-gray-500">Check your profile for personalized suggestions.</p>
            <Button size="sm" variant="outline" asChild className="mt-3 text-xs">
              <Link to={createPageUrl("Resources")}>Browse Resources Library</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  </>
);
