import { StepItem, FaqItem } from '../components/common/HowItWorksFaqSection';
import { Compass, Car, FileCheck, Globe, ShieldCheck, Palmtree, Calendar, CreditCard, Award, Bell } from 'lucide-react';

export interface PageGuideConfig {
  title: string;
  subtitle: string;
  steps: StepItem[];
  faqs: FaqItem[];
  accentColor: 'emerald' | 'amber';
}

export const pageGuides: Record<string, PageGuideConfig> = {
  property: {
    title: "How It Works & FAQs",
    subtitle: "Simple 3-step process to explore and purchase approved plots.",
    accentColor: "emerald",
    steps: [
      {
        number: "1",
        title: "Browse Approved Plots",
        description: "View verified ventures across Shadnagar, Yadadri, and Shamshabad.",
        icon: Compass
      },
      {
        number: "2",
        title: "Free Site Visit",
        description: "Schedule a complimentary visit to inspect the layout in person.",
        icon: Car
      },
      {
        number: "3",
        title: "Clear Registration",
        description: "Review legal documents and complete spot registration.",
        icon: FileCheck
      }
    ],
    faqs: [
      {
        question: "Are all layouts approved with clear titles?",
        answer: "Yes, all SVS ventures have clear legal titles and approved layout permissions."
      },
      {
        question: "Is the site visit cab service free?",
        answer: "Yes, we arrange free pick-up and drop for plot visits within Hyderabad."
      },
      {
        question: "Does SVS provide assistance if I want to resell later?",
        answer: "Yes, our team assists registered owners with resale and finding genuine buyers."
      }
    ]
  },

  nri: {
    title: "How It Works & FAQs",
    subtitle: "Simple steps for overseas investors to buy and manage plots.",
    accentColor: "emerald",
    steps: [
      {
        number: "1",
        title: "Select Country Desk",
        description: "Connect with our coordinator for your region and timezone.",
        icon: Globe
      },
      {
        number: "2",
        title: "Document Verification",
        description: "Review legal papers and complete plot booking formalities remotely.",
        icon: ShieldCheck
      },
      {
        number: "3",
        title: "Regular Updates",
        description: "Receive photos and progress updates on your registered property.",
        icon: Bell
      }
    ],
    faqs: [
      {
        question: "Can I buy a plot without traveling to India?",
        answer: "Yes, purchases and documentation can be completed through authorized family representatives or standard procedures."
      },
      {
        question: "How do I get updates about my plot from abroad?",
        answer: "Our team provides periodic photos and site condition updates upon request."
      },
      {
        question: "How can I make payments from abroad?",
        answer: "Payments are accepted through standard bank transfers (NRE/NRO/international wire)."
      }
    ]
  },

  clubResorts: {
    title: "How It Works & FAQs",
    subtitle: "Simple steps to plan your resort visit or event.",
    accentColor: "amber",
    steps: [
      {
        number: "1",
        title: "Choose Resort or Event",
        description: "Select your preferred resort location or upcoming get-together.",
        icon: Palmtree
      },
      {
        number: "2",
        title: "Select Dates & Guests",
        description: "Pick your dates; SVS members receive applicable card discounts.",
        icon: Calendar
      },
      {
        number: "3",
        title: "Booking Confirmation",
        description: "Receive your booking confirmation details for front-desk check-in.",
        icon: FileCheck
      }
    ],
    faqs: [
      {
        question: "Can non-members also book resort stays?",
        answer: "Yes, non-members can book based on availability, while members receive special discounts."
      },
      {
        question: "How do I use my membership benefits for a stay?",
        answer: "Simply share your Member ID when booking to apply your member rates."
      },
      {
        question: "Are banquet lawns available for family functions?",
        answer: "Yes, banquet halls and lawns are available for private family functions and meetings."
      }
    ]
  },

  membership: {
    title: "How It Works & FAQs",
    subtitle: "Simple steps to enroll and use your privilege membership.",
    accentColor: "amber",
    steps: [
      {
        number: "1",
        title: "Choose Card Plan",
        description: "Select Silver, Gold, or Platinum based on your preferences.",
        icon: CreditCard
      },
      {
        number: "2",
        title: "Simple Sign-Up",
        description: "Provide basic contact details to enroll.",
        icon: FileCheck
      },
      {
        number: "3",
        title: "Enjoy Benefits",
        description: "Use your membership for plot discounts and resort benefits.",
        icon: Award
      }
    ],
    faqs: [
      {
        question: "How long is the membership valid?",
        answer: "Memberships are valid for 3 to 5 years depending on the selected plan."
      },
      {
        question: "What benefits do members receive?",
        answer: "Members receive special pricing on new ventures, resort stay privileges, and priority support."
      },
      {
        question: "Can I upgrade my membership plan later?",
        answer: "Yes, you can upgrade your plan anytime by contacting support or from your dashboard."
      }
    ]
  }
};
