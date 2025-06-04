
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MessageCircle, BriefcaseIcon, HomeIcon, UsersIcon, CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Using the same message structure from the dashboard
const SAMPLE_MESSAGES = [
  {
    id: 1,
    type: "mentorship",
    sender_id: "mentor123",
    sender_name: "Jennifer Chen",
    content: "Looking forward to our session on interview prep next week! Let me know if you have specific questions you'd like to cover.",
    date: "2024-01-20T10:30:00Z",
    read: true
  },
  {
    id: 2,
    type: "job",
    sender_id: "recruiter123",
    sender_name: "Google Recruiting",
    content: "Thanks for your application! We'd like to schedule a first-round interview for the Software Engineering Intern position.",
    date: "2024-01-19T15:45:00Z", 
    read: false
  },
  {
    id: 3,
    type: "network",
    sender_id: "alumni123",
    sender_name: "Sarah M.",
    content: "I made that exact product management transition last year! Happy to chat more about my experience and offer advice.",
    date: "2024-01-18T09:15:00Z",
    read: false
  },
  {
    id: 4,
    type: "roommate",
    sender_id: "roomie123",
    sender_name: "Alex Johnson",
    content: "Hey! I saw your roommate profile and I'm also looking in New York. Would love to chat more about potentially being roommates!",
    date: "2024-01-17T14:20:00Z",
    read: true
  }
];

export default function InboxPage() {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      // In the future, load real messages here
      setMessages(SAMPLE_MESSAGES);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMessageTypeIcon = (type) => {
    switch(type) {
      case 'mentorship': 
        return <MessageCircle className="h-5 w-5 text-purple-600" />;
      case 'roommate': 
        return <HomeIcon className="h-5 w-5 text-green-600" />;
      case 'network': 
        return <UsersIcon className="h-5 w-5 text-orange-600" />;
      case 'job': 
        return <BriefcaseIcon className="h-5 w-5 text-blue-600" />;
      default: 
        return <MessageCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMessageTypeBadge = (type) => {
    const styles = {
      mentorship: "bg-purple-100 text-purple-800",
      roommate: "bg-green-100 text-green-800",
      network: "bg-orange-100 text-orange-800",
      job: "bg-blue-100 text-blue-800"
    };
    
    const labels = {
      mentorship: "Mentor",
      roommate: "Roommate",
      network: "Network",
      job: "Job"
    };

    return (
      <Badge className={styles[type] || "bg-gray-100 text-gray-800"}>
        {labels[type] || "Message"}
      </Badge>
    );
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter = activeFilter === "all" || message.type === activeFilter;
    const matchesSearch = searchTerm === "" || 
      message.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              onClick={() => navigate(createPageUrl("StudentDashboard"))}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `You have ${unreadCount} unread messages` : "All caught up!"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="mentorship">Mentors</TabsTrigger>
              <TabsTrigger value="job">Jobs</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="roommate">Roommates</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search messages..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-600 text-sm">
                {searchTerm ? "Try adjusting your search terms" : "Your inbox is empty"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 hover:bg-gray-50 transition-colors ${!message.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getMessageTypeIcon(message.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{message.sender_name}</span>
                        {getMessageTypeBadge(message.type)}
                        {!message.read && (
                          <Badge variant="outline" className="text-blue-500 border-blue-200">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{message.content}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDistanceToNow(new Date(message.date), { addSuffix: true })}
                        </span>
                        {message.read ? (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            Read
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
