
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { NetworkPost } from '@/api/entities';
import { User } from '@/api/entities';
import { 
  ArrowLeft, 
  Users, 
  Network, 
  Globe, 
  UserPlus, 
  CheckCircle2, 
  Circle, 
  ArrowUpCircle,
  Send,
  Award,
  Star,
  Zap,
  MessageCircle,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import EmojiPicker from '../components/network/EmojiPicker';
import PostBoostBadge from '../components/network/PostBoostBadge';

export default function GatorNation() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [connectionsMade, setConnectionsMade] = useState(127);
  const [userPoints, setUserPoints] = useState(50);
  const [successStory, setSuccessStory] = useState({
    text: "Aisha Patel connected with a Pre-Med mentor in Tampa!",
    emoji: "🎉"
  });
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replyTexts, setReplyTexts] = useState({});
  const [boostedPosts, setBoostedPosts] = useState({});
  const navigate = useNavigate();

  const topConnectors = [
    { name: "Jane Doe", type: "Alumni", points: 25 },
    { name: "Mike Smith", type: "Parent", points: 20 },
    { name: "Sarah Lee", type: "Alumni", points: 15 }
  ];

  // Sample replies data
  const [postReplies, setPostReplies] = useState({
    '1': [
      { id: '101', content: 'I work at Google in SF and can connect you! 🚀', author: 'John D.', likes: 5, date: '2023-05-02' },
      { id: '102', content: 'Know someone at Twitter, let me know if interested! 🤝', author: 'Jane S.', likes: 3, date: '2023-05-02' }
    ],
    '2': [
      { id: '103', content: "I'm in marketing at Coca-Cola, happy to help! ⭐", author: 'Mike P.', likes: 4, date: '2023-05-04' }
    ]
  });

  useEffect(() => {
    loadPosts();
    checkUser();
  }, []);

  const loadPosts = async () => {
    const fetchedPosts = await NetworkPost.list();
    setPosts(fetchedPosts);
  };

  const checkUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.log('User not logged in');
    }
  };

  // Convert emoji shortcodes to actual emojis
  const convertEmojis = (text) => {
    const emojiMap = {
      ':smile:': '😊',
      ':heart:': '❤️',
      ':rocket:': '🚀',
      ':handshake:': '🤝',
      ':star:': '⭐',
      ':fire:': '🔥',
      ':tada:': '🎉',
      ':thumbsup:': '👍',
      ':gator:': '🐊',
      ':blue:': '💙',
      ':orange:': '🧡'
    };
    
    return text.replace(/:[\w-]+:/g, match => emojiMap[match] || match);
  };

  // Get trending posts (posts with most replies)
  const getTrendingPosts = () => {
    // Create objects with post and reply count
    const postsWithReplyCounts = posts.map(post => ({
      post,
      replyCount: (postReplies[post.id] || []).length,
      // Add boosted status to the calculation
      boostScore: boostedPosts[post.id] ? 2 : 0
    }));
    
    // Sort by engagement score (replies + boost)
    return postsWithReplyCounts
      .sort((a, b) => (b.replyCount + b.boostScore) - (a.replyCount + a.boostScore))
      .slice(0, 2)
      .map(item => item.post);
  };

  const handleEmojiSelect = (emoji) => {
    setNewPost(prev => prev + emoji);
  };

  const handleReplyEmojiSelect = (postId, emoji) => {
    setReplyTexts(prev => ({
      ...prev,
      [postId]: (prev[postId] || '') + emoji
    }));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      // Redirect to register if not logged in
      navigate(createPageUrl("Register"));
      return;
    }

    if (!newPost.trim()) return;

    try {
      const processedPost = convertEmojis(newPost);
      
      await NetworkPost.create({
        title: "Connection Request",
        content: processedPost,
        category: "networking",
        user_id: currentUser?.id || "guest",
        status: "open"
      });

      // Update stats for gamification
      setConnectionsMade(prev => prev + 1);
      setUserPoints(prev => prev + 5);

      setNewPost('');
      loadPosts(); // Reload posts to show the new one
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const toggleReply = (postId) => {
    if (!currentUser) {
      // Redirect to register if not logged in
      navigate(createPageUrl("Register"));
      return;
    }

    setExpandedReplies(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleReplyChange = (postId, value) => {
    setReplyTexts(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const submitReply = (postId) => {
    if (!currentUser) {
      // Redirect to register if not logged in
      navigate(createPageUrl("Register"));
      return;
    }

    const replyText = replyTexts[postId]?.trim();
    if (!replyText) return;

    // Process emojis in the reply text
    const processedReply = convertEmojis(replyText);

    // In a real app, you would save this reply to the backend
    const newReply = {
      id: `reply-${Date.now()}`,
      content: processedReply,
      author: currentUser?.full_name || 'Anonymous Gator',
      likes: 0,
      date: new Date().toISOString().split('T')[0]
    };

    setPostReplies(prevReplies => ({
      ...prevReplies,
      [postId]: [...(prevReplies[postId] || []), newReply]
    }));

    // Clear the reply text
    setReplyTexts(prevTexts => ({
      ...prevTexts,
      [postId]: ''
    }));

    // Update user points
    setUserPoints(prevPoints => prevPoints + 10);
    
    // Extra points for responding to a boosted post
    if (!postReplies[postId] || postReplies[postId].length === 0) {
      setUserPoints(prevPoints => prevPoints + 5); // Extra 5 points for first reply
    }
  };

  const handleLike = (postId, replyId) => {
    if (!currentUser) {
      // Redirect to register if not logged in
      navigate(createPageUrl("Register"));
      return;
    }

    setPostReplies(prevReplies => {
      const updatedReplies = { ...prevReplies };
      const replyIndex = updatedReplies[postId]?.findIndex(r => r.id === replyId);
      
      if (replyIndex !== undefined && replyIndex >= 0) {
        updatedReplies[postId][replyIndex] = {
          ...updatedReplies[postId][replyIndex],
          likes: updatedReplies[postId][replyIndex].likes + 1
        };
      }
      
      return updatedReplies;
    });
  };

  const handleBoostPost = (postId) => {
    if (!currentUser) {
      navigate(createPageUrl("Register"));
      return;
    }

    setBoostedPosts(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }));

    // Give points for boosting
    setUserPoints(prev => prev + 3);

    // Log analytics (in a real app, send to backend)
    console.log(`Post ${postId} boosted by ${currentUser.id || 'unknown user'}`);
  };

  const renderPostForm = () => {
    if (!currentUser) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center mb-6">
          <p className="text-yellow-800 font-medium mb-2">
            Sign up or log in to post requests and connect with fellow Gators!
          </p>
          <Button 
            asChild
            className="bg-[#0021A5] hover:bg-[#0047D6]"
          >
            <Link to={createPageUrl("Register")}>
              Join Now
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handlePostSubmit} className="mb-6">
        <div className="relative">
          <Textarea
            placeholder="Ask for a connection (e.g., Looking for a software engineering internship in San Francisco. Any Gator alumni at tech companies there?)"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="mb-1 pr-12"
            rows={4}
          />
          <div className="absolute bottom-3 right-3">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-4">
          <p>Tip: Use emoji shortcodes like <span className="font-mono bg-gray-100 p-0.5 rounded">:smile:</span> for 😊 or <span className="font-mono bg-gray-100 p-0.5 rounded">:gator:</span> for 🐊</p>
        </div>
        <Button 
          type="submit" 
          className="bg-[#0021A5] hover:bg-[#0047D6]"
        >
          <Send className="w-4 h-4 mr-2" />
          Post Request
        </Button>
      </form>
    );
  };

  // Trending posts section at the top
  const renderTrendingPosts = () => {
    const trendingPosts = getTrendingPosts();
    
    if (trendingPosts.length === 0) {
      return null;
    }
    
    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-bold text-lg mb-2 text-[#0021A5] flex items-center">
          <Flame className="h-5 w-5 mr-2 text-orange-500" /> 
          Trending Posts
        </h4>
        <div className="space-y-3">
          {trendingPosts.map(post => (
            <div key={`trending-${post.id}`} className="p-3 bg-white rounded-md border-l-4 border-orange-400">
              <p className="text-gray-800">{post.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                <span>{new Date(post.created_date).toLocaleDateString()}</span>
                <span className="text-orange-500 font-medium">
                  {(postReplies[post.id] || []).length} replies
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          to={createPageUrl("Home")}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Back to Home
        </Link>

        {/* Enhanced Header Section */}
        <div className="relative mb-12 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0021A5] to-[#FA4616] opacity-90"></div>
          <div className="relative z-10 text-center py-16 px-4">
            <h1 className="text-5xl font-bold mb-4 text-white">
              Six Degrees of Gator Nation
            </h1>
            <p className="text-2xl font-semibold text-yellow-300 mb-6">
              A Connection Can Change a Life!
            </p>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Connect with the vibrant Gator community and discover how we're all connected through the power of our network.
            </p>
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg py-3 px-6 inline-block">
              <p className="text-white font-medium">
                No Other Platform Connects Gators Like This!
              </p>
            </div>
          </div>
          
          {/* Animated Connection Lines */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full opacity-20">
              <circle cx="20%" cy="30%" r="2" fill="white">
                <animate attributeName="cx" from="20%" to="80%" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="80%" cy="70%" r="2" fill="white">
                <animate attributeName="cx" from="80%" to="20%" dur="3s" repeatCount="indefinite" />
              </circle>
              <line x1="20%" y1="30%" x2="80%" y2="70%" stroke="white" strokeWidth="1">
                <animate attributeName="x1" from="20%" to="80%" dur="3s" repeatCount="indefinite" />
                <animate attributeName="x2" from="80%" to="20%" dur="3s" repeatCount="indefinite" />
              </line>
            </svg>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border-t-4 border-[#0021A5]">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="bg-blue-50 rounded-full p-6 flex-shrink-0">
                  <Network className="h-12 w-12 text-[#0021A5]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3">The Power of Connection</h2>
                  <p className="text-gray-700">
                    The theory of Six Degrees of Separation suggests that everyone is six or fewer social connections away from each other. In the Gator Nation, that number is even smaller! Our community platform helps you discover and leverage those connections.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
                  <Users className="h-8 w-8 text-[#0021A5] mb-3 animate-pulse" />
                  <h3 className="font-semibold text-xl mb-2">Find Your Network</h3>
                  <p className="text-gray-600">Discover alumni, students, and parents in your field or region.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
                  <Globe className="h-8 w-8 text-[#0021A5] mb-3 animate-pulse" />
                  <h3 className="font-semibold text-xl mb-2">Global Community</h3>
                  <p className="text-gray-600">Connect with Gators around the world who share your interests.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
                  <UserPlus className="h-8 w-8 text-[#0021A5] mb-3 animate-pulse" />
                  <h3 className="font-semibold text-xl mb-2">Grow Together</h3>
                  <p className="text-gray-600">Expand your professional network while supporting fellow Gators.</p>
                </div>
              </div>
            </div>
            
            {/* Who Do You Know Message Board */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-[#0021A5]">
              <h3 className="text-2xl font-bold mb-6 text-[#0021A5]">Who Do You Know? - Help a Gator Today!</h3>
              
              {/* Stats and Success Ticker */}
              <div className="flex flex-wrap justify-between mb-6 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-[#0021A5] mr-2" />
                  <span className="font-semibold">Connections Made This Week: <span className="text-[#0021A5] font-bold">{connectionsMade}</span></span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-[#0021A5] mr-2" />
                  <span className="font-semibold">Your Gator Points: <span className="text-[#0021A5] font-bold">{userPoints}</span></span>
                </div>
              </div>
              
              {/* Success Story Ticker */}
              <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 py-3 px-4 rounded-lg mb-6 overflow-hidden whitespace-nowrap">
                <div className="animate-marquee inline-block">
                  {successStory.emoji} Success Story: {successStory.text} {successStory.emoji}
                </div>
              </div>
              
              {renderPostForm()}
              
              {/* Trending Posts Section */}
              {renderTrendingPosts()}
              
              {/* Leaderboard */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-bold text-lg mb-2 text-[#0021A5] flex items-center">
                  <Star className="h-5 w-5 mr-2" /> 
                  Top Connectors This Month
                </h4>
                <ul className="space-y-2">
                  {topConnectors.map((connector, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{connector.name} ({connector.type})</span>
                      <span className="font-bold">{connector.points} points</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Posts with Enhanced Reply System */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md border-l-4 border-[#0021A5] relative"
                  >
                    <p className="text-gray-800 mb-3">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>Posted {new Date(post.created_date).toLocaleDateString()}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleReply(post.id)}
                        className="flex items-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Reply
                        {expandedReplies[post.id] ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Reply section */}
                    {expandedReplies[post.id] && (
                      <div className="mt-3 pl-4 border-l-2 border-dashed border-blue-300">
                        {/* Existing replies */}
                        {postReplies[post.id]?.map((reply) => (
                          <div key={reply.id} className="bg-blue-50 p-3 rounded-md mb-2">
                            <p className="text-gray-800 mb-1">{reply.content}</p>
                            <div className="flex justify-between text-xs text-gray-500 items-center">
                              <div>
                                <span className="font-medium">{reply.author}</span> • {new Date(reply.date).toLocaleDateString()}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 p-1 flex items-center gap-1 text-blue-600"
                                onClick={() => handleLike(post.id, reply.id)}
                              >
                                <ThumbsUp className="w-3 h-3" /> 
                                <span>{reply.likes}</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {/* Reply form */}
                        <div className="mt-2">
                          <div className="relative">
                            <Textarea
                              placeholder="Write a reply... (use :smile: for 😊, :rocket: for 🚀, etc.)"
                              value={replyTexts[post.id] || ''}
                              onChange={(e) => handleReplyChange(post.id, e.target.value)}
                              className="mb-2 text-sm pr-10"
                              rows={2}
                            />
                            <div className="absolute bottom-3 right-2">
                              <EmojiPicker onEmojiSelect={(emoji) => handleReplyEmojiSelect(post.id, emoji)} />
                            </div>
                          </div>
                          <Button 
                            className="bg-[#0021A5] hover:bg-[#0047D6] text-xs py-1 h-8"
                            onClick={() => submitReply(post.id)}
                          >
                            Submit Reply
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Nudge for posts with no replies */}
                    {(!postReplies[post.id] || postReplies[post.id].length === 0) && (
                      <PostBoostBadge onBoost={() => handleBoostPost(post.id)} />
                    )}
                    
                    {post.id % 2 === 0 && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Alumni Helper
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Recent Connections</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Connected with 3 alumni in Marketing</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-medium">Michael Chen</p>
                    <p className="text-sm text-gray-500">Found a mentor in Software Engineering</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-medium">Aisha Patel</p>
                    <p className="text-sm text-gray-500">Joined the Pre-Med student group</p>
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-bold mb-4 mt-8">Featured Groups</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-[#0021A5] font-medium">CS</span>
                  </div>
                  <div>
                    <p className="font-medium">Computer Science</p>
                    <p className="text-sm text-gray-500">450+ members</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-[#E63900] font-medium">BUS</span>
                  </div>
                  <div>
                    <p className="font-medium">Business Network</p>
                    <p className="text-sm text-gray-500">780+ members</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-teal-700 font-medium">ENG</span>
                  </div>
                  <div>
                    <p className="font-medium">Engineering Professionals</p>
                    <p className="text-sm text-gray-500">620+ members</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#0021A5]/10 to-[#FA4616]/10 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Connect?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of Gators who are expanding their networks and finding opportunities through the Six Degrees of Gator Nation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              asChild
              className="bg-[#0021A5] hover:bg-[#0047D6]"
            >
              <Link to={createPageUrl("Register")}>
                Create Account
              </Link>
            </Button>
            <Button 
              variant="outline"
              asChild
            >
              <Link to={createPageUrl("HowItWorks")}>
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
