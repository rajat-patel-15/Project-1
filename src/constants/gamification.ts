import { Badge, BinStation, Challenge, ItemGuide, QuantityBracket, WasteType } from '../types';

export const BASE_POINTS: Record<WasteType, number> = {
  PLASTIC: 10,
  PAPER: 8,
  GLASS: 12,
  METAL: 15,
  E_WASTE: 25,
  OTHER: 5,
};

export const QUANTITY_MULTIPLIERS: Record<QuantityBracket, { multiplier: number; estGrams: number; label: string }> = {
  '<100g': { multiplier: 1.0, estGrams: 50, label: 'Small (<100g, e.g. bottle cap, receipts)' },
  '100-500g': { multiplier: 1.5, estGrams: 300, label: 'Medium (100–500g, e.g. 2-3 bottles, notebook)' },
  '500g-1kg': { multiplier: 2.5, estGrams: 750, label: 'Substantial (500g–1kg, e.g. thick textbook, jar)' },
  '1-5kg': { multiplier: 4.0, estGrams: 3000, label: 'Large (1–5kg, e.g. stack of boxes, small appliance)' },
  '>5kg': { multiplier: 5.0, estGrams: 6000, label: 'Bulk (>5kg, e.g. hostel room clearout, e-waste bin)' },
};

export const SYSTEM_BADGES: Badge[] = [
  {
    id: 'badge-1',
    code: 'ECO_STARTER',
    title: 'Eco Starter',
    description: 'Logged your very first verified recycling activity on campus.',
    icon: 'Sprout',
    criteriaType: 'LOG_COUNT',
    criteriaThreshold: 1,
  },
  {
    id: 'badge-2',
    code: 'RECYCLER',
    title: 'Dedicated Recycler',
    description: 'Logged 10 or more recycling activities and built sustainable habits.',
    icon: 'Recycle',
    criteriaType: 'LOG_COUNT',
    criteriaThreshold: 10,
  },
  {
    id: 'badge-3',
    code: 'GREEN_CHAMPION',
    title: 'Green Champion',
    description: 'Earned 500+ total eco points across verified campus stations.',
    icon: 'Trophy',
    criteriaType: 'POINTS',
    criteriaThreshold: 500,
  },
  {
    id: 'badge-4',
    code: 'ECO_STREAK',
    title: 'Eco Streak Master',
    description: 'Maintained an active continuous 7-day recycling streak.',
    icon: 'Flame',
    criteriaType: 'STREAK',
    criteriaThreshold: 7,
  },
  {
    id: 'badge-5',
    code: 'SUSTAINABILITY_LEADER',
    title: 'Campus Sustainability Leader',
    description: 'Reached the Top 3 positions on the institutional leaderboard.',
    icon: 'Crown',
    criteriaType: 'RANK',
    criteriaThreshold: 3,
  },
];

export const INITIAL_BIN_STATIONS: BinStation[] = [
  {
    id: 'bin-1',
    qrCode: 'BIN-COLLEGE-001',
    name: 'Main Academic Quad Station',
    locationDescription: 'Central walkway outside Administrative Building & Lecture Hall A',
    acceptedTypes: ['PLASTIC', 'PAPER', 'METAL', 'GLASS'],
    isActive: true,
  },
  {
    id: 'bin-2',
    qrCode: 'BIN-HOSTEL-003',
    name: 'Hostel Cluster B Hub',
    locationDescription: 'Residential courtyard adjacent to Dining Hall 2',
    acceptedTypes: ['PLASTIC', 'PAPER', 'E_WASTE', 'METAL'],
    isActive: true,
  },
  {
    id: 'bin-3',
    qrCode: 'BIN-LIBRARY-002',
    name: 'Central Library Station',
    locationDescription: 'Ground Floor Atrium, near quiet study rooms & print station',
    acceptedTypes: ['PAPER', 'PLASTIC', 'E_WASTE'],
    isActive: true,
  },
  {
    id: 'bin-4',
    qrCode: 'BIN-CAFETERIA-004',
    name: 'Campus Cafeteria Station',
    locationDescription: 'Food Court Exit 3, beside composting collection bay',
    acceptedTypes: ['PLASTIC', 'GLASS', 'METAL'],
    isActive: true,
  },
  {
    id: 'bin-5',
    qrCode: 'BIN-SCI-005',
    name: 'Science & Engineering Complex',
    locationDescription: 'Innovation Wing Lab Corridor, 1st Floor',
    acceptedTypes: ['E_WASTE', 'METAL', 'PLASTIC', 'GLASS'],
    isActive: true,
  },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Reusable Bottle 7 Days',
    description: 'Avoid single-use beverage containers all week and log 3 verified metal/paper recycles.',
    rewardPoints: 50,
    deadline: '2026-10-31',
    isActive: true,
    createdById: 'admin-1',
    category: 'PLASTIC',
  },
  {
    id: 'ch-2',
    title: 'Campus Quad Paper Cleanup',
    description: 'Collect and divert discarded paper flyers, exam scrap notes, and cardboard packaging.',
    rewardPoints: 100,
    deadline: '2026-11-05',
    isActive: true,
    createdById: 'admin-1',
    category: 'PAPER',
  },
  {
    id: 'ch-3',
    title: 'E-Waste Dorm Amnesty Drive',
    description: 'Safely deposit broken charging cords, depleted lithium cells, or outdated electronics.',
    rewardPoints: 120,
    deadline: '2026-11-15',
    isActive: true,
    createdById: 'admin-1',
    category: 'E_WASTE',
  },
  {
    id: 'ch-4',
    title: 'Zero Plastic Week Marathon',
    description: 'Demonstrate zero single-use plastics logged across 5 consecutive active days.',
    rewardPoints: 80,
    deadline: '2026-10-28',
    isActive: true,
    createdById: 'admin-1',
    category: 'PLASTIC',
  },
];

export const RECYCLING_DICTIONARY: ItemGuide[] = [
  {
    id: 'item-1',
    name: 'Plastic Water Bottle (PET)',
    category: 'PLASTIC',
    recyclable: true,
    instructions: 'Widely recyclable in yellow bins. Crush to save space.',
    prepSteps: ['Empty liquids completely', 'Rinse with clean water', 'Screw cap back on or keep separate depending on bin instruction'],
    commonMisconceptions: 'Leaving liquid inside can spoil entire bales of paper recycling if contaminated.',
    ecoTip: 'Carrying a reusable stainless steel flask saves an average of 156 plastic bottles per year.',
    tags: ['beverage', 'pet', 'container', 'single-use']
  },
  {
    id: 'item-2',
    name: 'Takeaway Coffee Cup',
    category: 'OTHER',
    recyclable: false,
    instructions: 'Usually lined with polyethylene plastic film; cannot be recycled with regular paper.',
    prepSteps: ['Remove plastic lid (often plastic #5 or #6, recyclable)', 'Discard paper cup in landfill bin or specialized composting'],
    commonMisconceptions: '90% of students think hot paper cups go into paper recycling, causing machine jams.',
    ecoTip: 'Bring your own travel mug to campus cafes for a 10% discount and zero waste.',
    tags: ['coffee', 'beverage', 'hot-cup', 'cafe']
  },
  {
    id: 'item-3',
    name: 'Greasy Pizza Box',
    category: 'OTHER',
    recyclable: false,
    instructions: 'Grease and food oils degrade paper fibers and cannot be washed out during recycling.',
    prepSteps: ['Tear off unsoiled clean lid for Paper recycling', 'Throw oily base into compost or general waste'],
    commonMisconceptions: 'Putting greasy cardboard in the paper bin ruins clean pulp.',
    ecoTip: 'The clean top half can always be torn off and recycled as corrugated cardboard!',
    tags: ['food', 'cardboard', 'takeout', 'grease']
  },
  {
    id: 'item-4',
    name: 'Aluminum Soda / Seltzer Can',
    category: 'METAL',
    recyclable: true,
    instructions: 'Infinitely recyclable with zero loss of metal quality. 95% less energy than virgin bauxite.',
    prepSteps: ['Empty contents completely', 'Quick rinse to eliminate sticky residue', 'Do not crush completely if automated optical sorters are used on campus'],
    ecoTip: 'Recycling 1 aluminum can saves enough electricity to power a laptop for 3 hours.',
    tags: ['can', 'drink', 'soda', 'aluminum']
  },
  {
    id: 'item-5',
    name: 'Spiral Bound Notebook',
    category: 'PAPER',
    recyclable: true,
    instructions: 'Paper pages are high-grade recyclable material.',
    prepSteps: ['Unwind or pull out metal/plastic spiral coil', 'Remove plastic covers', 'Place paper sheets into blue bin'],
    ecoTip: 'Digital note-taking apps save paper, but when paper is used, 100% recycled paper is best.',
    tags: ['stationery', 'study', 'notebook', 'notes']
  },
  {
    id: 'item-6',
    name: 'Lithium & Alkaline Batteries',
    category: 'E_WASTE',
    recyclable: true,
    instructions: 'DANGEROUS: Do NOT toss into regular bins due to fire and chemical toxicity risks.',
    prepSteps: ['Tape terminals with clear scotch or electrical tape', 'Deposit only in designated orange e-waste bins at Library or Science hub'],
    commonMisconceptions: 'Throwing batteries in trash causes landfill chemical leaching and compactor fires.',
    ecoTip: 'Rechargeable AA/AAA batteries can be recharged 500+ times, saving money and heavy metals.',
    tags: ['electronics', 'battery', 'hazardous', 'power']
  },
  {
    id: 'item-7',
    name: 'Broken Phone Charging Cable / USB Cord',
    category: 'E_WASTE',
    recyclable: true,
    instructions: 'Contains valuable copper wiring and PVC insulation.',
    prepSteps: ['Bundle neatly with rubber band or twist tie', 'Drop into campus E-waste collection bin'],
    ecoTip: 'Copper in charging cables is 100% reclaimable and highly sought after by recyclers.',
    tags: ['cords', 'charger', 'phone', 'wire']
  },
  {
    id: 'item-8',
    name: 'Clear Glass Juice Bottle',
    category: 'GLASS',
    recyclable: true,
    instructions: 'Glass is 100% circular and can be melted down endlessly.',
    prepSteps: ['Rinse out residual beverage', 'Remove metal or plastic caps (recycle separately)', 'Labels can stay on; incinerated during furnace melt'],
    ecoTip: 'Glass bottles made from cullet (recycled glass) melt at a 30% lower temperature.',
    tags: ['glass', 'bottle', 'beverage', 'jar']
  },
  {
    id: 'item-9',
    name: 'Plastic Snack & Chip Bags (Multi-layer Foil)',
    category: 'OTHER',
    recyclable: false,
    instructions: 'Composed of laminated metallized plastic that cannot be separated by standard recycling.',
    prepSteps: ['Dispose in general landfill waste or check for TerraCycle specialty drop-offs'],
    commonMisconceptions: 'The shiny inside looks like metal, but it is actually plasticized aluminum.',
    ecoTip: 'Buy snacks in bulk containers or opt for fruit/nuts in reusable silicone bags.',
    tags: ['snack', 'chips', 'crisps', 'wrapper']
  },
  {
    id: 'item-10',
    name: 'Corrugated Shipping Boxes (Amazon / Delivery)',
    category: 'PAPER',
    recyclable: true,
    instructions: 'Top tier recyclable material.',
    prepSteps: ['Remove plastic bubble wrap, airbags, and shipping invoices', 'Flatten box completely to conserve bin capacity'],
    ecoTip: 'Hostel move-in week generates 200kg of cardboard per floor; flatten them for easy pickup.',
    tags: ['packaging', 'shipping', 'delivery', 'cardboard']
  },
  {
    id: 'item-11',
    name: 'Styrofoam Takeout Box / Expanded Polystyrene',
    category: 'OTHER',
    recyclable: false,
    instructions: 'Not accepted in municipal/campus curbside bins; crumbles into microplastics.',
    prepSteps: ['Wipe clean and discard in designated general waste bin'],
    ecoTip: 'Request your campus dining halls to switch to molded fiber sugarcane pulp clamshells.',
    tags: ['food-box', 'foam', 'takeout', 'styrofoam']
  },
  {
    id: 'item-12',
    name: 'Glossy Flyers & Campus Event Posters',
    category: 'PAPER',
    recyclable: true,
    instructions: 'Modern glossy coatings are clay-based and wash out easily during pulping.',
    prepSteps: ['Remove staples or adhesive tape', 'Place in Paper recycling bin'],
    ecoTip: 'Encourage student clubs to use digital QR posters instead of mass paper distribution.',
    tags: ['poster', 'flyer', 'paper', 'event']
  },
  {
    id: 'item-13',
    name: 'Plastic Food Clamshell (PET #1 / PP #5)',
    category: 'PLASTIC',
    recyclable: true,
    instructions: 'Recyclable if thoroughly free from food residue.',
    prepSteps: ['Scrape leftover food into compost', 'Rinse with water until clear of oil films', 'Check bottom for resin ID triangle #1 or #5'],
    ecoTip: 'Food contaminated plastics attract pests and can cause entire recycle loads to be landfilled.',
    tags: ['clamshell', 'salad', 'food-container', 'takeout']
  },
  {
    id: 'item-14',
    name: 'Thermal Cash Register Receipt',
    category: 'OTHER',
    recyclable: false,
    instructions: 'Coated with Bisphenol-A (BPA) or BPS thermal chemical developer.',
    prepSteps: ['Dispose in landfill trash; do not recycle with paper to avoid chemical cross-contamination'],
    commonMisconceptions: 'Receipts seem like paper, but the chemical coating disrupts pulp recycling.',
    ecoTip: 'Opt for digital e-receipts sent via email or SMS whenever offered.',
    tags: ['receipt', 'thermal', 'paper', 'store']
  },
  {
    id: 'item-15',
    name: 'Old Laptop or Tablet',
    category: 'E_WASTE',
    recyclable: true,
    instructions: 'Rich in precious metals (Gold, Silver, Platinum, Palladium) and rare earth elements.',
    prepSteps: ['Factory reset and wipe personal hard drive data', 'Remove battery if swollen', 'Submit to campus IT E-waste drive'],
    ecoTip: '1 ton of recycled PC boards contains more gold than 17 tons of raw gold ore.',
    tags: ['laptop', 'computer', 'e-waste', 'tech']
  },
  {
    id: 'item-16',
    name: 'Steel / Tin Soup & Tuna Can',
    category: 'METAL',
    recyclable: true,
    instructions: 'Magnetic steel is highly sought after by smelters.',
    prepSteps: ['Rinse out leftover gravy or food', 'Place lid inside the can to prevent cuts', 'Recycle in Metal bin'],
    ecoTip: 'Steel can be recycled continuously without losing structural strength.',
    tags: ['tin', 'canned-food', 'metal', 'soup']
  },
  {
    id: 'item-17',
    name: 'Plastic Grocery / Shopping Bag',
    category: 'OTHER',
    recyclable: false,
    instructions: 'Thin film plastics jam sorting conveyor belts at Materials Recovery Facilities (MRF).',
    prepSteps: ['Do NOT put in standard campus bins', 'Take to designated grocery store plastic film drop-off bins'],
    ecoTip: 'Keep a compact fold-up tote bag in your backpack for spontaneous shopping.',
    tags: ['polybag', 'film', 'plastic-bag', 'grocery']
  },
  {
    id: 'item-18',
    name: 'Glass Jam / Peanut Butter Jar',
    category: 'GLASS',
    recyclable: true,
    instructions: 'Standard container glass (soda-lime).',
    prepSteps: ['Soak in warm water to rinse residue', 'Recycle metal lid in metal bin, glass jar in glass bin'],
    ecoTip: 'Clean glass jars make great reusable storage for pens, grains, or dormitory overnight oats!',
    tags: ['jar', 'jam', 'glass', 'kitchen']
  },
  {
    id: 'item-19',
    name: 'Fluorescent Tube & CFL Lightbulb',
    category: 'E_WASTE',
    recyclable: true,
    instructions: 'Contains mercury vapor! Must be handled through institutional hazardous waste.',
    prepSteps: ['Do NOT break', 'Package in protective cardboard sleeve', 'Hand to Campus Facilities or Science lab staff'],
    ecoTip: 'LED bulbs use 75% less energy and contain no toxic mercury vapor.',
    tags: ['light', 'mercury', 'bulb', 'hazardous']
  },
  {
    id: 'item-20',
    name: 'Juice / Milk Tetra Pak Carton',
    category: 'PAPER',
    recyclable: true,
    instructions: 'Aseptic composite carton with 75% paper, 20% plastic, 5% aluminum foil.',
    prepSteps: ['Push straw inside or discard straw', 'Empty liquid and flatten carton', 'Deposit in paper/carton bin where campus accepts poly-coated paper'],
    ecoTip: 'Specialist hydra-pulpers separate paper fibers from polyethylene layers efficiently.',
    tags: ['tetrapak', 'carton', 'milk', 'juice']
  },
  {
    id: 'item-21',
    name: 'Plastic Cutlery (Fork, Spoon, Knife)',
    category: 'OTHER',
    recyclable: false,
    instructions: 'Polystyrene #6 cutlery is too small and brittle for sorting machinery to capture.',
    prepSteps: ['Dispose in general waste'],
    ecoTip: 'Carry a lightweight bamboo or stainless steel cutlery pouch in your university bag.',
    tags: ['cutlery', 'utensils', 'plastic', 'fork']
  },
  {
    id: 'item-22',
    name: 'Hardcover Textbook',
    category: 'PAPER',
    recyclable: true,
    instructions: 'Pages are paper; stiff hard cover contains bookbinder glue and cardboard.',
    prepSteps: ['Cut or rip pages out from the spine', 'Recycle pages in paper bin', 'Consider donating or reselling on student textbook exchange first'],
    ecoTip: 'Book resale avoids manufacturing waste altogether and saves fellow students money.',
    tags: ['book', 'textbook', 'study', 'pages']
  },
  {
    id: 'item-23',
    name: 'Bubble Wrap & Air Pillows',
    category: 'OTHER',
    recyclable: false,
    instructions: 'LDPE #4 plastic film. Not accepted in standard campus rigid plastic bins.',
    prepSteps: ['Pop bubbles for stress relief!', 'Bundle with clean grocery bag films for grocery return'],
    ecoTip: 'Keep clean bubble wrap in dorm storage to reuse for end-of-semester shipping.',
    tags: ['packaging', 'bubblewrap', 'plastic', 'shipping']
  },
  {
    id: 'item-24',
    name: 'Plastic Yogurt / Hummus Cup (PP #5)',
    category: 'PLASTIC',
    recyclable: true,
    instructions: 'Polypropylene #5 is increasingly recyclable and transformed into car parts and storage bins.',
    prepSteps: ['Peel off foil lid completely (metal bin)', 'Rinse cup clean of dairy or food', 'Stack with other clean cups'],
    ecoTip: 'Recycled PP has a 50% lower carbon footprint than virgin fossil-based polymer.',
    tags: ['yogurt', 'food', 'plastic', 'container']
  },
  {
    id: 'item-25',
    name: 'Aerosol Spray Can (Deodorant / Hair Spray)',
    category: 'METAL',
    recyclable: true,
    instructions: 'Recyclable only when COMPLETELY empty and depressurized.',
    prepSteps: ['Hold nozzle down until hiss stops and pressure is zero', 'Remove plastic cap (recycle separately)', 'Do NOT puncture or incinerate'],
    ecoTip: 'Roll-on deodorants or solid bars use 80% less packaging volume.',
    tags: ['spray', 'aerosol', 'metal', 'deodorant']
  },
  {
    id: 'item-26',
    name: 'Empty Medicine Blister Pack',
    category: 'OTHER',
    recyclable: false,
    instructions: 'Heat-sealed aluminum and PVC plastic foil cannot be separated mechanically.',
    prepSteps: ['Dispose in general waste or check local pharmacy specialized recycling boxes'],
    ecoTip: 'Buy non-prescription vitamins in bulk recyclable amber glass or PET bottles.',
    tags: ['medicine', 'pharma', 'health', 'blister']
  },
  {
    id: 'item-27',
    name: 'Shampoo / Conditioner Bottle (HDPE #2)',
    category: 'PLASTIC',
    recyclable: true,
    instructions: 'High-density polyethylene (#2) is one of the cleanest and easiest plastics to recycle.',
    prepSteps: ['Rinse out soapy residue with warm water', 'Unscrew pump mechanism (spring pumps go in general waste)', 'Recycle bottle in plastic bin'],
    ecoTip: 'Solid shampoo bars eliminate plastic packaging entirely and last 2-3x longer.',
    tags: ['shampoo', 'bathroom', 'hygiene', 'bottle']
  },
  {
    id: 'item-28',
    name: 'Clean Aluminum Foil',
    category: 'METAL',
    recyclable: true,
    instructions: 'Aluminum foil is recyclable ONLY if free from cheese or food grease.',
    prepSteps: ['Wipe clean or rinse off food crumbs', 'Roll foil into a ball at least 2 inches (5cm) wide so sorting screens catch it'],
    ecoTip: 'Small bits of foil fall through sorting screens; combining them into a grapefruit-sized ball ensures recovery.',
    tags: ['foil', 'cooking', 'aluminum', 'kitchen']
  },
  {
    id: 'item-29',
    name: 'Cardboard Egg Carton',
    category: 'PAPER',
    recyclable: true,
    instructions: 'Molded pulp fiber is 100% biodegradable and recyclable.',
    prepSteps: ['Ensure no cracked raw egg residue', 'Place in Paper bin or campus composting station'],
    ecoTip: 'Egg cartons can also be used as seedling planters for campus garden projects.',
    tags: ['carton', 'eggs', 'paper', 'compost']
  },
  {
    id: 'item-30',
    name: 'Disposable Face Mask',
    category: 'OTHER',
    recyclable: false,
    instructions: 'Made of non-woven polypropylene plastic with metal wire and elastic.',
    prepSteps: ['Cut ear loops to protect wildlife', 'Dispose in general landfill waste bin'],
    ecoTip: 'Use washable reusable cotton masks in low-risk settings.',
    tags: ['mask', 'hygiene', 'medical', 'covid']
  },
  {
    id: 'item-31',
    name: 'Wine / Beverage Cork (Natural)',
    category: 'OTHER',
    recyclable: false,
    instructions: 'Natural tree cork is biodegradable but cannot be processed in paper/plastic streams.',
    prepSteps: ['Drop into organic compost or specialized Cork Forest recycling drop-boxes'],
    ecoTip: 'Cork harvesting doesn’t harm trees; cork oaks regenerate their bark every 9 years.',
    tags: ['cork', 'bottle', 'organic']
  },
  {
    id: 'item-32',
    name: 'Old USB Flash Drive / Thumb Drive',
    category: 'E_WASTE',
    recyclable: true,
    instructions: 'Contains NAND flash memory, controller chip, and gold-plated connector contacts.',
    prepSteps: ['Format or securely erase files', 'Deposit in E-waste bin at Science Complex'],
    ecoTip: 'Recycling 1 million USB drives yields 24kg of gold and 350kg of copper.',
    tags: ['usb', 'memory', 'flash', 'electronics']
  }
];
