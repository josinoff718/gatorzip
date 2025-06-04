
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Job } from '@/api/entities';
import { User } from '@/api/entities';
import { ArrowLeft, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ShareJobLeadModal from '../components/jobs/ShareJobLeadModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ShareJobLead() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    job_url: '',
    company_name: '',
    location: '',
    type: 'Internship',
  });

  const [sharedJobTitleForModal, setSharedJobTitleForModal] = useState('');

  // Validate form
  const isFormValid = () => {
    return formData.title.trim() !== '' && 
           formData.company_name.trim() !== '' &&
           formData.job_url.trim() !== '' &&
           formData.type.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      let userData;
      try {
        userData = await User.me();
      } catch (error) {
        // If not logged in, store data and redirect to onboarding
        localStorage.setItem('pendingJobLead', JSON.stringify(formData));
        navigate(createPageUrl("Onboarding")); // Or OnboardingRole/AuthSignin depending on flow
        return;
      }
      
      const jobData = {
        title: formData.title,
        company_name: formData.company_name,
        location: formData.location,
        type: formData.type.toLowerCase().replace('-', '_'), // e.g., 'full-time' -> 'full_time'
        job_url: formData.job_url,
        posted_by: userData.full_name,
        posted_by_email: userData.email,
        poster_type: 'parent', // Assuming this page is for parents
        status: 'active'
      };

      await Job.create(jobData);

      // Store the new contribution in localStorage for ParentDashboard
      const dashboardData = JSON.parse(localStorage.getItem('parentDashboardData') || '{}');
      const newPoints = (dashboardData.points || 0) + 10; // Default to 0 if points not set
      
      const updatedRecentLeads = [
        {
          title: formData.title,
          date: new Date().toLocaleDateString()
        },
        ...(dashboardData.recentLeads || [])
      ].slice(0, 3);

      const updatedData = {
        ...dashboardData,
        points: newPoints,
        recentLeads: updatedRecentLeads,
        lastSharedLead: { title: formData.title, pointsEarned: 10, date: new Date().toISOString() } // For banner
      };
      
      localStorage.setItem('parentDashboardData', JSON.stringify(updatedData));
      
      toast({
        title: "🎉 Lead Shared!",
        description: "Thanks for sharing—you earned +10 points!",
        variant: "success",
      });
      
      // Show success modal and then redirect to ParentDashboard
      setSharedJobTitleForModal(formData.title); // For the modal
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: "There was an error sharing the job lead. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const savedJobLead = localStorage.getItem('pendingJobLead');
    if (savedJobLead) {
      try {
        const parsedData = JSON.parse(savedJobLead);
        setFormData(parsedData);
        localStorage.removeItem('pendingJobLead'); // Clear after restoring
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Share a Job Lead</h1>
        <p className="text-gray-600">
          Came across a great internship or job? Share it with our community network.
        </p>
      </div>

      <Card className="p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Software Engineering Intern"
              required
            />
          </div>

          <div>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              placeholder="e.g. Google"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="City, State or 'Remote'"
            />
          </div>

          <div>
            <Label htmlFor="type">Type of Opportunity</Label>
            <Select
              name="type"
              value={formData.type}
              onValueChange={(value) => setFormData({...formData, type: value})}
              required
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Full-Time">Full-Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="job_url">Application Link</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="job_url"
                name="job_url"
                type="url"
                value={formData.job_url}
                onChange={(e) => setFormData({...formData, job_url: e.target.value})}
                placeholder="https://..."
                className="pl-10"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Direct link to where students apply
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sharing...
                </>
              ) : "Share Job Lead →"}
            </Button>
          </div>
        </form>
      </Card>
      
      <ShareJobLeadModal 
        isOpen={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          navigate(createPageUrl("ParentDashboard"), { 
            state: { leadShared: true, pointsEarned: 10 } 
          });
        }}
        jobTitle={sharedJobTitleForModal || formData.title}
      />
    </div>
  );
}
