import React, { useState } from 'react';
import { 
  AlertTriangle, 
  BookOpen, 
  CheckCircle, 
  HelpCircle, 
  Info, 
  Layers, 
  Lightbulb, 
  Recycle, 
  Search, 
  Sparkles, 
  Tag, 
  X, 
  XCircle 
} from 'lucide-react';
import { RECYCLING_DICTIONARY } from '../../constants/gamification';
import { ItemGuide, WasteType } from '../../types';

export const EducationEngine: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WasteType | 'ALL'>('ALL');
  const [activeItem, setActiveItem] = useState<ItemGuide | null>(null);

  const categories = [
    { type: 'ALL', label: 'All Items', icon: Layers },
    { type: 'PLASTIC', label: 'Plastic', count: RECYCLING_DICTIONARY.filter(i => i.category === 'PLASTIC').length },
    { type: 'PAPER', label: 'Paper & Cardboard', count: RECYCLING_DICTIONARY.filter(i => i.category === 'PAPER').length },
    { type: 'METAL', label: 'Metal & Foil', count: RECYCLING_DICTIONARY.filter(i => i.category === 'METAL').length },
    { type: 'GLASS', label: 'Glass', count: RECYCLING_DICTIONARY.filter(i => i.category === 'GLASS').length },
    { type: 'E_WASTE', label: 'E-Waste & Batteries', count: RECYCLING_DICTIONARY.filter(i => i.category === 'E_WASTE').length },
    { type: 'OTHER', label: 'General / Non-Recyclable', count: RECYCLING_DICTIONARY.filter(i => i.category === 'OTHER').length },
  ];

  const quickPillSearches = [
    'Takeaway Coffee Cup',
    'Greasy Pizza Box',
    'Lithium & Alkaline Batteries',
    'Spiral Bound Notebook',
    'Thermal Cash Register Receipt',
    'Aluminum Soda / Seltzer Can',
    'Plastic Grocery / Shopping Bag',
    'Juice / Milk Tetra Pak Carton',
  ];

  const filteredItems = RECYCLING_DICTIONARY.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesName = item.name.toLowerCase().includes(query);
    const matchesInstructions = item.instructions.toLowerCase().includes(query);
    const matchesTags = item.tags.some(t => t.toLowerCase().includes(query));

    return matchesCategory && (matchesName || matchesInstructions || matchesTags);
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Education Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-forest-light to-teal-900 text-white p-6 sm:p-8 shadow-eco">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Waste Literacy Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Segregation Guidelines & Item Directory
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
            Eliminate contamination at the source. Use real-time lookup to distinguish between true recyclables and deceptive "wishcycling" items.
          </p>
        </div>
      </div>

      {/* CORE 5 WASTE GUIDELINE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Plastic */}
        <div className="eco-card p-4 border-amber-200/60 bg-amber-50/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-amber-800">Plastic #1 - #5</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Yellow Bin</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">PET bottles, PP yogurt tubs, HDPE milk jugs.</p>
            <p className="text-[11px] text-slate-500 mt-2"><strong>Rule:</strong> Empty all liquid, rinse, and keep caps on.</p>
          </div>
          <p className="text-[10px] text-amber-700 font-semibold mt-3 pt-2 border-t border-amber-200/50">
            ❌ No plastic wrap, film bags, or plastic straws.
          </p>
        </div>

        {/* Paper */}
        <div className="eco-card p-4 border-blue-200/60 bg-blue-50/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-blue-800">Paper & Boxes</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">Blue Bin</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">Notebooks, Amazon cartons, clean exam scrap sheets.</p>
            <p className="text-[11px] text-slate-500 mt-2"><strong>Rule:</strong> Flatten boxes; remove plastic bubblewrap.</p>
          </div>
          <p className="text-[10px] text-blue-700 font-semibold mt-3 pt-2 border-t border-blue-200/50">
            ❌ No food-greased pizza boxes or thermal receipts.
          </p>
        </div>

        {/* Metal */}
        <div className="eco-card p-4 border-purple-200/60 bg-purple-50/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-purple-800">Metal & Aluminum</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">Gray Bin</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">Beverage cans, steel food tins, clean rolled foil.</p>
            <p className="text-[11px] text-slate-500 mt-2"><strong>Rule:</strong> Quick rinse; compress foil into 2" ball.</p>
          </div>
          <p className="text-[10px] text-purple-700 font-semibold mt-3 pt-2 border-t border-purple-200/50">
            ⚡ 95% less energy than virgin aluminum smelting.
          </p>
        </div>

        {/* Glass */}
        <div className="eco-card p-4 border-teal-200/60 bg-teal-50/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-teal-800">Glass Jars & Bottles</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">Green Bin</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">Drink bottles, condiment jars, jam containers.</p>
            <p className="text-[11px] text-slate-500 mt-2"><strong>Rule:</strong> 100% infinitely recyclable without quality loss.</p>
          </div>
          <p className="text-[10px] text-teal-700 font-semibold mt-3 pt-2 border-t border-teal-200/50">
            ❌ No Pyrex cookware, lightbulbs, or window glass.
          </p>
        </div>

        {/* E-Waste */}
        <div className="eco-card p-4 border-red-200/60 bg-red-50/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-red-800">E-Waste & Batteries</span>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">Orange Hub</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">Batteries, charging cables, old phones, flash drives.</p>
            <p className="text-[11px] text-slate-500 mt-2"><strong>Rule:</strong> Tape battery terminals; library drop box.</p>
          </div>
          <p className="text-[10px] text-red-700 font-semibold mt-3 pt-2 border-t border-red-200/50">
            ⚠️ Fire & toxic heavy metal hazard in landfill.
          </p>
        </div>
      </div>

      {/* SEARCH ENGINE SECTION */}
      <div className="eco-card p-6 border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                "Can I Recycle This?" Real-Time Search Bar
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant campus dictionary lookup with prep steps and contamination warnings.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search coffee cup, pizza box, batteries, cables..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="eco-input pl-10 pr-9 py-2.5 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Clickable Suggestions Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Common lookups:</span>
          {quickPillSearches.map(item => (
            <button
              key={item}
              onClick={() => setSearchQuery(item)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-600 whitespace-nowrap transition-colors text-[11px] font-medium"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 mt-2">
          {categories.map(c => {
            const isSelected = selectedCategory === c.type;
            return (
              <button
                key={c.type}
                onClick={() => setSelectedCategory(c.type as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{c.label}</span>
                {c.count !== undefined && (
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {c.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCH RESULTS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Displaying {filteredItems.length} campus items
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="text-xs text-emerald-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="eco-card p-12 text-center text-slate-500">
            <HelpCircle className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No matching items found for "{searchQuery}"</p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching for a category or generic term like "plastic", "paper", "glass", or "can".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="eco-card p-5 cursor-pointer hover:border-emerald-400 flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </h3>
                    {item.recyclable ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Recyclable</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 shrink-0">
                        <XCircle className="w-3 h-3 text-red-600" />
                        <span>Landfill / Other</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {item.instructions}
                  </p>

                  {/* Prep steps snippet */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Preparation Steps:
                    </p>
                    <ul className="space-y-1 text-[11px] text-slate-700">
                      {item.prepSteps.slice(0, 2).map((step, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {item.commonMisconceptions && (
                    <div className="mt-2 text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/50 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item.commonMisconceptions}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <span className="text-slate-400 group-hover:text-emerald-600 font-medium transition-colors">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL FOR CLICKED ITEM */}
      {activeItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setActiveItem(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-slide-up"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {activeItem.category}
                    </span>
                    {activeItem.recyclable ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Recyclable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600">
                        <XCircle className="w-3.5 h-3.5 text-red-500" /> Non-Recyclable (Landfill)
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{activeItem.name}</h3>
                </div>
                <button
                  onClick={() => setActiveItem(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <p className="font-bold text-slate-700 mb-1">Campus Sorting Instructions:</p>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {activeItem.instructions}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-700 mb-1.5">Mandatory Preparation Steps:</p>
                  <div className="space-y-1.5">
                    {activeItem.prepSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-lg text-emerald-900">
                        <span className="font-bold text-emerald-600">{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {activeItem.commonMisconceptions && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                    <p className="font-bold flex items-center gap-1.5 text-amber-800 mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Common Student Misconception</span>
                    </p>
                    <p className="text-xs leading-relaxed">{activeItem.commonMisconceptions}</p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900">
                  <p className="font-bold flex items-center gap-1.5 text-teal-800 mb-1">
                    <Lightbulb className="w-4 h-4 text-teal-600" />
                    <span>Eco Impact Tip</span>
                  </p>
                  <p className="text-xs leading-relaxed">{activeItem.ecoTip}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeItem.tags.map(t => (
                    <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
