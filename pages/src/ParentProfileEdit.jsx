import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, AlertCircle, Save } from 'lucide-react';
import OnboardingStepIndicator from '../components/onboarding/OnboardingStepIndicator';
import { createPageUrl } from "@/utils";
import TermsDialog from '../components/legal/TermsDialog';
import { User } from '@/api/entities';
import { Card } from "@/components/ui/card";

export default function ParentProfileEdit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    supportGoals: [],
    supportMessage: '',
    agreeToTerms: true
  });
  const [showTerms, setShowTerms] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      
      try {
        const userData = await User.me();
        
        // Prepopulate form with user data
        setFormData({
          fullName: userData.full_name || '',
          supportMessage: userData.support_message || '',
          supportGoals: userData.support_goals || [],
          agreeToTerms: true
        });
      } catch (error) {
        console.error("Error loading user data:", error);
        // User is not logged in - redirect to parent onboarding
        navigate(createPageUrl("ParentOnboarding"));
        return;
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToSupportMessage = (text) => {
    const currentText = formData.supportMessage.trim();
    const newText = currentText ? `${currentText}, ${text}` : text;
    updateFormData('supportMessage', newText);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setSubmitError('');
      
      // Update user data on the server
      await User.updateMyUserData({
        support_message: formData.supportMessage,
        user_type: 'parent' // Ensure user_type is set to parent
      });
      
      // Navigate back to parent dashboard with success message
      navigate(createPageUrl("ParentDashboard"), { 
        state: { message: "Profile updated successfully" } 
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setSubmitError('There was an error updating your profile. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate(createPageUrl("ParentDashboard"));
  };

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0021A5]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-900">Edit Parent Profile</h1>
            <p className="text-gray-600 mt-2">
              Update your information and preferences for the Gator parent community.
            </p>
          </div>

          <form onSubmit={handleSave}>
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Your Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Your Full Name"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
              </div>
              
              {/* Community Engagement */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Community Engagement</h2>
                
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">
                    Select areas of interest:
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="text-sm"
                      onClick={() => addToSupportMessage('Open your network')}
                    >
                      Open your network
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-sm"
                      onClick={() => addToSupportMessage('Six Degrees of Gator Nation')}
                    >
                      Six Degrees of Gator Nation
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-sm"
                      onClick={() => addToSupportMessage('Seek support from career experts')}
                    >
                      Seek support from career experts
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="supportInput">How would you like to engage with the community?</Label>
                  <Textarea
                    id="supportInput"
                    placeholder="e.g., Open your network, connect with other Gator parents..."
                    value={formData.supportMessage}
                    onChange={(e) => updateFormData('supportMessage', e.target.value)}
                    className="w-full min-h-[120px]"
                  />
                </div>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <p>As a Gator parent, you'll benefit from:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Access to webinars with career experts</li>
                    <li>Parent forums to share experiences</li>
                    <li>Connection with mentors for guidance</li>
                    <li>Resources to help your student succeed</li>
                  </ul>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="text-red-500 mt-4">
                {submitError}
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                className="bg-[#0021A5] hover:bg-[#0021A5]/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
        
        <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      </div>
    </div>
  );
}
