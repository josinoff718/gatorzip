import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for testing
const mockMentors = [
  {
    id: "m1",
    full_name: "Jennifer Chen",
    graduation_year: 2015,
    current_title: "Senior Software Engineer",
    current_company: "Google",
    industry: "technology",
    location: "San Francisco, CA"
  },
  {
    id: "m2",
    full_name: "Michael Rodriguez",
    graduation_year: 2018,
    current_title: "Investment Banking Associate",
    current_company: "Goldman Sachs",
    industry: "finance",
    location: "New York, NY"
  }
];

export default function MentorMatchPage() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState(mockMentors);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const userData = await User.me();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentor Match</h1>
          <p className="text-gray-600 mt-1 text-lg">
            Link up with Gator grads who've been in your shoes — here to help you crush it.
          </p>
        </div>

        {currentUser?.type === "alumni" && (
          <Button 
            onClick={() => navigate(createPageUrl("AlumniOnboarding"))}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Become a Mentor
          </Button>
        )}
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search mentors..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Mentor list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading mentors...</p>
        ) : mentors.length > 0 ? (
          mentors.map(mentor => (
            <Card key={mentor.id} className="overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">{mentor.full_name}</h3>
                <p className="text-gray-600 text-sm">{mentor.current_title} at {mentor.current_company}</p>
                <p className="text-gray-500 text-sm">{mentor.location}</p>
                <p className="text-gray-500 text-sm mt-2">Class of '{mentor.graduation_year}</p>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Send a Note
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No mentors found</p>
        )}
      </div>
    </div>
  );
}
