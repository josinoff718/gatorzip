
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar,
  Users,
  MessageSquare,
  CheckCircle,
  Star,
  Clock,
  BookOpen,
  GraduationCap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MentorDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setIsLoading(false);
  };

  const mentorshipStats = {
    totalSessions: 12,
    upcomingSessions: 3,
    studentsHelped: 8,
    averageRating: 4.8
  };

  const upcomingSessions = [
    {
      id: 1,
      studentName: "Alex Johnson",
      type: "Resume Review",
      date: "2024-03-15T14:00:00",
      status: "scheduled"
    },
    {
      id: 2,
      studentName: "Sarah Smith",
      type: "Career Advice",
      date: "2024-03-17T15:30:00",
      status: "scheduled"
    },
    {
      id: 3,
      studentName: "Michael Brown",
      type: "Mock Interview",
      date: "2024-03-20T11:00:00",
      status: "scheduled"
    }
  ];

  const recentRequests = [
    {
      id: 1,
      studentName: "Emma Davis",
      type: "Career Advice",
      message: "Would love your insights on transitioning into product management",
      date: "2024-03-10T09:00:00"
    },
    {
      id: 2,
      studentName: "James Wilson",
      type: "Resume Review",
      message: "Seeking feedback on my internship resume",
      date: "2024-03-09T14:30:00"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track your mentorship impact and manage upcoming sessions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sessions</p>
                <p className="text-2xl font-bold">{mentorshipStats.totalSessions}</p>
              </div>
              <Calendar className="h-8 w-8 text-[--primary] opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Students Helped</p>
                <p className="text-2xl font-bold">{mentorshipStats.studentsHelped}</p>
              </div>
              <Users className="h-8 w-8 text-[--secondary] opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming Sessions</p>
                <p className="text-2xl font-bold">{mentorshipStats.upcomingSessions}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold">{mentorshipStats.averageRating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[--primary]" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{session.studentName}</h3>
                    <p className="text-sm text-gray-600">{session.type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                      })}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Join Session
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[--secondary]" />
              Recent Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map(request => (
                <div key={request.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{request.studentName}</span>
                    <Badge variant="outline" className="text-xs">
                      {request.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.message}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(request.date).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm">
                      Respond
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-4 px-6 flex flex-col items-center gap-2"
        >
          <Calendar className="h-6 w-6" />
          <span>Set Availability</span>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto py-4 px-6 flex flex-col items-center gap-2"
        >
          <GraduationCap className="h-6 w-6" />
          <span>Update Expertise</span>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto py-4 px-6 flex flex-col items-center gap-2"
        >
          <BookOpen className="h-6 w-6" />
          <span>Share Resources</span>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto py-4 px-6 flex flex-col items-center gap-2"
        >
          <MessageSquare className="h-6 w-6" />
          <span>Message Center</span>
        </Button>
      </div>
    </div>
  );
}
