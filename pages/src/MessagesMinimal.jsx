import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageUrl } from '@/utils';

export default function MessagesMinimalPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Button 
        onClick={() => window.history.back()}
        className="mb-6 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        variant="ghost"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Messages - Minimal Version</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-4">Network Connectivity Test</h3>
            <p className="text-gray-600 mb-6">
              This is a simplified version of the Messages page that doesn't make API calls.
              If you can see this page, the basic app structure is working.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.reload()}
                className="mr-4"
              >
                Refresh Page
              </Button>
              
              <Link to={createPageUrl("CompanyDashboard")}>
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Network Error:</strong> The full Messages page couldn't load due to network issues.
                Try refreshing your browser or checking your internet connection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
