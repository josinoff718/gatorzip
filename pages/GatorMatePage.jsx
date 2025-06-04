
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Search, 
  Filter, 
  MapPin, 
  Calendar,
  DollarSign,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  Shield,
  Users,
  X
} from "lucide-react";
import { useSchool } from '@/components/school/SchoolContext';
import { getSchoolTerms } from '@/components/school/SchoolBranding';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import AdvancedFilters from "../components/gatormate/AdvancedFilters"; // Import the component

const DEMO_ROOMMATES = [
  {
    id: 1,
    name: "Alex Johnson",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    graduationYear: 2024,
    location: "Midtown, Gainesville",
    moveInDate: "2024-08-01", // YYYY-MM-DD
    budgetPerPerson: 950, // Numerical budget
    hasPlace: true,
    isVerified: true,
    tags: ["Non-smoker", "Early riser", "Clean", "Gym enthusiast", "Software Engineer"],
    school_id: "current", 
    bio: "Quiet and studious software engineer looking for a clean place."
  },
  {
    id: 2,
    name: "Sarah Williams",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    graduationYear: 2025,
    location: "Downtown, Orlando",
    moveInDate: "2024-07-15",
    budgetPerPerson: 1100,
    hasPlace: false,
    isVerified: true,
    tags: ["Pet-friendly", "Night owl", "Social", "Music lover", "Marketing Student"],
    school_id: "other", 
    bio: "Friendly marketing student seeking a sociable roommate for an apartment near UCF."
  },
  {
    id: 3,
    name: "Mike Chen",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    graduationYear: 2024,
    location: "College Park, Gainesville",
    moveInDate: "2024-09-01", // Later move-in
    budgetPerPerson: 800,
    hasPlace: true,
    isVerified: false,
    tags: ["Quiet", "Student", "Clean", "Tech-savvy", "Computer Science"],
    school_id: "current",
    bio: "CS student at UF, prefers a quiet environment for studying."
  },
  {
    id: 4,
    name: "Jessica Brown",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    graduationYear: 2026,
    location: "Southwest Gainesville",
    moveInDate: "2024-07-20", // ASAP relative to 'now'
    budgetPerPerson: 750,
    hasPlace: false,
    isVerified: true,
    tags: ["Artsy", "Vegan", "Yoga", "Quiet", "Environmental Science"],
    school_id: "current",
    bio: "Environmental science student looking for a chill, vegan-friendly roommate."
  }
];

export default function GatorMatePage() {
  const { currentSchool } = useSchool();
  const schoolTerms = getSchoolTerms(currentSchool);
  
  const [showAllSchools, setShowAllSchools] = useState(false); // This is for the main page toggle
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // State for advanced filter values
  const [advancedFilterValues, setAdvancedFilterValues] = useState({
    schoolFilter: currentSchool ? 'my_school' : 'all', // This is for the modal's school filter
    budgetMin: '',
    budgetMax: '',
    moveInDateOption: 'all', // 'all', 'asap', 'next30days', 'future'
    hasPlaceOption: 'all', // 'all', 'looking', 'has_place'
    graduationYear: '',
    // Add other filters from AdvancedFilters.jsx if needed, e.g., gender
    gender: 'all', // As per existing AdvancedFilters component
  });

  useEffect(() => {
    setTimeout(() => {
      setRoommates(DEMO_ROOMMATES);
      setLoading(false);
    }, 500);
  }, []);

  // Update modal's school filter if currentSchool changes and it's set to 'my_school'
   useEffect(() => {
    if (currentSchool && advancedFilterValues.schoolFilter === 'my_school') {
      // No direct action needed here, just noting that 'my_school' depends on currentSchool
    } else if (!currentSchool && advancedFilterValues.schoolFilter === 'my_school') {
      // If currentSchool becomes null and filter was 'my_school', default to 'all'
      setAdvancedFilterValues(prev => ({ ...prev, schoolFilter: 'all' }));
    }
  }, [currentSchool, advancedFilterValues.schoolFilter]);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const applyFiltersToRoommates = () => {
    let filtered = [...roommates];

    // 1. Main page school toggle
    if (!showAllSchools && currentSchool) {
      filtered = filtered.filter(r => r.school_id === "current");
    }

    // 2. Search term
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(lowerSearchTerm) ||
        r.location.toLowerCase().includes(lowerSearchTerm) ||
        (r.tags && r.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))) ||
        r.bio?.toLowerCase().includes(lowerSearchTerm) ||
        (r.graduationYear && r.graduationYear.toString().includes(lowerSearchTerm))
      );
    }

    // 3. Advanced Filters from modal
    // School filter from modal
    if (advancedFilterValues.schoolFilter === 'my_school' && currentSchool) {
        // This logic is a bit redundant if main page toggle is also 'my_school'
        // but ensures modal filter is respected if different
        filtered = filtered.filter(r => r.school_id === "current");
    } // 'all' doesn't need explicit filtering here as it's the default or covered by main toggle

    // Budget
    const budgetMin = parseFloat(advancedFilterValues.budgetMin);
    const budgetMax = parseFloat(advancedFilterValues.budgetMax);
    if (!isNaN(budgetMin)) {
      filtered = filtered.filter(r => r.budgetPerPerson >= budgetMin);
    }
    if (!isNaN(budgetMax)) {
      filtered = filtered.filter(r => r.budgetPerPerson <= budgetMax);
    }

    // Move-in Date
    const today = new Date();
    if (advancedFilterValues.moveInDateOption !== 'all') {
      filtered = filtered.filter(r => {
        const moveDate = new Date(r.moveInDate);
        if (advancedFilterValues.moveInDateOption === 'asap') {
          const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          return moveDate >= today && moveDate <= sevenDaysFromNow;
        }
        if (advancedFilterValues.moveInDateOption === 'next30days') {
          const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
          return moveDate >= today && moveDate <= thirtyDaysFromNow;
        }
        if (advancedFilterValues.moveInDateOption === 'future') {
          const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
          return moveDate > thirtyDaysFromNow;
        }
        return true;
      });
    }
    
    // Has Place
    if (advancedFilterValues.hasPlaceOption === 'looking') {
      filtered = filtered.filter(r => !r.hasPlace);
    } else if (advancedFilterValues.hasPlaceOption === 'has_place') {
      filtered = filtered.filter(r => r.hasPlace);
    }

    // Graduation Year
    const gradYear = parseInt(advancedFilterValues.graduationYear);
    if (!isNaN(gradYear)) {
      filtered = filtered.filter(r => r.graduationYear === gradYear);
    }
    
    // Gender (from AdvancedFilters.jsx)
    if (advancedFilterValues.gender !== 'all') {
      // Assuming DEMO_ROOMMATES has a 'gender' field: 'male', 'female', 'non-binary', 'other'
      // Add 'gender' to DEMO_ROOMMATES if you want to test this
      // For now, this won't filter if 'gender' field is missing in demo data
       filtered = filtered.filter(r => r.gender && r.gender.toLowerCase() === advancedFilterValues.gender);
    }


    return filtered;
  };

  const displayedRoommates = applyFiltersToRoommates();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link 
            to={createPageUrl("StudentDashboard")} 
            className="inline-flex items-center text-gray-600 hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Home className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find a Roommate</h1>
              <p className="text-gray-600">Connect with {schoolTerms?.mascots || 'students'} looking for roommates</p>
            </div>
          </div>

          {currentSchool && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-gray-700 mb-2 sm:mb-0">
                  {!showAllSchools 
                    ? `Showing roommates from ${currentSchool.short_name || currentSchool.name}` 
                    : "Showing roommates from all schools"}
                </p>
                <Button 
                  variant="link" 
                  onClick={() => setShowAllSchools(!showAllSchools)}
                  className="text-primary h-auto p-0 text-sm"
                >
                  {showAllSchools ? `Show Only ${currentSchool.short_name || currentSchool.name}` : "Show All Schools"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 space-y-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              className="pl-10 h-11 text-base" 
              placeholder="Search by name, location, major, tags..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="flex-1 h-11 text-base"
              onClick={() => setShowFiltersModal(true)}
            >
              <Filter className="mr-2 h-5 w-5" /> Advanced Filters ({Object.values(advancedFilterValues).filter(v => v && v !== 'all' && v !== (currentSchool ? 'my_school' : 'all')).length})
            </Button>
          </div>
        </div>

        {displayedRoommates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRoommates.map((roommate) => (
              <Card key={roommate.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
                <div className="relative">
                  <img src={roommate.photo} alt={roommate.name} className="w-full h-56 object-cover" />
                  {roommate.isVerified && (
                     <Badge className="absolute top-2 right-2 bg-green-100 text-green-700 border border-green-200 px-2 py-1 text-xs">
                       <Shield className="mr-1 h-3 w-3" /> Verified
                     </Badge>
                  )}
                   <Badge variant="secondary" className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-xs">
                      {roommate.school_id === "current" ? (currentSchool?.short_name || "My School") : "Other School"}
                   </Badge>
                </div>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold mb-1">{roommate.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Class of {roommate.graduationYear}
                  </p>
                  <div className="text-sm text-gray-700 space-y-1 mb-3">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" /> {roommate.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" /> Move-in: {new Date(roommate.moveInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" /> Budget: ${roommate.budgetPerPerson}/mo
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{roommate.bio}</p>

                  {roommate.tags && roommate.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {roommate.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                        {roommate.tags.length > 3 && <Badge variant="outline" className="text-xs">+{roommate.tags.length - 3} more</Badge>}
                      </div>
                    </div>
                  )}
                  <div className="mt-auto flex gap-2 pt-3 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      View Profile
                    </Button>
                    <Button size="sm" className="themed-button-primary flex-1 text-xs">
                      <MessageSquare className="mr-1 h-3.5 w-3.5" /> Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Roommates Found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filters, or check back later.
            </p>
            {searchTerm && (
                <Button variant="link" onClick={clearSearch} className="mt-2 text-primary">Clear Search</Button>
            )}
          </div>
        )}

        <Card className="mt-10 p-6 bg-gradient-to-r from-primary/80 to-primary text-white shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Ready to Find Your Match?</h2>
              <p className="opacity-90 mt-1">Create your profile to connect with potential roommates.</p>
            </div>
            <Link to={createPageUrl("Profile")}> {/* Update this to the correct profile creation page */}
              <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-gray-100 border-2 border-white hover:border-gray-200 transition-all duration-300 ease-in-out">
                <UserPlus className="mr-2 h-5 w-5" /> Create Your Profile
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <Dialog open={showFiltersModal} onOpenChange={setShowFiltersModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>
              Refine your roommate search. Changes are applied live.
            </DialogDescription>
          </DialogHeader>
          
          <AdvancedFilters 
            filterValues={advancedFilterValues}
            setFilterValues={setAdvancedFilterValues}
          />

          <DialogFooter className="mt-4">
            <Button className="w-full themed-button-primary" onClick={() => setShowFiltersModal(false) }>View Results</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
