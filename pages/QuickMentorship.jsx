import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Clock,
  FileText,
  MessageSquare,
  Users,
  Star,
  Video
} from "lucide-react";
import QuickSessionCard from "../components/mentorship/QuickSessionCard";

export default function QuickMentorshipPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Mock data - in real app, fetch from MentorshipSession entity
  const availableSessions = [
    {
      id: 1,
      mentor_name: "Jennifer Chen",
      mentor_title: "Senior Software Engineer at Google",
      session_type: "technical_advice",
      duration_minutes: 30,
      available_slots: 3
    },
    {
      id: 2,
      mentor_name: "Michael Rodriguez",
      mentor_title: "Investment Banking Associate at Goldman Sachs",
      session_type: "career_chat",
      duration_minutes: 15,
      available_slots: 5
    },
    // Add more mock sessions
  ];

  const handleBookSession = (session) => {
    // Implement booking logic
    console.log("Booking session:", session);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quick Mentorship Sessions</h1>
        <p className="text-gray-600 mt-1">
          Book a focused session with experienced alumni
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Session Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setSelectedType("resume_review")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Resume Review
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setSelectedType("career_chat")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Career Chat
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setSelectedType("mock_interview")}
            >
              <Users className="w-4 h-4 mr-2" />
              Mock Interview
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setSelectedType("industry_insights")}
            >
              <Star className="w-4 h-4 mr-2" />
              Industry Insights
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setSelectedType("technical_advice")}
            >
              <Video className="w-4 h-4 mr-2" />
              Technical Advice
            </Button>
          </CardContent>
        </Card>

        {/* Sessions Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search by mentor name or session type..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableSessions
              .filter(session => 
                (selectedType === "all" || session.session_type === selectedType) &&
                (searchTerm === "" || 
                  session.mentor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  session.session_type.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map(session => (
                <QuickSessionCard
                  key={session.id}
                  session={session}
                  onBook={handleBookSession}
                />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}