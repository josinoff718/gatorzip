
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { UploadFile } from "@/api/integrations";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, CheckCircle, User, UploadCloud, FileText, Loader2, Shield } from "lucide-react";
import SchoolPicker from '@/components/school/SchoolPicker';
import { useSchool } from '@/components/school/SchoolContext';

export default function Registration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentSchool } = useSchool(); // Assuming useSchool is still relevant if this page becomes a fallback

  const urlParams = new URLSearchParams(window.location.search);
  const regType = urlParams.get('type');
  
  useEffect(() => {
    switch (regType) {
      case 'parent':
        navigate(createPageUrl('ParentOnboarding'));
        break;
      case 'alumni':
        navigate(createPageUrl('AlumniOnboarding'));
        break;
      case 'company':
        navigate(createPageUrl('CompanyOnboarding'));
        break;
      case 'student':
        navigate(createPageUrl('StudentOnboarding')); // Ensure redirection for student type
        break;
      default:
        // If no type, or an unknown type, redirect to role selection or a generic student onboarding.
        // This case might indicate an issue upstream if a regType is expected.
        toast({ title: "Registration type unclear.", description: "Redirecting to role selection.", variant: "outline" });
        navigate(createPageUrl('OnboardingRole')); 
    }
  }, [regType, navigate, toast]);

  // Since this page now primarily redirects, the form UI might not be shown.
  // A loading state is appropriate.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center p-8 bg-white shadow-xl rounded-lg">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        <p className="mt-6 text-gray-700 text-lg font-semibold">Preparing your registration...</p>
        <p className="mt-2 text-sm text-gray-500">
          You are being redirected. If this takes too long, please select your role again.
        </p>
         <Button variant="link" onClick={() => navigate(createPageUrl('OnboardingRole'))} className="mt-4 text-blue-600 hover:text-blue-700">
            Choose Your Role
        </Button>
      </div>
    </div>
  );
}
