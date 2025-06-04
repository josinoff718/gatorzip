import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Mail, 
  Globe, 
  Shield,
  ChevronLeft 
} from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: 'public',
    marketingEmails: false
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        // In a real app, you would fetch user settings here
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleBackToDashboard = () => {
    if (user?.user_type === 'parent') {
      navigate(createPageUrl("ParentDashboard"));
    } else if (user?.user_type === 'student') {
      navigate(createPageUrl("StudentDashboard"));
    } else if (user?.user_type === 'alumni') {
      navigate(createPageUrl("AlumniDashboard"));
    } else {
      navigate(createPageUrl("Dashboard"));
    }
  };

  const updateSettings = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // In a real app, you would save these settings to the backend
    try {
      await User.updateMyUserData({
        settings: {
          ...settings,
          [key]: value
        }
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0021A5]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={handleBackToDashboard}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and notifications</p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={user?.full_name || ''} 
                className="max-w-md"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user?.email || ''} 
                className="max-w-md"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications about important updates</p>
                </div>
              </div>
              <Switch 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSettings('pushNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about activity</p>
                </div>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSettings('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Marketing Communications</p>
                  <p className="text-sm text-gray-500">Receive updates about new features and events</p>
                </div>
              </div>
              <Switch 
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => updateSettings('marketingEmails', checked)}
              />
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Profile Visibility</p>
                <p className="text-sm text-gray-500">Control who can see your profile</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select 
                className="form-select rounded-md border-gray-300"
                value={settings.profileVisibility}
                onChange={(e) => updateSettings('profileVisibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="connections">Connections Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
          <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <Button variant="destructive">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
