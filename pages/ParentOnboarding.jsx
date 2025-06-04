
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'; // Added Loader2
import { createPageUrl } from "@/utils";
import { User } from '@/api/entities';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';

export default function ParentOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true); // For initial auth check
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    graduationYear: '', // This will hold student's graduation year
    receiveNewsletter: false,
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const userData = await User.me();
      if (userData) {
        setFormData(prev => ({
          ...prev,
          fullName: userData.full_name || '',
          email: userData.email || '',
          // Pre-fill parent-specific data if it exists
          graduationYear: userData.studentGraduationYear ? String(userData.studentGraduationYear) : '',
          receiveNewsletter: userData.receiveNewsletter || false,
        }));
        // If user_type is already 'parent' and they've set a graduation year, maybe they are done?
        // For now, let them proceed through the form to confirm/update.
      }
    } catch (error) {
      console.log("User not authenticated yet or error fetching user data:", error);
      // If not authenticated, they might be redirected by a global auth handler or User.login()
      // This page assumes they will become authenticated to submit data.
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must include at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must include at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must include at least one number";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must include at least one special character (!@#$%^&*)";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (name === 'password') {
      setPasswordError(validatePassword(value));
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setConfirmPasswordError("Passwords don't match");
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        setConfirmPasswordError("");
      }
    }
    
    if (name === 'confirmPassword') {
      if (value === formData.password) {
        setConfirmPasswordError("");
      } else {
        setConfirmPasswordError("Passwords don't match");
      }
    }
  };
  
  // Specific handler for ShadCN Select and Checkbox components
  const handleValueChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const isFormValid = () => {
    if (currentStep === 1) {
      const isPasswordRequired = !User.me(); // Only require password if user is not yet fully authenticated/created.
                                            // This is a simplification; actual new user creation is handled by base44 auth.
                                            // For an update, password fields are not strictly necessary for validation.
      
      const passwordFieldsValid = isPasswordRequired ? 
        (formData.password.trim() !== '' && passwordError === '' &&
         formData.confirmPassword.trim() !== '' && formData.password === formData.confirmPassword)
        : true;

      return (
        formData.fullName.trim() !== '' &&
        formData.email.trim() !== '' &&
        formData.email.includes('@') &&
        passwordFieldsValid
      );
    } else if (currentStep === 2) {
      return formData.graduationYear && formData.agreeToTerms;
    }
    return true;
  };

  const handleNext = async () => {
    if (!isFormValid()) {
      let errorFields = [];
      if (currentStep === 1) {
        if (!formData.fullName.trim()) errorFields.push("Full Name");
        if (!formData.email.trim() || !formData.email.includes('@')) errorFields.push("Valid Email");
        // Password validation messages are shown inline
      }
      if (currentStep === 2) {
        if (!formData.graduationYear) errorFields.push("Student's Graduation Year");
        if (!formData.agreeToTerms) errorFields.push("Agreement to Terms");
      }

      toast({
        title: "Missing Information",
        description: `Please complete all required fields${errorFields.length > 0 ? ': ' + errorFields.join(', ') : ''}.`,
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step: Save data
      setIsSubmitting(true);
      try {
        // Ensure user is authenticated before trying to update
        // User.me() will throw if not, but good to be explicit or rely on global auth.
        // For this page, we assume checkAuth() has run or user is proceeding after login.

        const updateData = {
          full_name: formData.fullName,
          studentGraduationYear: parseInt(formData.graduationYear),
          receiveNewsletter: formData.receiveNewsletter,
          user_type: 'parent'
          // We are not updating email or password here as User.updateMyUserData is for profile data.
          // Email is typically fixed after registration, password changes have separate flows.
        };
        
        await User.updateMyUserData(updateData);
        
        toast({
          title: "Profile Updated!",
          description: "Your parent profile information has been saved.",
        });
        
        localStorage.setItem('user_type', 'parent'); // Keep this for immediate UI updates in layout
        localStorage.setItem('onboardingComplete', 'true'); // Mark onboarding as complete for this role

        navigate(createPageUrl("ParentDashboard"));

      } catch (error) {
        console.error("Error updating user data:", error);
        toast({
          title: "Update Failed",
          description: "Could not save your profile information. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      // Consider where to navigate if they go back from step 1.
      // If they came from OnboardingRole, maybe back there?
      // For now, navigating to Home or a generic pre-login page.
      navigate(createPageUrl("Home")); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between mb-8">
          {[1, 2].map(step => (
            <div 
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                step <= currentStep ? 'bg-[#0021A5] text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-blue-900">Welcome, Parent!</h2>
                  <p className="text-gray-600">
                    Let's set up your account.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Your Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your Full Name"
                      className="w-full"
                      required
                      aria-required="true"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="w-full"
                      required
                      aria-required="true"
                      // Email is often not editable post-registration without a verification flow
                      // disabled={!!(await User.me().catch(() => null))?.email} 
                    />
                  </div>
                  
                  {/* Password fields are more for initial signup. If user is already logged in,
                      this section might be hidden or changed to "Change Password" functionality.
                      For now, keeping UI as is, but not sending password to User.updateMyUserData. */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Create Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a secure password"
                        className="w-full pr-10"
                        // required // Only truly required if it's an initial account creation step
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {passwordError}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be 8+ characters with uppercase, lowercase, number, & special character.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className="w-full pr-10"
                        // required // Matching above
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {confirmPasswordError && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-blue-900">About Your Student</h2>
                  <p className="text-gray-600">This helps us tailor relevant information.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">When does your child graduate?</Label>
                    <Select
                      value={formData.graduationYear}
                      onValueChange={(value) => handleValueChange('graduationYear', value)}
                      // required // Validation handled in isFormValid
                    >
                      <SelectTrigger id="graduationYear" className="w-full" aria-required="true">
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null} disabled>Select a year</SelectItem>
                        {/* Generating a range of years */}
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 5 - i).map(year => (
                          <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="receiveNewsletter"
                      name="receiveNewsletter" // Added name for handleInputChange if it were used directly
                      checked={formData.receiveNewsletter}
                      onCheckedChange={(checked) => handleValueChange('receiveNewsletter', !!checked)}
                    />
                    <Label htmlFor="receiveNewsletter" className="text-sm text-gray-700 cursor-pointer">
                      Receive newsletters and updates?
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2 pt-4">
                    <Checkbox
                      id="agreeToTerms"
                      name="agreeToTerms" // Added name
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleValueChange('agreeToTerms', !!checked)}
                      // required // Validation handled in isFormValid
                      aria-required="true"
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm text-gray-700 cursor-pointer">
                      I agree to the <Link to={createPageUrl("Terms")} target="_blank" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to={createPageUrl("Privacy")} target="_blank" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                    </Label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              <Button
                type="submit"
                className="bg-[#0021A5] hover:bg-[#001A84] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  currentStep === 2 ? 'Complete Setup' : 'Next'
                )}
                {currentStep !== 2 && !isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
