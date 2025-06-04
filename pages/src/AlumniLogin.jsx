import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Loader2, Eye, EyeOff } from "lucide-react";
import OnboardingStepIndicator from "../components/onboarding/OnboardingStepIndicator";
import { toast } from "../components/ui/use-toast";

export default function AlumniLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLinkedInConnect = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would connect to LinkedIn
      await new Promise(resolve => setTimeout(resolve, 1200));
      navigate(createPageUrl("AlumniProfileForm"));
    } catch (error) {
      console.error("LinkedIn connection error:", error);
      toast({
        title: "Connection failed",
        description: "We couldn't connect to LinkedIn. Please try creating an account manually.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both username and password to continue.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      // In a real implementation, this would create an account
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to profile form
      navigate(createPageUrl("AlumniProfileForm"));
    } catch (error) {
      console.error("Account creation error:", error);
      toast({
        title: "Account creation failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate(createPageUrl("AlumniDashboard"));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress tracker */}
      <div className="mb-8">
        <OnboardingStepIndicator currentStep={1} totalSteps={3} />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to the Fast Forward Network!
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Your experience can help launch a student's future — whether you mentor once, post a job lead, or quietly open doors behind the scenes.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800 mb-2">
            By filling out this form, you'll create a public-facing profile visible to students and parents.
          </p>
          <p className="text-blue-800">
            Prefer to stay behind the scenes? You can skip this and simply create a username and password to make introductions or post job leads.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Button
              onClick={handleLinkedInConnect}
              className="w-full bg-[#0077B5] hover:bg-[#006195] text-white flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Linkedin className="h-5 w-5" />
              )}
              Connect LinkedIn to Autofill
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Create Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  You'll use this login to post leads, make introductions, and track your impact.
                </p>
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-[#0033A0] hover:bg-[#0033A0]/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : "Continue"}
              </Button>
            </form>

            <div className="text-center pt-2">
              <Button
                variant="link"
                className="text-sm text-gray-600"
                onClick={handleSkip}
                disabled={isLoading}
              >
                Skip profile setup for now →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
