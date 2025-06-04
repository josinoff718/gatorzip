import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import AuthCheck from '../components/auth/AuthCheck';
import { ArrowLeft } from 'lucide-react';

export default function CommunityPage() {
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
            <h1 className="text-4xl font-bold mb-4">GatorConnect Community</h1>
            <p className="text-xl text-gray-600">
              Connect with fellow Gators, share experiences, and grow together.
            </p>
          </div>

          <div className="grid gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Student Forums</h2>
              <p className="text-gray-600 mb-4">
                Discuss campus life, academics, and career opportunities with your peers.
              </p>
              <Button className="w-full md:w-auto">
                Join Discussion
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Parent Support Groups</h2>
              <p className="text-gray-600 mb-4">
                Connect with other parents and share advice about supporting your student.
              </p>
              <Button className="w-full md:w-auto">
                Join Group
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Alumni Network</h2>
              <p className="text-gray-600 mb-4">
                Network with fellow alumni and mentor current students.
              </p>
              <Button className="w-full md:w-auto">
                Connect
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}