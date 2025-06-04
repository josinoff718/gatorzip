
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Users, 
  Briefcase, 
  PlusCircle, 
  BarChart3, 
  Calendar as CalendarIcon,
  Settings,
  ChevronRight,
  MessageSquare,
  Edit,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SparkLineChart } from "@/components/ui/sparkline";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import apiManager from "@/components/utils/ApiManager";
import RateLimitBanner from "@/components/utils/RateLimitBanner";
import { User } from "@/api/entities";
import { Job } from "@/api/entities";

const MetricCard = ({ icon, title, count, subtitle, sparklineData, tooltipText, className, isLoading, error }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Card className={`group transition-all duration-200 hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:bg-white/[1.01] ${className} h-[140px] flex flex-col`}>
          <CardContent className="p-5 flex flex-col flex-grow justify-between">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : error ? (
               <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mb-1" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center mt-1">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    {icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-0.5">{count}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>
                  </div>
                </div>
                
                {sparklineData ? (
                  <div className="mt-2">
                    <SparkLineChart data={sparklineData} height={35} width="100%" stroke="rgb(59 130 246)" strokeWidth={1} />
                  </div>
                ) : (
                  <div style={{ height: '35px' }} className="mt-2"></div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText || title}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const JobPostRow = ({ job, focusRingStyle }) => (
  <Link 
    to={createPageUrl(`JobDetail/${job.id}`)} 
    className={`flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200 group ${focusRingStyle}`}
  >
    <div>
      <h3 className="font-medium text-gray-900 group-hover:text-blue-700">{job.title}</h3>
      <div className="mt-1 flex text-sm text-gray-500">
        <span>{job.applicants} applicants</span>
        <span className="mx-2">•</span>
        <span>Posted {job.posted}</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span 
        className={`text-sm font-semibold px-3 py-1 rounded-xl text-white shadow-sm ${job.status === 'active' ? 'bg-[#28A745]' : 'bg-[#6C757D]'}`}
      >
        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
      </span>
      <ChevronRight className="h-4 w-4 text-[#6C757D] group-hover:opacity-80" />
    </div>
  </Link>
);

const ApplicationRow = ({ applicant, focusRingStyle }) => (
  <div 
    className={`flex items-center p-3 rounded-lg border border-transparent ${focusRingStyle}`}
  >
    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
      {applicant.name.charAt(0)}
    </div>
    <div className="ml-3 flex-1">
      <p className="text-sm font-medium text-gray-900 leading-snug">{applicant.name}</p>
      <p className="text-xs text-gray-500">{applicant.role} • {applicant.university}</p>
    </div>
    <div className="text-xs text-gray-500/60 flex items-center gap-0.5 pr-1">
      {applicant.date}
    </div>
  </div>
);

export default function CompanyDashboard() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  
  const message = searchParams.get('message');
  const messageType = searchParams.get('type') || 'info';

  const [postedJobs, setPostedJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [jobError, setJobError] = useState(null);
  
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  const focusRingStyle = "focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2";
  const sampleSparklineData = [5, 10, 15, 12, 18, 20, 25, 22, 28, 30, 26, 32];
  const profileViewsData = [8, 12, 15, 22, 18, 25, 30, 28, 20, 35, 32, 38];

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      setIsLoadingUser(true);
      setUserError(null);
      
      try {
        // Use the API manager for user data
        const currentUser = await apiManager.getUser();
        setUser(currentUser);
        
        if (currentUser && currentUser.id) {
          // Fetch jobs using API manager
          setIsLoadingJobs(true);
          setJobError(null);
          
          try {
            const companyJobsData = await apiManager.filterJobs({ company_id: currentUser.id });
            setPostedJobs(companyJobsData);
          } catch (jobError) {
            console.error("Error fetching company jobs:", jobError);
            if (jobError.response?.status === 429) {
              setJobError("Server busy. Job data will load shortly.");
              // Dispatch event for banner
              window.dispatchEvent(new CustomEvent('rateLimitHit'));
            } else {
              setJobError("Failed to load job postings.");
            }
            setPostedJobs([]);
          } finally {
            setIsLoadingJobs(false);
          }
        } else {
          setJobError("Cannot fetch jobs without user identification.");
          setIsLoadingJobs(false);
          setPostedJobs([]);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        if (error.response?.status === 429) {
          setUserError("Server busy. Please wait a moment.");
          // Dispatch event for banner
          window.dispatchEvent(new CustomEvent('rateLimitHit'));
        } else {
          setUserError("Failed to load user data.");
        }
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchUserAndJobs();
  }, []);

  const activeJobCount = useMemo(() => postedJobs.filter(job => job.status === 'active').length, [postedJobs]);
  const jobListingsMetricSparkline = useMemo(() => {
    if (isLoadingJobs || postedJobs.length === 0) return [0,0,0,0,0,0];
    const baseCount = postedJobs.length;
    return [baseCount * 0.8, baseCount * 1.1, baseCount, baseCount * 0.9, baseCount * 1.2, baseCount].map(v => Math.max(0, Math.round(v)));
  }, [postedJobs, isLoadingJobs]);

  const metrics = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Total Candidates",
      count: "124",
      subtitle: "Last 30 days",
      sparklineData: sampleSparklineData,
      tooltipText: "Unique candidates who applied or were sourced in the last 30 days.",
      className: focusRingStyle,
      isLoading: false,
      error: null,
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Active Job Listings",
      count: activeJobCount.toString(),
      subtitle: "Currently accepting applications",
      sparklineData: jobListingsMetricSparkline,
      tooltipText: "Job postings currently marked as 'active' and open for applications.",
      className: focusRingStyle,
      isLoading: isLoadingJobs,
      error: jobError,
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Profile Views",
      count: "56",
      subtitle: "This week",
      sparklineData: profileViewsData,
      tooltipText: "Number of times your company profile has been viewed by students this week.",
      className: focusRingStyle,
      isLoading: false,
      error: null,
    },
  ];

  const applications = [
    { id: "demo1", name: "Alex Johnson", role: "Software Engineer", date: "2d ago", university: "University of Florida" },
    { id: "demo2", name: "Sophia Martinez", role: "Marketing Intern", date: "3d ago", university: "University of Florida" },
    { id: "demo3", name: "Michael Chang", role: "Product Designer", date: "4d ago", university: "University of Florida" },
    { id: "demo4", name: "Emma Wilson", role: "Data Analyst", date: "5d ago", university: "University of Florida" }
  ];

  const secondaryActions = [
    {
      label: "Messages",
      href: createPageUrl("Messages"),
      icon: <MessageSquare className="mr-2 h-[18px] w-[18px] text-gray-600" />,
    },
    {
      label: "Edit Profile",
      href: createPageUrl("CompanyProfile"),
      icon: <Edit className="mr-2 h-[18px] w-[18px] text-gray-600" />,
    },
  ];

  const formatDatePosted = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.ceil(diffDays / 7);

    if (diffDays <= 1) return 'Today';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks <= 4) return `${diffWeeks}w ago`;
    return date.toLocaleDateString();
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }
  
  if (userError && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Dashboard Temporarily Unavailable</h2>
        <p className="text-gray-600 text-center mb-4">{userError}</p>
        <div className="flex gap-3">
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          <Button variant="outline" onClick={() => navigate(createPageUrl('Home'))}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <RateLimitBanner />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.full_name || 'Company'}!</p>
                {userError && <p className="text-xs text-amber-600 mt-1">{userError}</p>}
              </div>
              <div className="flex items-center gap-4">
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
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="space-y-2"></div>
              <div className="mt-4 md:mt-0 flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={`rounded-full ${focusRingStyle}`}
                        aria-label="Settings"
                        onClick={() => navigate(createPageUrl("Settings"))}
                      >
                          <Settings className="h-4 w-4 text-gray-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 w-full sm:w-auto"
                  asChild
                >
                  <Link to={createPageUrl("CompanyPostPage")} className="flex items-center justify-center text-white">
                    <PlusCircle className="h-4 w-4 mr-2 sm:mr-1" />
                    Post Job
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric) => (
              <MetricCard 
                key={metric.title}
                {...metric}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Student Interactions</h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`hover:bg-gray-50 hover:text-blue-600 px-4 ${focusRingStyle}`}
                      asChild
                    >
                      <Link to={createPageUrl("Messages")} className="flex items-center">
                        View all conversations
                        <ChevronRight className="ml-2 h-4 w-4 text-[#6C757D] group-hover:opacity-80" />
                      </Link>
                    </Button>
                  </div>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-1">
                      {applications.map((applicant) => (
                        <ApplicationRow 
                          key={applicant.id} 
                          applicant={applicant}
                          focusRingStyle={focusRingStyle}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Your Job Postings</h2>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className={`hover:bg-gray-50 hover:text-blue-600 px-4 ${focusRingStyle}`}
                      asChild
                    >
                      <Link to={createPageUrl("ManageJobs")} className="flex items-center">
                        Manage Jobs
                        <ChevronRight className="ml-2 h-4 w-4 text-[#6C757D] group-hover:opacity-80" />
                      </Link>
                    </Button>
                  </div>
                  {isLoadingJobs ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Loading your job postings...</p>
                      </div>
                    </div>
                  ) : jobError ? (
                    <div className="text-center py-4 text-amber-600 flex flex-col items-center">
                      <AlertTriangle className="h-8 w-8 mb-2" />
                      <p>{jobError}</p>
                      <p className="text-xs text-gray-500 mt-1">Data will load automatically when available</p>
                    </div>
                  ) : postedJobs.length === 0 ? (
                    <div className="text-center py-10">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">You haven't posted any jobs yet.</p>
                      <Button 
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                        asChild
                      >
                        <Link to={createPageUrl("CompanyPostPage")}>Post Your First Job</Link>
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-[250px] pr-3">
                      <div className="space-y-1">
                        {postedJobs.map((job) => (
                          <JobPostRow 
                            key={job.id} 
                            job={{
                              ...job,
                              applicants: job.views || 0,
                              posted: formatDatePosted(job.created_date)
                            }}
                            focusRingStyle={focusRingStyle}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button 
                      className={`w-full flex flex-row items-center justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-10 px-3 py-2 ${focusRingStyle}`}
                      asChild
                    >
                      <Link to={createPageUrl("Students")} className="flex flex-row items-center w-full h-full gap-2">
                        <Users className="mr-0 h-[18px] w-[18px]" />
                        Browse Talent
                      </Link>
                    </Button>
                    {secondaryActions.map((action) => (
                      <Button
                        key={action.label}
                        variant="outline"
                        className={`w-full flex flex-row items-center justify-start gap-2 text-gray-700 hover:bg-gray-50 border-gray-200 h-10 px-3 py-2 ${focusRingStyle}`}
                        asChild
                      >
                        <Link to={action.href} className="flex flex-row items-center w-full h-full gap-2">
                          {React.cloneElement(action.icon, { className: "mr-0 h-[18px] w-[18px] text-gray-600" })}
                          {action.label}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={`overflow-hidden ${focusRingStyle}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className={focusRingStyle}
                            asChild
                            aria-label="View calendar"
                          >
                            <Link to={createPageUrl("Events")}>
                              <CalendarIcon className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View calendar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-0">
                    {[
                      { id:"event1", title: "Spring Career Fair", date: "Apr 15", time: "1:00 PM - 4:00 PM" },
                      { id:"event2", title: "Industry Networking", date: "Apr 22", time: "5:30 PM - 7:30 PM" }
                    ].map((event, i, arr) => (
                      <Link 
                        to={createPageUrl(`Events`)}
                        key={event.id} 
                        className={`flex items-start p-3 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group ${focusRingStyle} ${i > 0 ? 'border-t border-gray-100' : ''}`}
                      >
                        <div className="flex-shrink-0 p-2 bg-orange-100 rounded-lg text-orange-700">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-gray-900 group-hover:text-blue-700">{event.title}</p>
                          <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-[#6C757D] mt-1 group-hover:opacity-80" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
