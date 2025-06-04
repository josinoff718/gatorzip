import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SupportReport from '@/components/utils/SupportReport';

export default function SupportReportPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            className="flex items-center mr-4 text-gray-600 hover:text-gray-900"
            onClick={() => navigate(createPageUrl('home'))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold">Authentication Support Report</h1>
        </div>

        <SupportReport />
        
        <div className="mt-10 text-sm text-gray-500">
          <h3 className="font-medium text-gray-700 mb-2">What to do with this report?</h3>
          <p>
            Please contact Base44 support and provide them with the information from this page.
            The "Copy Full Report" button will copy a detailed technical report to your clipboard
            that Base44 support can use to diagnose and fix the authentication issue.
          </p>
        </div>
      </div>
    </div>
  );
}
