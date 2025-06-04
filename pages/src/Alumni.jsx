import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";

// Simple mock data
const mockAlumni = [
  {
    id: "m1",
    full_name: "Jennifer Chen",
    type: "alumni",
    graduation_year: 2015,
    major: "Computer Science",
    current_title: "Senior Software Engineer",
    current_company: "Google",
    industry: "technology",
    location: "San Francisco, CA"
  },
  {
    id: "m2",
    full_name: "Michael Rodriguez",
    type: "alumni",
    graduation_year: 2018,
    major: "Finance",
    current_title: "Investment Banking Associate",
    current_company: "Goldman Sachs",
    industry: "finance",
    location: "New York, NY"
  }
];

// Simple stories data
const featuredStories = [
  {
    id: 1,
    title: "From Gainesville to Google: My Tech Journey",
    user: {
      full_name: "Maria Rodriguez",
      graduation_year: 2018,
      current_company: "Google",
      current_title: "Senior Software Engineer"
    }
  }
];

export default function AlumniPage() {
  const [alumni, setAlumni] = useState(mockAlumni);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gator Alumni Network</h1>
          <p className="text-gray-600 mt-1">
            Connect with UF alumni and learn from their experiences
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Share Your Story
        </Button>
      </div>

      {/* Simple Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni.map(alumnus => (
          <Card key={alumnus.id} className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg">{alumnus.full_name}</h3>
              <p className="text-gray-600 text-sm">{alumnus.current_title} at {alumnus.current_company}</p>
              <p className="text-gray-500 text-sm">{alumnus.location}</p>
              <p className="text-gray-500 text-sm mt-2">Class of {alumnus.graduation_year}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
