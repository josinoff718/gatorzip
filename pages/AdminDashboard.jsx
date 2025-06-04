import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { StudentProfile } from '@/api/entities';
import { AlumniProfile } from '@/api/entities';
import { CompanyProfile } from '@/api/entities';

import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  Settings, 
  AlertTriangle, 
  Loader2, 
  BarChart2, 
  CheckSquare, 
  Clock 
} from 'lucide-react';
import NewRegistrantsTodayCounter from '@/components/dashboard/NewRegistrantsTodayCounter';
import StatCard from '@/components/admin/StatCard';
import NavCard from '@/components/admin/NavCard';
import RegistrationTrendChart from '@/components/admin/RegistrationTrendChart';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [summary, setSummary] = useState({
    student: { count: 0, pending: 0, isLoading: true, error: null },
    parent: { count: 0, pending: 0, isLoading: true, error: null },
    company: { count: 0, pending: 0, isLoading: true, error: null },
    alumni: { count: 0, pending: 0, isLoading: true, error: null },
  });
  const [pendingAlert, setPendingAlert] = useState({ show: false, message: "" });

  useEffect(() => {
    const checkAdminStatusAndLoadData = async () => {
      setLoadingAuth(true);
      try {
        const currentUser = await User.me();
        if (currentUser && currentUser.user_type === 'admin') {
          setIsAdmin(true);
          fetchAllUserCounts();
        } else {
          setIsAdmin(false);
          navigate(createPageUrl('Home'));
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        navigate(createPageUrl('AuthSignin'));
      } finally {
        setLoadingAuth(false);
      }
    };
    checkAdminStatusAndLoadData();
  }, [navigate]);

  const fetchAllUserCounts = async () => {
    try {
      const allUsers = await User.list();
      const studentProfiles = await StudentProfile.list();
      const alumniProfiles = await AlumniProfile.list();
      const companyProfiles = await CompanyProfile.list();

      const studentUserIdsWithProfile = new Set(studentProfiles.map(p => p.user_id));
      const alumniUserIdsWithProfile = new Set(alumniProfiles.map(p => p.user_id));
      const companyUserIdsWithProfile = new Set(companyProfiles.map(p => p.user_id));

      let studentCount = 0;
      let studentPending = 0;
      let parentCount = 0;
      let companyCount = 0;
      let companyPending = 0;
      let alumniCount = 0;
      let alumniPending = 0;
      let recentPendingCount = 0;

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      allUsers.forEach(user => {
        const isRecent = user.created_date && new Date(user.created_date) > twentyFourHoursAgo;

        switch (user.user_type) {
          case 'student':
            studentCount++;
            if (!studentUserIdsWithProfile.has(user.id)) {
              studentPending++;
              if (isRecent) recentPendingCount++;
            }
            break;
          case 'parent':
            parentCount++;
            break;
          case 'company':
            companyCount++;
            if (!companyUserIdsWithProfile.has(user.id)) {
              companyPending++;
               if (isRecent) recentPendingCount++;
            }
            break;
          case 'alumni':
            alumniCount++;
            if (!alumniUserIdsWithProfile.has(user.id)) {
              alumniPending++;
              if (isRecent) recentPendingCount++;
            }
            break;
          default:
            break;
        }
      });

      setSummary({
        student: { count: studentCount, pending: studentPending, isLoading: false, error: null },
        parent: { count: parentCount, pending: 0, isLoading: false, error: null },
        company: { count: companyCount, pending: companyPending, isLoading: false, error: null },
        alumni: { count: alumniCount, pending: alumniPending, isLoading: false, error: null },
      });

      if (recentPendingCount > 10) {
        setPendingAlert({ show: true, message: `${recentPendingCount} new users are awaiting profile completion from the last 24 hours.` });
      }

    } catch (error) {
      console.error("Error fetching user counts:", error);
      const errorMessage = "Failed to load summary data.";
      setSummary({
        student: { count: 0, pending: 0, isLoading: false, error: errorMessage },
        parent: { count: 0, pending: 0, isLoading: false, error: errorMessage },
        company: { count: 0, pending: 0, isLoading: false, error: errorMessage },
        alumni: { count: 0, pending: 0, isLoading: false, error: errorMessage },
      });
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      navigate(createPageUrl('AuthSignin'));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  const userManagementSections = [
    { title: "Students", icon: GraduationCap, href: createPageUrl("AdminStudents"), description: "Manage student users and profiles." },
    { title: "Parents", icon: Users, href: createPageUrl("AdminParents"), description: "View parent registrations." },
    { title: "Companies", icon: Briefcase, href: createPageUrl("AdminCompanies"), description: "Oversee company accounts and job posts." },
    { title: "Alumni", icon: Users, href: createPageUrl("AdminAlumni"), description: "Manage alumni users and contributions." },
  ];

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
        <ShieldCheck className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
        <Button onClick={() => navigate(createPageUrl('Home'))}>Go to Homepage</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-6 border-b border-gray-300">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Platform overview and management tools.</p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <NewRegistrantsTodayCounter title="New Users Today" />
            <Button variant="outline" onClick={handleLogout} className="hover:bg-red-50 hover:border-red-500 hover:text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Pending Registrations Alert */}
        {pendingAlert.show && (
          <Card className="mb-8 bg-amber-50 border-amber-400">
            <CardContent className="p-4 flex items-center">
              <AlertTriangle className="h-6 w-6 text-amber-600 mr-3 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800">Attention Needed</h3>
                <p className="text-sm text-amber-700">{pendingAlert.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Students" 
            count={summary.student.count} 
            pendingCount={summary.student.pending}
            icon={GraduationCap} 
            linkTo={createPageUrl("AdminStudents")}
            isLoading={summary.student.isLoading}
            error={summary.student.error}
          />
          <StatCard 
            title="Total Parents" 
            count={summary.parent.count}
            pendingCount={summary.parent.pending}
            icon={Users} 
            linkTo={createPageUrl("AdminParents")}
            isLoading={summary.parent.isLoading}
            error={summary.parent.error}
          />
          <StatCard 
            title="Total Companies" 
            count={summary.company.count} 
            pendingCount={summary.company.pending}
            icon={Briefcase} 
            linkTo={createPageUrl("AdminCompanies")}
            isLoading={summary.company.isLoading}
            error={summary.company.error}
          />
          <StatCard 
            title="Total Alumni" 
            count={summary.alumni.count} 
            pendingCount={summary.alumni.pending}
            icon={Users} 
            linkTo={createPageUrl("AdminAlumni")}
            isLoading={summary.alumni.isLoading}
            error={summary.alumni.error}
          />
        </div>

        {/* User Management Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">User Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userManagementSections.map((section) => (
              <NavCard 
                key={section.title}
                title={section.title}
                icon={section.icon}
                href={section.href}
                description={section.description}
              />
            ))}
             <NavCard 
                title="Email Subscriptions"
                icon={Mail}
                href={createPageUrl("AdminSubscriptions")}
                description="View newsletter subscribers."
              />
          </div>
        </section>
        
        {/* Registration Trends Chart */}
        <section className="mb-10">
           <RegistrationTrendChart />
        </section>

        {/* Quick Actions & Settings */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quick Actions & Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <CheckSquare className="h-6 w-6 text-green-500 mr-3" />
                  <h3 className="text-lg font-medium">Bulk Approve (Coming Soon)</h3>
                </div>
                <p className="text-sm text-gray-600">Quickly approve pending user profiles or content.</p>
              </CardContent>
            </Card>
             <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Settings className="h-6 w-6 text-gray-500 mr-3" />
                  <h3 className="text-lg font-medium">Platform Settings</h3>
                </div>
                <p className="text-sm text-gray-600">Configure site-wide parameters and features.</p>
              </CardContent>
            </Card>
             <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <BarChart2 className="h-6 w-6 text-purple-500 mr-3" />
                  <h3 className="text-lg font-medium">View Analytics (More)</h3>
                </div>
                <p className="text-sm text-gray-600">Access detailed platform usage statistics.</p>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}