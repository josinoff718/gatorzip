
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Added import for Link
import { createPageUrl } from "@/utils"; // Added import for createPageUrl
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Download, 
  FileText, 
  Search, 
  Video, 
  CheckCircle, 
  Link as LinkIcon, 
  Calendar,
  ArrowUpRight
} from "lucide-react";

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const resourceCategories = {
    career: [
      {
        id: 1,
        title: "Resume Writing Guide",
        description: "Learn how to craft a compelling resume that stands out to employers",
        type: "document",
        tags: ["resume", "job search"],
        url: "#"
      },
      {
        id: 2,
        title: "Interview Preparation Strategies",
        description: "Comprehensive guide to acing your job interviews",
        type: "document",
        tags: ["interview", "job search"],
        url: "#"
      },
      {
        id: 3,
        title: "Job Search Strategies Workshop",
        description: "Recording of our popular workshop on effective job searching",
        type: "video",
        tags: ["job search", "workshop"],
        url: "#"
      },
      {
        id: 4,
        title: "Networking for Introverts",
        description: "Tips and strategies for building professional connections",
        type: "article",
        tags: ["networking", "soft skills"],
        url: "#"
      },
      {
        id: 5,
        title: "Salary Negotiation Tactics",
        description: "How to confidently negotiate your compensation package",
        type: "document",
        tags: ["negotiation", "career growth"],
        url: "#"
      }
    ],
    skills: [
      {
        id: 6,
        title: "Email Etiquette Guide",
        description: "Learn professional email communication standards",
        type: "document",
        tags: ["communication", "professional skills"],
        url: "#"
      },
      {
        id: 7,
        title: "Slack & Teams Best Practices",
        description: "How to effectively use messaging platforms in a professional setting",
        type: "article",
        tags: ["communication", "technology"],
        url: "#"
      },
      {
        id: 8,
        title: "Public Speaking Workshop",
        description: "Build confidence and skill in presentations and public speaking",
        type: "video",
        tags: ["communication", "presentation"],
        url: "#"
      },
      {
        id: 9,
        title: "Data Analysis Fundamentals",
        description: "Introduction to data-driven decision making",
        type: "course",
        tags: ["technical skills", "data"],
        url: "#"
      }
    ],
    parents: [
      {
        id: 10,
        title: "Parent's Guide to Career Development",
        description: "How to support your student's career journey",
        type: "document",
        tags: ["parent resources", "support"],
        url: "#"
      },
      {
        id: 11,
        title: "Career Timeline for College Students",
        description: "What to expect and when during your student's college career",
        type: "document",
        tags: ["planning", "timelines"],
        url: "#"
      },
      {
        id: 12,
        title: "Supporting Your Gator's Job Search",
        description: "Practical ways to help without overstepping",
        type: "article",
        tags: ["parent resources", "job search"],
        url: "#"
      }
    ],
    events: [
      {
        id: 13,
        title: "Fall Career Fair",
        description: "Annual career fair with over 100 employers",
        type: "event",
        date: "2023-10-15",
        tags: ["networking", "job fair"],
        url: "#"
      },
      {
        id: 14,
        title: "Resume Review Day",
        description: "Get feedback on your resume from industry professionals",
        type: "event",
        date: "2023-09-20",
        tags: ["resume", "feedback"],
        url: "#"
      },
      {
        id: 15,
        title: "Mock Interview Marathon",
        description: "Practice your interview skills with real recruiters",
        type: "event",
        date: "2023-11-05",
        tags: ["interview", "practice"],
        url: "#"
      },
      {
        id: 16,
        title: "Industry Panel: Tech Careers",
        description: "Hear from UF alumni working in technology",
        type: "event",
        date: "2023-09-28",
        tags: ["industry insights", "panel"],
        url: "#"
      }
    ]
  };

  const filterResources = (resources) => {
    if (!searchTerm) return resources;
    
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const resourceTypeIcons = {
    document: <FileText className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    article: <BookOpen className="h-4 w-4" />,
    course: <CheckCircle className="h-4 w-4" />,
    event: <Calendar className="h-4 w-4" />
  };

  const ResourceCard = ({ resource }) => (
    <Card className="h-full transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-1">
              {resourceTypeIcons[resource.type]}
              <Badge variant="outline" className="text-xs">
                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
              </Badge>
              {resource.date && (
                <Badge variant="outline" className="ml-1 text-xs">
                  {new Date(resource.date).toLocaleDateString()}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold">{resource.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{resource.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <div className="border-t px-5 py-3">
        <Button variant="link" className="h-auto p-0 text-[--primary]" asChild>
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            {resource.type === "document" ? (
              <>Download <Download className="ml-1 h-3 w-3" /></>
            ) : resource.type === "event" ? (
              <>Register <ArrowUpRight className="ml-1 h-3 w-3" /></>
            ) : (
              <>View Resource <LinkIcon className="ml-1 h-3 w-3" /></>
            )}
          </a>
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Career Resources</h1>
        <p className="text-gray-600 mt-1">
          Tools, guides, and resources to help you succeed
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="career" className="space-y-6">
        <TabsList>
          <TabsTrigger value="career">Career Essentials</TabsTrigger>
          <TabsTrigger value="skills">Professional Skills</TabsTrigger>
          <TabsTrigger value="parents">For Parents</TabsTrigger>
          <TabsTrigger value="events">Events & Workshops</TabsTrigger>
        </TabsList>

        {Object.keys(resourceCategories).map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filterResources(resourceCategories[category]).map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
              {filterResources(resourceCategories[category]).length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No resources found</h3>
                  <p className="mt-1 text-gray-500">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 bg-[--secondary]/10 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Need specialized guidance?</h2>
            <p className="mt-2 text-gray-600">
              Connect with a mentor who's been where you're going. Our network of alumni and industry professionals are ready to help.
            </p>
          </div>
          <Button 
            className="bg-[--secondary] hover:bg-[--secondary]/90"
            size="lg"
            asChild
          >
            <Link to={createPageUrl("Mentorship")}>
              Find a Mentor
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
