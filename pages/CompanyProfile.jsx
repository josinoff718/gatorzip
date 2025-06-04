
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { CompanyProfile as CompanyProfileEntity } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// Use the simplified Select and SelectItem that work with native select/option
import { Select, SelectItem } from '@/components/ui/select'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadFile } from '@/api/integrations'; 
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Building, Link as LinkIcon, UploadCloud, Save } from 'lucide-react';
import { createPageUrl } from '@/utils';

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "Manufacturing", 
  "Retail", "Consulting", "Marketing", "Real Estate", "Non-profit", "Other"
];
const COMPANY_SIZES = [
  "1-10 employees", "11-50 employees", "51-200 employees", 
  "201-500 employees", "501-1000 employees", "1000+ employees"
];

export default function CompanyProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    website: '',
    industry: '',
    company_size: '',
    description: '',
    logo_url: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    address_country: '',
    contact_email: '',
    contact_phone: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = await User.me();
        setCurrentUser(userData);
        
        let initialFormData = {
          company_name: userData.full_name || '',
          contact_email: userData.email || '',
          website: '',
          industry: '',
          company_size: '',
          description: '',
          logo_url: '',
          address_street: '',
          address_city: '',
          address_state: '',
          address_zip: '',
          address_country: '',
          contact_phone: ''
        };

        const storedInfo = JSON.parse(localStorage.getItem('companyInfo') || '{}');
        initialFormData.company_name = storedInfo.name || initialFormData.company_name;
        initialFormData.website = storedInfo.website || initialFormData.website;
        initialFormData.industry = storedInfo.industry || initialFormData.industry;
        initialFormData.company_size = storedInfo.size || initialFormData.company_size;
        
        const existingProfiles = await CompanyProfileEntity.filter({ user_id: userData.id });
        if (existingProfiles.length > 0) {
          const existingProfile = existingProfiles[0];
          setProfile(existingProfile);
          initialFormData = {
            ...initialFormData,
            ...existingProfile,
            company_name: existingProfile.company_name || initialFormData.company_name,
            contact_email: existingProfile.contact_email || initialFormData.contact_email,
            industry: existingProfile.industry || initialFormData.industry,
            company_size: existingProfile.company_size || initialFormData.company_size,
          };
        }
        setFormData(initialFormData);

      } catch (error) {
        console.error('Error fetching company data:', error);
        toast({ title: 'Error', description: 'Could not load company profile.', variant: 'destructive' });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // For native select, onChange event provides the value directly on e.target.value
  const handleSelectChange = (name, value) => {
     // If using native select, the event might be directly passed, or value from onValueChange if supported by custom Select
    if (typeof value === 'string') { // Assuming direct value from onValueChange
        setFormData(prev => ({ ...prev, [name]: value }));
    } else if (value && value.target) { // Handling direct event from native select
        setFormData(prev => ({ ...prev, [name]: value.target.value }));
    }
  };
  

  const handleLogoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setIsUploadingLogo(true);
    try {
      const { file_url } = await UploadFile({ file: logoFile });
      setFormData(prev => ({ ...prev, logo_url: file_url }));
      setLogoFile(null);
      toast({ title: 'Success', description: 'Logo uploaded successfully.' });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({ title: 'Error', description: 'Logo upload failed.', variant: 'destructive' });
    }
    setIsUploadingLogo(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);

    const profileData = {
      ...formData,
      user_id: currentUser.id,
    };

    try {
      let updatedProfile;
      if (profile && profile.id) {
        updatedProfile = await CompanyProfileEntity.update(profile.id, profileData);
      } else {
        updatedProfile = await CompanyProfileEntity.create(profileData);
      }
      setProfile(updatedProfile); 

      if (currentUser.full_name !== formData.company_name) {
          await User.updateMyUserData({ full_name: formData.company_name });
      }

      toast({ title: 'Success', description: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: 'Error', description: 'Failed to save profile.', variant: 'destructive' });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      <Button 
        variant="ghost" 
        onClick={() => navigate(createPageUrl('CompanyDashboard'))} 
        className="mb-6 text-gray-600 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Company Profile</CardTitle>
              <CardDescription>Keep your company's information up-to-date for students and alumni.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input id="company_name" name="company_name" value={formData.company_name} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input id="website" name="website" type="url" placeholder="https://yourcompany.com" value={formData.website} onChange={handleInputChange} className="pl-10" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  
                  <Select 
                    id="industry" 
                    name="industry" 
                    value={formData.industry} 
                    onChange={(e) => handleSelectChange('industry', e)} // Pass the event
                  >
                    <SelectItem value={null}>Select industry</SelectItem> 
                    {INDUSTRIES.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="company_size">Company Size</Label>
                   
                  <Select 
                    id="company_size" 
                    name="company_size" 
                    value={formData.company_size} 
                    onChange={(e) => handleSelectChange('company_size', e)} // Pass the event
                  >
                     <SelectItem value={null}>Select company size</SelectItem> 
                    {COMPANY_SIZES.map(size => <SelectItem key={size} value={size}>{size}</SelectItem>)}
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea id="description" name="description" placeholder="Tell students about your company, culture, and mission..." value={formData.description} onChange={handleInputChange} className="min-h-[120px]" />
              </div>
            </section>

            
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Company Logo</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {formData.logo_url && (
                  <div className="w-24 h-24 rounded-full overflow-hidden border shadow-sm flex-shrink-0">
                    <img src={formData.logo_url} alt="Company Logo" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex-grow">
                  <Label htmlFor="logo_file" className="block mb-1">Upload New Logo</Label>
                  <div className="flex items-center gap-2">
                    <Input id="logo_file" type="file" onChange={handleLogoFileChange} accept="image/png, image/jpeg, image/svg+xml" className="flex-grow" />
                    <Button type="button" variant="outline" onClick={handleLogoUpload} disabled={!logoFile || isUploadingLogo}>
                      {isUploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4 mr-2" />}
                      {isUploadingLogo ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Recommended: Square PNG or SVG, max 2MB.</p>
                </div>
              </div>
            </section>
            
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <Label htmlFor="contact_email">Public Contact Email</Label>
                  <Input id="contact_email" name="contact_email" type="email" placeholder="e.g., careers@yourcompany.com" value={formData.contact_email} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Public Contact Phone</Label>
                  <Input id="contact_phone" name="contact_phone" type="tel" placeholder="(123) 456-7890" value={formData.contact_phone} onChange={handleInputChange} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Company Address (Optional)</h3>
              <div>
                <Label htmlFor="address_street">Street Address</Label>
                <Input id="address_street" name="address_street" value={formData.address_street} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="address_city">City</Label>
                  <Input id="address_city" name="address_city" value={formData.address_city} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="address_state">State / Province</Label>
                  <Input id="address_state" name="address_state" value={formData.address_state} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="address_zip">Zip / Postal Code</Label>
                  <Input id="address_zip" name="address_zip" value={formData.address_zip} onChange={handleInputChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="address_country">Country</Label>
                <Input id="address_country" name="address_country" value={formData.address_country} onChange={handleInputChange} />
              </div>
            </section>

            <div className="flex justify-end pt-6 border-t">
              <Button type="submit" disabled={isSaving || isUploadingLogo} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isSaving ? 'Saving Profile...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
