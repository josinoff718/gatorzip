
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from '@/components/ui/card';
import { Job } from '@/api/entities';
import { User } from '@/api/entities';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from 'lucide-react';
import MultiSchoolPicker from '@/components/ui/multi-school-picker'; // Added import

export default function CompanyPostPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const getCompanyInfoFromStorage = () => {
    try {
      const companyInfo = localStorage.getItem('companyInfo');
      return companyInfo ? JSON.parse(companyInfo) : {};
    } catch (error) {
      console.error('Error parsing company info from localStorage:', error);
      return {};
    }
  };

  const companyInfo = getCompanyInfoFromStorage();
  
  const [formData, setFormData] = useState({
    title: '',
    company_name: companyInfo.name || '', 
    type: 'full_time',
    locationType: 'in_person',
    location: '',
    description: '',
    applicationLink: '',
    schoolScope: 'all_schools', 
    target_schools: [] 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSchoolScopeChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      schoolScope: value,
      target_schools: value === 'all_schools' ? [] : prev.target_schools
    }));
  };
  
  const handleTargetSchoolsChange = (selectedSchoolIds) => {
    setFormData(prev => ({
      ...prev,
      target_schools: selectedSchoolIds
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userData = await User.me();
      
      const jobData = {
        title: formData.title,
        company_name: formData.company_name,
        type: formData.type,
        locationType: formData.locationType,
        location: formData.locationType === 'remote' ? 'Remote' : formData.location,
        description: formData.description,
        company_id: userData.id, 
        posted_by: userData.full_name,
        posted_by_email: userData.email,
        poster_type: 'company',
        status: 'active',
        job_url: formData.applicationLink, 
        applicationLink: formData.applicationLink,
        views: 0,
        target_schools: formData.schoolScope === 'specific_schools' ? formData.target_schools : [] 
      };
      
      await Job.create(jobData);

      toast({
        title: "Success!",
        description: "Your job has been posted successfully.",
      });

      navigate(createPageUrl('CompanyDashboard'));
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: "There was an error posting the job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Post a Job or Internship</h1>
        <p className="text-gray-600 mt-1">
          Share an opportunity with talented students.
        </p>
      </div>

      <Card className="p-6 shadow-lg">
        <form onSubmit={handleSubmitForm} className="space-y-6">
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Software Engineering Intern"
              required
            />
          </div>

          <div>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              placeholder="e.g., Google"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Job Type</Label>
              <Select 
                id="type"
                name="type"
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
                className="w-full mt-1" // Ensure className applies to the select element
              >
                {/* <SelectItem value={null}>Select job type</SelectItem>  Optional placeholder if default isn't set */}
                <SelectItem value="full_time">Full-Time</SelectItem>
                <SelectItem value="part_time">Part-Time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </Select>
            </div>

            <div>
              <Label htmlFor="locationType">Location Type</Label>
              <Select
                id="locationType"
                name="locationType"
                value={formData.locationType}
                onValueChange={(value) => handleSelectChange('locationType', value)}
                className="w-full mt-1" // Ensure className applies to the select element
              >
                <SelectItem value="in_person">In Person</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location (if not remote)</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., New York, NY or Gainesville, FL"
              disabled={formData.locationType === 'remote'}
            />
          </div>

          <div>
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide a detailed description of the role, responsibilities, and company culture."
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="applicationLink">Application Link or Email</Label>
            <Input
              id="applicationLink"
              name="applicationLink"
              value={formData.applicationLink}
              onChange={handleInputChange}
              placeholder="https://careers.example.com/apply/job123 or apply@example.com"
              required
            />
          </div>

           {/* School Targeting Section */}
           <div className="space-y-3 p-4 border-t border-gray-200 mt-6">
            <Label className="text-base font-medium">School Targeting</Label>
            <p className="text-sm text-gray-500 mb-3">
              Choose whether to post this job to all schools in the network or select specific ones.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-x-2">
                <input
                  type="radio"
                  id="all_schools"
                  name="schoolScope"
                  value="all_schools"
                  checked={formData.schoolScope === 'all_schools'}
                  onChange={handleSchoolScopeChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor="all_schools" className="font-normal">Post to all schools</Label>
              </div>
              <div className="flex items-center gap-x-2">
                <input
                  type="radio"
                  id="specific_schools"
                  name="schoolScope"
                  value="specific_schools"
                  checked={formData.schoolScope === 'specific_schools'}
                  onChange={handleSchoolScopeChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor="specific_schools" className="font-normal">Post to specific schools</Label>
              </div>
            </div>

            {formData.schoolScope === 'specific_schools' && (
              <div className="mt-3">
                <Label htmlFor="target_schools_picker">Select Target Schools</Label>
                <MultiSchoolPicker 
                  id="target_schools_picker"
                  selected={formData.target_schools}
                  onChange={handleTargetSchoolsChange}
                  placeholder="Search and select schools..."
                  className="mt-1"
                />
                 <p className="text-xs text-gray-500 mt-1">
                  Only students from the selected schools will see this job opportunity.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Job'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
