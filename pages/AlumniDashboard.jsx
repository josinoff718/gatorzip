
import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Users, 
  MessageCircle, 
  BookOpen, 
  HelpCircle,
  Star,
  Edit,
  TrendingUp,
  ChevronRight,
  MessageSquare,
  ExternalLink,
  Inbox,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SparkLineChart } from "@/components/ui/sparkline";

const Skeleton = ({ className, ...props }) => (
  <div 
    className={`animate-pulse rounded bg-gray-200 ${className || ''}`}
    {...props}
  />
);

const MetricCard = ({ icon, count, label, trend, trendIcon, trendColorClass, onClick, ariaLabel }) => (
  <button
    onClick={onClick}
    className={`w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg group cursor-pointer hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] focus-visible:shadow-[0_4px_8px_rgba(0,0,0,0.05)] ${focusRingStyle(trendColorClass ? trendColorClass.split('-')[1] : 'blue')}`}
    aria-label={ariaLabel}
  >
    <Card className={`h-full group-hover:bg-black/[0.02] group-focus-visible:bg-black/[0.02] transition-all duration-200 min-h-[180px]`}>
      <CardContent className="p-3 flex flex-col justify-between h-full">
        <div className="flex items-center"> 
            <div className={`p-2.5 rounded-full ${trendColorClass ? `bg-${trendColorClass.split('-')[1]}-500/15 text-${trendColorClass.split('-')[1]}-600` : 'bg-blue-500/15 text-blue-600'}`}>
              {icon}
            </div>
            <div className="ml-3">
              <div className="text-2xl font-bold mb-0.5">{count}</div>
              <div className="text-sm text-gray-600">{label}</div>
            </div>
        </div>
        <Badge 
          className={`mt-auto text-xs px-2 py-1 font-medium inline-flex items-center self-start ${
            trendColorClass ? `${trendColorClass} border-${trendColorClass.split('-')[1]}-200` : 'bg-gray-100 text-gray-700 border-gray-200'
          }`}
        >
          {trendIcon}
          {trend}
        </Badge>
      </CardContent>
    </Card>
  </button>
);

const focusRingStyle = (color = 'blue') => `focus-visible:ring-${color}-500`;

const EmptyRequests = () => (
  <div className="text-center py-12">
    <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-gray-700 font-medium text-lg mb-2">No current requests</h3>
    <p className="text-gray-500 text-sm mb-6">
      Looks like your inbox is clear! Invite a student or answer questions in 6 Degrees.
    </p>
    <Button 
      asChild 
      className="px-8 py-4 hover:bg-[#FF6B4A]/10 text-[#FF6B4A] hover:text-[#E04E2D] focus-visible:ring-2 focus-visible:ring-[#FF6B4A] focus-visible:ring-offset-2 transform hover:-translate-y-0.5 transition-all"
      aria-label="Browse 6 Degrees questions"
    >
      <Link to={createPageUrl("Network")}>
        Browse Questions
        <ChevronRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  </div>
);

export default function AlumniDashboard() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const message = searchParams.get('message');
  const messageType = searchParams.get('type') || 'info';

  const [isLoading, setIsLoading] = useState(true);
  const [hasPendingRequests, setHasPendingRequests] = useState(true);
  const [requestsCount, setRequestsCount] = useState(0); 
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isChartLoading, setIsChartLoading] = useState(true);
  
  const sparklineData = [12, 15, 10, 18, 14, 22, 25, 20, 28, 22, 30, 26];

  const chartSummary = useMemo(() => {
    if (!sparklineData || sparklineData.length === 0) return null;
    const average = sparklineData.reduce((a, b) => a + b, 0) / sparklineData.length;
    const highest = Math.max(...sparklineData);
    return {
      average: average.toFixed(1),
      highest: highest,
      periodCount: sparklineData.length
    };
  }, [sparklineData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChartLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        const mockRequests = [
          { id: "req1", name: "Emily Davis", topic: "Career Advice", message: "I'm a junior majoring in Finance...", time: "2 days ago" },
          { id: "req2", name: "Jason Kim", topic: "Resume Review", message: "Would you mind taking a look at my resume?...", time: "5 days ago" }
        ];
        if (hasPendingRequests) {
            setPendingRequests(mockRequests);
        } else {
            setPendingRequests([]);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        setPendingRequests([]);
        setHasPendingRequests(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [hasPendingRequests]);

  const commonFocusRing = "focus-visible:ring-2 focus-visible:ring-offset-2";
  const respondDeclineFocusRing = "focus:outline-none focus-visible:ring-3 focus-visible:ring-[#FF4500] focus-visible:ring-offset-2";

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <title>Alumni Dashboard — Alumni Network</title>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .help-panel-button {
          animation: fadeUp 0.4s ease-out forwards;
          opacity: 0; /* Start transparent for animation */
        }
        .help-panel-button:nth-child(1) { animation-delay: 0.1s; }
        .help-panel-button:nth-child(2) { animation-delay: 0.2s; }
        .help-panel-button:nth-child(3) { animation-delay: 0.3s; }

        @media (prefers-reduced-motion: reduce) {
          .help-panel-button {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
      <header className="sticky top-0 z-50 bg-[#E84D3D] shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-5 lg:px-8">
          <div className="flex justify-end items-center">
            <Button 
              asChild
              className="bg-white text-[#E84D3D] hover:bg-gray-100 font-medium transition transform hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] px-4 py-2 rounded-md focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#E84D3D]"
              aria-label="Share your alumni success story"
            >
              <Link to={createPageUrl("ShareStory")}>
                <Edit className="h-4 w-4 mr-2" />
                Share Your Story
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={<Users className="h-6 w-6" />}
            count="15"
            label="Students Mentored"
            trend="+3 this month"
            trendIcon={<TrendingUp className="h-3 w-3 mr-1" />}
            trendColorClass="bg-green-100 text-green-700"
            ariaLabel="View mentored students statistics"
          />
          <MetricCard 
            icon={<MessageSquare className="h-6 w-6" />}
            count="27"
            label="Questions Answered"
            trend="+8 this week"
            trendIcon={<TrendingUp className="h-3 w-3 mr-1" />}
            trendColorClass="bg-green-100 text-green-700"
            ariaLabel="View questions answered statistics"
          />
          <MetricCard
            icon={<MessageCircle className="h-6 w-6" />}
            count="24"
            label="Messages Answered"
            trend="+5 this week"
            trendIcon={<TrendingUp className="h-3 w-3 mr-1" />}
            trendColorClass="bg-green-100 text-green-700"
            ariaLabel="View messages answered statistics"
          />
          <MetricCard
            icon={<Star className="h-6 w-6" />}
            count="320"
            label="Impact Points"
            trend="→ 0%" 
            trendIcon={<ArrowRight className="h-3 w-3 mr-1" />}
            trendColorClass="bg-green-100 text-green-700"
            ariaLabel="View impact points statistics"
          />
        </div>

        <Card className="hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] focus-within:shadow-[0_4px_8px_rgba(0,0,0,0.05)] transition-all duration-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              How would you like to help today?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                asChild
                className={`bg-[#FF6B4A] text-white hover:bg-[#E04E2D] h-12 help-panel-button hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] focus-visible:shadow-[0_4px_8px_rgba(0,0,0,0.05)] ${commonFocusRing} focus-visible:ring-[#FF6B4A]`}
              >
                <Link to={createPageUrl("Students")} className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Mentor Students
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                className={`border-2 border-red-700 text-red-700 hover:bg-red-50 h-12 help-panel-button hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] focus-visible:shadow-[0_4px_8px_rgba(0,0,0,0.05)] ${commonFocusRing} focus-visible:ring-red-700`}
              >
                <Link to={createPageUrl("ShareJobLead")} className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Share Job Lead
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                className={`border-2 border-purple-700 text-purple-700 hover:bg-purple-50 h-12 help-panel-button hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] focus-visible:shadow-[0_4px_8px_rgba(0,0,0,0.05)] ${commonFocusRing} focus-visible:ring-purple-700`}
              >
                <Link to={createPageUrl("Network")} className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Answer Questions
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] focus-within:shadow-[0_4px_8px_rgba(0,0,0,0.05)] transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Pending Requests</h2>
              {pendingRequests.length > 0 && (
                <Button variant="ghost" size="sm" asChild className={`${commonFocusRing} focus-visible:ring-blue-500`}>
                  <Link to={createPageUrl("Requests")}>View all</Link>
                </Button>
              )}
            </div>
            {isLoading ? (
              <div className="space-y-4">
                {[1,2].map(i => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            ) : pendingRequests.length === 0 ? (
              <EmptyRequests />
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] focus-within:shadow-[0_4px_8px_rgba(0,0,0,0.05)] transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{request.name}</h3>
                        <span className="text-xs text-gray-500 sm:hidden">{request.time}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 w-full sm:w-auto justify-end sm:justify-normal">
                        <span className="text-xs text-gray-500 hidden sm:inline">{request.time}</span>
                        <Button variant="outline" size="sm" className={`${respondDeclineFocusRing} hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]`}>Decline</Button>
                        <Button size="sm" className={`bg-[#FF5A36] text-white hover:bg-[#E04D2D] ${respondDeclineFocusRing} hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]`}>Respond</Button>
                      </div>
                    </div>
                    <Badge className="mt-1 sm:mt-0 bg-[#6B46C1] text-white text-base px-4 py-1.5">
                       {request.topic}
                    </Badge>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{request.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] focus-within:shadow-[0_4px_8px_rgba(0,0,0,0.05)] transition-all duration-200">
          <CardContent className="px-8 pt-6 pb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900" id="impact-chart-title">
                  Monthly Impact Insights
                </h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        aria-label="Information about impact periods" 
                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-full p-1"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Each data point represents a distinct period (e.g., month) of activity.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="bg-green-100 text-green-700 font-medium px-3 py-1.5 cursor-help">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +25% this month
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentage change compared to the previous month's total impact points.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {isChartLoading ? (
              <div className="h-[90px] w-full bg-gray-50 flex items-center justify-center rounded-md mt-2 mb-3 text-center p-2">
                <p className="text-sm text-gray-500">Loading impact data...</p>
              </div>
            ) : sparklineData && sparklineData.length >= 2 ? (
              <div 
                className="mt-2"
                role="figure"
                aria-labelledby="impact-chart-title"
                aria-describedby="impact-chart-desc impact-chart-summary"
              >
                <p id="impact-chart-desc" className="text-xs text-gray-500 mb-1">Trend over the last {chartSummary?.periodCount || 'multiple'} periods.</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <SparkLineChart 
                          data={sparklineData}
                          height={60} 
                          width="100%" 
                          strokeWidth={1.5}
                          className="text-blue-700" 
                          dotRadius={2}
                          dotFill="rgb(29 78 216)" 
                          stroke="rgb(59, 130, 246)"
                          label="Monthly impact points trend"
                        />
                        <div className="absolute bottom-0 w-full border-t border-gray-200" style={{height: '1px'}}></div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View trend of Impact Points earned. Current trend: +25% this month.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {chartSummary && (
                  <p id="impact-chart-summary" className="text-xs text-center text-gray-600">
                    Highest: {chartSummary.highest} pts &nbsp;&bull;&nbsp; Avg: {chartSummary.average} pts/period
                  </p>
                )}
              </div>
            ) : (
              <div className="h-[90px] w-full bg-gray-50 flex items-center justify-center rounded-md mt-2 mb-3 text-center p-2">
                <p className="text-sm text-gray-600">
                  No impact data yet—mentor a student or answer a question to start tracking your monthly progress.
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-700 text-center mt-3 mb-4">
              Your contributions are making a significant difference to students.
            </p>
            
            <div className="text-center">
                <Link 
                    to={createPageUrl("ImpactReport")}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md"
                >
                    View Full Impact Report
                    <ExternalLink className="ml-1.5 h-4 w-4" />
                </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
