
import React, { useState } from "react";
import { Mail, Globe, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { SendEmail } from "@/api/integrations";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TermsDialog from "../components/legal/TermsDialog";

export default function ContactPage() {
  const [showTerms, setShowTerms] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await SendEmail({
        to: "jill@uffastforward.com",
        subject: `Contact Form: ${formData.get("topic")}`,
        body: `From: ${formData.get("name")} (${formData.get("email")})
        \nTopic: ${formData.get("topic")}
        \nMessage: ${formData.get("message")}`
      });
      
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll get back to you soon!",
      });
      
      e.target.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-600 mt-1">
          Get in touch with the College Fast Forward team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-100">
                <Mail className="h-5 w-5 text-[--primary]" />
              </div>
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <a 
                  href="mailto:jill@uffastforward.com"
                  className="text-sm text-[--primary] hover:underline"
                >
                  jill@uffastforward.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Follow Us</h3>
                <div className="flex gap-2 mt-1">
                  <a 
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[--primary]"
                  >
                    Twitter
                  </a>
                  <span className="text-gray-300">•</span>
                  <a 
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[--primary]"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Send Us a Message</h2>
          <p className="text-gray-600 mb-6">Please allow 1–2 business days for a response.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Select name="topic" required defaultValue="general">
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General inquiry</SelectItem>
                  <SelectItem value="mentorship">Mentorship program</SelectItem>
                  <SelectItem value="jobs">Job leads</SelectItem>
                  <SelectItem value="feedback">Feedback & Bug report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="How can we help?" 
                className="min-h-[150px]"
                required 
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>

        <div className="lg:pl-12">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">❓ How do I become a mentor?</h3>
              <p className="text-gray-600">
                If you're a UF alum, sign up as a mentor through your profile settings. 
                Visit the Mentorship page to learn more about our program.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">❓ Can parents join College Fast Forward?</h3>
              <p className="text-gray-600">
                Yes! Parents can create an account to share job leads, provide career advice, 
                and connect with other Gator families.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">❓ Is College Fast Forward free to use?</h3>
              <p className="text-gray-600">
                Our core platform is currently free for UF students, alumni, and parents. We may 
                introduce optional premium features in the future—any changes will be communicated 
                well in advance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">❓ How can I post a job opportunity?</h3>
              <p className="text-gray-600">
                Go to the Jobs page and click "Post a Job." You can share internships, 
                entry-level positions, or other opportunities for fellow Gators.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 border-t pt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Legal and Privacy Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-2">Privacy Policy</h3>
              <p className="text-gray-600 mb-4">
                Learn how we collect, use, and protect your personal information.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowTerms(true);
                  document.querySelector('[data-value="privacy"]').click();
                }}
              >
                Read Privacy Policy
              </Button>
            </div>
            <div>
              <h3 className="font-medium mb-2">Terms of Service</h3>
              <p className="text-gray-600 mb-4">
                Review our terms and conditions for using College Fast Forward.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowTerms(true);
                  document.querySelector('[data-value="terms"]').click();
                }}
              >
                Read Terms of Service
              </Button>
            </div>
          </div>
          
          <TermsDialog
            open={showTerms}
            onOpenChange={setShowTerms}
          />
          
          <p className="text-center text-gray-500 italic mt-12">
            Powered by Gators who actually care. Here, who you know isn't just a saying—it's your next opportunity.
          </p>
        </div>
      </div>
    </div>
  );
}
