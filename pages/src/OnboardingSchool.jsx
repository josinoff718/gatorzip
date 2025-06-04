import React, { useState } from 'react';
import { User } from '@/api/entities';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function OnboardingSchool() {
  const [schoolQuery, setSchoolQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Mock schools for demonstration
  const schools = [
    { id: 'uf', name: 'University of Florida', shortName: 'UF', mascotEmoji: '🐊' },
    { id: 'fsu', name: 'Florida State University', shortName: 'FSU', mascotEmoji: '🏹' },
    { id: 'ucf', name: 'University of Central Florida', shortName: 'UCF', mascotEmoji: '⚔️' },
    { id: 'usf', name: 'University of South Florida', shortName: 'USF', mascotEmoji: '🐂' }
  ];
  
  const filteredSchools = schoolQuery 
    ? schools.filter(school => 
        school.name.toLowerCase().includes(schoolQuery.toLowerCase()) ||
        school.shortName.toLowerCase().includes(schoolQuery.toLowerCase()))
    : schools;
  
  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
  };
  
  const handleContinue = async () => {
    if (!selectedSchool) return;
    
    setIsLoading(true);
    try {
      await User.updateMyUserData({ 
        school: selectedSchool
      });
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      console.error("Failed to update school:", error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F9FAFF] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Select Your School</h1>
          <p className="text-gray-600">
            We'll personalize your experience based on your school
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-10" 
              placeholder="Search for your school" 
              value={schoolQuery}
              onChange={(e) => setSchoolQuery(e.target.value)}
            />
          </div>
          
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {filteredSchools.map(school => (
              <div 
                key={school.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedSchool?.id === school.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSchoolSelect(school)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{school.name}</p>
                    <p className="text-sm text-gray-500">{school.shortName}</p>
                  </div>
                  <span className="text-xl">{school.mascotEmoji}</span>
                </div>
              </div>
            ))}
            
            {filteredSchools.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No schools found. Try a different search.
              </div>
            )}
          </div>
          
          <Button 
            className="w-full mt-6" 
            disabled={!selectedSchool || isLoading}
            onClick={handleContinue}
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
