
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  HelpCircle, 
  Briefcase, 
  BookOpen,
  ArrowRight,
  Users,
  Calendar,
  Bookmark,
  MessageCircle,
  ExternalLink,
  Video, 
  MapPin, 
  AlertTriangle,
  FileText,
  Pen,
  Globe,
  Loader2,
  Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PendingRequestsList from '@/components/parents/PendingRequestsList';
import { useNavigate } from 'react-router-dom';

const SkeletonCard = ({ className = "", count = 1 }) => (
  Array(count).fill(0).map((_, index) => (
    <div key={index} className={`bg-gray-100 p-4 rounded-lg animate-pulse ${className} mb-3 last:mb-0`}>
      <div className="flex items-center mb-3">
        <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
  ))
);

export default function ParentDashboard() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingRequestsData, setPendingRequestsData] = useState([]);
  const [communityHighlightsData, setCommunityHighlightsData] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState({ full_name: 'Parent' }); // Mock user data

  const message = searchParams.get('message');
  const messageType = searchParams.get('type') || 'info';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        const mockPending = [
          { 
            id: 1, 
            name: "Emily Davis", 
            type: "Career Advice", 
            message: "I'm a junior majoring in Finance and would love some advice on breaking into investment banking. Specifically, I'm curious about networking strategies and typical interview questions for entry-level analyst roles.", 
            time: "18h ago", 
            avatarInitial: "E", 
            badgeColor: "#7C3AED", 
            bgColor: "#E0F2FF"
          },
          { 
            id: 2, 
            name: "Jason Kim", 
            type: "Resume Review", 
            message: "Could someone take a look at my resume for software engineering internships? Any feedback is appreciated!", 
            time: "3 days ago", 
            avatarInitial: "J", 
            badgeColor: "#059669", 
            bgColor: "#E6F7E2"
          }
        ];
        setPendingRequestsData(mockPending);

        const mockHighlights = [
          {
            id: 1,
            name: "Robert Miller",
            action: "Shared a Software Engineering Internship at IBM.",
            type: "Job Lead", 
            time: "2h ago",
            avatarInitial: "R",
            pillStyle: {backgroundColor: '#FF6600', color: 'white'} 
          },
          {
            id: 2,
            name: "Linda Thompson",
            action: "Hosted a 'Navigating First Jobs After College' session.",
            type: "Webinar", 
            time: "1w ago",
            avatarInitial: "L",
            pillStyle: {backgroundColor: '#5B21B6', color: 'white'} 
          },
          {
            id: 3,
            name: "Daniel Garcia",
            action: "Answered questions about housing options near campus.",
            type: "Answer", 
            time: "1w ago",
            avatarInitial: "D",
            pillStyle: {backgroundColor: '#059669', color: 'white'}
          }
        ];
        setCommunityHighlightsData(mockHighlights);

      } catch (err) {
        setError(err.message || "Could not load data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      const mockPending = [
          { 
            id: 1, 
            name: "Emily Davis", 
            type: "Career Advice", 
            message: "I'm a junior majoring in Finance and would love some advice on breaking into investment banking. Specifically, I'm curious about networking strategies and typical interview questions for entry-level analyst roles.", 
            time: "18h ago", 
            avatarInitial: "E", 
            badgeColor: "#7C3AED", 
            bgColor: "#E0F2FF"
          },
          { 
            id: 2, 
            name: "Jason Kim", 
            type: "Resume Review", 
            message: "Could someone take a look at my resume for software engineering internships? Any feedback is appreciated!", 
            time: "3 days ago", 
            avatarInitial: "J", 
            badgeColor: "#059669", 
            bgColor: "#E6F7E2"
          }
      ];
      setPendingRequestsData(mockPending);
      const mockHighlights = [
        {
          id: 1,
          name: "Robert Miller",
          action: "Shared a Software Engineering Internship at IBM.",
          type: "Job Lead", 
          time: "2h ago",
          avatarInitial: "R",
          pillStyle: {backgroundColor: '#FF6600', color: 'white'} 
        },
        {
          id: 2,
          name: "Linda Thompson",
          action: "Hosted a 'Navigating First Jobs After College' session.",
          type: "Webinar", 
          time: "1w ago",
          avatarInitial: "L",
          pillStyle: {backgroundColor: '#5B21B6', color: 'white'}
        },
        {
          id: 3,
          name: "Daniel Garcia",
          action: "Answered questions about housing options near campus.",
          type: "Answer", 
          time: "1w ago",
          avatarInitial: "D",
          pillStyle: {backgroundColor: '#059669', color: 'white'}
        }
      ];
      setCommunityHighlightsData(mockHighlights);
      setIsLoading(false);
    }, 1500);
  };
  
  const isNew = (timeAgo) => {
    return typeof timeAgo === 'string' && 
           (timeAgo.includes('h') || 
            timeAgo.includes('min') || 
            timeAgo.toLowerCase() === 'just now');
  };

  const upcomingEventsData = [
    { 
      id: 1, 
      title: "Alumni Panel: Careers in Tech", 
      date: "Apr 15", 
      time: "6:00 PM EST", 
      location: "Virtual", 
      icon: <Globe className="h-4 w-4 text-blue-600" aria-hidden="true" /> 
    },
    { 
      id: 2, 
      title: "Networking Night: Business Leaders", 
      date: "Apr 22", 
      time: "7:00 PM EST", 
      location: "UF Campus Center", 
      icon: <MapPin className="h-4 w-4 text-orange-600" aria-hidden="true" /> 
    },
  ];

  const cardStyles = "bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden";
  const sectionSpacing = "mb-12";
  const focusStyles = "focus:outline-none focus:ring-2 focus:ring-[#FCD34D] focus:ring-offset-2";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.full_name}! Help your Gator succeed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button 
              onClick={() => navigate(createPageUrl('Settings'))}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-base font-semibold text-[#1F2E3D] mb-4">Ways to Help</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                
                <Card className={`rounded-lg shadow-sm overflow-hidden ${focusStyles} focus-within:ring-[3px] focus-within:ring-[#FCD34D] focus-within:ring-offset-2`}>
                  <div className="bg-[#E0F2FF] p-4 flex flex-col h-full">
                    <div className="mb-auto">
                      <div className="flex justify-center mb-3">
                        <HelpCircle className="h-8 w-8 text-[#3366FF]" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold text-center text-[#1F2E3D] mb-2">Answer Questions</h3>
                      <p className="text-sm text-center text-[#475467] mb-4">
                        Answer student questions and share your expertise in our 6 Degrees community.
                      </p>
                    </div>
                    <Button 
                      className={`w-full h-10 bg-[#3366FF] text-white hover:bg-blue-700 rounded-md text-sm font-medium px-4 ${focusStyles}`}
                      asChild
                      aria-label="Browse Questions in the 6 Degrees community"
                    >
                      <Link to={createPageUrl("Network")} className="flex items-center justify-center"> 
                        Browse Questions <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </Card>

                <Card className={`rounded-lg shadow-sm overflow-hidden ${focusStyles} focus-within:ring-[3px] focus-within:ring-[#FCD34D] focus-within:ring-offset-2`}>
                  <div className="bg-[#FFF3E0] p-4 flex flex-col h-full">
                    <div className="mb-auto">
                      <div className="flex justify-center mb-3">
                        <Briefcase className="h-8 w-8 text-[#FF6600]" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold text-center text-[#1F2E3D] mb-2">Share Job Leads</h3>
                      <p className="text-sm text-center text-[#475467] mb-4">
                        Help students discover internship and job opportunities in your network.
                      </p>
                    </div>
                    <Button 
                      className={`w-full h-10 bg-[#FF6600] text-white hover:bg-orange-700 rounded-md text-sm font-medium px-4 ${focusStyles}`}
                      asChild
                      aria-label="Share job opportunities"
                    >
                      <Link to={createPageUrl("ShareJobLead")} className="flex items-center justify-center"> 
                        Share Opportunity <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </Card>

                <Card className={`rounded-lg shadow-sm overflow-hidden ${focusStyles} focus-within:ring-[3px] focus-within:ring-[#FCD34D] focus-within:ring-offset-2`}>
                  <div className="bg-[#E6F7E2] p-4 flex flex-col h-full">
                    <div className="mb-auto">
                      <div className="flex justify-center mb-3">
                        <BookOpen className="h-8 w-8 text-[#008000]" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold text-center text-[#1F2E3D] mb-2">Explore Resources</h3>
                      <p className="text-sm text-center text-[#475467] mb-4">
                        Access guides and tools to help support your student's success.
                      </p>
                    </div>
                    <Button 
                      className={`w-full h-10 bg-[#008000] text-white hover:bg-green-700 rounded-md text-sm font-medium px-4 ${focusStyles}`}
                      asChild
                      aria-label="View resources for parents"
                    >
                      <Link to={createPageUrl("Resources")} className="flex items-center justify-center">
                        View Resources <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-[#1F2E3D] mb-4">Community Highlights</h2>
              <div className={`${cardStyles} ${focusStyles}`}>
                <div className="md:block">
                  <div className="p-4">
                    {isLoading && <SkeletonCard className="h-16" count={3} />}
                  {error && !isLoading && (
                    <div className="text-center py-6 bg-red-50 rounded-md">
                      <AlertTriangle className="mx-auto h-6 w-6 text-red-500 mb-2" />
                      <p className="font-medium text-red-600">Unable to load community highlights.</p>
                      <button 
                        onClick={handleRetry}
                        className={`mt-2 text-sm text-blue-600 hover:underline rounded-md ${focusStyles}`}
                      >
                        Please try again
                      </button>
                    </div>
                  )}
                  {!isLoading && !error && communityHighlightsData.length === 0 && (
                    <div className="text-center py-6 bg-gray-50 rounded-md">
                      <Users className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-600">No community activity yet.</p>
                    </div>
                  )}
                  {!isLoading && !error && communityHighlightsData.map((item) => (
                    <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold">
                          {item.avatarInitial}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-wrap gap-x-2">
                              <span className="font-semibold text-[#1F2E3D]">{item.name}</span>
                              {isNew(item.time) && (
                                <Badge 
                                  className="text-xs px-1.5 py-0.5"
                                  style={{ backgroundColor: '#059669', color: 'white' }}
                                >
                                  New
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-[#475467]">{item.time}</span>
                          </div>
                          <p className="text-sm text-[#475467] mt-1">{item.action}</p>
                          <Badge 
                            className="text-xs mt-2 px-1.5 py-0.5"
                            style={item.pillStyle}
                          >
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 flex justify-end">
                    <Link 
                      to={createPageUrl("Community")} 
                      className={`text-sm font-medium text-[#FF6600] hover:underline flex items-center rounded ${focusStyles}`}
                      aria-label="View all community activity"
                    >
                      View All Activity <ExternalLink className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-12">
            
            <div className={`${cardStyles}`}>
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#FEE2E2] flex items-center justify-center font-semibold text-[#9A3412]">
                    A
                  </div>
                  <div>
                    <div className="text-base font-semibold text-[#111827]">Alex Thompson</div>
                    <div className="text-sm text-[#6B7280]">Computer Science • Class of 2025</div>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#E5E7EB]">
                <Link 
                  to={createPageUrl("StudentResources")} 
                  className={`flex items-center gap-2 px-4 py-3 text-[#374151] hover:bg-[#F3F4F6] transition-colors ${focusStyles}`}
                >
                  <FileText className="h-5 w-5 flex-shrink-0" />
                  <span className="text-[0.9375rem]">View Student Resources</span>
                </Link>
                <Link 
                  to="#"
                  className={`flex items-center gap-2 px-4 py-3 text-[#374151] hover:bg-[#F3F4F6] transition-colors border-t border-[#E5E7EB] ${focusStyles}`}
                >
                  <Calendar className="h-5 w-5 flex-shrink-0" />
                  <span className="text-[0.9375rem]">Important Dates</span>
                </Link>
                <Link 
                  to={createPageUrl("ParentProfileEdit")}
                  className={`flex items-center gap-2 px-4 py-3 text-[#374151] hover:bg-[#F3F4F6] transition-colors border-t border-[#E5E7EB] ${focusStyles}`}
                >
                  <Pen className="h-5 w-5 flex-shrink-0" />
                  <span className="text-[0.9375rem]">Complete Your Profile</span>
                </Link>
              </div>
            </div>
            
            <div className={`${cardStyles}`}>
              <div className="p-4">
                <h2 className="text-base font-semibold text-[#1F2E3D] mb-4">Pending Requests</h2>
                <div className="divide-y divide-gray-200">
                  {pendingRequestsData.map((request, index) => (
                    <div 
                      key={request.id}
                      className={`py-4 ${index === 0 ? '' : 'pt-4'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                          {request.avatarInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-semibold text-[#111827]">{request.name}</span>
                            <span 
                              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium !text-white"
                              style={{ 
                                backgroundColor: request.type === 'Career Advice' ? '#4C1D95' : '#047857'
                              }}
                            >
                              {request.type}
                            </span>
                            <span className="text-xs text-[#6B7280] ml-auto">{request.time}</span>
                          </div>
                          <p className="text-[0.9375rem] text-[#374151] mb-3 line-clamp-2">
                            {request.message}
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#374151] border-[#9CA3AF] hover:bg-gray-50"
                            >
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#047857] text-white hover:bg-[#036c4e]"
                            >
                              Respond
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Card className="rounded-xl shadow-sm overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-base font-semibold text-[#1F2E3D] mb-3">Upcoming Events</h3>
                {isLoading && <SkeletonCard className="h-16" count={2} />}
                {error && !isLoading && (
                  <div className="text-center py-6 bg-red-50 rounded-md">
                    <AlertTriangle className="mx-auto h-6 w-6 text-red-500 mb-2" />
                    <p className="font-medium text-red-600">Unable to load events.</p>
                    <button 
                      onClick={handleRetry}
                      className={`mt-2 text-sm text-blue-600 hover:underline rounded-md ${focusStyles}`}
                    >
                      Please try again
                    </button>
                  </div>
                )}
                {!isLoading && !error && (
                  <div className="space-y-3">
                    {upcomingEventsData.map(event => (
                      <div key={event.id} className={`flex items-start space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors focus-within:ring-[3px] focus-within:ring-[#FCD34D] focus-within:ring-offset-1 ${focusStyles}`}>
                        <div className="flex-shrink-0 mt-0.5">
                          <Badge className="text-xs px-2 py-1 bg-orange-100 text-orange-700 font-medium">{event.date}</Badge>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#1F2E3D] text-sm">{event.title}</p>
                          <div className="flex items-center text-xs text-[#475467] mt-1">
                            {event.icon}
                            <span className="ml-1.5">{event.location} • {event.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className={`w-full mt-2 h-10 rounded-md border-[#D0D5DD] text-[#344054] hover:bg-[#F9FAFB] ${focusStyles}`}
                      asChild
                    >
                      <Link to="#" className="text-base">View All Events</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="rounded-xl shadow-sm overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-base font-semibold text-[#1F2E3D] mb-3">Quick Links</h3>
                <nav>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        to={createPageUrl("Messages")} 
                        className={`flex items-center p-2 text-sm text-[#1F2E3D] hover:bg-gray-50 rounded-md ${focusStyles}`}
                      >
                        <MessageCircle className="mr-3 h-5 w-5 text-[#475467]" aria-hidden="true" />
                        Messages
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to={createPageUrl("ParentNetwork")} 
                        className={`flex items-center p-2 text-sm text-[#1F2E3D] hover:bg-gray-50 rounded-md ${focusStyles}`}
                      >
                        <Users className="mr-3 h-5 w-5 text-[#475467]" aria-hidden="true" />
                        Parent Network
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to={createPageUrl("SavedResources")} 
                        className={`flex items-center p-2 text-sm text-[#1F2E3D] hover:bg-gray-50 rounded-md ${focusStyles}`}
                      >
                        <Bookmark className="mr-3 h-5 w-5 text-[#475467]" aria-hidden="true" />
                        Saved Resources
                      </Link>
                    </li>
                  </ul>
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
