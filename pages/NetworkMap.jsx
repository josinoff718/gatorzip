
import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@/api/entities';
import { Connection } from '@/api/entities';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ArrowLeft, UserCircle, Users, Briefcase, GraduationCap, Link as LinkIcon,
  Loader2, AlertTriangle, Search, Filter as FilterIcon, Settings2, BarChart3, CalendarDays,
  Sigma, Eye, School, Building, UserSquare2, Info, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import apiManager from '@/components/utils/ApiManager';

const ConnectionCard = ({ connectedUser }) => {
  if (!connectedUser) return null;

  const profile = connectedUser.profile || {};
  const userType = connectedUser.user_type || 'user';
  
  let detail = '';
  let IconComponent = UserCircle;
  let typeLabel = 'User';

  if (userType === 'student') {
    detail = `${profile.major || 'Student'}${profile.graduation_year ? `, Class of ${profile.graduation_year}` : ''}`;
    IconComponent = GraduationCap;
    typeLabel = 'Student';
  } else if (userType === 'alumni') {
    detail = `${profile.current_title || 'Alumni'} at ${profile.current_company || 'Previous Company'}`;
    IconComponent = Briefcase;
    typeLabel = 'Alumni';
  } else if (userType === 'company') {
    detail = `Represents ${connectedUser.full_name || 'Company'}`;
    IconComponent = Building;
    typeLabel = 'Company';
  } else if (userType === 'parent') {
    detail = 'Parent';
    IconComponent = UserSquare2; // More distinct icon for parent
    typeLabel = 'Parent';
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 bg-white">
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Avatar size="md">
          <AvatarImage src={profile.profile_image_url || connectedUser.profile_image_url} alt={connectedUser.full_name} />
          <AvatarFallback>
            {connectedUser.full_name ? connectedUser.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : <UserCircle size={18}/>}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">{connectedUser.full_name || 'Unnamed User'}</h3>
            <Badge variant={
              userType === 'student' ? 'default' :
              userType === 'alumni' ? 'secondary' :
              userType === 'company' ? 'outline' : 
              userType === 'parent' ? 'info' : 
              'default'
            } className="text-xs">{typeLabel}</Badge>
          </div>
          {detail && <p className="text-sm text-gray-600 flex items-center mt-1"><IconComponent className="w-3.5 h-3.5 mr-1.5 text-gray-500" /> {detail}</p>}
        </div>
        <Button variant="outline" size="sm" asChild className="mt-2 sm:mt-0 w-full sm:w-auto">
          <Link to={createPageUrl(`Profile?userId=${connectedUser.id}`)}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ title, value, icon: Icon, change, changeType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <p className={`text-xs ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </p>
      )}
    </CardContent>
  </Card>
);

const roleFilterOptions = [
  { id: 'student', label: 'Students', icon: GraduationCap, color: 'text-blue-600' },
  { id: 'alumni', label: 'Alumni', icon: Briefcase, color: 'text-purple-600' },
  { id: 'company', label: 'Companies', icon: Building, color: 'text-green-600' },
  { id: 'parent', label: 'Parents', icon: UserSquare2, color: 'text-orange-600' },
];

export default function NetworkMapPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [allConnectedUsers, setAllConnectedUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilters, setRoleFilters] = useState(roleFilterOptions.map(r => r.id)); 
  const [degreeFilter, setDegreeFilter] = useState('1');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await apiManager.getUser();
        setCurrentUser(user);

        if (user && user.id) {
          const outgoing = await Connection.filter({ requester_id: user.id, status: 'accepted' });
          const incoming = await Connection.filter({ recipient_id: user.id, status: 'accepted' });
          
          const allCons = [...outgoing, ...incoming];
          const uniqueCons = Array.from(new Set(allCons.map(c => c.id))).map(id => allCons.find(c => c.id === id));
          setConnections(uniqueCons);

          if (uniqueCons.length > 0) {
            const connectedUserIds = uniqueCons.map(conn => 
              conn.requester_id === user.id ? conn.recipient_id : conn.requester_id
            ).filter(id => id);
            
            const profiles = [];
            for (const userId of connectedUserIds) {
              try {
                const connectedUser = await User.get(userId);
                if (connectedUser) profiles.push(connectedUser);
              } catch (profileError) {
                console.warn(`Could not fetch profile for user ID ${userId}:`, profileError.message);
              }
            }
            setAllConnectedUsers(profiles);
          }
        } else {
           setError("You need to be logged in to view your network.");
        }
      } catch (err) {
        console.error("Error fetching network data:", err);
        setError(err.message || "Failed to load network data.");
        if (err.response?.status === 429) {
          setError("High traffic. Please try again in a moment.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredConnectedUsers = useMemo(() => {
    return allConnectedUsers.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = user.full_name?.toLowerCase().includes(searchLower);
      const companyMatch = user.profile?.current_company?.toLowerCase().includes(searchLower);
      const majorMatch = user.profile?.major?.toLowerCase().includes(searchLower);

      const matchesSearch = searchTerm === "" || nameMatch || companyMatch || majorMatch;
      const matchesRole = roleFilters.includes(user.user_type || 'user');
      
      return matchesSearch && matchesRole;
    });
  }, [allConnectedUsers, searchTerm, roleFilters, degreeFilter]);

  const handleRoleFilterChange = (roleId) => {
    setRoleFilters(prev => 
      prev.includes(roleId) ? prev.filter(r => r !== roleId) : [...prev, roleId]
    );
  };
  
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(createPageUrl(currentUser?.user_type ? `${currentUser.user_type.charAt(0).toUpperCase() + currentUser.user_type.slice(1)}Dashboard` : 'Home'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !currentUser) { 
    return (
      <div className="container mx-auto px-4 py-8 text-center">
         <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate(createPageUrl('Home'))}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go to Home
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} className="text-gray-700 hover:bg-gray-100">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Visualize Your Network
          </h1>
          <div className="w-12 h-full"> 
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                      <Settings2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Network Settings (Coming Soon)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <p className="text-sm text-gray-500">
          <Link to={createPageUrl('Home')} className="hover:underline">Home</Link> / 
          <Link to={createPageUrl('Home')} className="hover:underline"> Six Degrees </Link> / 
          <span className="font-medium text-gray-700"> Visualize Network</span>
        </p>
      </div>

      {/* Top Metrics Bar */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Connections" value={connections.length} icon={Users} />
          <MetricCard title="Mentors Available" value="12" icon={GraduationCap} change="+3 this week" changeType="positive" />
          <MetricCard title="Alumni Network" value="150+" icon={Briefcase} />
          <MetricCard title="New Connections (Month)" value="5" icon={CalendarDays} />
        </div>
      </section>
      
      {/* Main Content: Sidebar + Graph Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar: Added sticky positioning for desktop */}
        <aside className="lg:w-1/3 xl:w-1/4 space-y-6 lg:sticky lg:top-20 self-start"> 
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><FilterIcon className="mr-2 h-5 w-5" /> Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search-connections" className="font-medium">Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    id="search-connections"
                    placeholder="Name, company, major..." 
                    className="pl-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-sm">Role</h4>
                <div className="space-y-3"> 
                  {roleFilterOptions.map(role => (
                    <div key={role.id} className="flex items-center justify-between">
                      <Label htmlFor={`role-${role.id}`} className={`text-sm font-normal flex items-center ${role.color}`}>
                        <role.icon className="mr-2 h-4 w-4" /> {role.label}
                      </Label>
                      <Switch 
                        id={`role-${role.id}`} 
                        checked={roleFilters.includes(role.id)}
                        onCheckedChange={() => handleRoleFilterChange(role.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-sm">Connection Degree</h4>
                <div className="flex space-x-2">
                  {[{ val: '1', label: '1st'}, { val: '2', label: '2nd'}, { val: 'All', label: 'All'}].map(deg => (
                    <TooltipProvider key={deg.val} delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant={degreeFilter === deg.val ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDegreeFilter(deg.val)}
                            className="flex-1"
                            disabled={deg.val === '2' || deg.val === 'All'}
                          >
                            {deg.label}
                          </Button>
                        </TooltipTrigger>
                        {(deg.val === '2' || deg.val === 'All') && (
                          <TooltipContent>
                            <p>Coming Soon!</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="legend">
              <AccordionTrigger className="text-base bg-white px-6 py-4 rounded-lg border font-semibold hover:no-underline">
                <div className="flex items-center">
                  <Info className="mr-2 h-5 w-5"/> Legend
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-0"> 
                 <Card> 
                    <CardContent className="space-y-2 text-sm p-4">
                      {roleFilterOptions.map(role => (
                        <div key={`legend-${role.id}`} className="flex items-center">
                          <role.icon className={`mr-2 h-4 w-4 ${role.color}`} />
                          <span className="text-gray-700">{role.label}</span>
                        </div>
                      ))}
                      <div className="flex items-center">
                          <LinkIcon className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">Connection Link</span>
                      </div>
                    </CardContent>
                 </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </aside>

        {/* Main Graph Area / List Area */}
        <section className="lg:w-2/3 xl:w-3/4">
          <Card className="min-h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center">
                    <Sigma className="mr-2 h-6 w-6 text-indigo-600"/> Your Network Overview
                </CardTitle>
                <Badge variant="outline">{filteredConnectedUsers.length} Visible</Badge>
              </div>
              <CardDescription>
                {degreeFilter === '1' && "Displaying your direct (1st degree) connections. "}
                Interactive graph view coming soon!
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              {/* Placeholder for Graph */}
              <div className="h-64 bg-gray-200/50 rounded-md flex items-center justify-center mb-6 border border-dashed border-gray-300">
                <p className="text-gray-500">Interactive Network Graph Coming Soon!</p>
              </div>

              {/* List of Connections */}
              {error && <p className="text-red-600 bg-red-50 p-3 rounded-md my-4">{error}</p>}
              
              {filteredConnectedUsers.length > 0 ? (
                <div className="space-y-4">
                  {filteredConnectedUsers.map(user => (
                    <ConnectionCard key={user.id} connectedUser={user} />
                  ))}
                </div>
              ) : (
                 !error && ( 
                    <div className="text-center py-10">
                        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Connections Found</h3>
                        <p className="text-sm text-gray-500 mb-6">
                          Try adjusting your search or filters. Haven't made connections yet?
                        </p>
                        <Button asChild>
                          <Link to={createPageUrl('Students')}> 
                            Explore Profiles <ChevronRight className="ml-1 h-4 w-4"/>
                          </Link>
                        </Button>
                    </div>
                 )
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
