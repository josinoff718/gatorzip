import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  UserCheck, 
  Building, 
  Bell 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ActivityPage() {
  const navigate = useNavigate();

  // Mock activity data
  const activities = [
    {
      id: 'a1',
      type: 'message',
      title: 'Sara K. replied to your question',
      description: 'Your question about "best resources for interview prep" received a reply.',
      time: '2 hours ago',
      icon: MessageSquare,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: createPageUrl("Network")
    },
    {
      id: 'a2',
      type: 'mentor',
      title: 'Mentor match accepted',
      description: 'Alex C. accepted your mentorship request. You can now schedule a session.',
      time: 'Yesterday',
      icon: UserCheck,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      link: createPageUrl("Mentorship")
    },
    {
      id: 'a3',
      type: 'roommate',
      title: '3 new roommate matches',
      description: 'New potential roommates match your preferences.',
      time: '2 days ago',
      icon: Calendar,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: createPageUrl("GatorMate")
    },
    {
      id: 'a4',
      type: 'job',
      title: 'New job posting in your field',
      description: 'A new entry-level position at Tech Solutions Inc. matches your profile.',
      time: '3 days ago',
      icon: Building,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      link: createPageUrl("Jobs")
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:text-gray-900 mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Bell className="mr-3 h-6 w-6 text-blue-500" />
          Activity & Notifications
        </h1>
        <p className="text-gray-600 mt-1">
          Keep track of your interactions across the Gator network.
        </p>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          
          return (
            <div 
              key={activity.id} 
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`${activity.iconBg} p-3 rounded-full flex-shrink-0`}>
                  <IconComponent className={`h-5 w-5 ${activity.iconColor}`} />
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <Link 
                      to={activity.link}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">No activity yet</h3>
            <p className="text-gray-500 mb-4">
              Your activity feed will show interactions across the Gator network.
            </p>
            <Button onClick={() => navigate(createPageUrl("Dashboard"))}>
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
