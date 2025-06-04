import React, { useState, useEffect } from 'react';
import { NotificationSubscription } from '@/api/entities';
import { User } from '@/api/entities'; // For potential admin role check in the future
import { Loader2, Mail, AlertTriangle, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

// Helper function to format date (from Message.js, could be moved to utils)
const formatPrettyDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function for CSV export
const convertToCSV = (data) => {
  if (!data || data.length === 0) return "";
  const headers = ["Email", "Source", "Subscribed Date"];
  const csvRows = [
    headers.join(','),
    ...data.map(row => [
      `"${row.email || ''}"`,
      `"${row.source || ''}"`,
      `"${formatPrettyDate(row.created_date) || ''}"`
    ].join(','))
  ];
  return csvRows.join('\n');
};

const downloadCSV = (csvData, filename = "subscriptions.csv") => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};


export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // In a real scenario, you'd add role-based access control here
  // For now, we assume access is granted if the page is loaded.
  // useEffect(() => {
  //   const checkAdmin = async () => {
  //     try {
  //       const user = await User.me();
  //       if (user.role !== 'admin') {
  //         navigate(createPageUrl('Home')); // Or a 'Not Authorized' page
  //       }
  //     } catch (e) {
  //       navigate(createPageUrl('AuthSignin')); // Not logged in
  //     }
  //   };
  //   checkAdmin();
  // }, [navigate]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await NotificationSubscription.list('-created_date'); // Sort by most recent
        setSubscriptions(data);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
        setError("Failed to load subscriptions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleExportCSV = () => {
    const csvData = convertToCSV(filteredSubscriptions);
    downloadCSV(csvData);
  };

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.source && sub.source.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-700">Loading Subscriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
        <p className="text-red-600 mb-6 text-center">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="outline"
          onClick={() => navigate(createPageUrl('CompanyDashboard'))} // Or a generic Admin Dashboard
          className="mb-6 bg-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard 
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                  <Mail className="mr-3 h-6 w-6 text-blue-600" />
                  Email Subscriptions
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  List of users who signed up for notifications.
                </p>
              </div>
              <Button onClick={handleExportCSV} variant="outline" className="bg-green-500 hover:bg-green-600 text-white sm:ml-auto">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>
            <div className="mt-6">
              <Input 
                type="text"
                placeholder="Search by email or source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredSubscriptions.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Subscriptions Found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "No subscriptions match your search." : "There are no email subscriptions yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Subscribed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sub.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            sub.source === 'hero_notify_me' ? 'bg-blue-100 text-blue-800' : 
                            sub.source === 'footer_signup' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {sub.source || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatPrettyDate(sub.created_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        {filteredSubscriptions.length > 0 && (
          <p className="text-center mt-4 text-sm text-gray-500">
            Showing {filteredSubscriptions.length} of {subscriptions.length} total subscriptions.
          </p>
        )}
      </div>
    </div>
  );
}