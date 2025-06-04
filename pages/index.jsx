import Layout from "./Layout.jsx";

import Jobs from "./Jobs";

import Onboarding from "./Onboarding";

import Mentorship from "./Mentorship";

import Resources from "./Resources";

import Students from "./Students";

import Alumni from "./Alumni";

import ShareStory from "./ShareStory";

import AlumniDashboard from "./AlumniDashboard";

import AllStories from "./AllStories";

import Network from "./Network";

import AlumniProfile from "./AlumniProfile";

import Dashboard from "./Dashboard";

import StudentOnboarding from "./StudentOnboarding";

import ParentOnboarding from "./ParentOnboarding";

import Events from "./Events";

import QuickMentorship from "./QuickMentorship";

import MentorDashboard from "./MentorDashboard";

import LogoutPage from "./LogoutPage";

import Layout from "./Layout";

import AlternateHome from "./AlternateHome";

import Contact from "./Contact";

import FAQ from "./FAQ";

import MentorMatch from "./MentorMatch";

import ParentDashboard from "./ParentDashboard";

import StudentDashboard from "./StudentDashboard";

import DashboardRedirect from "./DashboardRedirect";

import Inbox from "./Inbox";

import AlumniLogin from "./AlumniLogin";

import AlumniProfileForm from "./AlumniProfileForm";

import AlumniMentorPreferences from "./AlumniMentorPreferences";

import AlumniOnboardingSuccess from "./AlumniOnboardingSuccess";

import PreLogin from "./PreLogin";

import CompanyOnboarding from "./CompanyOnboarding";

import CompanyDashboard from "./CompanyDashboard";

import CompanyPost from "./CompanyPost";

import CompanyPostPage from "./CompanyPostPage";

import Community from "./Community";

import Register from "./Register";

import Match from "./Match";

import AlumniOnboarding from "./AlumniOnboarding";

import GatorNation from "./GatorNation";

import StudentOnboardingStep2 from "./StudentOnboardingStep2";

import MentorProfile from "./MentorProfile";

import Settings from "./Settings";

import ParentProfileEdit from "./ParentProfileEdit";

import ShareJobLead from "./ShareJobLead";

import Profile from "./Profile";

import OnboardingRole from "./OnboardingRole";

import OnboardingSchool from "./OnboardingSchool";

import AuthSignin from "./AuthSignin";

import onboarding from "./onboarding";

import SupportReport from "./SupportReport";

import Home from "./Home";

import home from "./home";

import RegisterSchool from "./RegisterSchool";

import RegisterInterests from "./RegisterInterests";

import TasksStandalone from "./TasksStandalone";

import ActivityPage from "./ActivityPage";

import CompanyRegistration from "./CompanyRegistration";

import CompanyQuickStart from "./CompanyQuickStart";

import GatorMatePage from "./GatorMatePage";

import gator-mate from "./gator-mate";

import UserDataTestPage from "./UserDataTestPage";

import Messages from "./Messages";

import CompanyProfile from "./CompanyProfile";

import MessagesMinimal from "./MessagesMinimal";

import AdminSubscriptions from "./AdminSubscriptions";

import AdminStudents from "./AdminStudents";

import AdminDashboard from "./AdminDashboard";

import AdminParents from "./AdminParents";

import AdminCompanies from "./AdminCompanies";

import AdminAlumni from "./AdminAlumni";

import NetworkMap from "./NetworkMap";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Jobs: Jobs,
    
    Onboarding: Onboarding,
    
    Mentorship: Mentorship,
    
    Resources: Resources,
    
    Students: Students,
    
    Alumni: Alumni,
    
    ShareStory: ShareStory,
    
    AlumniDashboard: AlumniDashboard,
    
    AllStories: AllStories,
    
    Network: Network,
    
    AlumniProfile: AlumniProfile,
    
    Dashboard: Dashboard,
    
    StudentOnboarding: StudentOnboarding,
    
    ParentOnboarding: ParentOnboarding,
    
    Events: Events,
    
    QuickMentorship: QuickMentorship,
    
    MentorDashboard: MentorDashboard,
    
    LogoutPage: LogoutPage,
    
    Layout: Layout,
    
    AlternateHome: AlternateHome,
    
    Contact: Contact,
    
    FAQ: FAQ,
    
    MentorMatch: MentorMatch,
    
    ParentDashboard: ParentDashboard,
    
    StudentDashboard: StudentDashboard,
    
    DashboardRedirect: DashboardRedirect,
    
    Inbox: Inbox,
    
    AlumniLogin: AlumniLogin,
    
    AlumniProfileForm: AlumniProfileForm,
    
    AlumniMentorPreferences: AlumniMentorPreferences,
    
    AlumniOnboardingSuccess: AlumniOnboardingSuccess,
    
    PreLogin: PreLogin,
    
    CompanyOnboarding: CompanyOnboarding,
    
    CompanyDashboard: CompanyDashboard,
    
    CompanyPost: CompanyPost,
    
    CompanyPostPage: CompanyPostPage,
    
    Community: Community,
    
    Register: Register,
    
    Match: Match,
    
    AlumniOnboarding: AlumniOnboarding,
    
    GatorNation: GatorNation,
    
    StudentOnboardingStep2: StudentOnboardingStep2,
    
    MentorProfile: MentorProfile,
    
    Settings: Settings,
    
    ParentProfileEdit: ParentProfileEdit,
    
    ShareJobLead: ShareJobLead,
    
    Profile: Profile,
    
    OnboardingRole: OnboardingRole,
    
    OnboardingSchool: OnboardingSchool,
    
    AuthSignin: AuthSignin,
    
    onboarding: onboarding,
    
    SupportReport: SupportReport,
    
    Home: Home,
    
    home: home,
    
    RegisterSchool: RegisterSchool,
    
    RegisterInterests: RegisterInterests,
    
    TasksStandalone: TasksStandalone,
    
    ActivityPage: ActivityPage,
    
    CompanyRegistration: CompanyRegistration,
    
    CompanyQuickStart: CompanyQuickStart,
    
    GatorMatePage: GatorMatePage,
    
    gator-mate: gator-mate,
    
    UserDataTestPage: UserDataTestPage,
    
    Messages: Messages,
    
    CompanyProfile: CompanyProfile,
    
    MessagesMinimal: MessagesMinimal,
    
    AdminSubscriptions: AdminSubscriptions,
    
    AdminStudents: AdminStudents,
    
    AdminDashboard: AdminDashboard,
    
    AdminParents: AdminParents,
    
    AdminCompanies: AdminCompanies,
    
    AdminAlumni: AdminAlumni,
    
    NetworkMap: NetworkMap,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Jobs />} />
                
                
                <Route path="/Jobs" element={<Jobs />} />
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/Mentorship" element={<Mentorship />} />
                
                <Route path="/Resources" element={<Resources />} />
                
                <Route path="/Students" element={<Students />} />
                
                <Route path="/Alumni" element={<Alumni />} />
                
                <Route path="/ShareStory" element={<ShareStory />} />
                
                <Route path="/AlumniDashboard" element={<AlumniDashboard />} />
                
                <Route path="/AllStories" element={<AllStories />} />
                
                <Route path="/Network" element={<Network />} />
                
                <Route path="/AlumniProfile" element={<AlumniProfile />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/StudentOnboarding" element={<StudentOnboarding />} />
                
                <Route path="/ParentOnboarding" element={<ParentOnboarding />} />
                
                <Route path="/Events" element={<Events />} />
                
                <Route path="/QuickMentorship" element={<QuickMentorship />} />
                
                <Route path="/MentorDashboard" element={<MentorDashboard />} />
                
                <Route path="/LogoutPage" element={<LogoutPage />} />
                
                <Route path="/Layout" element={<Layout />} />
                
                <Route path="/AlternateHome" element={<AlternateHome />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/FAQ" element={<FAQ />} />
                
                <Route path="/MentorMatch" element={<MentorMatch />} />
                
                <Route path="/ParentDashboard" element={<ParentDashboard />} />
                
                <Route path="/StudentDashboard" element={<StudentDashboard />} />
                
                <Route path="/DashboardRedirect" element={<DashboardRedirect />} />
                
                <Route path="/Inbox" element={<Inbox />} />
                
                <Route path="/AlumniLogin" element={<AlumniLogin />} />
                
                <Route path="/AlumniProfileForm" element={<AlumniProfileForm />} />
                
                <Route path="/AlumniMentorPreferences" element={<AlumniMentorPreferences />} />
                
                <Route path="/AlumniOnboardingSuccess" element={<AlumniOnboardingSuccess />} />
                
                <Route path="/PreLogin" element={<PreLogin />} />
                
                <Route path="/CompanyOnboarding" element={<CompanyOnboarding />} />
                
                <Route path="/CompanyDashboard" element={<CompanyDashboard />} />
                
                <Route path="/CompanyPost" element={<CompanyPost />} />
                
                <Route path="/CompanyPostPage" element={<CompanyPostPage />} />
                
                <Route path="/Community" element={<Community />} />
                
                <Route path="/Register" element={<Register />} />
                
                <Route path="/Match" element={<Match />} />
                
                <Route path="/AlumniOnboarding" element={<AlumniOnboarding />} />
                
                <Route path="/GatorNation" element={<GatorNation />} />
                
                <Route path="/StudentOnboardingStep2" element={<StudentOnboardingStep2 />} />
                
                <Route path="/MentorProfile" element={<MentorProfile />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/ParentProfileEdit" element={<ParentProfileEdit />} />
                
                <Route path="/ShareJobLead" element={<ShareJobLead />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/OnboardingRole" element={<OnboardingRole />} />
                
                <Route path="/OnboardingSchool" element={<OnboardingSchool />} />
                
                <Route path="/AuthSignin" element={<AuthSignin />} />
                
                <Route path="/onboarding" element={<onboarding />} />
                
                <Route path="/SupportReport" element={<SupportReport />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/home" element={<home />} />
                
                <Route path="/RegisterSchool" element={<RegisterSchool />} />
                
                <Route path="/RegisterInterests" element={<RegisterInterests />} />
                
                <Route path="/TasksStandalone" element={<TasksStandalone />} />
                
                <Route path="/ActivityPage" element={<ActivityPage />} />
                
                <Route path="/CompanyRegistration" element={<CompanyRegistration />} />
                
                <Route path="/CompanyQuickStart" element={<CompanyQuickStart />} />
                
                <Route path="/GatorMatePage" element={<GatorMatePage />} />
                
                <Route path="/gator-mate" element={<gator-mate />} />
                
                <Route path="/UserDataTestPage" element={<UserDataTestPage />} />
                
                <Route path="/Messages" element={<Messages />} />
                
                <Route path="/CompanyProfile" element={<CompanyProfile />} />
                
                <Route path="/MessagesMinimal" element={<MessagesMinimal />} />
                
                <Route path="/AdminSubscriptions" element={<AdminSubscriptions />} />
                
                <Route path="/AdminStudents" element={<AdminStudents />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/AdminParents" element={<AdminParents />} />
                
                <Route path="/AdminCompanies" element={<AdminCompanies />} />
                
                <Route path="/AdminAlumni" element={<AdminAlumni />} />
                
                <Route path="/NetworkMap" element={<NetworkMap />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}