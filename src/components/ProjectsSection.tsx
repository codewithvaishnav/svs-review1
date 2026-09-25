import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Project, FirestoreCollections } from '../types';
import { 
  Building2, MapPin, CheckCircle2, ArrowRight, Download, Sparkles, 
  ShieldCheck, FileText, Filter, Phone 
} from 'lucide-react';

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
  onDownloadBrochure: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
  onDownloadBrochure,
}) => {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed' | 'upcoming'>('all');

  useEffect(() => {
    const unsubscribe = dbService.subscribeToCollection<Project>(
      FirestoreCollections.VENTURES,
      (cloudProjects) => {
        setProjectsList(cloudProjects || []);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredProjects = projectsList.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  return (
    <section id="projects" className="py-16 sm:py-20 bg-white text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-emerald-700" />
              SVS Property Division
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif">
              Ongoing & Upcoming Ventures
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl">
              Fully approved DTCP, HMDA & RERA open plot ventures in Hyderabad&apos;s most booming growth corridors with 100% clear titles and instant spot registration.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              All Layouts ({projectsList.length})
            </button>

            <button
              onClick={() => setStatusFilter('ongoing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'ongoing'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Ongoing ({projectsList.filter(p => p.status === 'ongoing').length})
            </button>

            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Completed ({projectsList.filter(p => p.status === 'completed').length})
            </button>

            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'upcoming'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Upcoming ({projectsList.filter(p => p.status === 'upcoming').length})
            </button>
          </div>
        </div>

        {/* Projects Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900">No Ventures Listed in this Category</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                All verified DTCP and HMDA layouts added by SVS Administration will appear here live with site maps and spot registration details.
              </p>
            </div>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-all"
              >
                View All Categories
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-emerald-600 hover:shadow-md transition-all group"
              >
                
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase shadow-xs ${
                        project.status === 'ongoing'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {project.status === 'ongoing' ? 'Ongoing Venture' : 'Upcoming Pre-Launch'}
                    </span>
                  </div>

                  {/* Zone Label */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-[11px]">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {project.zone}
                    </span>
                    {project.startingPrice && (
                      <span className="bg-white text-slate-900 px-2 py-0.5 rounded text-[11px] font-bold border border-slate-200 shadow-xs">
                        {project.startingPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {project.shortDesc}
                    </p>
                  </div>

                  {/* Highlights List */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {project.highlights.slice(0, 3).map((item, hIdx) => (
                      <div key={hIdx} className="text-xs text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 flex items-center gap-2">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      Site Visit / Inquiry
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={onDownloadBrochure}
                      title="Download Layout Map & Brochure"
                      className="p-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-700" />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
