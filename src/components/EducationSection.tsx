import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Award, Users, CheckCircle2, 
  Sparkles, HeartHandshake, PhoneCall, ArrowRight, School, Lightbulb 
} from 'lucide-react';

interface EducationSectionProps {
  onOpenEnrollment?: () => void;
  onApplyStudent?: () => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ 
  onOpenEnrollment,
  onApplyStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'academy' | 'scholarship' | 'skills'>('academy');

  return (
    <section id="education-division" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-amber-700" />
            SVS Educational Institutions & Skill Academy
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Nurturing Minds, Building Future Leaders
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Supported by Srivasuda Foundation, SVS Education empowers rural youth, offers vocational skill development, and awards scholarships to deserving students.
          </p>
        </div>

        {/* Key Educational Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-700">5,000+</div>
            <div className="text-xs font-bold text-slate-700">Students Trained</div>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-600">1,200+</div>
            <div className="text-xs font-bold text-slate-700">Merit Scholarships</div>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-700">15+</div>
            <div className="text-xs font-bold text-slate-700">Skill Centers</div>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-rose-600">100%</div>
            <div className="text-xs font-bold text-slate-700">Placement Support</div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setActiveTab('academy')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'academy'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            SVS International School
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Skill Development Center
          </button>
          <button
            onClick={() => setActiveTab('scholarship')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'scholarship'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Scholarship & Foundation
          </button>
        </div>

        {/* Tab 1: SVS International School */}
        {activeTab === 'academy' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-200">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <School className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Values-Based Curriculum</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Combining holistic STEM learning with moral values, environmental ethics, and leadership coaching from pre-primary to higher secondary.
              </p>
            </div>

            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Modern Infrastructure</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart classrooms, digital science labs, comprehensive sports arenas, and computer centers designed for hands-on interactive learning.
              </p>
            </div>

            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Experienced Faculty</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated educators trained in modern pedagogical tools to ensure every child gets personalized guidance and mental growth support.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Skill Development Center */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-200">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Real Estate & Surveying Skills</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Free vocational training in Total Station land surveying, CAD layout design, and real estate marketing for rural youth.
              </p>
            </div>

            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Digital Skills & IT Literacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Courses in basic software development, digital marketing, graphic design, and financial literacy to foster employment readiness.
              </p>
            </div>

            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">100% Guaranteed Job Placements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Top graduates are recruited directly into the SVS Group network as certified channel managers, plot supervisors, and CAD specialists.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Scholarship & Foundation */}
        {activeTab === 'scholarship' && (
          <div className="bg-emerald-800 text-white p-8 sm:p-10 rounded-3xl border border-emerald-700 space-y-6 animate-in fade-in duration-200 shadow-xl">
            <div className="max-w-2xl space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
                Srivasuda Foundation CSR Initiative
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Merit Scholarships for High-Performing & Underprivileged Students
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Every year, SVS Group allocates a fixed percentage of plot sales revenue into the Srivasuda Educational Trust. This fund covers school fees, books, uniforms, and college tuition for deserving students across Telangana.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-emerald-700">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
                <span className="text-xs text-white font-semibold">100% Tuition Fee Subsidies</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
                <span className="text-xs text-white font-semibold">Free Study Materials & Laptops</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
                <span className="text-xs text-white font-semibold">Higher Education University Grants</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold">
              Interested in SVS Vocational Skill Center or Srivasuda Scholarships?
            </h4>
            <p className="text-xs text-slate-400">
              Apply for free training batches or recommend a deserving student for our scholarship drive.
            </p>
          </div>

          <button
            onClick={() => {
              if (onApplyStudent) {
                onApplyStudent();
              } else if (onOpenEnrollment) {
                onOpenEnrollment();
              }
            }}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            Apply / Enroll Student
          </button>
        </div>

      </div>
    </section>
  );
};
