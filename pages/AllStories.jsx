import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { AlumniStory } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Search,
  Filter,
  BookOpen,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import StoryPreview from "../components/alumni/StoryPreview";

export default function AllStoriesPage() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setCurrentUser(userData);
      
      // In a real app, load stories from AlumniStory API endpoint
      // For now we'll use mock data
      setStories([
        {
          id: 1,
          title: "From Gainesville to Google: My Tech Journey",
          user: {
            full_name: "Maria Rodriguez",
            graduation_year: 2018,
            current_company: "Google",
            current_title: "Senior Software Engineer"
          },
          story_type: "career_transition",
          excerpt: "After graduating with a Computer Science degree, I took an unconventional path through three industries before landing my dream job...",
          image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop",
          created_date: new Date(2023, 5, 15)
        },
        {
          id: 2,
          title: "Advice for Business Gators: Building Your Network Early",
          user: {
            full_name: "James Washington",
            graduation_year: 2015,
            current_company: "McKinsey & Company",
            current_title: "Managing Consultant"
          },
          story_type: "advice",
          excerpt: "The connections you make during your time at UF will be invaluable. Here's how I leveraged mine to accelerate my consulting career...",
          image_url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2874&auto=format&fit=crop",
          created_date: new Date(2023, 4, 22)
        },
        {
          id: 3,
          title: "Healthcare Innovation: What I Wish I Knew as a Student",
          user: {
            full_name: "Priya Patel",
            graduation_year: 2017,
            current_company: "Mayo Clinic",
            current_title: "Healthcare Innovation Lead"
          },
          story_type: "industry_insight",
          excerpt: "The healthcare industry is rapidly evolving. Here are the skills and knowledge areas that have been most valuable in my career path...",
          image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2940&auto=format&fit=crop",
          created_date: new Date(2023, 6, 3)
        },
        {
          id: 4,
          title: "The Five Skills That Accelerated My Career Growth",
          user: {
            full_name: "David Chen",
            graduation_year: 2016,
            current_company: "Adobe",
            current_title: "Product Marketing Manager"
          },
          story_type: "professional_development",
          excerpt: "Beyond technical expertise, these five skills helped me stand out and get promoted three times in four years...",
          image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2942&auto=format&fit=crop",
          created_date: new Date(2023, 3, 12)
        },
        {
          id: 5,
          title: "Moving from Engineering to Product Management",
          user: {
            full_name: "Alex Taylor",
            graduation_year: 2014,
            current_company: "Spotify",
            current_title: "Senior Product Manager"
          },
          story_type: "career_transition",
          excerpt: "Making the leap from engineering to product was challenging but rewarding. Here's how I navigated the transition and what I learned...",
          image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2940&auto=format&fit=crop",
          created_date: new Date(2023, 5, 28)
        },
        {
          id: 6,
          title: "Finding the Right Mentor: Lessons from My First Five Years",
          user: {
            full_name: "Sophia Wilson",
            graduation_year: 2019,
            current_company: "Deloitte",
            current_title: "Consultant"
          },
          story_type: "advice",
          excerpt: "Mentorship transformed my early career, but finding the right mentor wasn't always straightforward. Here's what worked for me...",
          image_url: "https://images.unsplash.com/photo-1573497161079-f3fd25cc6b90?q=80&w=2874&auto=format&fit=crop",
          created_date: new Date(2023, 7, 10)
        }
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = searchTerm === "" || 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === "all" || story.story_type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="gap-1"
        >
          <Link to={createPageUrl("Alumni")}>
            <ArrowLeft className="h-4 w-4" /> Back to Alumni
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alumni Stories</h1>
          <p className="text-gray-600 mt-1">
            Real experiences and insights from fellow Gators
          </p>
        </div>
        {currentUser?.type === "alumni" && (
          <Link to={createPageUrl("ShareStory")}>
            <Button className="bg-[--secondary] hover:bg-[--secondary]/90">
              <BookOpen className="w-4 h-4 mr-2" />
              Share Your Story
            </Button>
          </Link>
        )}
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search stories by title, content..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          <Badge 
            variant={activeFilter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter("all")}
          >
            All Types
          </Badge>
          <Badge 
            variant={activeFilter === "career_transition" ? "default" : "outline"}
            className="cursor-pointer flex items-center gap-1"
            onClick={() => setActiveFilter("career_transition")}
          >
            <Briefcase className="h-3 w-3" /> Career Transitions
          </Badge>
          <Badge 
            variant={activeFilter === "professional_development" ? "default" : "outline"}
            className="cursor-pointer flex items-center gap-1"
            onClick={() => setActiveFilter("professional_development")}
          >
            <GraduationCap className="h-3 w-3" /> Professional Development
          </Badge>
          <Badge 
            variant={activeFilter === "industry_insight" ? "default" : "outline"}
            className="cursor-pointer flex items-center gap-1"
            onClick={() => setActiveFilter("industry_insight")}
          >
            <Lightbulb className="h-3 w-3" /> Industry Insights
          </Badge>
          <Badge 
            variant={activeFilter === "advice" ? "default" : "outline"}
            className="cursor-pointer flex items-center gap-1"
            onClick={() => setActiveFilter("advice")}
          >
            <HelpCircle className="h-3 w-3" /> Advice
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="h-[350px] animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredStories.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No stories found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filters
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map(story => (
            <StoryPreview key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}