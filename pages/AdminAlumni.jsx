import React from 'react';
import { ArrowLeft, Users } from 'lucide-react'; // Changed icon to Users for Alumni
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminAlumniPage() {
  // Placeholder: Fetch and display alumni data here
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link 
            to={createPageUrl("AdminDashboard")} 
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl font-bold">Manage Alumni</CardTitle>
                <p className="text-gray-500">View and manage alumni user accounts and contributions.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-center py-10 text-gray-500">
              Alumni management features are coming soon. This page will display a table of registered alumni with options to filter, search, and manage their accounts and mentorship activities.
            </p>
            {/* Placeholder for data table, filters, and actions */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}