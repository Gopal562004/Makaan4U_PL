// ============================================================================
// MAKAAN4U REAL ESTATE DATABASE
// Realistic Indian Property Marketplace Catalog
// Verified RERA registrations, authentic micro-markets, realistic prices
// ============================================================================

export const CITIES = [
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    tagline: "India's financial capital & premier coastal luxury market",
    coverImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹34,800",
    growthYoY: "+7.8%",
    totalListings: 1420,
    activeProjects: 84,
    description: "From iconic sea-facing penthouses along Worli Sea Face to heritage bungalows in Bandra West, Mumbai remains the crown jewel of high-value Indian real estate with unmatched capital appreciation and liquidity.",
    topLocalities: ["Worli", "Bandra West", "Lower Parel", "Andheri West", "Powai", "Juhu", "Prabhadevi"],
    marketHighlights: [
      "Mumbai Coastal Road operational, cutting South Mumbai to Suburb transit by 65%",
      "Record registration revenue exceeding ₹11,000 Cr in Q3 2025",
      "High demand for 3 & 4 BHK residences with sea and skyline panoramas"
    ]
  },
  {
    id: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    tagline: "Silicon Valley of Asia with booming luxury villa communities",
    coverImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹12,400",
    growthYoY: "+11.2%",
    totalListings: 1850,
    activeProjects: 112,
    description: "Driven by senior tech leadership and venture capital wealth, Bangalore leads India in rental yields and gated luxury villa enclaves across North Bangalore and East Tech Corridors.",
    topLocalities: ["Indiranagar", "Lavelle Road", "Whitefield", "Koramangala", "Sadashivanagar", "Sarjapur Road"],
    marketHighlights: [
      "Suburban Rail & Metro Pink Line expansion accelerating peripheral growth",
      "Strongest rental yields among Indian metros averaging 4.2% - 5.1%",
      "Sustainable green-certified developments dominating new buyer choices"
    ]
  },
  {
    id: "delhi-ncr",
    name: "Delhi NCR",
    state: "NCR (Gurgaon, Delhi, Noida)",
    tagline: "Expansive golf estates, high-rise condominiums & diplomatic enclaves",
    coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹18,600",
    growthYoY: "+14.6%",
    totalListings: 1640,
    activeProjects: 96,
    description: "Gurgaon's Golf Course Road and Dwarka Expressway command unprecedented demand for ultra-luxury gated condominium projects with private elevators and concierge services.",
    topLocalities: ["Golf Course Road", "DLF Phase 5", "Vasant Vihar", "Greater Kailash II", "Noida Expressway", "Sohna Road"],
    marketHighlights: [
      "Dwarka Expressway operational corridor driving tier-1 developer launches",
      "Penthouse category registering over 28% year-on-year capital appreciation",
      "Delhi Master Plan 2041 reshaping low-density residential sectors"
    ]
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    tagline: "Cultural capital & thriving automotive/IT hub with leafy green estates",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹9,200",
    growthYoY: "+8.9%",
    totalListings: 980,
    activeProjects: 65,
    description: "Known for cosmopolitan living, Pune offers tree-lined avenues in Koregaon Park and modern high-rises in Baner and Kharadi, attracting diaspora investors and professionals.",
    topLocalities: ["Koregaon Park", "Kalyani Nagar", "Baner", "Boat Club Road", "Kharadi", "Aundh"],
    marketHighlights: [
      "Pune Ring Road Phase 1 triggering residential plotted growth",
      "Emerging as primary retirement and second-home preference for Mumbaikars",
      "IT corridors seeing steady 8-10% rental increases annually"
    ]
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    tagline: "India's fastest-growing infrastructure & ultra-modern skyscraper city",
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹10,800",
    growthYoY: "+12.4%",
    totalListings: 1120,
    activeProjects: 78,
    description: "With wide expressways, uninterrupted power and business-friendly policy, Hyderabad's Financial District and Kokapet boast some of India's tallest residential towers.",
    topLocalities: ["Jubilee Hills", "Banjara Hills", "Gachibowli", "Financial District", "Kokapet", "Hitec City"],
    marketHighlights: [
      "Kokapet Neopolis auctions setting historic state land benchmark prices",
      "High livability score with extensive Outer Ring Road connectivity",
      "Exponential NRI luxury demand for 4,000+ sq.ft sky villas"
    ]
  },
  {
    id: "goa",
    name: "Goa",
    state: "Goa",
    tagline: "Portuguese heritage villas, tropical sanctuaries & coastal retreats",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹16,500",
    growthYoY: "+15.8%",
    totalListings: 430,
    activeProjects: 32,
    description: "North Goa's Assagao and Siolim have evolved into India's premier creative lifestyle destination with restored 19th-century Portuguese estates and contemporary tropical modernist villas.",
    topLocalities: ["Assagao", "Siolim", "Candolim", "Moira", "Anjuna", "Aldona"],
    marketHighlights: [
      "Mopa (Manohar) International Airport unlocking North Goa accessibility",
      "Highest short-stay holiday rental occupancy yielding up to 8.5% gross",
      "Strict FAR and heritage preservation laws maintaining scarcity value"
    ]
  }
];

export const LOCALITIES = [
  {
    id: "worli",
    name: "Worli",
    city: "Mumbai",
    cityId: "mumbai",
    avgPrice: "₹52,000/sq.ft",
    priceRange: "₹45,000 - ₹85,000/sq.ft",
    growthRate: "+8.5% YoY",
    lifestyleRating: 9.8,
    connectivityRating: 9.6,
    totalProperties: 184,
    description: "South Mumbai's undisputed luxury bastion. Home to ultra-exclusive residential skyscrapers overlooking the Arabian Sea, premier clubhouses, and direct connectivity via the Coastal Road and Sea Link.",
    landmarks: ["Bandra-Worli Sea Link", "Four Seasons Hotel", "High Street Phoenix & Palladium", "Mahalaxmi Racecourse"],
    schools: ["Podar International", "Aditya Birla World Academy", "The Cathedral & John Connon (nearby)"],
    hospitals: ["Hinduja Healthcare", "Jaslok Hospital", "Breach Candy Hospital"]
  },
  {
    id: "bandra-west",
    name: "Bandra West",
    city: "Mumbai",
    cityId: "mumbai",
    avgPrice: "₹64,000/sq.ft",
    priceRange: "₹55,000 - ₹95,000/sq.ft",
    growthRate: "+9.2% YoY",
    lifestyleRating: 9.9,
    connectivityRating: 9.4,
    totalProperties: 142,
    description: "The 'Queen of the Suburbs' blends colonial seaside charm with world-class fine dining, art galleries, and celebrity addresses on Carter Road and Bandstand.",
    landmarks: ["Carter Road Promenade", "Bandstand", "Bandra Fort", "Pali Hill Boutique Cafes"],
    schools: ["St. Stanislaus High School", "St. Anne's", "Dhirubhai Ambani International (BKC transit)"],
    hospitals: ["Lilavati Hospital", "Holy Family Hospital"]
  },
  {
    id: "indiranagar",
    name: "Indiranagar",
    city: "Bangalore",
    cityId: "bangalore",
    avgPrice: "₹18,500/sq.ft",
    priceRange: "₹15,000 - ₹24,000/sq.ft",
    growthRate: "+10.4% YoY",
    lifestyleRating: 9.7,
    connectivityRating: 9.5,
    totalProperties: 168,
    description: "Bangalore's cultural and gastronomy epicentre. Tree-canopied residential layouts flanked by 100 Feet Road and 12th Main, combining serene living with elite social life.",
    landmarks: ["100 Feet Road Retail Promenade", "Indiranagar Club", "Namma Metro Purple Line Station"],
    schools: ["National Public School (NPS)", "The Frank Anthony Public School"],
    hospitals: ["Manipal Hospital Old Airport Rd", "Chinmaya Mission Hospital"]
  },
  {
    id: "golf-course-road",
    name: "Golf Course Road",
    city: "Delhi NCR",
    cityId: "delhi-ncr",
    avgPrice: "₹29,000/sq.ft",
    priceRange: "₹24,000 - ₹48,000/sq.ft",
    growthRate: "+16.8% YoY",
    lifestyleRating: 9.8,
    connectivityRating: 9.7,
    totalProperties: 215,
    description: "The prestigious billionaire mile of Gurgaon. Home to DLF Camellias and Magnolias with world-class 16-lane signal-free expressway, rapid metro, and championship golf courses.",
    landmarks: ["DLF Golf & Country Club", "Horizon Center", "One Horizon Gourmet Alley"],
    schools: ["The Shri Ram School Aravali", "Heritage Xperiential Learning School"],
    hospitals: ["Fortis Memorial Research Institute", "Max Super Speciality Hospital"]
  },
  {
    id: "assagao",
    name: "Assagao",
    city: "Goa",
    cityId: "goa",
    avgPrice: "₹22,000/sq.ft",
    priceRange: "₹18,000 - ₹35,000/sq.ft",
    growthRate: "+18.2% YoY",
    lifestyleRating: 9.9,
    connectivityRating: 8.8,
    totalProperties: 86,
    description: "The 'Beverly Hills of Goa', nestled within lush tropical valley hillsides. Characterized by bougainvillea-framed Indo-Portuguese mansions, curated concept stores, and artisanal dining.",
    landmarks: ["Villa Blanche Bistro", "Soro Village Pub", "St. Cajetan Church"],
    schools: ["St. Anthony's High School", "International School of Goa"],
    hospitals: ["Manipal Hospital Dona Paula (transit)", "Vision Multi-Speciality Mapusa"]
  }
];

export const DEVELOPERS = [
  {
    id: "godrej-properties",
    name: "Godrej Properties",
    established: "1990",
    headquarters: "Mumbai, Maharashtra",
    reraCompliance: "100% RERA Registered",
    completedProjects: 92,
    ongoingProjects: 48,
    rating: 4.8,
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80",
    description: "Part of the 127-year-old Godrej Group legacy. Renowned for environmental stewardship, cutting-edge architectural partnerships, and punctual delivery track record across 12 Indian cities."
  },
  {
    id: "oberoi-realty",
    name: "Oberoi Realty",
    established: "1998",
    headquarters: "Mumbai, Maharashtra",
    reraCompliance: "100% RERA Registered",
    completedProjects: 44,
    ongoingProjects: 18,
    rating: 4.9,
    logo: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=200&auto=format&fit=crop&q=80",
    description: "Synonymous with immaculate engineering, high-ceiling luxury residences, and integrated township masterpieces like Oberoi Garden City Goregaon and Forestville Thane."
  },
  {
    id: "dlf-limited",
    name: "DLF Limited",
    established: "1946",
    headquarters: "New Delhi & Gurgaon",
    reraCompliance: "100% RERA Registered",
    completedProjects: 150,
    ongoingProjects: 36,
    rating: 4.9,
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80",
    description: "India's largest listed real estate company by market capitalization. DLF created modern Gurgaon and sets the global benchmark for super-luxury residential estates with The Camellias."
  },
  {
    id: "prestige-group",
    name: "Prestige Group",
    established: "1986",
    headquarters: "Bangalore, Karnataka",
    reraCompliance: "100% RERA Registered",
    completedProjects: 140,
    ongoingProjects: 52,
    rating: 4.8,
    logo: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=200&auto=format&fit=crop&q=80",
    description: "Pioneering South Indian developer with expanding footprints in Mumbai and NCR. Known for transformative townships, ultra-luxury high-rises, and Falcon City master developments."
  },
  {
    id: "lodha-group",
    name: "Lodha (Macrotech)",
    established: "1980",
    headquarters: "Mumbai, Maharashtra",
    reraCompliance: "100% RERA Registered",
    completedProjects: 130,
    ongoingProjects: 60,
    rating: 4.7,
    logo: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=200&auto=format&fit=crop&q=80",
    description: "Building world-class landmarks including The World Towers, Lodha Altamount, and Palava Smart City. Renowned for signature collaborations with Armani/Casa and Pei Cobb Freed."
  }
];

export const PROJECTS = [
  {
    id: "proj-1",
    slug: "oberoi-forestville",
    title: "Oberoi Forestville",
    developer: "Oberoi Realty",
    developerId: "oberoi-realty",
    city: "Mumbai",
    locality: "Kolshet, Thane West",
    category: "New Launch",
    status: "Under Construction",
    startingPrice: "₹2.25 Cr",
    priceRange: "₹2.25 Cr - ₹4.80 Cr",
    configuration: "3 & 4 BHK Luxury Residences",
    possessionDate: "December 2028",
    reraNumber: "P51700050312",
    constructionStatus: "Foundation Completed & 14 Floors Cast",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1000&auto=format&fit=crop&q=80"
    ],
    highlights: [
      "5 towers spread across 18 acres with 70% open green biophilic spaces",
      "Design inspired by biophilia with forest walking trails and natural canopy",
      "Olympic-sized temperature controlled lap pool and dual clubhouses",
      "Direct feeder to upcoming Metro Line 4 and Ghodbunder freeway"
    ],
    units: [
      { type: "3 BHK Elegance", carpetArea: "1,090 sq.ft", price: "₹2.25 Cr onward" },
      { type: "3 BHK Grande", carpetArea: "1,280 sq.ft", price: "₹2.70 Cr onward" },
      { type: "4 BHK Royal Suite", carpetArea: "1,780 sq.ft", price: "₹3.95 Cr onward" }
    ]
  },
  {
    id: "proj-2",
    slug: "dlf-the-camellias",
    title: "DLF The Camellias",
    developer: "DLF Limited",
    developerId: "dlf-limited",
    city: "Delhi NCR",
    locality: "Golf Course Road, Gurgaon",
    category: "Ultra-Luxury",
    status: "Ready to Move",
    startingPrice: "₹38.00 Cr",
    priceRange: "₹38.00 Cr - ₹85.00 Cr",
    configuration: "4, 5 BHK & Penthouse Estates",
    possessionDate: "Ready to Move",
    reraNumber: "RC/REP/HAR/2018/14",
    constructionStatus: "Completed with Occupancy Certificate (OC)",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1000&auto=format&fit=crop&q=80"
    ],
    highlights: [
      "Ranked among the top 10 most exclusive residential addresses globally",
      "160,000 sq.ft Clubhouse with 7 dining rooms, Michelin chef residencies",
      "Unobstructed views over DLF Golf Course and Aravalli Ridge forest",
      "Single apartment per lobby wing with private high-speed biometric lifts"
    ],
    units: [
      { type: "4 BHK Signature", carpetArea: "7,400 sq.ft", price: "₹42.00 Cr" },
      { type: "5 BHK Imperial", carpetArea: "9,500 sq.ft", price: "₹56.00 Cr" },
      { type: "Sky Penthouse", carpetArea: "14,000 sq.ft", price: "₹85.00 Cr" }
    ]
  },
  {
    id: "proj-3",
    slug: "prestige-kingfisher-towers",
    title: "Prestige Kingfisher Towers",
    developer: "Prestige Group",
    developerId: "prestige-group",
    city: "Bangalore",
    locality: "Lavelle Road, Central Bangalore",
    category: "Premium Projects",
    status: "Ready to Move",
    startingPrice: "₹28.50 Cr",
    priceRange: "₹28.50 Cr - ₹45.00 Cr",
    configuration: "4 BHK Ultra-Spacious Sky Villas",
    possessionDate: "Ready to Move",
    reraNumber: "PRM/KA/RERA/1251/310/PR/171015/000414",
    constructionStatus: "Delivered & Inhabited by Top Promoters",
    coverImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&auto=format&fit=crop&q=80"
    ],
    highlights: [
      "Overlooks the 300-acre green canopy of historic Cubbon Park",
      "Floor-to-ceiling double-glazed low-E soundproof glass curtain walling",
      "Dedicated concierge desk managed by international hospitality team"
    ],
    units: [
      { type: "4 BHK Sky Villa A", carpetArea: "8,321 sq.ft", price: "₹28.50 Cr" },
      { type: "4 BHK Penthouse", carpetArea: "11,500 sq.ft", price: "₹45.00 Cr" }
    ]
  },
  {
    id: "proj-4",
    slug: "godrej-reserve-kandivali",
    title: "Godrej Reserve",
    developer: "Godrej Properties",
    developerId: "godrej-properties",
    city: "Mumbai",
    locality: "Kandivali East, Mumbai",
    category: "New Launch",
    status: "Under Construction",
    startingPrice: "₹1.95 Cr",
    priceRange: "₹1.95 Cr - ₹3.75 Cr",
    configuration: "2, 3 & 4 BHK Forest-Facing Homes",
    possessionDate: "March 2029",
    reraNumber: "P51800054321",
    constructionStatus: "Excavation and Piling Complete",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80"
    ],
    highlights: [
      "Adjacent to Sanjay Gandhi National Park with unhindered forest views",
      "Low carbon footprint construction with platinum IGBC pre-certification",
      "6 curated club zones including co-working pods and amphitheatre"
    ],
    units: [
      { type: "2 BHK Forest View", carpetArea: "730 sq.ft", price: "₹1.95 Cr" },
      { type: "3 BHK Grande", carpetArea: "1,040 sq.ft", price: "₹2.65 Cr" },
      { type: "4 BHK Horizon", carpetArea: "1,520 sq.ft", price: "₹3.75 Cr" }
    ]
  }
];

export const PROPERTIES = [
  {
    id: "prop-mumbai-1",
    slug: "the-reserve-worli-sea-face",
    title: "The Reserve at Worli Sea Face",
    propertyType: "Apartment",
    listingType: "Buy",
    price: "₹14.50 Cr",
    priceNumeric: 145000000,
    pricePerSqFt: "₹58,700/sq.ft",
    carpetArea: "2,470 sq.ft",
    superArea: "3,150 sq.ft",
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    floor: "31st of 45 Floors",
    facing: "West (Arabian Sea Facing)",
    possession: "Ready to Move",
    ageOfProperty: "2 Years",
    furnishing: "Semi-Furnished (Poliform Italian Kitchen)",
    parking: "3 Covered Podiums",
    maintenance: "₹24,000/month",
    reraId: "P51900008342",
    verified: true,
    featured: true,
    city: "Mumbai",
    locality: "Worli",
    address: "Dr. Annie Besant Road, Worli Sea Face, Mumbai 400018",
    coordinates: { lat: 19.0144, lng: 72.8154 },
    developer: "K Raheja Corp",
    agent: {
      id: "agent-1",
      name: "Rajeshwar Sengupta",
      agency: "South Mumbai Private Office",
      phone: "+91 98201 44820",
      email: "rajeshwar.s@makaan4u.com",
      reraNo: "A51900034821",
      rating: 4.9,
      experience: "16 Years in Luxury S-Mumbai",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
    },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&auto=format&fit=crop&q=80"
    ],
    overview: "Commanding 270-degree panoramas of the Arabian Sea and Bandra-Worli Sea Link, this custom 31st-floor residence represents the pinnacle of contemporary coastal living. Floor-to-ceiling low-iron acoustic glazing, imported Travertine marble flooring throughout living lounges, and a wrap-around sunset deck crafted for effortless hosting.",
    amenities: [
      { name: "Infinity Sea-view Pool", category: "Wellness" },
      { name: "Private Residents Spa & Sauna", category: "Wellness" },
      { name: "Technogym Certified Studio", category: "Sports" },
      { name: "Temperature Controlled Wine Cellar", category: "Lifestyle" },
      { name: "24/7 Multi-Tiered Biometric Security", category: "Security" },
      { name: "EV Charging Infrastructure", category: "Eco" },
      { name: "Concierge & Valet Service", category: "Service" },
      { name: "100% Full Power Backup", category: "Utility" }
    ],
    floorPlanUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80",
    nearbyLandmarks: [
      { name: "Worli Coastal Road Interchange", distance: "450 m", time: "2 min drive" },
      { name: "Palladium & High Street Phoenix", distance: "1.8 km", time: "6 min drive" },
      { name: "Bandra-Worli Sea Link Gate", distance: "1.2 km", time: "4 min drive" },
      { name: "Jaslok Super-Speciality Hospital", distance: "3.5 km", time: "12 min drive" }
    ],
    priceHistory: [
      { year: "2023", pricePerSqFt: 51200 },
      { year: "2024", pricePerSqFt: 54600 },
      { year: "2025", pricePerSqFt: 58700 }
    ]
  },
  {
    id: "prop-mumbai-2",
    slug: "heritage-sanctuary-pali-hill",
    title: "The Glass House on Pali Hill",
    propertyType: "Independent House",
    listingType: "Buy",
    price: "₹26.00 Cr",
    priceNumeric: 260000000,
    pricePerSqFt: "₹72,200/sq.ft",
    carpetArea: "3,600 sq.ft",
    superArea: "4,400 sq.ft",
    bedrooms: 5,
    bathrooms: 6,
    balconies: 4,
    floor: "G+2 Standalone Villa",
    facing: "East (Vastu Compliant)",
    possession: "Ready to Move",
    ageOfProperty: "New Construction (2024)",
    furnishing: "Fully Furnished by Architectural Digest 100 Studio",
    parking: "4 Dedicated Driveway Bays",
    maintenance: "₹18,000/month",
    reraId: "P51800049102",
    verified: true,
    featured: true,
    city: "Mumbai",
    locality: "Bandra West",
    address: "Zig Zag Road, Pali Hill, Bandra West, Mumbai 400050",
    coordinates: { lat: 19.0626, lng: 72.8294 },
    developer: "Signature Homes Atelier",
    agent: {
      id: "agent-2",
      name: "Tanya Shroff",
      agency: "Bandra Heritage Estates",
      phone: "+91 98190 28411",
      email: "tanya.shroff@makaan4u.com",
      reraNo: "A51800021940",
      rating: 5.0,
      experience: "12 Years in Pali Hill & Carter Road",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
    },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&auto=format&fit=crop&q=80"
    ],
    overview: "Set amidst the ancient banyan trees of Pali Hill, this rare private architectural villa balances tropical modernist lines with private garden courtyards and private rooftop lap pool. Crafted with fluted basalt stonework, Burmese teak cabinetry, and double-height gallery living spaces.",
    amenities: [
      { name: "Private Rooftop Lap Pool", category: "Wellness" },
      { name: "Landscaped Zen Courtyard", category: "Eco" },
      { name: "Private Otis Glass Elevator", category: "Utility" },
      { name: "Sub-Zero & Wolf Gourmet Kitchen", category: "Lifestyle" },
      { name: "Dedicated Staff Quarters (2 rooms)", category: "Service" },
      { name: "Perimeter Infrared Security", category: "Security" }
    ],
    nearbyLandmarks: [
      { name: "Carter Road Promenade", distance: "600 m", time: "3 min drive" },
      { name: "Bandra Gymkhana", distance: "850 m", time: "4 min walk" },
      { name: "Lilavati Super Speciality Hospital", distance: "2.1 km", time: "8 min drive" }
    ],
    priceHistory: [
      { year: "2023", pricePerSqFt: 64000 },
      { year: "2024", pricePerSqFt: 68500 },
      { year: "2025", pricePerSqFt: 72200 }
    ]
  },
  {
    id: "prop-blr-1",
    slug: "the-penthouse-indiranagar-defence-colony",
    title: "Penthouse at Defence Colony",
    propertyType: "Apartment",
    listingType: "Buy",
    price: "₹7.80 Cr",
    priceNumeric: 78000000,
    pricePerSqFt: "₹24,375/sq.ft",
    carpetArea: "3,200 sq.ft",
    superArea: "3,850 sq.ft",
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    floor: "Top 8th & 9th Duplex",
    facing: "North-East",
    possession: "Ready to Move",
    ageOfProperty: "1 Year",
    furnishing: "Semi-Furnished (Engineered Oak Floors)",
    parking: "2 Covered Bays",
    maintenance: "₹14,500/month",
    reraId: "PRM/KA/RERA/1251/310/PR/200118/003180",
    verified: true,
    featured: false,
    city: "Bangalore",
    locality: "Indiranagar",
    address: "Defence Colony, 6th Main Road, Indiranagar, Bangalore 560038",
    coordinates: { lat: 12.9784, lng: 77.6408 },
    developer: "Prestige Group",
    agent: {
      id: "agent-3",
      name: "Karthik Narayanan",
      agency: "East Bangalore Prime Realty",
      phone: "+91 98450 33902",
      email: "karthik.n@makaan4u.com",
      reraNo: "AG/KA/2019/008812",
      rating: 4.8,
      experience: "10 Years in Central Bangalore",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
    },
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=80"
    ],
    overview: "Nestled on a serene tree-lined cul-de-sac in Defence Colony, this duplex penthouse features 18-foot double-height salon windows overlooking Bangalore's historic green canopy. Complete with private sky terrace garden, motorized pergola, and smart climate control.",
    amenities: [
      { name: "Private Landscaped Sky Garden", category: "Eco" },
      { name: "Direct Penthouse Keycard Access", category: "Security" },
      { name: "Clubhouse with Squash Court", category: "Sports" },
      { name: "100% Solar Water Heating System", category: "Eco" },
      { name: "Dual Borewell + Cauvery Water Line", category: "Utility" }
    ],
    nearbyLandmarks: [
      { name: "100 Feet Road Commercial District", distance: "400 m", time: "5 min walk" },
      { name: "Indiranagar Metro Station", distance: "850 m", time: "3 min drive" },
      { name: "Manipal Hospital Old Airport Rd", distance: "2.4 km", time: "8 min drive" }
    ],
    priceHistory: [
      { year: "2023", pricePerSqFt: 21000 },
      { year: "2024", pricePerSqFt: 22800 },
      { year: "2025", pricePerSqFt: 24375 }
    ]
  },
  {
    id: "prop-gurgaon-1",
    slug: "dlf-camellias-golf-facing-suite",
    title: "Golf View Suite at The Camellias",
    propertyType: "Apartment",
    listingType: "Buy",
    price: "₹45.00 Cr",
    priceNumeric: 450000000,
    pricePerSqFt: "₹60,800/sq.ft",
    carpetArea: "7,400 sq.ft",
    superArea: "8,800 sq.ft",
    bedrooms: 5,
    bathrooms: 6,
    balconies: 3,
    floor: "18th of 38 Floors",
    facing: "North-West (Full Championship Golf Course View)",
    possession: "Ready to Move",
    ageOfProperty: "Under 2 Years",
    furnishing: "Bare Shell with Luxury Fit-Out Allowance",
    parking: "4 Stilt Bays",
    maintenance: "₹68,000/month",
    reraId: "RC/REP/HAR/2018/14",
    verified: true,
    featured: true,
    city: "Delhi NCR",
    locality: "Golf Course Road",
    address: "DLF Phase 5, Golf Course Road, Sector 42, Gurgaon 122002",
    coordinates: { lat: 28.4595, lng: 77.0988 },
    developer: "DLF Limited",
    agent: {
      id: "agent-4",
      name: "Vikramaditya Oberoi",
      agency: "Capital Assets Advisory NCR",
      phone: "+91 99100 84729",
      email: "vikramaditya@makaan4u.com",
      reraNo: "HRERA-PKL-REA-2020-044",
      rating: 4.9,
      experience: "18 Years in Luxury NCR Real Estate",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
    },
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&auto=format&fit=crop&q=80"
    ],
    overview: "Regarded as India's most prestigious gated condominium address. This 7,400 sq.ft single-level residence offers sweeping vistas over the Arnold Palmer & Gary Player golf courses. Features double master suites, 11-foot clear slab ceilings, acoustic isolation membranes, and exclusive access to the 1.6 lakh sq.ft Clubhouse.",
    amenities: [
      { name: "Championship 18-Hole Golf Access", category: "Sports" },
      { name: "Resident Concierge & Butler Wing", category: "Service" },
      { name: "Heated Indoor & Outdoor Olympic Pools", category: "Wellness" },
      { name: "Private Screening Theatre (48 Seats)", category: "Lifestyle" },
      { name: "HEPA Fresh Air Circulation Filter System", category: "Eco" },
      { name: "3-Tier Armed Perimeter Protocol", category: "Security" }
    ],
    nearbyLandmarks: [
      { name: "One Horizon Center Dining", distance: "300 m", time: "3 min walk" },
      { name: "Sector 42-43 Rapid Metro", distance: "600 m", time: "2 min drive" },
      { name: "IGI International Airport T3", distance: "16 km", time: "22 min drive via Express" }
    ],
    priceHistory: [
      { year: "2023", pricePerSqFt: 46000 },
      { year: "2024", pricePerSqFt: 53500 },
      { year: "2025", pricePerSqFt: 60800 }
    ]
  },
  {
    id: "prop-goa-1",
    slug: "casa-terracotta-assagao-villa",
    title: "Casa Terracotta Portuguese Estate",
    propertyType: "Villa",
    listingType: "Buy",
    price: "₹11.20 Cr",
    priceNumeric: 112000000,
    pricePerSqFt: "₹28,000/sq.ft",
    carpetArea: "4,000 sq.ft",
    superArea: "6,500 sq.ft (Plot Area 11,200 sq.ft)",
    bedrooms: 4,
    bathrooms: 5,
    balconies: 2,
    floor: "Ground + 1 Portuguese Layout",
    facing: "South-West (Valley & Sunset Views)",
    possession: "Ready to Move",
    ageOfProperty: "Restored & Expanded (2024)",
    furnishing: "Fully Furnished with Antique Reclaimed Teak",
    parking: "3 Vehicle Covered Garage",
    maintenance: "₹12,000/month",
    reraId: "PRGO08211420",
    verified: true,
    featured: true,
    city: "Goa",
    locality: "Assagao",
    address: "Badem Road, Assagao, North Goa 403507",
    coordinates: { lat: 15.5908, lng: 73.7712 },
    developer: "Isprava Luxury Homes",
    agent: {
      id: "agent-5",
      name: "Leanne D'Souza",
      agency: "Goa Coastal Heritage Properties",
      phone: "+91 98221 90432",
      email: "leanne.dsouza@makaan4u.com",
      reraNo: "RERA-GOA-AG-2018-091",
      rating: 5.0,
      experience: "14 Years in North Goa Luxury",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
    },
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80"
    ],
    overview: "A timeless heritage Indo-Portuguese villa sensitively updated with modern comforts. Features handcrafted ceramic terracotta roof tiles, antique brass fittings, private turquoise pool set within a private mango orchard, and high vaulted timber ceilings.",
    amenities: [
      { name: "Private 14m Turquoise Lap Pool", category: "Wellness" },
      { name: "Private Mango & Frangipani Orchard", category: "Eco" },
      { name: "Covered Alfresco Dining Pavilion", category: "Lifestyle" },
      { name: "Separate 2-Bedroom Caretaker Cottage", category: "Service" },
      { name: "Generac Silent Diesel Generator", category: "Utility" }
    ],
    nearbyLandmarks: [
      { name: "Villa Blanche Bistro Assagao", distance: "350 m", time: "4 min walk" },
      { name: "Vagator & Ozran Beaches", distance: "3.2 km", time: "8 min drive" },
      { name: "Mopa International Airport", distance: "28 km", time: "35 min drive" }
    ],
    priceHistory: [
      { year: "2023", pricePerSqFt: 22000 },
      { year: "2024", pricePerSqFt: 25500 },
      { year: "2025", pricePerSqFt: 28000 }
    ]
  },
  {
    id: "prop-pune-1",
    slug: "koregaon-park-lane-5-garden-residence",
    title: "Garden Residence at Koregaon Park",
    propertyType: "Apartment",
    listingType: "Buy",
    price: "₹4.85 Cr",
    priceNumeric: 48500000,
    pricePerSqFt: "₹18,650/sq.ft",
    carpetArea: "2,600 sq.ft",
    superArea: "3,100 sq.ft",
    bedrooms: 3,
    bathrooms: 4,
    balconies: 2,
    floor: "4th of 12 Floors",
    facing: "East (Tree-Canopy View)",
    possession: "Ready to Move",
    ageOfProperty: "Under 3 Years",
    furnishing: "Semi-Furnished with German Poggenpohl Kitchen",
    parking: "2 Covered Stilt Bays",
    maintenance: "₹9,500/month",
    reraId: "P52100019283",
    verified: true,
    featured: false,
    city: "Pune",
    locality: "Koregaon Park",
    address: "Lane 5, North Main Road, Koregaon Park, Pune 411001",
    coordinates: { lat: 18.5362, lng: 73.894 },
    developer: "Marvel Realtors Legacy",
    agent: {
      id: "agent-6",
      name: "Amitabh Kulkarni",
      agency: "Pune Prime Realty",
      phone: "+91 98220 18491",
      email: "amitabh.k@makaan4u.com",
      reraNo: "A52100004128",
      rating: 4.8,
      experience: "15 Years in Koregaon Park & Boat Club Rd",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
    },
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80"
    ],
    overview: "Set along Pune's prestigious Lane 5, this boutique residence captures the signature leafiness of Koregaon Park. Expansive glass decks open directly into 80-year-old rain trees, with direct access to Pune's finest organic dining and artisanal bakeries.",
    amenities: [
      { name: "Rooftop Heated Plunge Pool", category: "Wellness" },
      { name: "Private Gymnasium", category: "Sports" },
      { name: "Automated Lighting & Shading Controls", category: "Lifestyle" },
      { name: "Full Rainwater Harvesting & Greywater Recycling", category: "Eco" }
    ],
    nearbyLandmarks: [
      { name: "Osho Teerth Park & Ashram", distance: "400 m", time: "5 min walk" },
      { name: "German Bakery Koregaon Park", distance: "300 m", time: "4 min walk" },
      { name: "Pune Railway Station", distance: "3.2 km", time: "10 min drive" }
    ],
    priceHistory: [
      { year: "2023", pricePerSqFt: 16200 },
      { year: "2024", pricePerSqFt: 17400 },
      { year: "2025", pricePerSqFt: 18650 }
    ]
  },
  {
    id: "prop-mumbai-rent-1",
    slug: "luxury-rental-bkc-sky-residence",
    title: "Executive Penthouse at BKC",
    propertyType: "Apartment",
    listingType: "Rent",
    price: "₹3.50 L/mo",
    priceNumeric: 350000,
    pricePerSqFt: "₹175/sq.ft/mo",
    carpetArea: "2,000 sq.ft",
    superArea: "2,450 sq.ft",
    bedrooms: 3,
    bathrooms: 4,
    balconies: 2,
    floor: "19th of 24 Floors",
    facing: "North-West (BKC Financial District Skyline)",
    possession: "Immediate",
    ageOfProperty: "Under 1 Year",
    furnishing: "Fully Furnished (Miele Appliances)",
    parking: "2 Covered Bays",
    maintenance: "Included in Rent",
    reraId: "P51800028910",
    verified: true,
    featured: false,
    city: "Mumbai",
    locality: "BKC",
    address: "Bandra Kurla Complex, G Block, Mumbai 400051",
    coordinates: { lat: 19.0657, lng: 72.8687 },
    developer: "Sunteck Realty",
    agent: {
      id: "agent-1",
      name: "Rajeshwar Sengupta",
      agency: "South Mumbai Private Office",
      phone: "+91 98201 44820",
      email: "rajeshwar.s@makaan4u.com",
      reraNo: "A51900034821",
      rating: 4.9,
      experience: "16 Years in Luxury S-Mumbai",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
    },
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80"
    ],
    overview: "Ideally situated inside BKC's core commercial hub, this 3 BHK executive residence is tailor-made for multinational leadership and expatriate executives. Featuring concierge assistance, 24/7 security, club facilities, and walking proximity to major banking headquarters and Jio World Plaza.",
    amenities: [
      { name: "24-Hour Valet & Concierge", category: "Service" },
      { name: "State-of-the-Art Fitness Center", category: "Sports" },
      { name: "Business Lounge & Private Meeting Pods", category: "Lifestyle" }
    ],
    nearbyLandmarks: [
      { name: "Jio World Plaza & Drive", distance: "400 m", time: "5 min walk" },
      { name: "Mumbai Domestic Airport", distance: "6.5 km", time: "15 min drive" }
    ],
    priceHistory: [
      { year: "2023", pricePerSqFt: 155 },
      { year: "2024", pricePerSqFt: 165 },
      { year: "2025", pricePerSqFt: 175 }
    ]
  }
];

export const INSIGHTS_ARTICLES = [
  {
    id: "art-1",
    slug: "rera-2-compliance-homebuyer-checklist",
    title: "RERA 2.0 Compliance: The Definitive Homebuyer Due-Diligence Checklist",
    category: "Legal & RERA",
    readingTime: "7 min read",
    publishedDate: "October 18, 2026",
    author: {
      name: "Adv. Sunita Mahapatra",
      title: "Senior Real Estate Counsel, High Court of Bombay",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
    },
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    excerpt: "With the latest appellate directives mandating quarterly escrow reconciliation and mandatory defect liability clauses, here is what high-value buyers must inspect before signing the agreement for sale.",
    content: `
### The Evolution of RERA Oversight in 2026

The Real Estate (Regulation and Development) Act has reached a mature milestone. Where early enforcement primarily focused on registration compliance, today's regulatory apparatus rigorously monitors **project escrow accounts (70% rule)**, promoter disclosures on construction milestones, and strict structural defect liability periods extending five years post possession.

### 5 Non-Negotiable Document Verifications

1. **Escrow Bank Audit Reports:** Every registered project must submit half-yearly audited certificates by a chartered accountant confirming that funds collected have strictly matched the percentage of physical site completion.
2. **Encumbrance Certificate & Title Search (30 Years):** Never rely solely on a standard bank pre-approval. Verify that the title report independently traces ownership history without pending litigation.
3. **Approved Sanctioned Plans vs. Marketing Layouts:** Promoters cannot alter sanctioned layouts or carpet areas by more than 5% without the prior written consent of at least two-thirds of the allottees.
4. **Commencement Certificate (CC) Phasing:** Ensure the CC is valid up to your specific floor level, not merely for the plinth or lower podiums.
5. **Carpet Area Calculation as per RERA definition:** Verify net usable floor area excluding external walls, service shafts, and common passages.

### Remedial Rights for Delayed Possession

Under Section 18 of RERA, if a promoter fails to deliver possession within the committed timeline, allottees retain the statutory right to seek a complete refund of amounts paid along with interest at the prescribed State Bank of India MCLR rate + 2%, or continue with monthly compensatory interest until actual handover.
    `,
    relatedLocalities: ["Worli", "Bandra West", "Golf Course Road"]
  },
  {
    id: "art-2",
    slug: "mumbai-coastal-road-western-suburbs-capital-gains",
    title: "The Mumbai Coastal Road Effect: Capital Appreciation Along Western Suburbs",
    category: "Market Trends",
    readingTime: "6 min read",
    publishedDate: "October 14, 2026",
    author: {
      name: "Nikhil Chidambaram",
      title: "Head of Research, Makaan4U Insights",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    heroImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Comprehensive data analysis reveals how the operational Coastal Road tunnel has re-priced prime micro-markets in Prabhadevi, Worli, and Bandra, compressing commuting times and accelerating redevelopment.",
    content: `
### Urban Transit Transformation

The commissioning of the Mumbai Coastal Road (Dharmaveer Swarajya Rakshak Chhatrapati Sambhaji Maharaj Coastal Road) represents the most decisive shift in South-to-West transit dynamics since the opening of the Bandra-Worli Sea Link in 2009.

Commuting times between Marine Drive and Worli have dropped from 45 minutes during peak evening hours to under 11 minutes. This physical compression of distance has had an immediate ripple effect on capital pricing:

- **Worli Sea Face & Lower Parel:** +9.4% appreciation over the last 12 months.
- **Prabhadevi & Shivaji Park:** Increased liquidity for 3+ BHK inventory previously constrained by traffic congestion.
- **Bandra Reclamation & Mount Mary:** Heightened interest from South Mumbai legacy families seeking larger carpet areas without sacrificing proximity to Nariman Point.
    `,
    relatedLocalities: ["Worli", "Bandra West"]
  },
  {
    id: "art-3",
    slug: "fractional-ownership-commercial-real-estate-india",
    title: "Fractional Ownership in Commercial Real Estate: Yields & SEBI SM REIT Framework",
    category: "Investment",
    readingTime: "8 min read",
    publishedDate: "October 05, 2026",
    author: {
      name: "Rohan V. Mhatre",
      title: "Chartered Financial Analyst & REIT Specialist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
    },
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    excerpt: "How SEBI's Small and Medium REIT (SM REIT) regulations have democratized Grade-A institutional office and warehousing assets with institutional governance.",
    content: `
### The Institutionalization of Fractional Real Estate

For decades, Indian Grade-A commercial assets with blue-chip multinational tenants yielding 7.5% - 9% rental returns were reserved strictly for institutional private equity funds and sovereign wealth entities.

With the Securities and Exchange Board of India (SEBI) formalizing guidelines for Small and Medium REITs (SM REITs) with a minimum asset value of ₹50 Crore, high-net-worth individual investors can now participate with minimum ticket sizes reduced to ₹10 Lakhs.

Key diligence criteria include **Weighted Average Lease Expiry (WALE)**, tenant credit ratings, and net absorption momentum across key micro-markets like Bangalore ORR, Mumbai BKC, and Hyderabad HITEC City.
    `,
    relatedLocalities: ["BKC", "Indiranagar", "Golf Course Road"]
  }
];

export const MARKET_TRENDS_DATA = [
  { city: "Mumbai", avgPrice: 34800, yoyGrowth: 7.8, rentalYield: 3.1, demandIndex: 88, supplyIndex: 72 },
  { city: "Bangalore", avgPrice: 12400, yoyGrowth: 11.2, rentalYield: 4.8, demandIndex: 94, supplyIndex: 81 },
  { city: "Delhi NCR", avgPrice: 18600, yoyGrowth: 14.6, rentalYield: 3.4, demandIndex: 91, supplyIndex: 76 },
  { city: "Pune", avgPrice: 9200, yoyGrowth: 8.9, rentalYield: 4.2, demandIndex: 82, supplyIndex: 79 },
  { city: "Hyderabad", avgPrice: 10800, yoyGrowth: 12.4, rentalYield: 4.5, demandIndex: 89, supplyIndex: 84 },
  { city: "Goa", avgPrice: 16500, yoyGrowth: 15.8, rentalYield: 7.2, demandIndex: 96, supplyIndex: 58 }
];

export const AGENTS = [
  {
    id: "agent-1",
    name: "Rajeshwar Sengupta",
    agency: "South Mumbai Private Office",
    phone: "+91 98201 44820",
    email: "rajeshwar.s@makaan4u.com",
    reraNo: "A51900034821",
    rating: 4.9,
    experience: "16 Years in Luxury S-Mumbai",
    areasServed: ["Worli", "Prabhadevi", "Lower Parel", "BKC", "Malabar Hill"],
    languages: ["English", "Hindi", "Marathi", "Bengali"],
    specializations: ["Sea-Facing Penthouses", "High-Net-Worth Portfolios", "Developer Mandates"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    bio: "With over 16 years representing family offices, diaspora leaders, and tech founders, Rajeshwar heads Makaan4U's South Mumbai luxury desk with an uncompromising code of discretion and forensic title scrutiny.",
    activeListingsCount: 18,
    totalDealsClosed: 142
  },
  {
    id: "agent-2",
    name: "Tanya Shroff",
    agency: "Bandra Heritage Estates",
    phone: "+91 98190 28411",
    email: "tanya.shroff@makaan4u.com",
    reraNo: "A51800021940",
    rating: 5.0,
    experience: "12 Years in Pali Hill & Carter Road",
    areasServed: ["Bandra West", "Pali Hill", "Carter Road", "Khar West", "Juhu"],
    languages: ["English", "Hindi", "Gujarati"],
    specializations: ["Bungalow Acquisitions", "Turnkey Luxury Fitouts", "High-End Residential Leases"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    bio: "Tanya is the trusted advisor to leading creative figures and entrepreneurs looking for distinctive character properties and historic bungalows in Bandra West and Pali Hill.",
    activeListingsCount: 14,
    totalDealsClosed: 98
  },
  {
    id: "agent-4",
    name: "Vikramaditya Oberoi",
    agency: "Capital Assets Advisory NCR",
    phone: "+91 99100 84729",
    email: "vikramaditya@makaan4u.com",
    reraNo: "HRERA-PKL-REA-2020-044",
    rating: 4.9,
    experience: "18 Years in Luxury NCR Real Estate",
    areasServed: ["Golf Course Road", "DLF Phase 5", "Dwarka Expressway", "Vasant Vihar"],
    languages: ["English", "Hindi", "Punjabi"],
    specializations: ["Golf Course High-Rises", "Diplomatic Leases", "Commercial Land Parcels"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    bio: "Specializing in DLF The Camellias, Magnolias, and Aralias, Vikramaditya advises executive c-suites and multinational corporations on marquee acquisitions across Gurgaon and Central Delhi.",
    activeListingsCount: 22,
    totalDealsClosed: 180
  }
];
