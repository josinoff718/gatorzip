
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { createPageUrl } from '@/utils';
import { toast } from '@/components/ui/use-toast';
import { Briefcase, Users, Search, ArrowRight, Lightbulb, CheckCircle, UploadCloud, Loader2 } from 'lucide-react';

const QUICK_START_STEPS = [
  { id: 'postJob', title: 'Post Your First Job', icon: Briefcase, description: 'Get your opportunity in front of thousands of talented Gators.' },
  { id: 'setupProfile', title: 'Complete Company Profile', icon: Users, description: 'Add details to attract the best candidates.' },
  { id: 'searchTalent', title: 'Explore Student Talent', icon: Search, description: 'Discover promising students and invite them to apply.' },
];

export default function CompanyQuickStart() {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(null); // To show forms for specific steps

  // Dummy state for form fields - replace with actual logic
  const [jobDetails, setJobDetails] = useState({ title: '', description: '' });
  const [profileDetails, setProfileDetails] = useState({ companyBio: '', logoUrl: '' });


  const toggleStepCompletion = (stepId) => {
    setCompletedSteps(prev =>
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    );
    setActiveStep(null); // Close any active form when marking complete
    toast({ title: "Step Updated!", description: `${QUICK_START_STEPS.find(s => s.id === stepId)?.title} marked as ${completedSteps.includes(stepId) ? 'incomplete' : 'complete'}.` });
  };

  const handleActionClick = (stepId) => {
    if (stepId === 'postJob') navigate(createPageUrl('CompanyPostPage'));
    else if (stepId === 'setupProfile') navigate(createPageUrl('CompanyProfile')); // Corrected page name
    else if (stepId === 'searchTalent') navigate(createPageUrl('Students'));
    else setActiveStep(stepId);
  };
  
  const progressPercentage = (completedSteps.length / QUICK_START_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Lightbulb className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome to College Fast Forward!
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Let's get you started. Complete these steps to make the most of your company account.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 mb-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700">Quick Start Checklist</h2>
              <span className="text-sm font-medium text-blue-600">
                {completedSteps.length} of {QUICK_START_STEPS.length} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2.5 [&>div]:bg-blue-500" />
          </div>

          <ul className="space-y-5">
            {QUICK_START_STEPS.map(step => (
              <li key={step.id} className={`p-5 rounded-lg transition-all duration-300 ease-in-out ${completedSteps.includes(step.id) ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} border`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4 ${completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-blue-500'}`}>
                      <step.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${completedSteps.includes(step.id) ? 'text-green-700' : 'text-gray-800'}`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant={completedSteps.includes(step.id) ? "ghost" : "default"}
                    size="sm"
                    onClick={() => completedSteps.includes(step.id) ? toggleStepCompletion(step.id) : handleActionClick(step.id)}
                    className={`${completedSteps.includes(step.id) ? 'text-green-600 hover:bg-green-100' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    {completedSteps.includes(step.id) ? <CheckCircle className="h-5 w-5 mr-1.5" /> : <ArrowRight className="h-4 w-4 mr-1.5" /> }
                    {completedSteps.includes(step.id) ? 'Completed' : 'Start'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {completedSteps.length === QUICK_START_STEPS.length ? (
          <div className="text-center p-6 bg-green-100 rounded-lg border border-green-300">
            <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-3" />
            <h2 className="text-2xl font-semibold text-green-800">All Set!</h2>
            <p className="text-green-700 mt-1 mb-4">You're ready to find amazing Gator talent.</p>
            <Button onClick={() => navigate(createPageUrl('CompanyDashboard'))} className="bg-green-600 hover:bg-green-700 text-white">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(createPageUrl('CompanyDashboard'))}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Skip for now, Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
