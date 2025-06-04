import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Check, Loader2 } from 'lucide-react'; // Added Loader2
import { User } from '@/api/entities'; // Added
import { CompanyProfile } from '@/api/entities'; // Added
import { useToast } from "@/components/ui/use-toast"; // Added

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    features: ['3 active job posts', 'Basic candidate filtering', 'Standard support']
  },
  {
    name: 'Pro',
    price: '$199/mo',
    features: ['Unlimited job posts', 'Advanced filtering', 'Priority support', 'Analytics dashboard', 'Team collaboration']
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Everything in Pro', 'Custom branding', 'API access', 'Dedicated account manager', 'ATS integration']
  }
];

export default function CompanyOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Added
  const [submitting, setSubmitting] = useState(false); // Added

  const [plan, setPlan] = useState('Pro');
  const [info, setInfo] = useState({
    name: '',
    website: '',
    industry: 'Technology',
    size: '1-50' // Changed default to match enum for CompanyProfile
  });

  const companySizeEnumMapping = {
    '1-50': '1-10 employees', // Example: Map form values to CompanyProfile enum values if they differ
    '51-200': '11-50 employees',
    '201-500': '51-200 employees',
    '501-1000': '201-500 employees', // This should be 501-1000 employees
    '1000+': '1000+ employees'
  };
  
  // Corrected mapping for company size to align with CompanyProfile entity
  const companySizeOptions = [
    { value: '1-10 employees', label: '1-10 employees' },
    { value: '11-50 employees', label: '11-50 employees' },
    { value: '51-200 employees', label: '51-200 employees' },
    { value: '201-500 employees', label: '201-500 employees' },
    { value: '501-1000 employees', label: '501-1000 employees' },
    { value: '1000+ employees', label: '1000+ employees' }
  ];


  // calculate progress percentage (50% for step1 merged)
  const progress = 50;
  const progressLabel = 'Step 1: Plan & Info';

  // Pre-fill form if data exists in localStorage (e.g., from a previous session)
  useEffect(() => {
    const storedCompanyInfo = localStorage.getItem('companyInfo');
    if (storedCompanyInfo) {
      try {
        setInfo(JSON.parse(storedCompanyInfo));
      } catch (e) { console.error("Failed to parse companyInfo from localStorage", e); }
    }
    const storedPlan = localStorage.getItem('companyPlan');
    if (storedPlan) {
      setPlan(storedPlan);
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const currentUser = await User.me();
      if (!currentUser) {
        toast({ title: "Authentication Error", description: "Could not verify user. Please log in again.", variant: "destructive"});
        navigate(createPageUrl('AuthSignin')); // Or your login page
        setSubmitting(false);
        return;
      }

      // 1. Update User record (full_name for company, ensure user_type is company)
      await User.updateMyUserData({ 
        full_name: info.name,
        user_type: 'company', // Re-affirm user_type in case it was missed or needs update
        onboarding_complete: true // Mark user-level onboarding as complete
      });

      // 2. Create/Update CompanyProfile record
      // Check if a CompanyProfile already exists for this user_id
      const existingProfiles = await CompanyProfile.filter({ user_id: currentUser.id });
      const companyProfileData = {
        user_id: currentUser.id,
        company_name: info.name,
        website: info.website,
        industry: info.industry,
        company_size: info.size, // Ensure this value matches one of the enum values in CompanyProfile schema
        // plan_name: plan, // Assuming CompanyProfile might have a plan field
        // description: "", // Add other fields as needed
      };

      if (existingProfiles.length > 0) {
        await CompanyProfile.update(existingProfiles[0].id, companyProfileData);
      } else {
        await CompanyProfile.create(companyProfileData);
      }

      // Store data in localStorage for quick client-side access & navigation
      localStorage.setItem('companyPlan', plan);
      localStorage.setItem('companyInfo', JSON.stringify(info)); // info contains name, website, industry, size
      localStorage.setItem('user_type', 'company'); // Already set by OnboardingRole, but good to confirm
      localStorage.setItem('onboardingComplete', 'true'); // For company-specific onboarding flow
      localStorage.setItem('userName', info.name); // Used by some components for display
      
      toast({ title: "Information Saved", description: "Your company details have been updated."});
      // Navigate to quick start or dashboard
      navigate(createPageUrl('CompanyQuickStart'));

    } catch (error) {
      console.error("Error during company onboarding submission:", error);
      toast({ title: "Submission Error", description: error.message || "Failed to save company information. Please try again.", variant: "destructive"});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Company Onboarding</h1>
      <p className="text-center text-gray-600">Hire top campus talent faster.</p>

      {/* Progress Bar */}
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              {progressLabel}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
        </div>
      </div>


      {/* Two-column: Plans & Company Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> {/* Increased gap */}
        {/* Plan Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md"> {/* Added card styling */}
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Your Plan</h2>
          <div className="space-y-4">
            {plans.map(p => (
              <div
                key={p.name}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg
                  ${plan === p.name
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500 ring-offset-1'
                    : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
                onClick={() => setPlan(p.name)}
                role="radio"
                aria-checked={plan === p.name}
                tabIndex="0"
                onKeyPress={(e) => e.key === 'Enter' && setPlan(p.name)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{p.name}</h3>
                  {p.name === 'Pro' && (
                    <span className="text-xs font-semibold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">{p.price}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan === p.name && (
                  <div className="mt-3 text-right text-blue-600 font-semibold">Selected</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Company Info Form */}
        <div className="bg-white p-6 rounded-lg shadow-md"> {/* Added card styling */}
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Company Information</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Your company's official name"
                value={info.name}
                onChange={e => setInfo({ ...info, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company Website<span className="text-red-500">*</span></label>
              <input
                type="url"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://yourcompany.com"
                value={info.website}
                onChange={e => setInfo({ ...info, website: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry<span className="text-red-500">*</span></label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  value={info.industry}
                  onChange={e => setInfo({ ...info, industry: e.target.value })}
                  required
                >
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Retail</option>
                  <option>Manufacturing</option>
                  <option>Consulting</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Company Size<span className="text-red-500">*</span></label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  value={info.size}
                  onChange={e => setInfo({ ...info, size: e.target.value })}
                  required
                >
                  {companySizeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              This helps us match you with relevant candidates and tailor your experience.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
