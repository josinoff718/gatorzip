import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import AuthCheck from '../components/auth/AuthCheck';
import { ArrowLeft, Search, Users, CheckCircle } from 'lucide-react';

export default function MatchPage() {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Match</h1>
            <p className="text-xl text-gray-600">
              Our AI-powered matching system connects you with compatible roommates based on your lifestyle and preferences.
            </p>
          </div>

          <div className="grid gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Browse Matches</h2>
                  <p className="text-gray-600 mb-4">
                    View potential roommates that match your preferences.
                  </p>
                  <Button className="w-full md:w-auto">
                    Start Browsing
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Smart Match</h2>
                  <p className="text-gray-600 mb-4">
                    Let our AI find your ideal roommate based on compatibility.
                  </p>
                  <Button className="w-full md:w-auto">
                    Get Matched
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Verify Your Profile</h2>
                  <p className="text-gray-600 mb-4">
                    Complete your profile verification to increase trust and matching accuracy.
                  </p>
                  <Button className="w-full md:w-auto">
                    Verify Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}