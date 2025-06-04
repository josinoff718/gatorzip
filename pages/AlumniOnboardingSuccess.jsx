import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Check, 
  ArrowRight, 
  Users, 
  Briefcase, 
  FileText,
  Star
} from "lucide-react";

export default function AlumniOnboardingSuccess() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-md">
          <CardContent className="p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold mb-6 font-display">Thank You for Giving Back! 🎉</h1>
            
            <p className="text-lg text-gray-700 mb-8">
              Your alumni profile is now active. Students, parents, and the
              College Fast Forward community can now connect with you based on your
              selected preferences.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Connection</h3>
                <p className="text-sm text-gray-600">
                  Students can now find and connect with you.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Impact</h3>
                <p className="text-sm text-gray-600">
                  Your experience helps shape the next generation.
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-1">Opportunity</h3>
                <p className="text-sm text-gray-600">
                  Open doors for rising Gators in your field.
                </p>
              </div>
            </div>
            
            <div className="bg-[#FFF8F2] p-6 rounded-xl mb-8 text-left">
              <h3 className="text-lg font-semibold mb-3">What happens next?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-[#FA4616] text-white flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <span className="text-xs">1</span>
                  </div>
                  <span>Students who match your background and expertise may reach out for advice.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-[#FA4616] text-white flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <span className="text-xs">2</span>
                  </div>
                  <span>You'll receive emails when someone wants to connect (based on your preferences).</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-[#FA4616] text-white flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <span className="text-xs">3</span>
                  </div>
                  <span>You can update your profile or preferences any time from your dashboard.</span>
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={() => navigate(createPageUrl("AlumniDashboard"))}
              className="bg-[#FA4616] hover:bg-[#e04114] text-white py-5 px-8 rounded-xl flex items-center gap-2 mx-auto transition-all duration-300 hover:translate-y-[-2px]"
            >
              Go to My Dashboard
              <ArrowRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-sm text-gray-500">
          Questions? <a href="#" className="text-[#0033A0] hover:underline">Contact support</a>
        </div>
      </div>
    </div>
  );
}