import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { StudentProfile } from '@/api/entities';
import { Loader2, Users, AlertTriangle, ArrowLeft, Download, Search, Filter, Eye, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Helper function to format date
const formatPrettyDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function for CSV export
const convertToCSV = (data) => {
  if (!data || data.length === 0) return "";
  const headers = [
    "Full Name", "Email", "Major", "Graduation Year", "Career Interests", 
    "Looking For", "Location", "Registration Date", "Profile Complete"
  ];
  const csvRows = [
    headers.join(','),
    ...data.map(row => [
      `"${row.user?.full_name || ''}"`,
      `"${row.user?.email || ''}"`,
      `"${row.profile?.major || ''}"`,
      `"${row.profile?.graduation_year || ''}"`,
      `"${row.profile?.career_interests ? row.profile.career_interests.join('; ') : ''}"`,
      `"${row.profile?.looking_for_options ? row.profile.looking_for_options.join('; ') : ''}"`,
      `"${row.profile?.location || ''}"`,
      `"${formatPrettyDate(row.user?.created_date) || ''}"`,
      `"${row.profile ? 'Yes' : 'No'}"`
    ].join(','))
  ];
  return csvRows.join('\n');
};

const downloadCSV = (csvData, filename = "students.csv") => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Student Detail Modal Component
const StudentDetailModal = ({ student, trigger }) => {
  const { user, profile } = student;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile?.profile_image_url} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user?.full_name || 'Unknown Student'}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Basic Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Registration Date:</span>
                <p>{formatPrettyDate(user?.created_date)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">User Type:</span>
                <p className="capitalize">{user?.user_type || 'Student'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Location:</span>
                <p>{profile?.location || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Profile Complete:</span>
                <Badge variant={profile ? "default" : "secondary"}>
                  {profile ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          {profile && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Major:</span>
                  <p>{profile.major}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Graduation Year:</span>
                  <p>{profile.graduation_year}</p>
                </div>
                {profile.student_id_number && (
                  <div>
                    <span className="font-medium text-gray-600">Student ID:</span>
                    <p>{profile.student_id_number}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Career Information */}
          {profile && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Career Information</h4>
              
              {profile.career_interests && profile.career_interests.length > 0 && (
                <div className="mb-3">
                  <span className="font-medium text-gray-600 block mb-2">Career Interests:</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.career_interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="bg-white">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.looking_for_options && profile.looking_for_options.length > 0 && (
                <div className="mb-3">
                  <span className="font-medium text-gray-600 block mb-2">Looking For:</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.looking_for_options.map((option, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.is_just_exploring && (
                <div className="mb-3">
                  <Badge className="bg-yellow-100 text-yellow-800">Just Exploring Options</Badge>
                </div>
              )}

              {profile.career_goal && (
                <div>
                  <span className="font-medium text-gray-600 block mb-2">Career Goals:</span>
                  <p className="text-sm bg-white p-3 rounded border">{profile.career_goal}</p>
                </div>
              )}
            </div>
          )}

          {/* Quick Intro */}
          {profile?.quick_intro && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Introduction</h4>
              <p className="text-sm bg-white p-3 rounded border">{profile.quick_intro}</p>
            </div>
          )}

          {/* Files */}
          {(profile?.resume_url || profile?.profile_image_url) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Uploaded Files</h4>
              <div className="space-y-2">
                {profile.resume_url && (
                  <div>
                    <span className="font-medium text-gray-600">Resume:</span>
                    <a 
                      href={profile.resume_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      View Resume
                    </a>
                  </div>
                )}
                {profile.profile_image_url && (
                  <div>
                    <span className="font-medium text-gray-600">Profile Photo:</span>
                    <a 
                      href={profile.profile_image_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      View Photo
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMajor, setFilterMajor] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterComplete, setFilterComplete] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all users with user_type 'student'
        const users = await User.filter({ user_type: 'student' }, '-created_date');
        
        // Fetch all student profiles
        const profiles = await StudentProfile.list();
        
        // Merge users with their profiles
        const studentsWithProfiles = users.map(user => {
          const profile = profiles.find(p => p.user_id === user.id);
          return { user, profile };
        });
        
        setStudents(studentsWithProfiles);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load student data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleExportCSV = () => {
    const csvData = convertToCSV(filteredStudents);
    downloadCSV(csvData);
  };

  // Get unique values for filters
  const uniqueMajors = [...new Set(students.map(s => s.profile?.major).filter(Boolean))].sort();
  const uniqueYears = [...new Set(students.map(s => s.profile?.graduation_year).filter(Boolean))].sort();

  const filteredStudents = students.filter(student => {
    const { user, profile } = student;
    
    // Search filter
    const searchMatch = !searchTerm || 
      user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile?.major?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Major filter
    const majorMatch = filterMajor === 'all' || profile?.major === filterMajor;
    
    // Year filter
    const yearMatch = filterYear === 'all' || profile?.graduation_year?.toString() === filterYear;
    
    // Completion filter
    const completeMatch = filterComplete === 'all' || 
      (filterComplete === 'complete' && profile) ||
      (filterComplete === 'incomplete' && !profile);
    
    return searchMatch && majorMatch && yearMatch && completeMatch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-700">Loading Student Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
        <p className="text-red-600 mb-6 text-center">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="outline"
          onClick={() => navigate(createPageUrl('CompanyDashboard'))}
          className="mb-6 bg-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard 
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                  <GraduationCap className="mr-3 h-6 w-6 text-blue-600" />
                  Student Registrations
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Students who have registered on the platform.
                </p>
              </div>
              <Button onClick={handleExportCSV} variant="outline" className="bg-green-500 hover:bg-green-600 text-white">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>
            
            {/* Filters */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input 
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              
              <Select value={filterMajor} onValueChange={setFilterMajor}>
                <SelectTrigger>
                  <SelectValue placeholder="All Majors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Majors</SelectItem>
                  {uniqueMajors.map(major => (
                    <SelectItem key={major} value={major}>{major}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>Class of {year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterComplete} onValueChange={setFilterComplete}>
                <SelectTrigger>
                  <SelectValue placeholder="All Profiles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Profiles</SelectItem>
                  <SelectItem value="complete">Complete Profiles</SelectItem>
                  <SelectItem value="incomplete">Incomplete Profiles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Students Found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterMajor !== 'all' || filterYear !== 'all' || filterComplete !== 'all' 
                    ? "No students match your current filters." 
                    : "No students have registered yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Major & Year
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interests
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => {
                      const { user, profile } = student;
                      return (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={profile?.profile_image_url} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {profile ? (
                              <div>
                                <div className="font-medium">{profile.major}</div>
                                <div className="text-gray-500">Class of {profile.graduation_year}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Not specified</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {profile?.career_interests && profile.career_interests.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {profile.career_interests.slice(0, 2).map((interest, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                                {profile.career_interests.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{profile.career_interests.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">None specified</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={profile ? "default" : "secondary"}>
                              {profile ? "Profile Complete" : "Profile Incomplete"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatPrettyDate(user.created_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <StudentDetailModal 
                              student={student}
                              trigger={
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {filteredStudents.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <p>
              Showing {filteredStudents.length} of {students.length} total students.
            </p>
            <div className="flex gap-4">
              <span>Complete Profiles: {students.filter(s => s.profile).length}</span>
              <span>Incomplete Profiles: {students.filter(s => !s.profile).length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
