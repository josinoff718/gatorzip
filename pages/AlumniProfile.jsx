import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { AlumniProfile } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

import AlumniBasicInfoForm from "../components/alumni/AlumniBasicInfoForm";
import AlumniExperienceForm from "../components/alumni/AlumniExperienceForm";
import AlumniMentorshipForm from "../components/alumni/AlumniMentorshipForm";
import AlumniProfilePreview from "../components/alumni/AlumniProfilePreview";

export default function AlumniProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [tempProfileData, setTempProfileData] = useState({});

  // This function will track changes between tabs without saving to database yet
  const handleFormUpdate = (sectionData) => {
    setTempProfileData(prev => ({
      ...prev,
      ...sectionData
    }));
  };

  const handleSave = async (sectionData) => {
    setIsSaving(true);
    try {
      // Combine current temp data with new section data
      const combinedData = {
        ...tempProfileData,
        ...sectionData
      };
      
      let updatedProfile;
      if (profile?.id) {
        updatedProfile = await AlumniProfile.update(profile.id, {
          ...profile,
          ...combinedData
        });
      } else {
        // For new profile creation
        updatedProfile = await AlumniProfile.create({
          user_id: user.id,
          ...combinedData,
          // Set default values for required fields if not provided
          industry: combinedData.industry || "Other"
        });
      }
      setProfile(updatedProfile);
      setTempProfileData({}); // Clear temp data after successful save
      
      // Move to next tab after saving
      if (activeTab === "basic") setActiveTab("experience");
      else if (activeTab === "experience") setActiveTab("mentorship");
      else if (activeTab === "mentorship") setActiveTab("preview");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setIsSaving(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Only redirect if not alumni and not in demo mode
      if (userData.type !== "alumni") {
        // Update user type to alumni if they're creating a profile
        await User.updateMyUserData({ type: "alumni" });
      }

      // Look for existing profile
      const profiles = await AlumniProfile.filter({ user_id: userData.id });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      navigate(createPageUrl("Home"));
    }
    setIsLoading(false);
  };

  // Get the merged profile data (database + temporary changes)
  const getMergedProfile = () => {
    if (!profile) return tempProfileData;
    return { ...profile, ...tempProfileData };
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[--primary]" />
      </div>
    );
  }

  const mergedProfile = getMergedProfile();

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Alumni Profile</CardTitle>
          <CardDescription>Share your experience and help guide the next generation of Gators</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <AlumniBasicInfoForm
                profile={mergedProfile}
                onSave={handleSave}
                onChange={handleFormUpdate}
                isSaving={isSaving}
              />
            </TabsContent>

            <TabsContent value="experience">
              <AlumniExperienceForm
                profile={mergedProfile}
                onSave={handleSave}
                onChange={handleFormUpdate}
                isSaving={isSaving}
              />
            </TabsContent>

            <TabsContent value="mentorship">
              <AlumniMentorshipForm
                profile={mergedProfile}
                onSave={handleSave}
                onChange={handleFormUpdate}
                isSaving={isSaving}
              />
            </TabsContent>

            <TabsContent value="preview">
              <AlumniProfilePreview profile={mergedProfile} user={user} />
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => navigate(createPageUrl("AlumniDashboard"))}
                  className="bg-[--secondary] hover:bg-[--secondary]/90"
                >
                  Go to Dashboard
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}