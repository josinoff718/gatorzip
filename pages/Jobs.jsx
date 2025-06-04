import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Job } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPageUrl } from "@/utils";
import { 
  Building, 
  Filter, 
  Search, 
  Users,
  X,
  ChevronLeft,
  Loader2,
  Plus
} from "lucide-react";
import JobFilters from "../components/jobs/JobFilters";
import CompanyJobCard from "../components/jobs/CompanyJobCard";
import GatorJobCard from "../components/jobs/GatorJobCard";
import { Badge } from "@/components/ui/badge";

// Replace CommonJS require with a fallback approach using variables
// that will be safely used throughout the component
const defaultSchoolTerms = {
  mascot: "student",
  mascots: "students",
  shortName: "your school",
  networkTitle: "Student Network"
};

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [gatorJobs, setGatorJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("company");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const navigate = useNavigate();
  
  // Use direct variables instead of trying to dynamically import
  const currentSchool = null; // Default to null since we can't safely use SchoolContext
  const schoolTerms = defaultSchoolTerms;
  
  // Add school filter state
  const [showAllSchools, setShowAllSchools] = useState(false);

  // Separate filters for each tab
  const [companyFilters, setCompanyFilters] = useState({
    type: "all",
    department: "all",
    location: "all"
  });
  
  const [gatorFilters, setGatorFilters] = useState({
    type: "all",
    department: "all",
    location: "all"
  });

  const filters = activeTab === "company" ? companyFilters : gatorFilters;
  const setFilters = activeTab === "company" ? setCompanyFilters : setGatorFilters;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Load jobs data
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const jobsData = await Job.list("-created_date");
        const currentDate = new Date();
        
        // Filter active jobs
        let activeJobs = jobsData.filter(job => {
          if (job.expiration_date) {
            return new Date(job.expiration_date) > currentDate;
          }
          if (job.created_date) {
            const thirtyDaysLater = new Date(job.created_date);
            thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
            return thirtyDaysLater > currentDate;
          }
          return true;
        });
        
        // School filtering removed since we don't have access to SchoolContext

        // Split jobs
        const companyJobs = activeJobs.filter(job => 
          job.company_id && 
          job.poster_type !== "alumni" && 
          job.poster_type !== "parent"
        );
        
        const gatorJobs = activeJobs.filter(job => 
          job.poster_type === "alumni" || 
          job.poster_type === "parent"
        );

        setJobs(activeJobs);
        setCompanyJobs(companyJobs);
        setGatorJobs(gatorJobs);
      } catch (error) {
        console.error("Error loading jobs:", error);
        setJobs([]);
        setCompanyJobs([]);
        setGatorJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [showAllSchools]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowMobileFilters(false);
  };

  const handlePostJobClick = () => {
    // Get user type directly from localStorage without attempting authentication
    const userType = localStorage.getItem('user_type');
    
    console.log("Post job clicked, user type from localStorage:", userType);
    
    // Navigate based on user type
    switch(userType?.toLowerCase()) {
      case 'parent':
        navigate(createPageUrl("CompanyPost")); // No query params to fix
        break;
      case 'alumni':
        navigate(createPageUrl("CompanyPost")); // No query params to fix
        break;
      case 'company':
        navigate(createPageUrl("CompanyPost")); // No query params to fix
        break;
      default:
        // If not logged in, redirect to onboarding
        navigate(createPageUrl("Onboarding")); // No query params to fix
    }
  };

  // Toggle school filter - no longer applicable without school context
  const handleToggleAllSchools = () => {
    setShowAllSchools(!showAllSchools);
  };

  // Filter jobs based on search and filters
  const applyFilters = (jobsList, tabFilters) => {
    return jobsList.filter(job => {
      const matchesSearch = !searchQuery || (
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const matchesType = tabFilters.type === "all" || job.type === tabFilters.type;
      const matchesDepartment = tabFilters.department === "all" || job.department === tabFilters.department;
      const matchesLocation = tabFilters.location === "all" || 
        (job.location && job.location.toLowerCase().includes(tabFilters.location.toLowerCase()));
      
      return matchesSearch && matchesType && matchesDepartment && matchesLocation;
    });
  };

  const filteredCompanyJobs = applyFilters(companyJobs, companyFilters);
  const filteredGatorJobs = applyFilters(gatorJobs, gatorFilters);
  const displayedJobs = activeTab === "company" ? filteredCompanyJobs : filteredGatorJobs;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-[#0021A5]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:text-gray-900"
          onClick={handleBackClick}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <Button 
          onClick={handlePostJobClick}
          className="bg-[#FA4616] hover:bg-[#E63900] text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          Share Job Lead
        </Button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900">Find Your Next Opportunity 🚀</h1>
            <p className="text-gray-600 mt-1">
              Internships and jobs from companies and the community.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="flex">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by title, company, or location..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button 
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="ml-2 md:hidden"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabChange("company")}
              className={`
                flex items-center pb-4 border-b-2 font-medium text-sm transition-colors
                ${activeTab === "company"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
              `}
              aria-selected={activeTab === "company"}
              role="tab"
            >
              <Building className="w-5 h-5 mr-2" />
              Company Jobs
            </button>
            <button
              onClick={() => handleTabChange("gator")}
              className={`
                flex items-center pb-4 border-b-2 font-medium text-sm transition-colors
                ${activeTab === "gator"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
              `}
              aria-selected={activeTab === "gator"}
              role="tab"
            >
              <Users className="w-5 h-5 mr-2" />
              Gator Network Leads
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters - Toggle based on mobile visibility state */}
          <div className={`
            w-full lg:w-64 flex-shrink-0
            ${showMobileFilters ? "block" : "hidden lg:block"}
          `}>
            <JobFilters 
              filters={filters} 
              setFilters={setFilters} 
              jobs={activeTab === "company" ? companyJobs : gatorJobs}
              onClose={() => setShowMobileFilters(false)}
              activeTab={activeTab}
            />
          </div>

          <div className="flex-1">
            {/* Job listings */}
            <div className="space-y-4">
              {displayedJobs.length > 0 ? (
                displayedJobs.map((job) => (
                  activeTab === "company" ? (
                    <CompanyJobCard key={job.id} job={job} />
                  ) : (
                    <GatorJobCard key={job.id} job={job} />
                  )
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No jobs found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}