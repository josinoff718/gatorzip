
import React, { useState, useCallback, useEffect } from 'react';
import { User as UserEntity } from '@/api/entities';
import { StudentProfile } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { safeApiCall } from "../components/utils/errorHandler";
import { 
  Upload, 
  ArrowRight,
  AlertCircle,
  Info,
  X,
  User,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";

export default function StudentOnboarding() {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    verificationMethod: 'email',
    location: '',
    quickIntro: '',
    photo: null,
    password: '',
    confirmPassword: '',
  });
  
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(50);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load form data from localStorage on component mount
    const storedData = localStorage.getItem('onboardingStep1Data');
    if (storedData) {
      setFormData(JSON.parse(storedData));
      // Set preview image if a photo was previously selected
      const storedFormData = JSON.parse(storedData);
      if (storedFormData.photo) {
          setPreviewImage(storedFormData.photo);
      }
    }
  }, []);

  // Set onboarding status flag on component mount
  useEffect(() => {
    localStorage.setItem('onboardingComplete', 'false');
    console.log('Setting onboardingComplete = false from StudentOnboarding');
    
    // Check if we have data for this user and auto-populate the form
    const loadPreviousData = async () => {
      try {
        const userData = await UserEntity.me();
        if (userData) {
          // Pre-populate form with any existing data
          setFormData(prev => ({
            ...prev,
            fullName: userData.full_name || prev.fullName,
            email: userData.email || prev.email,
            // Add any other fields that should be pre-populated
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadPreviousData();
    
    // Check if redirected from /profile
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'profile') {
      console.log('Redirected from /profile page');
    }
  }, []);

  const validateEmail = useCallback((email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@ufl\.edu$/;
    return email ? regex.test(email) : false;
  }, []);

  const validateStudentId = useCallback((id) => {
    const regex = /^\d{8}$/;
    return id ? regex.test(id) : false;
  }, []);

  const validatePassword = useCallback((password, email, studentId) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      return "Password must meet all requirements";
    }

    if (email && password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
      return "Password cannot contain your email";
    }

    if (studentId && password.includes(studentId)) {
      return "Password cannot contain your student ID";
    }

    return "";
  }, []);

  
  const handleSaveProgress = () => {
    localStorage.setItem('onboardingStep1Data', JSON.stringify(formData));
    toast({
      title: "Progress Saved",
      description: "You can continue later from where you left off.",
      duration: 3000,
    });
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validation logic
    let isValid = true;
    let errorMessage = '';
    
    if (name === 'email' && value) {
      isValid = validateEmail(value);
      errorMessage = isValid ? '' : 'Please enter a valid ufl.edu email address';
    }

    if (name === 'studentId' && value) {
      isValid = validateStudentId(value);
      errorMessage = isValid ? '' : 'Please enter a valid 8-digit student ID';
    }

    if (name === 'fullName' && !value.trim()) {
      isValid = false;
      errorMessage = 'Full name is required';
    }

    // Update errors state
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  }, [validateEmail, validateStudentId]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, photo: 'Photo must be less than 5MB' }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Please upload an image file' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, photo: file }));
      setErrors(prev => ({ ...prev, photo: '' }));
      setPreviewImage(URL.createObjectURL(file));
    }
  }, []);

  const skipPhoto = useCallback(() => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPreviewImage(null);
  }, []);

  const isFormValid = useCallback(() => {
    // Basic required field validation
    if (!formData.fullName.trim()) return false;

    // Verify either email or student ID based on verification method
    if (formData.verificationMethod === 'email') {
      if (!validateEmail(formData.email)) return false;
    } else if (formData.verificationMethod === 'studentId') {
      if (!validateStudentId(formData.studentId)) return false;
    }

    // Password validation
    if (!formData.password || !formData.confirmPassword) return false;
    if (formData.password !== formData.confirmPassword) return false;
    if (validatePassword(formData.password, formData.email, formData.studentId)) return false;

    return true;
  }, [formData, validateEmail, validateStudentId, validatePassword]);

  const handleNextStep = useCallback(() => {
    if (isFormValid()) {
      // Store the data without the File object
      const dataToStore = {
        ...formData,
        photo: formData.photo ? URL.createObjectURL(formData.photo) : null
      };
      
      localStorage.setItem('onboardingStep1Data', JSON.stringify(dataToStore));
      navigate(createPageUrl('StudentOnboardingStep2'));
    } else {
      // Mark all relevant fields as touched to show validation errors
      setTouched({
        fullName: true,
        email: formData.verificationMethod === 'email',
        studentId: formData.verificationMethod === 'studentId',
        password: true,
        confirmPassword: true
      });

      // Set specific errors
      const newErrors = {};
      
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      if (formData.verificationMethod === 'email' && !validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid ufl.edu email address';
      }

      if (formData.verificationMethod === 'studentId' && !validateStudentId(formData.studentId)) {
        newErrors.studentId = 'Please enter a valid 8-digit student ID';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else {
        const passwordError = validatePassword(formData.password, formData.email, formData.studentId);
        if (passwordError) {
          newErrors.password = passwordError;
        }
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      setErrors(newErrors);
    }
  }, [formData, isFormValid, navigate, validateEmail, validateStudentId, validatePassword]);

  const handleVerificationMethodChange = useCallback((value) => {
    setFormData(prev => ({
      ...prev,
      verificationMethod: value,
      // Clear both fields when switching to ensure only one is filled
      email: value === 'email' ? prev.email : '',
      studentId: value === 'studentId' ? prev.studentId : ''
    }));
    
    // Clear errors for both fields
    setErrors(prev => ({
      ...prev,
      email: '',
      studentId: ''
    }));
    
    // Reset touched state for both fields
    setTouched(prev => ({
      ...prev,
      email: false,
      studentId: false
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation logic here...
    
    setIsSubmitting(true);
    
    try {
      // Get current user
      let userData = null;
      
      await safeApiCall(
        async () => {
          userData = await UserEntity.me();
          return userData;
        },
        {
          errorMessage: "Could not retrieve user data. Please try again.",
          maxRetries: 3, // Try up to 3 times
          onError: () => {
            setIsSubmitting(false);
          }
        }
      );
      
      if (!userData) {
        setIsSubmitting(false);
        return;
      }
      
      // Update user type
      await safeApiCall(
        async () => {
          await UserEntity.updateMyUserData({ user_type: "student" });
        },
        {
          errorMessage: "Could not update user profile. Please try again.",
          onError: () => {
            setIsSubmitting(false);
          }
        }
      );
      
      // Create student profile
      await safeApiCall(
        async () => {
          await StudentProfile.create({
            user_id: userData.id,
            // major: formData.major,
            // graduation_year: parseInt(formData.graduation_year),
            // ... other fields ...
          });
        },
        {
          successMessage: "Profile created successfully!",
          errorMessage: "Could not create student profile. Please try again.",
          onError: () => {
            setIsSubmitting(false);
          },
          onSuccess: () => {
            // Redirect to next step or dashboard
            navigate(createPageUrl("StudentOnboardingStep2"));
          }
        }
      );
    } catch (err) {
      console.error("Signup error:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 font-display">
            Welcome to College Fast Forward
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's set up your profile to connect you with opportunities that match your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Progress Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Student Onboarding: Step 1 of 2
              </h2>
              <Progress value={progress} className="h-2 mb-2" />
              <p className="text-sm text-gray-500 text-right">{progress}% Complete</p>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-end mb-6">
                <Button
                  variant="ghost" 
                  onClick={handleSaveProgress}
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Save Progress
                </Button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

              {/* Full Name */}
              <div className="mb-6">
                <Label htmlFor="fullName" className="required">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName && touched.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && touched.fullName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Verification Method */}
              <div className="mb-6">
                <div className="mb-4">
                  <Label className="text-base font-semibold">
                    Verification Method (Choose 1 option)
                  </Label>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Choose how you want to verify your student status:</p>
                    <ul className="mt-1 space-y-1 text-sm text-gray-600">
                      <li>• UF Email: Fastest verification, instant access to all features</li>
                      <li>• Student ID: Manual verification within 24 hours</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  {/* UF Email Option */}
                  <div className="flex items-start space-x-2 rounded-lg border p-4">
                    <input
                      type="radio"
                      id="email-method"
                      name="verificationMethod"
                      value="email"
                      checked={formData.verificationMethod === 'email'}
                      onChange={(e) => handleVerificationMethodChange(e.target.value)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none w-full">
                      <Label htmlFor="email-method">UF Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="yourname@ufl.edu"
                        className={errors.email && touched.email ? 'border-red-500' : ''}
                        disabled={formData.verificationMethod !== 'email'}
                      />
                      <p className="text-sm text-gray-500">
                        Your University of Florida email will be used to verify your student status.
                      </p>
                      {errors.email && touched.email && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Student ID Option */}
                  <div className="flex items-start space-x-2 rounded-lg border p-4">
                    <input
                      type="radio"
                      id="studentId-method"
                      name="verificationMethod"
                      value="studentId"
                      checked={formData.verificationMethod === 'studentId'}
                      onChange={(e) => handleVerificationMethodChange(e.target.value)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none w-full">
                      <Label htmlFor="studentId-method">Student ID</Label>
                      <Input
                        id="studentId"
                        name="studentId"
                        type="text"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        placeholder="e.g., 12345678"
                        className={errors.studentId && touched.studentId ? 'border-red-500' : ''}
                        disabled={formData.verificationMethod !== 'studentId'}
                        maxLength={8}
                      />
                      <p className="text-sm text-gray-500">
                        Enter your 8-digit University of Florida student ID if you don't have a UF email.
                      </p>
                      {errors.studentId && touched.studentId && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.studentId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Section - Moved here */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-4 block">Set Password</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password" className="required">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password && touched.password ? 'border-red-500' : ''}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Password must be at least 8 characters long, include at least one uppercase letter, 
                      one lowercase letter, one number, and one special character (e.g., !@#$%^&*).
                    </p>
                    {errors.password && touched.password && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="required">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Miami, FL"
                />
              </div>

              {/* Quick Introduction */}
              <div className="mb-6">
                <Label htmlFor="quickIntro">Quick Introduction (Optional)</Label>
                <Textarea
                  id="quickIntro"
                  name="quickIntro"
                  value={formData.quickIntro}
                  onChange={handleInputChange}
                  placeholder="Share something brief about yourself, your interests, or what you hope to achieve."
                  className="h-24"
                />
              </div>

              {/* Profile Photo */}
              <div className="mb-6">
                <Label>Profile Photo (Optional)</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photo-upload').click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={skipPhoto}
                    >
                      Skip for now
                    </Button>
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {errors.photo && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.photo}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Upload a photo to help mentors and peers recognize you.
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={!isFormValid()}
                  className="bg-[#0021A5] hover:bg-[#001A84]"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mb-6 text-sm text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </div>
          </div>

          {/* Profile Preview Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-[#FA4616] p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-6">
                Profile Preview
              </h3>
              
              <div className="flex flex-col items-center">
                {/* Profile Photo */}
                <div className="mb-4">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#0021A5] flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <p className="font-semibold text-xl mb-2">
                  {formData.fullName || 'Your Name'} <span className="text-red-500">*</span>
                </p>

                {/* Verification Info */}
                {formData.email && validateEmail(formData.email) && (
                  <p className="text-gray-600 text-sm mb-4">
                    {formData.email}
                  </p>
                )}
                {formData.studentId && validateStudentId(formData.studentId) && (
                  <p className="text-gray-600 text-sm mb-4">
                    Student ID: {formData.studentId}
                  </p>
                )}

                {/* Location */}
                {formData.location && (
                  <p className="text-gray-500 text-sm mb-2">
                    {formData.location}
                  </p>
                )}

                {/* Quick Introduction */}
                {formData.quickIntro && (
                  <p className="text-gray-500 text-sm text-center mb-4">
                    {formData.quickIntro}
                  </p>
                )}

                {/* Required Fields Notice */}
                <p className="mt-4 text-xs text-gray-500">
                  Fields marked with <span className="text-red-500">*</span> are required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Onboarding?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel? Your progress will not be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Continue Editing
            </Button>
            <Button
              variant="destructive"
              onClick={() => navigate(createPageUrl('Home'))}
            >
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
