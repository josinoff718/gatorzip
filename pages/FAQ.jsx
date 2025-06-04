
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search,
  GraduationCap,
  Users,
  Briefcase,
  Building,
  Shield,
  CreditCard,
  Mail,
  ChevronRight
} from "lucide-react";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    {
      title: "Getting Started",
      icon: GraduationCap,
      faqs: [
        {
          q: "Who can join College Fast Forward?",
          a: "Our platform is exclusively for UF students, alumni, parents, and vetted employers. This ensures a trusted network focused on helping Gators succeed."
        },
        {
          q: "How do I create an account?",
          a: "Click 'Sign In' at the top of the page and select your role (student, alumni, or parent). You'll need to verify your UF affiliation during registration."
        },
        {
          q: "Is College Fast Forward free to use?",
          a: "Yes! Our core platform is currently free for UF students, alumni, and parents. We may introduce optional premium features in the future—any changes will be communicated well in advance."
        }
      ]
    },
    {
      title: "Mentorship",
      icon: Users,
      faqs: [
        {
          q: "How do I become a mentor?",
          a: "If you're a UF alum, you can sign up as a mentor through your profile settings. Visit the Mentorship page to learn more about our program and set your availability preferences."
        },
        {
          q: "How are mentors vetted?",
          a: "All mentors must verify their UF alumni status. We also review professional credentials and maintain a feedback system to ensure quality mentorship experiences."
        },
        {
          q: "What's expected of mentors?",
          a: "Mentors typically offer career guidance, resume reviews, or informational interviews. You can set your availability and preferred meeting format (virtual/in-person)."
        }
      ]
    },
    {
      title: "Job Opportunities",
      icon: Briefcase,
      faqs: [
        {
          q: "How can I post a job opportunity?",
          a: "Visit the Jobs page and click 'Post a Job.' You can share internships, entry-level positions, or other opportunities for fellow Gators."
        },
        {
          q: "Who can post jobs?",
          a: "Alumni, parents, and verified employers can post job opportunities. All postings are reviewed to ensure relevance and legitimacy."
        },
        {
          q: "Are all job postings paid positions?",
          a: "While most postings are for paid positions, some may be internships or volunteer opportunities. Each posting clearly indicates the compensation type."
        }
      ]
    },
    {
      title: "Parents",
      icon: Building,
      faqs: [
        {
          q: "Can parents join College Fast Forward?",
          a: "Yes! Parents can create an account to share job leads, provide career advice, and connect with other Gator families."
        },
        {
          q: "What can parents do on the platform?",
          a: "Parents can post job opportunities, join industry discussions, connect with other parents, and help students with career guidance and networking."
        },
        {
          q: "How do you verify parent accounts?",
          a: "Parents verify their status through their student's UF ID number and basic verification process."
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      faqs: [
        {
          q: "How is my information protected?",
          a: "We maintain strict privacy standards and only share information you explicitly make public. Your contact details are only visible to verified network members."
        },
        {
          q: "Can I control who sees my profile?",
          a: "Yes, you have full control over your profile visibility and can adjust privacy settings at any time."
        },
        {
          q: "How do you prevent spam?",
          a: "We require verification for all accounts and actively monitor platform activity to maintain a trusted professional network."
        }
      ]
    },
    {
      title: "Support",
      icon: Mail,
      faqs: [
        {
          q: "How can I get help?",
          a: "Email us at jill@uffastforward.com. We typically respond within 1-2 business days."
        },
        {
          q: "How do I report inappropriate behavior?",
          a: "Use the 'Report' button on any content or profile, or email us directly. We take all reports seriously and investigate promptly."
        },
        {
          q: "What happens if I find a bug?",
          a: "Please report any technical issues through our Feedback form or email us directly. We appreciate your help in improving the platform."
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <p className="text-gray-600 mt-1">
          Find answers to common questions about College Fast Forward
        </p>
      </div>

      <div className="relative max-w-xl mx-auto mb-12">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        <Input
          type="search"
          placeholder="Search FAQs..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-12">
        {filteredCategories.map((category, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-blue-50">
                <category.icon className="h-6 w-6 text-[--secondary]" />
              </div>
              <h2 className="text-2xl font-semibold">{category.title}</h2>
            </div>
            
            <div className="space-y-6">
              {category.faqs.map((faq, faqIndex) => (
                <div key={faqIndex} className="border-b border-gray-100 pb-6 last:border-0">
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[--secondary]/5 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Still have questions?</h2>
            <p className="mt-2 text-gray-600">
              We're here to help. Reach out to our team and we'll get back to you soon.
            </p>
          </div>
          <Button 
            className="bg-[--secondary] hover:bg-[--secondary]/90"
            asChild
          >
            <Link to={createPageUrl("Contact")}>
              Contact Us <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
