
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
// User entity import is kept for when auth is re-enabled, but User.me() will be removed.
// import { User } from '@/api/entities'; 
import { MessageRecord } from '@/api/entities'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, Inbox, Send, Search, Loader2, 
  Filter, Paperclip, X, Smile, ChevronDown,
  Clock, Calendar, BookOpen, Star, Archive,
  Menu, CheckCircle, MoreVertical, MapPin
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from '@/components/ui/use-toast';

const MESSAGE_FETCH_LIMIT = 100;
const APPLICATION_STATUSES = ['responded', 'no_response', 'interview_scheduled', 'hired', 'application_pending'];

// --- Static User/Company Context (Temporary) ---
const MOCK_CURRENT_USER = {
  id: "mock_company_123", // Replace with a representative static ID
  full_name: "Mock Company Inc.",    // Replace with a representative static name
  user_type: "company"         // Assuming 'company' for this page
};
// --- End Static User/Company Context ---

export default function MessagesPage() {
  console.log("MessagesPage: Component rendering or re-rendering (AUTH DISABLED).");
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(MOCK_CURRENT_USER); // Initialize with mock user
  const [conversations, setConversations] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // isAuthError state is no longer needed as we are bypassing auth for now.
  // const [isAuthError, setIsAuthError] = useState(false); 
  const [viewFilter, setViewFilter] = useState("all");
  const [activeMainTab, setActiveMainTab] = useState("all_messages");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const composerRef = useRef(null);
  const [userHasScrolledUp, setUserHasScrolledUp] = useState(false);
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);
  const [showScrollShadow, setShowScrollShadow] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const formatTimestamp = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.round((now - date) / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return `Yesterday`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }, []);

  const groupMessagesIntoConversations = useCallback((messages, currentUserId) => {
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const otherParticipantId = msg.sender_id === currentUserId ? msg.recipient_id : msg.sender_id;
      let otherParticipantName = msg.sender_id === currentUserId ? msg.recipient_name : msg.sender_name;
      const otherParticipantType = msg.sender_id === currentUserId ? msg.recipient_type : msg.sender_type;
      
      const convoId = msg.conversation_id;

      let fallbackInitials = "??";
      if (otherParticipantName && typeof otherParticipantName === 'string' && otherParticipantName.trim() !== "") {
        const names = otherParticipantName.trim().split(" ").filter(n => n);
        if (names.length >= 2) {
          fallbackInitials = `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        } else if (names.length === 1 && names[0].length > 0) {
          fallbackInitials = names[0].substring(0, 2).toUpperCase();
        }
      } else {
        otherParticipantName = "Unknown Participant";
        if (otherParticipantId && typeof otherParticipantId === 'string') {
            fallbackInitials = otherParticipantId.substring(0,2).toUpperCase();
        }
      }

      if (!conversationsMap.has(convoId)) {
        let participantProfile = {};
        const messagesForThisConvo = messages.filter(m => m.conversation_id === convoId && m.student_profile_snapshot);
        messagesForThisConvo.sort((a,b) => new Date(b.created_date) - new Date(a.created_date)); 
        
        if (messagesForThisConvo.length > 0 && messagesForThisConvo[0].student_profile_snapshot) {
            try {
                participantProfile = JSON.parse(messagesForThisConvo[0].student_profile_snapshot);
            } catch(e) { console.warn("Failed to parse profile snapshot for convo:", convoId, e)}
        }
        
        conversationsMap.set(convoId, {
          id: convoId,
          participant: {
            id: otherParticipantId,
            name: otherParticipantName,
            avatarFallback: fallbackInitials,
            role: participantProfile.major || (otherParticipantType === 'student' ? 'Student Applicant' : otherParticipantType), 
            location: participantProfile.location,
            graduationYear: participantProfile.graduation_year,
            avatarUrl: participantProfile.profile_image_url || null
          },
          messages: [],
          lastMessage: '',
          timestamp: '',
          unread: false,
          unreadCount: 0,
          archived: messages.some(m => m.conversation_id === convoId && m.status === 'archived'),
          isApplication: messages.some(m => m.conversation_id === convoId && APPLICATION_STATUSES.includes(m.status)),
          highestApplicationStatus: messages
            .filter(m => m.conversation_id === convoId && APPLICATION_STATUSES.includes(m.status))
            .map(m => m.status)
            .sort((a,b) => APPLICATION_STATUSES.indexOf(b) - APPLICATION_STATUSES.indexOf(a))[0] || null,
        });
      }

      const conversation = conversationsMap.get(convoId);
      conversation.messages.push({
        id: msg.id,
        sender: msg.sender_id === currentUserId ? 'You' : msg.sender_name,
        senderId: msg.sender_id, 
        text: msg.message,
        time: new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTimestamp: msg.created_date,
        read: msg.sender_id === currentUserId || msg.read_by_recipient, 
        status: msg.status, 
      });

      if (msg.sender_id !== currentUserId && !msg.read_by_recipient) {
        conversation.unread = true;
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }
    });

    conversationsMap.forEach(convo => {
      convo.messages.sort((a, b) => new Date(a.fullTimestamp) - new Date(b.fullTimestamp));
      if (convo.messages.length > 0) {
        const lastMsg = convo.messages[convo.messages.length - 1];
        convo.lastMessage = lastMsg.text;
        convo.timestamp = formatTimestamp(lastMsg.fullTimestamp); 
        if (!convo.participant.avatarUrl) {
            const participantMessagesWithSnapshot = convo.messages.filter(m => 
              m.senderId === convo.participant.id && 
              m.senderSnapshot && 
              typeof m.senderSnapshot === 'object' && 
              m.senderSnapshot.profile_image_url
            );
            if (participantMessagesWithSnapshot.length > 0) {
                convo.participant.avatarUrl = participantMessagesWithSnapshot[participantMessagesWithSnapshot.length -1].senderSnapshot.profile_image_url;
            }
        }
      }
    });
    
    const grouped = Array.from(conversationsMap.values());
    grouped.sort((a,b) => {
        const lastMsgA = a.messages[a.messages.length - 1];
        const lastMsgB = b.messages[b.messages.length - 1];
        if (!lastMsgA || !lastMsgB) return 0;
        return new Date(lastMsgB.fullTimestamp) - new Date(lastMsgA.fullTimestamp);
    });
    return grouped;
  }, [formatTimestamp]);

  const fetchData = useCallback(async () => {
    console.log("MessagesPage: fetchData started (AUTH DISABLED).");
    setIsLoading(true);
    setError(null);
    // setIsAuthError(false); // Not needed

    try {
      // const user = await User.me(); // Removed User.me() call
      const user = MOCK_CURRENT_USER; // Use mock user
      console.log("MessagesPage: Using MOCK_CURRENT_USER.", user);
      // setCurrentUser(user); // Already set in useState initialization

      const sentMessages = await MessageRecord.filter(
        { sender_id: user.id },
        '-created_date',
        MESSAGE_FETCH_LIMIT
      );
      console.log("MessagesPage: Fetched sent messages.", sentMessages?.length);
      const receivedMessages = await MessageRecord.filter(
        { recipient_id: user.id },
        '-created_date',
        MESSAGE_FETCH_LIMIT
      );
      console.log("MessagesPage: Fetched received messages.", receivedMessages?.length);
      
      const allUserMessages = [...sentMessages, ...receivedMessages];
      const uniqueMessagesMap = new Map();
      allUserMessages.forEach(msg => {
        if (!uniqueMessagesMap.has(msg.id) || new Date(msg.created_date) > new Date(uniqueMessagesMap.get(msg.id).created_date)) {
           uniqueMessagesMap.set(msg.id, msg);
        }
      });
      const uniqueMessages = Array.from(uniqueMessagesMap.values());

      setAllMessages(uniqueMessages);
      const grouped = groupMessagesIntoConversations(uniqueMessages, user.id);
      setConversations(grouped);

      if (grouped.length > 0) {
        const currentConvo = conversations.find(c => c.id === selectedConversation?.id);
        const newSelected = currentConvo ? grouped.find(c => c.id === currentConvo.id) || grouped[0] : grouped[0];
        setSelectedConversation(newSelected);
        if (window.innerWidth < 768 && newSelected) {
          setMobileSidebarOpen(false);
        }
      } else {
        setSelectedConversation(null);
      }
      console.log("MessagesPage: fetchData data processing complete (AUTH DISABLED).");
    } catch (err) {
      console.error("MessagesPage: Error in fetchData (AUTH DISABLED):", err);
      let errorMsg = "Failed to load messages. Please check your connection or try again later.";
      
      // Simplified error handling as auth errors are not expected with this setup
      if (err.response?.status === 429 || (err.message && err.message.toLowerCase().includes('rate limit exceeded'))) {
        errorMsg = "We're experiencing high traffic. Please try again in a few moments.";
      } else if ((err.isAxiosError && !err.response) || (err.message && err.message.toLowerCase().includes('network error'))) {
        errorMsg = "A network error occurred. Please check your internet connection and try again.";
      } else if (err.response) {
        errorMsg = `Failed to load messages (Error ${err.response.status}). Please try again.`;
      }
      
      setError(errorMsg);
      // setIsAuthError(false); // Not needed

      try {
        toast({ title: "Loading Error", description: errorMsg, variant: "destructive" });
      } catch (toastErr) {
        console.error("MessagesPage: Error displaying toast:", toastErr);
      }
    } finally {
      console.log("MessagesPage: fetchData finally block, setting isLoading to false (AUTH DISABLED).");
      setIsLoading(false);
    }
  }, [groupMessagesIntoConversations]); // conversations and selectedConversation removed from deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        if (selectedConversation) {
          setMobileSidebarOpen(false);
        } else {
          setMobileSidebarOpen(true);
        }
      } else {
        setMobileSidebarOpen(true); 
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation && !userHasScrolledUp && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages?.length, userHasScrolledUp, selectedConversation]);

  const handleSelectConversation = useCallback(async (conversation) => {
    setUserHasScrolledUp(false); 
    setShowNewMessageIndicator(false);
    setSelectedConversation(conversation);

    if (isMobile) {
      setMobileSidebarOpen(false); 
    }

    // Temporarily disable marking messages as read, as it depends on currentUser
    if (currentUser && currentUser.id !== MOCK_CURRENT_USER.id && conversation.unreadCount > 0) {
      // This block will effectively be skipped with the mock user if its ID is different
      // Or, remove this entire if-block if we don't want any read-marking logic for now.
      console.log("Skipping mark as read with mock user or no unread messages.");
    } else if (currentUser.id === MOCK_CURRENT_USER.id && conversation.unreadCount > 0) {
      // If we want mock user to "read" messages (for UI testing)
      const unreadMessageIdsToUpdate = conversation.messages
        .filter(msg => msg.senderId !== currentUser.id && !msg.read)
        .map(msg => msg.id);
      
      try {
        // This MessageRecord.update might fail if the mock user doesn't have permissions
        // For now, we'll assume it works or we can temporarily comment it out.
        /*
        for (const msgId of unreadMessageIdsToUpdate) {
          await MessageRecord.update(msgId, { read_by_recipient: true });
        }
        */
        console.log("Mock user 'reading' messages. API update skipped for now.", unreadMessageIdsToUpdate);

        const updatedMessages = allMessages.map(msg => {
          if (unreadMessageIdsToUpdate.includes(msg.id)) {
            return { ...msg, read_by_recipient: true };
          }
          return msg;
        });
        setAllMessages(updatedMessages);
        const updatedGroupedConversations = groupMessagesIntoConversations(updatedMessages, currentUser.id);
        setConversations(updatedGroupedConversations);
        
        const newlySelectedConvo = updatedGroupedConversations.find(c => c.id === conversation.id);
        if (newlySelectedConvo) {
            setSelectedConversation(newlySelectedConvo);
        }
      } catch (readErr) {
        console.error("Error marking messages as read (mock user):", readErr);
        toast({ title: "Error", description: "Could not mark messages as read (mock).", variant: "destructive" });
      }
    }
    
    setTimeout(() => composerRef.current?.focus(), 300);
  }, [currentUser, isMobile, allMessages, groupMessagesIntoConversations]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return; // currentUser will be MOCK_CURRENT_USER
    setIsSending(true);
    const recipient = selectedConversation.participant;
    const conversationId = selectedConversation.id; 

    try {
      const newMsgPayload = {
        conversation_id: conversationId,
        sender_id: currentUser.id, // MOCK_CURRENT_USER.id
        sender_name: currentUser.full_name, // MOCK_CURRENT_USER.full_name
        sender_type: currentUser.user_type, // MOCK_CURRENT_USER.user_type
        recipient_id: recipient.id,
        recipient_name: recipient.name,
        recipient_type: recipient.role === 'Student Applicant' ? 'student' : (recipient.role || 'student'),
        message: newMessage.trim(),
        read_by_recipient: false, 
        status: 'responded', 
      };
      const createdMessage = await MessageRecord.create(newMsgPayload);

      const newListOfAllMessages = [...allMessages, createdMessage];
      setAllMessages(newListOfAllMessages);
      const updatedGrouped = groupMessagesIntoConversations(newListOfAllMessages, currentUser.id);
      setConversations(updatedGrouped);

      const currentConvoInUpdatedList = updatedGrouped.find(c => c.id === conversationId);
      if (currentConvoInUpdatedList) {
        setSelectedConversation(currentConvoInUpdatedList);
      }
      
      setNewMessage('');
      setUserHasScrolledUp(false); 
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      setTimeout(() => composerRef.current?.focus(), 200);

    } catch (sendError) {
      console.error("Error sending message (AUTH DISABLED):", sendError);
      toast({ title: "Send Error", description: "Could not send message.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  }, [newMessage, selectedConversation, currentUser, allMessages, groupMessagesIntoConversations]);
  
  const filterConversationLogic = useCallback((conversation) => {
    if (activeMainTab === "applications" && !conversation.isApplication) {
      return false;
    }

    const statusMatch = 
      (viewFilter === "unread" && conversation.unread && !conversation.archived) ||
      (viewFilter === "archived" && conversation.archived) ||
      (viewFilter === "all" && !conversation.archived); 
    
    if (!statusMatch) return false;

    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = conversation.participant.name?.toLowerCase().includes(searchLower);
    const roleMatch = conversation.participant.role?.toLowerCase().includes(searchLower);
    const messageMatch = conversation.lastMessage?.toLowerCase().includes(searchLower) || 
                         conversation.messages.some(m => m.text?.toLowerCase().includes(searchLower));
    return nameMatch || roleMatch || messageMatch;
  }, [activeMainTab, viewFilter, searchTerm]);
  
  const filteredConversations = conversations.filter(filterConversationLogic);
  const unreadCount = conversations.filter(c => c.unread && !c.archived).length;
  const allCount = conversations.filter(c => !c.archived).length;
  const archivedCount = conversations.filter(c => c.archived).length;
  
  const handleScroll = useCallback(() => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      const isScrolledUp = scrollTop < scrollHeight - clientHeight - 100; 
      setUserHasScrolledUp(isScrolledUp);
      setShowScrollShadow(scrollTop > 10); 

      if (!isScrolledUp) {
        setShowNewMessageIndicator(false);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-gray-700">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <Card className="inline-block p-6 md:p-10 border-red-200 bg-red-50">
          <div className="text-red-500 mb-4 text-3xl">⚠️</div>
          <h2 className="text-xl font-semibold text-red-700 mb-3">Error Occurred</h2>
          <p className="mb-6 text-red-600">{error}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              onClick={fetchData}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
            >
              Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(createPageUrl("CompanyDashboard"))} 
              className="px-6 py-2 rounded-md"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate(createPageUrl("CompanyDashboard"))}
          className="mb-6 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md inline-flex items-center text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="h-[calc(100vh-200px)] flex flex-col shadow-lg relative z-10">
          <CardHeader className="border-b py-4 bg-white relative z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {isMobile && (
                  <Button
                    onClick={() => setMobileSidebarOpen(prev => !prev)}
                    className="mr-2 sm:hidden h-10 w-10 rounded-md text-gray-500 bg-transparent hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                    aria-label={mobileSidebarOpen ? "Close thread list" : "Open thread list"}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                <CardTitle className="text-2xl font-semibold text-gray-900">Company Inbox</CardTitle>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => toast({ title: "Feature Coming Soon", description: "Creating new conversations will be added shortly."})}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 h-9 rounded-md inline-flex items-center justify-center text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  <span className="hidden sm:inline mr-2 text-white">New Message</span> 
                  <Send className="h-4 w-4 text-white" /> 
                </Button>
              </div>
            </div>

            <Tabs 
              value={activeMainTab} 
              onValueChange={setActiveMainTab} 
              className="w-full mt-4"
            >
              <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="all_messages"
                  className="text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200/0"
                >
                  All Messages
                </TabsTrigger>
                <TabsTrigger 
                  value="applications"
                  className="text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200/0"
                >
                  Applications
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <div className="flex flex-1 overflow-hidden relative">
            <aside 
              className={`
                ${isMobile ? (mobileSidebarOpen ? 'block w-full md:w-1/3' : 'hidden md:block md:w-1/3') : 'w-1/3'} 
                border-r border-gray-200 flex flex-col bg-white relative z-10 
              `} 
              aria-label="Message threads"
            >
              <div className="p-4 border-b border-gray-200 space-y-3 bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    aria-label="Search messages"
                  />
                </div>
                
                <Tabs 
                  value={viewFilter} 
                  onValueChange={setViewFilter} 
                  className="w-full"
                >
                  <TabsList className="w-full grid grid-cols-3 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger value="unread" className="text-xs sm:text-sm px-2 py-1.5 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200/0">
                      Unread ({unreadCount})
                    </TabsTrigger>
                    <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-1.5 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200/0">
                      All ({allCount})
                    </TabsTrigger>
                    <TabsTrigger value="archived" className="text-xs sm:text-sm px-2 py-1.5 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200/0">
                      Archived ({archivedCount})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 overflow-y-auto bg-white">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                    <Inbox className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-base">No {activeMainTab === "applications" ? "applications" : "conversations"} found {searchTerm ? "for your search." : (viewFilter !== "all" ? `in '${viewFilter}'.` : ".")}</p>
                  </div>
                ) : (
                  filteredConversations.map(convo => (
                    <div
                      key={convo.id}
                      className={`
                        p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 relative
                        ${selectedConversation?.id === convo.id 
                          ? 'bg-blue-50 border-l-4 border-l-blue-600'
                          : 'border-l-4 border-l-transparent hover:bg-gray-50 hover:border-l-gray-300'
                        } 
                        ${convo.unread ? 'bg-gray-50' : 'bg-white'}
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset
                      `}
                      onClick={() => handleSelectConversation(convo)}
                      role="button"
                      tabIndex="0"
                      onKeyDown={(e) => e.key === 'Enter' && handleSelectConversation(convo)}
                      aria-selected={selectedConversation?.id === convo.id}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <Avatar name={convo.participant.name} src={convo.participant.avatarUrl || undefined} size="md" className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                              {convo.participant.avatarFallback}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1 space-y-1">
                            <h3 className={`text-sm font-semibold truncate ${
                              selectedConversation?.id === convo.id ? 'text-blue-700' : 
                              convo.unread ? 'text-gray-900' : 'text-gray-800'
                            }`}>
                              {convo.participant.name}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">
                              {convo.participant.role || 'Applicant'}
                            </p>
                            {activeMainTab === "applications" && convo.highestApplicationStatus && (
                              <Badge variant={
                                convo.highestApplicationStatus === 'hired' ? 'success' :
                                convo.highestApplicationStatus === 'interview_scheduled' ? 'primary' :
                                convo.highestApplicationStatus === 'responded' ? 'default' :
                                convo.highestApplicationStatus === 'application_pending' ? 'secondary' :
                                'warning'
                              } className="mt-1 text-[10px] px-2 py-0.5">
                                {convo.highestApplicationStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-1 ml-2 flex-shrink-0">
                          {convo.unread && convo.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white px-1.5 py-0.5 text-[10px] font-medium min-w-[18px] h-[18px] flex items-center justify-center rounded-full"> 
                              {convo.unreadCount}
                            </Badge>
                          )}
                          <span className={`text-xs font-medium ${
                            selectedConversation?.id === convo.id ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {convo.timestamp}
                          </span>
                        </div>
                      </div>
                      <div className={`mt-2 text-xs leading-normal pl-13 pr-2 ${
                        selectedConversation?.id === convo.id ? 'text-gray-700' : 'text-gray-600'
                      } line-clamp-2`}>
                        {convo.lastMessage}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>

            <main 
              role="region"
              aria-labelledby="conversation-partner-name"
              className={`${
                isMobile && mobileSidebarOpen ? 'hidden md:flex md:flex-col' : 'flex flex-col'
              } ${
                isMobile ? 'w-full' : 'w-2/3 md:w-2/3'
              } bg-gray-50 relative z-0`}
              aria-live="polite"
            >
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200 bg-white relative z-20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isMobile && (
                          <Button
                            onClick={() => setMobileSidebarOpen(true)}
                            className="mr-2 sm:hidden h-9 w-9 p-0 rounded-md text-gray-500 bg-transparent hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                            aria-label="Back to thread list"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                        )}
                        <Avatar name={selectedConversation.participant.name} src={selectedConversation.participant.avatarUrl || undefined} size="md" className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                            {selectedConversation.participant.avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h2 id="conversation-partner-name" className="text-base font-semibold text-gray-900 truncate">
                            {selectedConversation.participant.name}
                          </h2>
                          <p className="text-xs text-gray-500 truncate"> 
                            {selectedConversation.participant.role || 'Applicant'}
                            {selectedConversation.participant.graduationYear && ` | Grad: ${selectedConversation.participant.graduationYear}`}
                          </p>
                          {selectedConversation.participant.location && (
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{selectedConversation.participant.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50 relative message-pane"
                    ref={messageListRef}
                    onScroll={handleScroll}
                    role="log"
                    aria-label={`Messages with ${selectedConversation.participant.name}`}
                  >
                    {selectedConversation.messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-lg shadow-sm relative z-10 chat-bubble
                          ${msg.sender === 'You' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border border-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                          <div className={`flex items-center mt-2 text-[11px] ${
                            msg.sender === 'You' ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            <span className="font-medium">{msg.time}</span>
                            {msg.sender === 'You' && msg.read && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CheckCircle className="h-3 w-3 ml-2 text-blue-200"/>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs p-2 bg-gray-900 text-white rounded">
                                  Read
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {msg.sender === 'You' && !msg.read && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Clock className="h-3 w-3 ml-2 text-blue-200 opacity-70"/>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs p-2 bg-gray-900 text-white rounded">
                                  Sent
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                    
                    {showNewMessageIndicator && (
                      <div 
                        className="sticky bottom-4 left-1/2 transform -translate-x-1/2 z-30 cursor-pointer"
                        onClick={() => {
                          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                          setUserHasScrolledUp(false);
                          setShowNewMessageIndicator(false);
                        }}
                      >
                        <Button
                          variant="outline"
                          className="bg-white hover:bg-gray-50 text-blue-600 border-blue-300 shadow-lg rounded-full text-xs h-8 px-4 transition-all duration-200"
                        >
                          <ChevronDown className="h-3 w-3 mr-1" />
                          New Messages
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-white relative z-20">
                    <div className="flex-1 bg-gray-50 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
                      <Textarea
                        ref={composerRef}
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[60px] max-h-[140px] resize-none border-0 bg-transparent focus:ring-0 p-3 text-sm"
                        onKeyDown={(e) => { 
                          if (e.key === 'Enter' && !e.shiftKey) { 
                            e.preventDefault(); 
                            handleSendMessage();
                          }
                        }}
                        aria-label="Message composer"
                      />
                      <div className="p-3 flex items-center justify-between border-t border-gray-200">
                        <div className="flex gap-2">
                          
                        </div>
                        <Button
                          onClick={handleSendMessage}
                          disabled={isSending || !newMessage.trim()}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 h-9 rounded-md text-sm inline-flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        >
                          {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                          ) : (
                            <Send className="h-4 w-4 text-white" />
                          )}
                          <span className="ml-2 hidden sm:inline text-white">Send</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                  <Inbox className="h-24 w-24 text-gray-300 mb-6" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the sidebar to view messages</p>
                  {conversations.length === 0 && !isLoading && (
                    <p className="text-sm text-gray-400 mt-2">You have no messages yet.</p>
                  )}
                </div>
              )}
            </main>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
}
