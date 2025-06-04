
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
import { Job } from '@/api/entities';
import { User } from '@/api/entities';
import { ArrowLeft, Briefcase, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MultiSchoolPicker from '@/components/ui/multi-school-picker';
import { RadioGroup } from "@/components/ui/radio-group";

export default function CompanyPost() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    type: 'internship',
    locationType: 'in_person',
    location: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    applicationMethod: 'email',
    applicationLink: '',
    isPaid: 'yes',
    salary: '',
    schoolScope: 'all',
    target_schools: []
  });

  const handleSchoolScopeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      schoolScope: value,
      target_schools: value === 'all' ? [] : prev.target_schools
    }));
  };

  const handleSchoolsChange = (selectedSchoolIds) => {
    setFormData(prev => ({
      ...prev,
      target_schools: selectedSchoolIds
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userData = await User.me();
      
      // Construct the job URL based on application method
      let job_url = formData.applicationLink;
      if (formData.applicationMethod === 'email') {
        job_url = `mailto:${formData.applicationLink}`;
      } else if (formData.applicationMethod === 'platform') {
        job_url = '#'; // Or some default platform URL
      }
      
      // If no application link provided, use a default value
      if (!job_url || job_url.trim() === '') {
        job_url = 'mailto:' + userData.email; // Default to poster's email
      }

      const jobData = {
        ...formData,
        posted_by: userData.full_name,
        posted_by_email: userData.email,
        company_id: 'parent_post',
        status: 'active',
        job_url: job_url, // Add required job_url field
        poster_type: 'parent', // Add required poster_type field
        ...(formData.schoolScope === 'specific' ? { target_schools: formData.target_schools } : {})
      };

      // Remove fields that aren't in the Job entity schema
      delete jobData.schoolScope;
      delete jobData.applicationMethod; // Remove since we've converted it to job_url

      await Job.create(jobData);

      navigate(createPageUrl('Jobs'), {
        state: { message: 'Job lead posted successfully!' }
      });
    } catch (error) {
      console.error('Error posting job:', error);
      alert('There was an error posting the job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="h-6 w-6 text-[#FA4616]" />
          <h1 className="text-3xl font-bold text-gray-900">Share a Job Lead</h1>
        </div>
        <p className="text-gray-600">
          Help Gator students find great opportunities by sharing job leads from your network.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="required">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Software Engineering Intern"
                required
              />
            </div>

            <div>
              <Label htmlFor="company" className="required">Company Name</Label>
              <Input
                id="company"
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                placeholder="e.g. Google"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="required">Job Type</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="entry_level">Entry Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="locationType" className="required">Location Type</Label>
                <Select
                  value={formData.locationType}
                  onValueChange={(value) => setFormData({...formData, locationType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="in_person">In Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g. New York, NY"
              />
            </div>

            <div>
              <Label htmlFor="description" className="required">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the role and its responsibilities"
                className="min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="qualifications">Qualifications</Label>
              <Textarea
                id="qualifications"
                value={formData.qualifications}
                onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                placeholder="List required skills and qualifications"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="isPaid" className="required">Is this a paid position?</Label>
                <Select
                  value={formData.isPaid}
                  onValueChange={(value) => setFormData({...formData, isPaid: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select yes/no" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="salary">Salary/Compensation (optional)</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  placeholder="e.g. $20-25/hour or $65,000/year"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="applicationMethod" className="required">How should students apply?</Label>
              <Select
                value={formData.applicationMethod}
                onValueChange={(value) => setFormData({...formData, applicationMethod: value, applicationLink: ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select application method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="external">External Website</SelectItem>
                  <SelectItem value="platform">Through Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="applicationLink">
                {formData.applicationMethod === 'email' ? 'Application Email' : 'Application Link'}
              </Label>
              <Input
                id="applicationLink"
                value={formData.applicationLink}
                onChange={(e) => setFormData({...formData, applicationLink: e.target.value})}
                placeholder={formData.applicationMethod === 'email' ? 
                  "Enter email address for applications" : 
                  "Enter application URL"
                }
                type={formData.applicationMethod === 'email' ? 'email' : 'url'}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.applicationMethod === 'email' ? 
                  "Students will send their applications to this email address" :
                  "Direct link where students can apply"
                }
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">School Targeting</h3>
              
              <RadioGroup 
                value={formData.schoolScope} 
                onValueChange={handleSchoolScopeChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="all-schools"
                    name="schoolScope"
                    value="all"
                    checked={formData.schoolScope === 'all'}
                    onChange={() => handleSchoolScopeChange('all')}
                    className="h-4 w-4"
                  />
                  <label htmlFor="all-schools" className="text-sm font-medium">
                    Post to All Schools (Recommended)
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="specific-schools"
                    name="schoolScope"
                    value="specific"
                    checked={formData.schoolScope === 'specific'}
                    onChange={() => handleSchoolScopeChange('specific')}
                    className="h-4 w-4"
                  />
                  <label htmlFor="specific-schools" className="text-sm font-medium">
                    Target Specific Schools
                  </label>
                </div>
              </RadioGroup>
              
              {formData.schoolScope === 'specific' && (
                <div className="mt-3">
                  <Label htmlFor="target-schools">Select Schools</Label>
                  <MultiSchoolPicker
                    id="target-schools"
                    selected={formData.target_schools}
                    onChange={handleSchoolsChange}
                    placeholder="Select one or more schools"
                    className="mt-1"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Only students from the selected schools will see this job opportunity.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
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
              disabled={isSubmitting}
              className="bg-[#FA4616] hover:bg-[#E63900]"
            >
              {isSubmitting ? 'Posting...' : 'Post Job Lead'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
