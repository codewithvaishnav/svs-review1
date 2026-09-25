import React, { useState } from 'react';
import { 
  Home, Building, Shield, CheckCircle2, MapPin, ArrowRight, 
  Sparkles, Layers, Award, Phone, Download, Compass, Ruler, Key
} from 'lucide-react';

interface HousingSectionProps {
  onOpenConsultation?: () => void;
  onDownloadBrochure?: () => void;
}

export const HousingSection: React.FC<HousingSectionProps> = ({
  onOpenConsultation,
  onDownloadBrochure
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'villas' | 'turnkey' | 'farmhouses'>('all');

  const housingProjects = [
    {
      id: 'svs-villas-shadnagar',
      title: 'Srivasudha Royal Green Villas',
      category: 'villas',
      location: 'Shadnagar Highway Zone, Hyderabad',
      type: '3 & 4 BHK Luxury Independent Villas',
      area: '240 - 400 Sq. Yards (2,800 - 4,200 SFT)',
      price: '₹1.45 Cr Onwards',
      status: 'Booking Open (HMDA RERA Approved)',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      highlights: [
        '100% Vastu Compliant East & West Facing Units',
        'Private Landscaped Garden & Double Car Parking',
        '24/7 Security, Underground Cabling & Clubhouse Access',
        '30 Mins from Rajiv Gandhi International Airport'
      ]
    },
    {
      id: 'svs-turnkey-construction',
      title: 'SVS Custom Turnkey Housing Solution',
      category: 'turnkey',
      location: 'On Your Plot (HMDA/DTCP Layouts Across Telangana)',
      type: 'Customized Architectural & Civil Construction',
      area: 'Customized as per Plot Size & Member Floorplan',
      price: '₹2,200 per SFT (Premium Specification)',
      status: 'End-to-End Turnkey Service',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      highlights: [
        'Architectural 3D Elevations & Structural Engineering',
        'High-Grade Steel, Fe500D & Branded Quality Cement',
        'Full Municipal / HMDA Building Plan Approval Assistance',
        'Monthly Construction Progress Photo & Drone Reports'
      ]
    },
    {
      id: 'svs-farm-villas-yadadri',
      title: 'Srivasudha Eco Farm Villas & Orchards',
      category: 'farmhouses',
      location: 'Yadadri Corridor / Aler Highway',
      type: 'Managed Organic Farmhouse & Weekend Cottage',
      area: 'Half Acre (2,420 Sq. Yds) with 2 BHK Cottage',
      price: '₹85 Lakhs Complete Package',
      status: 'Ready to Move & Harvest',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      highlights: [
        'Drip Irrigation, Sandalwood & Fruit Plantation Included',
        'Solar Power Backup & Dedicated Farm Caretaker',
        'Lifetime Membership to SVS Resorts & Staycation Exchange',
        'High Appreciation Growth Corridor near Yadadri Temple'
      ]
    }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? housingProjects 
    : housingProjects.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <Home className="w-4 h-4 text-emerald-700" />
            SVS Housing & Construction Division
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            Luxury Villas & <span className="text-emerald-700">Turnkey Housing</span> Solutions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From HMDA RERA-approved gated villa communities to custom turnkey house construction on your own plot. Built with uncompromising structural integrity, transparent pricing, and timely delivery.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { id: 'all', label: 'All Housing & Villas' },
            { id: 'villas', label: 'Luxury Gated Villas' },
            { id: 'turnkey', label: 'Turnkey Construction on Plot' },
            { id: 'farmhouses', label: 'Eco Farmhouses & Cottages' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Housing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col hover:border-amber-400 hover:shadow-xl transition-all shadow-md group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 border border-amber-200 shadow-xs">
                  {project.status}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    {project.location}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {project.type} • <span className="text-slate-700 font-semibold">{project.area}</span>
                  </p>

                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    {project.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Starting Price</div>
                    <div className="text-lg font-black text-amber-700">{project.price}</div>
                  </div>
                  <button
                    onClick={onOpenConsultation}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Inquire Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Turnkey Process Banner */}
        <div className="bg-emerald-800 border border-emerald-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold">
                <Key className="w-3.5 h-3.5" />
                Own a Plot? Let's Build Your Dream Home
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Srivasudha Hassle-Free Turnkey Construction
              </h2>
              <p className="text-emerald-100 text-sm leading-relaxed">
                We handle design, municipal approvals, civil construction, interior finishings, and handover with zero cost overrun and monthly digital CCTV / drone tracking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={onDownloadBrochure}
                className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                Housing Brochure PDF
              </button>
              <button
                onClick={onOpenConsultation}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Book Site Consultation
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
