import React, { useState } from 'react';
import { LucideIcon, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export interface StepItem {
  number: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowItWorksFaqSectionProps {
  title: string;
  subtitle: string;
  steps: StepItem[];
  faqs: FaqItem[];
  accentColor?: 'emerald' | 'amber';
}

export const HowItWorksFaqSection: React.FC<HowItWorksFaqSectionProps> = ({
  title,
  subtitle,
  steps,
  faqs,
  accentColor = 'emerald'
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const isAmber = accentColor === 'amber';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        
        {/* Minimal Header */}
        <div className="mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isAmber ? 'bg-amber-500' : 'bg-emerald-600'}`} />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* 3 Simple Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-3 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <div
                  className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs text-white ${
                    isAmber ? 'bg-amber-600' : 'bg-emerald-700'
                  }`}
                >
                  {step.number || idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {step.title}
                    </h4>
                    {StepIcon && <StepIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal FAQs Accordion */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Frequently Asked Questions</span>
          </div>

          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className={`bg-white border rounded-xl overflow-hidden transition-all ${
                  isOpen ? (isAmber ? 'border-amber-300 bg-amber-50/20' : 'border-emerald-300 bg-emerald-50/20') : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-2.5 px-3.5 text-left flex items-center justify-between gap-3 text-xs font-semibold text-slate-800 hover:text-emerald-800 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-slate-400">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-700" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3 pt-1 text-[11px] sm:text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
