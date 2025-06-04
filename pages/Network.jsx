
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetworkPost } from "@/api/entities";
import { User } from "@/api/entities";
import { 
  Users, 
  Search, 
  Filter,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  Reply,
  User as UserIcon,
  Check,
  ChevronLeft,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Flame, 
  MessagesSquare, 
  Clock, 
  TrendingUp,
  Trophy,
  Rocket
} from "lucide-react";
import { Label } from "@/components/ui/label";

export default function NetworkPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [activeFilter, setActiveFilter] = useState("needs_reply");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [questionData, setQuestionData] = useState({
    title: "",
    content: "",
    category: "networking",
    is_anonymous: false
  });
  
  const [expandedThreads, setExpandedThreads] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  // Fixed syntax error on this line
  const networkImageRef = useRef(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [isInviteSending, setIsInviteSending] = useState(false);
  const [isInviteSuccess, setIsInviteSuccess] = useState(false);

  // Demo top helpers data
  const topHelpers = [
    { name: "Emily T.", replies: 15, streak: 3, id: 1 },
    { name: "Ryan D.", replies: 7, streak: 2, id: 2 },
    { name: "Sam P.", replies: 3, streak: 1, id: 3 }
  ];

  // Demo post emojis based on category
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      "mentorship": "💼",
      "networking": "🤝",
      "job_seeking": "💻",
      "finance": "💸",
      "tech": "🖥️",
      "relocation": "🏙️",
      "other": "🔍",
      "career_advice": "🎯",
      "roommate": "🏠",
      "internship": "📬",
      "alumni_insights": "🧠",
      "parent_to_parent": "👪",
      "stressed": "😰"
    };
    return emojiMap[category] || "💬";
  };

  // Categories list definition
  const categories = [
    { id: "career_advice", label: "Career Advice", emoji: "🎯" },
    { id: "roommate", label: "Roommate Stuff", emoji: "🏠" },
    { id: "internship", label: "Internship Leads", emoji: "📬" },
    { id: "alumni_insights", label: "Alumni Insights", emoji: "🧠" },
    { id: "parent_to_parent", label: "Parent to Parent", emoji: "👪" },
    { id: "stressed", label: "I'm Just Stressed", emoji: "😰" }
  ];

  // Demo data for initial view and replies
  const recentPosts = [
    {
      id: 1,
      title: "Looking for Product Management mentors in Tech",
      content: "Rising senior in Information Systems seeking guidance on transitioning into PM roles. Would love to connect with people in product roles at tech companies.",
      category: "mentorship",
      user: {
        name: "Alex Chen",
        role: "Student",
        graduation_year: 2024
      },
      replies_count: 3,
      created_date: "2024-01-15",
      replies: [
        {
          id: 101,
          user: { name: "Jennifer L.", graduation_year: 2018 },
          content: "I've been a PM at Google for 3 years. Happy to chat about the transition from IS to product. DM me!",
          created_date: "2024-01-16"
        },
        {
          id: 102,
          user: { name: "Mike R.", graduation_year: 2020 },
          content: "I recommend checking out the APM programs at larger tech companies. They're great entry points for recent grads.",
          created_date: "2024-01-16"
        },
        {
          id: 103,
          user: { name: "Sarah T.", graduation_year: 2015 },
          content: "I made a similar transition. The key is building a portfolio of small projects that showcase your product thinking. I can review your resume if you'd like.",
          created_date: "2024-01-17"
        }
      ]
    },
    {
      id: 2,
      title: "Investment Banking interview prep partner needed",
      content: "Preparing for IB summer analyst interviews. Looking for fellow finance students to practice technical questions and case studies together.",
      category: "finance",
      user: {
        name: "Sarah Thompson",
        role: "Student",
        graduation_year: 2025
      },
      replies_count: 5,
      created_date: "2024-01-14",
      replies: [
        {
          id: 201,
          user: { name: "David K.", graduation_year: 2022 },
          content: "I just went through the IB recruiting process last year. Happy to share my interview notes and practice with you.",
          created_date: "2024-01-15"
        },
        {
          id: 202,
          user: { name: "Emma J.", graduation_year: 2024 },
          content: "I'm also preparing for IB interviews. Would love to partner up for case studies!",
          created_date: "2024-01-15"
        }
      ]
    },
    {
      id: 3,
      title: "Software Engineers in Seattle area?",
      content: "Moving to Seattle this summer for my first job. Would love to connect with other grads in the area, especially in tech.",
      category: "relocation",
      user: {
        name: "David Kim",
        role: "Recent Grad",
        graduation_year: 2023
      },
      replies_count: 8,
      created_date: "2024-01-13",
      replies: [
        {
          id: 301,
          user: { name: "Ryan D.", graduation_year: 2019 },
          content: "I've been in Seattle for 3 years working at Amazon. Let's connect when you arrive!",
          created_date: "2024-01-14"
        },
        {
          id: 302,
          user: { name: "Lisa M.", graduation_year: 2020 },
          content: "We have a Seattle meetup every month. I'll add you to our group!",
          created_date: "2024-01-14"
        },
        {
          id: 303,
          user: { name: "Carlos F.", graduation_year: 2018 },
          content: "If you're looking for housing, the Capitol Hill and Fremont areas are great for tech people. Lots of other devs around.",
          created_date: "2024-01-15"
        }
      ]
    }
  ];
  
  // Define handleLoadMore before it's used
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, just set hasMorePosts to false after one load more
      setHasMorePosts(false);
      setIsLoadingMore(false);
      console.log("All posts loaded!");
    }, 1000);
  }, [isLoadingMore]);

  // Define LoadMoreTrigger component to avoid intersection observer issues
  const LoadMoreTrigger = ({ onVisible, children }) => {
    const ref = useRef(null);
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onVisible();
          }
        },
        { threshold: 0.1 }
      );
      
      const currentRef = ref.current;
      if (currentRef) {
        observer.observe(currentRef);
      }
      
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [onVisible]);
    
    return <div ref={ref}>{children}</div>;
  };

  // Filter posts based on activeFilter
  const filteredPosts = recentPosts.filter(post => {
    if (activeFilter === "trending") {
      const hoursAgo = (Date.now() - new Date(post.created_date).getTime()) / (1000 * 60 * 60);
      return post.replies_count >= 3 && hoursAgo < 48;
    } else if (activeFilter === "needs_reply") {
      return post.replies_count <= 1;
    } else if (activeFilter === "newest") {
      const hoursAgo = (Date.now() - new Date(post.created_date).getTime()) / (1000 * 60 * 60);
      return hoursAgo < 24;
    }
    return true;
  });

  // Get badge for post based on activity
  const getPostBadge = (post) => {
    const hoursAgo = (Date.now() - new Date(post.created_date).getTime()) / (1000 * 60 * 60);
    
    if (post.replies_count >= 3 && hoursAgo < 48) {
      return { icon: Flame, label: "Trending", color: "bg-orange-100 text-orange-800" };
    }
    if (post.replies_count <= 1) {
      return { icon: MessagesSquare, label: "Needs Reply", color: "bg-blue-100 text-blue-800" };
    }
    if (hoursAgo < 24) {
      return { icon: Clock, label: "New", color: "bg-green-100 text-green-800" };
    }
    return null;
  };

  // QA: Enhanced filter handling
  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
    // Add loading state while filtering
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  // QA: Improved thread expansion
  const handleThreadExpansion = (postId) => {
    setExpandedThreads(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleBackClick = () => {
    navigate(createPageUrl("StudentDashboard")); 
  };

  const handleAddReply = (postId = null) => {
    if (!replyText.trim()) return;
    
    console.log("Sending reply:", replyText, "to post:", postId || selectedPost?.id);
    
    // Demo: Add reply to the thread and increment count
    if (postId) {
      // In a real app, you'd update state here with the new reply
      alert("Reply added successfully!");
    }
    
    setReplyText("");
    setReplyingTo(null);
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!questionData.title || !questionData.content) return;
    
    setIsLoading(true);
    
    try {
      // Here you would normally post to your backend
      console.log("Submitting question:", questionData);
      
      // For demo purposes, just show success and close
      alert("Your question has been posted!");
      setShowQuestionForm(false);
      setQuestionData({
        title: "",
        content: "",
        category: "networking",
        is_anonymous: false
      });
    } catch (error) {
      console.error("Error posting question:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAskQuestionClick = () => {
    setShowQuestionForm(true);
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setIsInviteSending(true);
    
    try {
      // In a real implementation, this would call an API
      console.log("Sending invite to:", inviteEmail);
      console.log("With message:", inviteMessage);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success state
      setIsInviteSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsInviteSuccess(false);
        setInviteEmail("");
        setInviteMessage("");
        setShowInviteModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error sending invite:", error);
    } finally {
      setIsInviteSending(false);
    }
  };

  // Fixed: Load user data only once
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        try {
          const userData = await User.me();
          setCurrentUser(userData);
        } catch (error) {
          // Allow guest access
          console.log("Network Page: Using guest access");
          setCurrentUser({ user_type: 'guest' });
        }
      } finally {
        // Always set loading to false, even for guests
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0021A5]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Back to Dashboard button - only show if user is authenticated */}
      {currentUser && currentUser.user_type !== 'guest' && (
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-600 hover:text-[#0021A5] transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Six Degrees of Connection</h1>
        
        <div className="py-8 px-6 bg-blue-50 rounded-lg">
          <p className="text-lg font-semibold text-blue-900 leading-[1.6] max-w-[60ch]">
            Six Degrees of Connection fast-tracks you to warm introductions, internships, and jobs through our community network.
          </p>
        </div>
      </div>

      <Card className="hover:shadow-sm transition-all mb-10 border-purple-100 bg-purple-50/30 shadow-sm">
        <CardContent className="p-7">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-purple-100 mt-1">
              <MessageSquare 
                className="h-[18px] w-[18px] text-purple-600" 
                aria-hidden="true" 
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">✍️ Ask the Network</h3>
              <p className="text-gray-600 mb-4">
                Post your question and our 6° community—students, alumni, mentors—will jump in to help.
                <br />
                <span className="italic text-gray-500">You can even ask anonymously.</span>
              </p>
              <div className="flex justify-end">
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700 hover:scale-[1.01] transition-all hover:shadow text-white group py-3.5"
                  onClick={handleAskQuestionClick}
                >
                  Ask a Question <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Recent Conversations</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-600">
                Real people. Real replies. Sort by what's trending or jump in to help.
              </p>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                📢 42 active now
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide pb-2">
                <div 
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500"
                  role="tablist"
                  aria-label="Filter conversations"
                >
                  <button
                    className={`
                      relative flex items-center justify-center gap-1 whitespace-nowrap rounded-sm 
                      px-3 py-1.5 text-sm font-semibold transition-all
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2
                      after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-current 
                      after:scale-x-0 hover:after:scale-x-100 after:transition-transform
                      ${activeFilter === 'needs_reply' 
                        ? 'bg-red-50 text-red-700 shadow-sm' 
                        : 'hover:text-red-600 text-red-500'
                      }
                    `}
                    onClick={() => handleFilterChange('needs_reply')}
                    aria-selected={activeFilter === 'needs_reply'}
                    role="tab"
                    tabIndex={activeFilter === 'needs_reply' ? 0 : -1}
                    id="tab-needs-reply"
                    aria-controls="panel-needs-reply"
                  >
                    <MessagesSquare className="h-4 w-4" aria-hidden="true" />
                    🙋 Needs Reply
                  </button>
                  <button
                    className={`
                      relative flex items-center justify-center gap-1 whitespace-nowrap rounded-sm 
                      px-3 py-1.5 text-sm font-medium transition-all
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2
                      after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-current 
                      after:scale-x-0 hover:after:scale-x-100 after:transition-transform
                      ${activeFilter === 'trending' 
                        ? 'bg-orange-50 text-orange-700 font-semibold shadow-sm' 
                        : 'hover:text-orange-600 text-orange-500'
                      }
                    `}
                    onClick={() => handleFilterChange('trending')}
                    aria-selected={activeFilter === 'trending'}
                    role="tab"
                    tabIndex={activeFilter === 'trending' ? 0 : -1}
                    id="tab-trending"
                    aria-controls="panel-trending"
                  >
                    <Flame className="h-4 w-4" aria-hidden="true" />
                    🔥 Trending
                  </button>
                  <button
                    className={`
                      relative flex items-center justify-center gap-1 whitespace-nowrap rounded-sm 
                      px-3 py-1.5 text-sm font-medium transition-all
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2
                      after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-current 
                      after:scale-x-0 hover:after:scale-x-100 after:transition-transform
                      ${activeFilter === 'newest' 
                        ? 'bg-green-50 text-green-700 font-semibold shadow-sm' 
                        : 'hover:text-green-600 text-green-500'
                      }
                    `}
                    onClick={() => handleFilterChange('newest')}
                    aria-selected={activeFilter === 'newest'}
                    role="tab"
                    tabIndex={activeFilter === 'newest' ? 0 : -1}
                    id="tab-newest"
                    aria-controls="panel-newest"
                  >
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    🕒 Recent
                  </button>
                  <button
                    className={`
                      relative flex items-center justify-center gap-1 whitespace-nowrap rounded-sm 
                      px-3 py-1.5 text-sm font-medium transition-all
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2
                      after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-current 
                      after:scale-x-0 hover:after:scale-x-100 after:transition-transform
                      ${activeFilter === 'active' 
                        ? 'bg-purple-50 text-purple-700 font-semibold shadow-sm' 
                        : 'hover:text-purple-600 text-purple-500'
                      }
                    `}
                    onClick={() => handleFilterChange('active')}
                    aria-selected={activeFilter === 'active'}
                    role="tab"
                    tabIndex={activeFilter === 'active' ? 0 : -1}
                    id="tab-active"
                    aria-controls="panel-active"
                  >
                    <TrendingUp className="h-4 w-4" aria-hidden="true" />
                    📈 Most Active
                  </button>
                </div>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-9"
                />
              </div>
            </div>

            <div 
              id="panel-needs-reply"
              role="tabpanel"
              aria-labelledby="tab-needs-reply"
              className={activeFilter === 'needs_reply' ? '' : 'hidden'}
            >
              <div className="space-y-4">
                {filteredPosts.map(post => {
                  const badgeInfo = getPostBadge(post);
                  const isExpanded = expandedThreads[post.id];
                  
                  return (
                    <Card 
                      key={post.id} 
                      className="overflow-hidden transition-all duration-200
                        hover:shadow-sm hover:border-l-4 hover:border-purple-500/25 
                        focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="w-full">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {getCategoryEmoji(post.category)} {post.title}
                              </h3>
                              {badgeInfo && (
                                <Badge className={`flex items-center gap-1 ${badgeInfo.color}`}>
                                  <badgeInfo.icon className="h-3 w-3" />
                                  {badgeInfo.label}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-gray-600 mb-3">{post.content}</p>
                            
                            {/* Simplified Meta - No Class of Year except in replies */}
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-500">
                                {post.is_anonymous ? (
                                  <span className="flex items-center gap-1">
                                    <UserIcon className="h-4 w-4" />
                                    Anonymous
                                  </span>
                                ) : (
                                  <>Posted by {post.user.name}</>
                                )}
                              </span>
                              
                              <button 
                                onClick={() => handleThreadExpansion(post.id)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                                aria-expanded={expandedThreads[post.id]}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.replies_count} replies</span>
                                {expandedThreads[post.id] ? 
                                  <ChevronUp className="h-4 w-4" /> : 
                                  <ChevronDown className="h-4 w-4" />
                                }
                              </button>
                            </div>
                            
                            {/* Expanded Reply Thread */}
                            {isExpanded && post.replies && (
                              <div className="mt-4 pl-4 border-l-2 border-gray-100">
                                {post.replies.map(reply => (
                                  <div key={reply.id} className="mb-4 last:mb-0">
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="font-medium">{reply.user.name}</span>
                                      {/* Class of YEAR only in replies for detail */}
                                      {reply.user.graduation_year && (
                                        <span className="text-gray-500">• Class of {reply.user.graduation_year}</span>
                                      )}
                                    </div>
                                    <p className="text-gray-700 my-1">{reply.content}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                      <span className="text-xs text-gray-500">
                                        {new Date(reply.created_date).toLocaleDateString()}
                                      </span>
                                      <button 
                                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                                        onClick={() => setReplyingTo(post.id)}
                                      >
                                        <Reply className="h-3 w-3" /> Reply
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                
                                {/* Inline Reply Form */}
                                {replyingTo === post.id && (
                                  <div className="mt-3">
                                    <Textarea
                                      placeholder="Write your reply..."
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      className="min-h-[80px] mb-2"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setReplyingTo(null)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        className="bg-[--primary]"
                                        onClick={() => handleAddReply(post.id)}
                                        disabled={!replyText.trim()}
                                      >
                                        Post Reply
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Reply Button */}
                                {replyingTo !== post.id && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => setReplyingTo(post.id)}
                                  >
                                    <Reply className="h-3 w-3 mr-1" /> Add Your Reply
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
                  🏆 Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {topHelpers.map((helper, index) => (
                  <div 
                    key={helper.id}
                    className={`flex items-center gap-3 ${
                      index === 0 ? "bg-amber-50" : ""
                    } p-2 rounded-lg transition-colors hover:bg-gray-50`}
                  >
                    <div className="font-medium w-8 text-center flex items-center justify-center">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{helper.name}</div>
                      <div className="text-xs text-gray-500">
                        <span className="group-hover:text-amber-500 transition-colors hover:font-medium cursor-default">
                          {helper.replies} replies
                        </span>
                        {helper.replies >= 10 && (
                          <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                            Super Connector
                          </Badge>
                        )}
                        {helper.replies >= 3 && helper.replies < 10 && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            Rising Helper
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <p className="text-sm text-gray-600 text-center border-t pt-4">
                  Help get this board moving! Your replies make our community stronger. 🌱
                </p>

                <div className="border-t pt-4">
                  <h4 className="text-lg font-medium mb-2 flex items-center gap-1.5">
                    <span className="text-xl">📣</span> Invite Your Network
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    If this board helped you, help someone else find it too.
                  </p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowInviteModal(true)}
                  >
                    🤝 Invite Your Network
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-[#0033A0]/5 to-[#FA4616]/5 border-0 mt-8">
        <CardContent className="p-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              💡 Connect & Grow
            </Badge>
            
            <blockquote className="my-6 text-sm italic text-orange-700 border-l-4 border-orange-200 pl-4 py-1 mx-auto max-w-lg">
              "I found my internship through a reply here—best decision I made all year."
              <footer className="mt-1 font-normal not-italic text-gray-500">
                — Jordan, Class of 2024
              </footer>
            </blockquote>
            
            <h2 className="text-2xl font-bold mb-2">
              Ready to tap into the power of your network?
            </h2>
            <p className="text-gray-600 mb-6">
              Whether you're looking for advice, mentorship, or just want to connect—our community is here to help.
            </p>
            
            <Button 
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 
                transition-all hover:shadow-md hover:scale-[1.02] group 
                py-3.5 mx-4 sm:mx-0 text-white"
              size="lg"
              onClick={handleAskQuestionClick}
            >
              Ask Your First Question 
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showQuestionForm} onOpenChange={setShowQuestionForm}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post a Question to the Network</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Question Title</Label>
              <Input
                id="title"
                placeholder="E.g., Looking for Product Management mentors in Tech"
                value={questionData.title}
                onChange={(e) => setQuestionData({...questionData, title: e.target.value})}
                required
              />
              <p className="text-xs text-gray-500">
                Be specific so the right people can help you
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Choose a category:</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setQuestionData({...questionData, category: category.id})}
                    className={`p-2 rounded-lg border transition-all text-left hover:bg-purple-50 ${
                      questionData.category === category.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="text-lg mr-1">{category.emoji}</span>
                    <span className="font-medium text-sm">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Details</Label>
              <Textarea
                id="content"
                placeholder="Share more context about what you're looking for..."
                value={questionData.content}
                onChange={(e) => setQuestionData({...questionData, content: e.target.value})}
                className="min-h-[100px]"
                required
              />
            </div>
            
            {/* Anonymous Option */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_anonymous"
                checked={questionData.is_anonymous}
                onChange={(e) => setQuestionData({...questionData, is_anonymous: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex flex-col">
                <label htmlFor="is_anonymous" className="text-sm font-medium cursor-pointer">
                  Post anonymously
                </label>
                <p className="text-xs text-gray-500">
                  Your name won't be shown publicly
                </p>
              </div>
            </div>
            
            {/* Fixed Footer Position */}
            <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowQuestionForm(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Posting..." : "Post Question"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-gray-600 mb-3">{selectedPost?.content}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{selectedPost?.user.name}</span>
                <span>•</span>
                <span>Class of {selectedPost?.user.graduation_year}</span>
                <span>•</span>
                <span>{new Date(selectedPost?.created_date).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Replies ({selectedPost?.replies_count})</h4>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-[--primary]" />
                  Write a Reply
                </h5>
                <Textarea 
                  placeholder="Share your advice, experience, or offer to help..." 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px] mb-3"
                />
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Be respectful and constructive.
                  </div>
                  <Button 
                    className="bg-[--primary]"
                    onClick={handleAddReply}
                    disabled={!replyText.trim()}
                  >
                    Post Reply
                  </Button>
                </div>
              </div>
              
              {selectedPost?.replies_count === 0 && (
                <div className="text-gray-500 text-center py-6">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p>Be the first to reply and help a fellow community member!</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-lg w-full max-h-[80vh] bg-white rounded-lg p-2 overflow-auto">
            <button 
              className="absolute -top-4 -right-4 bg-white rounded-full p-1 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                setShowImageModal(false);
              }}
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8c7f49_sixdegrees.png" 
              alt="Expanded view of the network connections diagram"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span role="img" aria-label="handshake">🤝</span> Invite a Friend
            </DialogTitle>
          </DialogHeader>
          
          {!isInviteSuccess ? (
            <form onSubmit={handleInviteSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="Their email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invite-message">Personal Message (Optional)</Label>
                <Textarea
                  id="invite-message"
                  placeholder="Add a personal note to your invitation..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800">
                <p>
                  We'll send them an invitation with your name and a link to join the platform.
                </p>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowInviteModal(false)}
                  disabled={isInviteSending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[--primary]"
                  disabled={isInviteSending || !inviteEmail}
                >
                  {isInviteSending ? "Sending..." : "Send Invite"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center">
              <div className="bg-green-100 text-green-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Check className="h-8 w-8"/>
              </div>
              <h3 className="text-xl font-semibold mb-2">Invite sent!</h3>
              <p className="text-gray-600 mb-4">
                Thanks for paying it forward. We'll let you know if they join!
              </p>
              <Button 
                className="bg-[--primary]"
                onClick={() => {
                  setIsInviteSuccess(false);
                  setInviteEmail("");
                  setInviteMessage("");
                  setShowInviteModal(false);
                }}
              >
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lazy Load with LoadMoreTrigger component */}
      <div className="mt-8 text-center">
        {hasMorePosts && (
          <LoadMoreTrigger onVisible={handleLoadMore}>
            {isLoadingMore ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto" />
            ) : (
              <Button 
                variant="outline"
                onClick={handleLoadMore}
                className="w-full sm:w-auto"
              >
                Load More Conversations
              </Button>
            )}
          </LoadMoreTrigger>
        )}
      </div>
    </div>
  );
}
