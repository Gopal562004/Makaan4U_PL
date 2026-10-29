import mongoose from "mongoose";
import City from "../models/City.js";
import Project from "../models/Project.js";
import Developer from "../models/Developer.js";
import Insight from "../models/Insight.js";
import Locality from "../models/Locality.js";
import MarketTrend from "../models/MarketTrend.js";
import ClientInquiry from "../models/ClientInquiry.js";

export const initialCities = [
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    tagline: "India's financial capital & premier coastal luxury market",
    coverImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹34,800",
    avgPriceNumeric: 34800,
    growthYoY: "+7.8%",
    growthNumeric: 7.8,
    totalListings: 1420,
    activeProjects: 84,
    description: "From iconic sea-facing penthouses along Worli Sea Face to heritage bungalows in Bandra West, Mumbai remains the crown jewel of high-value Indian real estate with unmatched capital appreciation and liquidity.",
    topLocalities: ["Worli", "Bandra West", "Lower Parel", "Andheri West", "Powai", "Juhu", "Prabhadevi"],
    marketHighlights: [
      "Mumbai Coastal Road operational, cutting South Mumbai to Suburb transit by 65%",
      "Record registration revenue exceeding ₹11,000 Cr in Q3 2025",
      "High demand for 3 & 4 BHK residences with sea and skyline panoramas",
    ],
    tier: "Tier-1",
    order: 1,
  },
  {
    slug: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    tagline: "Silicon Valley of Asia with booming luxury villa communities",
    coverImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹12,400",
    avgPriceNumeric: 12400,
    growthYoY: "+11.2%",
    growthNumeric: 11.2,
    totalListings: 1850,
    activeProjects: 112,
    description: "Driven by senior tech leadership and venture capital wealth, Bangalore leads India in rental yields and gated luxury villa enclaves across North Bangalore and East Tech Corridors.",
    topLocalities: ["Indiranagar", "Lavelle Road", "Whitefield", "Koramangala", "Sadashivanagar", "Sarjapur Road"],
    marketHighlights: [
      "Suburban Rail & Metro Pink Line expansion accelerating peripheral growth",
      "Strongest rental yields among Indian metros averaging 4.2% - 5.1%",
      "Sustainable green-certified developments dominating new buyer choices",
    ],
    tier: "Tier-1",
    order: 2,
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    state: "NCR (Gurgaon, Delhi, Noida)",
    tagline: "Expansive golf estates, high-rise condominiums & diplomatic enclaves",
    coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹18,600",
    avgPriceNumeric: 18600,
    growthYoY: "+14.6%",
    growthNumeric: 14.6,
    totalListings: 1640,
    activeProjects: 96,
    description: "Gurgaon's Golf Course Road and Dwarka Expressway command unprecedented demand for ultra-luxury gated condominium projects with private elevators and concierge services.",
    topLocalities: ["Golf Course Road", "DLF Phase 5", "Vasant Vihar", "Greater Kailash II", "Noida Expressway", "Sohna Road"],
    marketHighlights: [
      "Dwarka Expressway operational corridor driving tier-1 developer launches",
      "Penthouse category registering over 28% year-on-year capital appreciation",
      "Delhi Master Plan 2041 reshaping low-density residential sectors",
    ],
    tier: "Tier-1",
    order: 3,
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    tagline: "Cultural capital & thriving automotive/IT hub with leafy green estates",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹9,200",
    avgPriceNumeric: 9200,
    growthYoY: "+8.9%",
    growthNumeric: 8.9,
    totalListings: 980,
    activeProjects: 65,
    description: "Known for cosmopolitan living, Pune offers tree-lined avenues in Koregaon Park and modern high-rises in Baner and Kharadi, attracting diaspora investors and professionals.",
    topLocalities: ["Koregaon Park", "Kalyani Nagar", "Baner", "Boat Club Road", "Kharadi", "Aundh"],
    marketHighlights: [
      "Pune Ring Road Phase 1 triggering residential plotted growth",
      "Emerging as primary retirement and second-home preference for Mumbaikars",
      "IT corridors seeing steady 8-10% rental increases annually",
    ],
    tier: "Tier-1",
    order: 4,
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    tagline: "India's fastest-growing infrastructure & ultra-modern skyscraper city",
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹10,800",
    avgPriceNumeric: 10800,
    growthYoY: "+12.4%",
    growthNumeric: 12.4,
    totalListings: 1120,
    activeProjects: 78,
    description: "With wide expressways, uninterrupted power and business-friendly policy, Hyderabad's Financial District and Kokapet boast some of India's tallest residential towers.",
    topLocalities: ["Jubilee Hills", "Banjara Hills", "Gachibowli", "Financial District", "Kokapet", "Hitec City"],
    marketHighlights: [
      "Kokapet Neopolis auctions setting historic state land benchmark prices",
      "High livability score with extensive Outer Ring Road connectivity",
      "Exponential NRI luxury demand for 4,000+ sq.ft sky villas",
    ],
    tier: "Tier-1",
    order: 5,
  },
  {
    slug: "goa",
    name: "Goa",
    state: "Goa",
    tagline: "Portuguese heritage villas, tropical sanctuaries & coastal retreats",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
    avgPricePerSqFt: "₹16,500",
    avgPriceNumeric: 16500,
    growthYoY: "+15.8%",
    growthNumeric: 15.8,
    totalListings: 430,
    activeProjects: 32,
    description: "North Goa's Assagao and Siolim have evolved into India's premier creative lifestyle destination with restored 19th-century Portuguese estates and contemporary tropical modernist villas.",
    topLocalities: ["Assagao", "Siolim", "Candolim", "Moira", "Anjuna", "Aldona"],
    marketHighlights: [
      "Mopa (Manohar) International Airport unlocking North Goa accessibility",
      "Highest short-stay holiday rental occupancy yielding up to 8.5% gross",
      "Strict FAR and heritage preservation laws maintaining scarcity value",
    ],
    tier: "Tier-1",
    order: 6,
  },
];

export const initialProjects = [
  {
    slug: "oberoi-forestville",
    title: "Oberoi Forestville",
    developer: "Oberoi Realty",
    developerSlug: "oberoi-realty",
    city: "Mumbai",
    locality: "Kolshet, Thane West",
    state: "Maharashtra",
    category: "New Launch",
    status: "Under Construction",
    startingPrice: "₹2.25 Cr",
    startingPriceNumeric: 22500000,
    configurations: "3 & 4 BHK Luxury Residences",
    possessionTimeline: "December 2028",
    reraNumber: "P51700050312",
    phaseProgress: "Foundation Completed & 14 Floors Cast",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80",
    ],
    description: "Oberoi Forestville brings nature-infused biophilic living to Thane with grand high-ceiling architecture, extensive forest trails, and dual Olympic-specification clubhouses.",
    amenities: [
      "Olympic-sized lap pool",
      "Biophilic forest trail",
      "Dual state-of-the-art clubhouses",
      "Private screening lounge",
      "Tennis & Squash courts",
    ],
    bhkOptions: [
      { type: "3 BHK Elegance", carpetArea: "1,090 sq.ft", price: "₹2.25 Cr" },
      { type: "3 BHK Grande", carpetArea: "1,280 sq.ft", price: "₹2.70 Cr" },
      { type: "4 BHK Royal Suite", carpetArea: "1,780 sq.ft", price: "₹3.95 Cr" },
    ],
    featured: true,
    order: 1,
  },
  {
    slug: "dlf-the-camellias",
    title: "DLF The Camellias",
    developer: "DLF Limited",
    developerSlug: "dlf-limited",
    city: "Delhi NCR",
    locality: "Golf Course Road, Gurgaon",
    state: "Haryana",
    category: "Ultra-Luxury",
    status: "Ready to Move",
    startingPrice: "₹38.00 Cr",
    startingPriceNumeric: 380000000,
    configurations: "4, 5 BHK & Penthouse Estates",
    possessionTimeline: "Ready to Move",
    reraNumber: "RC/REP/HAR/2018/14",
    phaseProgress: "Completed with Occupancy Certificate (OC)",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1000&auto=format&fit=crop&q=80",
    ],
    description: "Ranked among the most exclusive residential addresses on the globe. Features private high-speed biometric elevators, Michelin-star chef dining, and sweeping views of the DLF Golf Course.",
    amenities: [
      "160,000 sq.ft Clubhouse",
      "7 Fine Dining Rooms",
      "Private Golf Simulator",
      "Indoor Heated Lap Pool",
      "Helipad Access & Full Concierge",
    ],
    bhkOptions: [
      { type: "4 BHK Signature", carpetArea: "7,400 sq.ft", price: "₹42.00 Cr" },
      { type: "5 BHK Imperial", carpetArea: "9,500 sq.ft", price: "₹56.00 Cr" },
      { type: "Sky Penthouse", carpetArea: "14,000 sq.ft", price: "₹85.00 Cr" },
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "prestige-kingfisher-towers",
    title: "Prestige Kingfisher Towers",
    developer: "Prestige Group",
    developerSlug: "prestige-group",
    city: "Bangalore",
    locality: "Lavelle Road, Central Bangalore",
    state: "Karnataka",
    category: "Premium Projects",
    status: "Ready to Move",
    startingPrice: "₹28.50 Cr",
    startingPriceNumeric: 285000000,
    configurations: "4 BHK Ultra-Spacious Sky Villas",
    possessionTimeline: "Ready to Move",
    reraNumber: "PRM/KA/RERA/1251/310/PR/171015/000414",
    phaseProgress: "Delivered & Inhabited by Top Promoters",
    coverImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&auto=format&fit=crop&q=80",
    ],
    description: "Bangalore's landmark sky villa development overlooking the vast green canopy of Cubbon Park. High-ceiling layouts, soundproof double-glazed acoustic envelope, and private concierge.",
    amenities: [
      "Infinity Sky Pool",
      "Private Wine Cellars",
      "Bespoke Butler Service",
      "Cubbon Park Panoramic Decks",
    ],
    bhkOptions: [
      { type: "4 BHK Sky Villa A", carpetArea: "8,321 sq.ft", price: "₹28.50 Cr" },
      { type: "4 BHK Penthouse", carpetArea: "11,500 sq.ft", price: "₹45.00 Cr" },
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "godrej-reserve-kandivali",
    title: "Godrej Reserve",
    developer: "Godrej Properties",
    developerSlug: "godrej-properties",
    city: "Mumbai",
    locality: "Kandivali East, Mumbai",
    state: "Maharashtra",
    category: "New Launch",
    status: "Under Construction",
    startingPrice: "₹1.95 Cr",
    startingPriceNumeric: 19500000,
    configurations: "2, 3 & 4 BHK Forest-Facing Homes",
    possessionTimeline: "March 2029",
    reraNumber: "P51800054321",
    phaseProgress: "Excavation and Piling Complete",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
    ],
    description: "Nestled adjacent to the verdant Sanjay Gandhi National Park, offering unhindered forest panoramas, platinum IGBC pre-certification, and 6 curated club zones.",
    amenities: [
      "National Park Views",
      "Biophilic Design",
      "6 Curated Club Zones",
      "EV Charging Infrastructure",
    ],
    bhkOptions: [
      { type: "2 BHK Forest View", carpetArea: "730 sq.ft", price: "₹1.95 Cr" },
      { type: "3 BHK Grande", carpetArea: "1,040 sq.ft", price: "₹2.65 Cr" },
      { type: "4 BHK Horizon", carpetArea: "1,520 sq.ft", price: "₹3.75 Cr" },
    ],
    featured: true,
    order: 4,
  },
];

export const initialDevelopers = [
  {
    slug: "godrej-properties",
    name: "Godrej Properties",
    established: 1990,
    headquarters: "Mumbai, Maharashtra",
    totalDeliveredSqFt: "42M+ sq.ft",
    activeProjectsCount: 48,
    experienceYears: 35,
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80",
    description: "Part of the 127-year-old Godrej Group legacy. Renowned for environmental stewardship, cutting-edge architectural partnerships, and punctual delivery track record across 12 Indian cities.",
    featuredProjects: ["godrej-reserve-kandivali"],
    order: 1,
  },
  {
    slug: "oberoi-realty",
    name: "Oberoi Realty",
    established: 1998,
    headquarters: "Mumbai, Maharashtra",
    totalDeliveredSqFt: "32M+ sq.ft",
    activeProjectsCount: 18,
    experienceYears: 27,
    logo: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=200&auto=format&fit=crop&q=80",
    description: "Synonymous with immaculate engineering, high-ceiling luxury residences, and integrated township masterpieces like Oberoi Garden City Goregaon and Forestville Thane.",
    featuredProjects: ["oberoi-forestville"],
    order: 2,
  },
  {
    slug: "dlf-limited",
    name: "DLF Limited",
    established: 1946,
    headquarters: "New Delhi & Gurgaon",
    totalDeliveredSqFt: "150M+ sq.ft",
    activeProjectsCount: 36,
    experienceYears: 79,
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80",
    description: "India's largest listed real estate company by market capitalization. DLF created modern Gurgaon and sets the global benchmark for super-luxury residential estates with The Camellias.",
    featuredProjects: ["dlf-the-camellias"],
    order: 3,
  },
  {
    slug: "prestige-group",
    name: "Prestige Group",
    established: 1986,
    headquarters: "Bangalore, Karnataka",
    totalDeliveredSqFt: "140M+ sq.ft",
    activeProjectsCount: 52,
    experienceYears: 39,
    logo: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=200&auto=format&fit=crop&q=80",
    description: "Pioneering South Indian developer with expanding footprints in Mumbai and NCR. Known for transformative townships, ultra-luxury high-rises, and Falcon City master developments.",
    featuredProjects: ["prestige-kingfisher-towers"],
    order: 4,
  },
];

export const initialInsights = [
  {
    slug: "rera-2-compliance-homebuyer-checklist",
    title: "RERA 2.0 Compliance: The Definitive Homebuyer Due-Diligence Checklist",
    category: "Legal & RERA",
    readingTime: "7 min read",
    publishedDate: "October 18, 2026",
    author: {
      name: "Adv. Sunita Mahapatra",
      role: "Senior Real Estate Counsel, High Court of Bombay",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    excerpt: "With the latest appellate directives mandating quarterly escrow reconciliation and mandatory defect liability clauses, here is what high-value buyers must inspect before signing the agreement for sale.",
    content: "The Real Estate (Regulation and Development) Act has reached a mature milestone. Today's regulatory apparatus rigorously monitors project escrow accounts (70% rule), promoter disclosures on construction milestones, and strict structural defect liability periods extending five years post possession.",
    tags: ["RERA", "Legal Compliance", "Due Diligence", "Escrow"],
    featured: true,
    views: 3420,
    order: 1,
  },
  {
    slug: "mumbai-coastal-road-western-suburbs-capital-gains",
    title: "The Mumbai Coastal Road Effect: Capital Appreciation Along Western Suburbs",
    category: "Market Trends",
    readingTime: "6 min read",
    publishedDate: "October 14, 2026",
    author: {
      name: "Nikhil Chidambaram",
      role: "Head of Research, Makaan4U Insights",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    heroImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Comprehensive data analysis reveals how the operational Coastal Road tunnel has re-priced prime micro-markets in Prabhadevi, Worli, and Bandra, compressing commuting times and accelerating redevelopment.",
    content: "The commissioning of the Mumbai Coastal Road represents the most decisive shift in South-to-West transit dynamics since the opening of the Bandra-Worli Sea Link. Commuting times between Marine Drive and Worli have dropped from 45 minutes to under 11 minutes.",
    tags: ["Mumbai", "Coastal Road", "Infrastructure", "Capital Appreciation"],
    featured: true,
    views: 4890,
    order: 2,
  },
  {
    slug: "fractional-ownership-commercial-real-estate-india",
    title: "Fractional Ownership in Commercial Real Estate: Yields & SEBI SM REIT Framework",
    category: "Investment",
    readingTime: "8 min read",
    publishedDate: "October 05, 2026",
    author: {
      name: "Rohan V. Mhatre",
      role: "Chartered Financial Analyst & REIT Specialist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    excerpt: "How SEBI's Small and Medium REIT (SM REIT) regulations have democratized Grade-A institutional office and warehousing assets with institutional governance.",
    content: "With SEBI formalizing guidelines for Small and Medium REITs (SM REITs) with a minimum asset value of ₹50 Crore, high-net-worth individual investors can now participate in Grade-A commercial real estate with minimum ticket sizes reduced to ₹10 Lakhs.",
    tags: ["REIT", "Commercial Real Estate", "Fractional Ownership", "SEBI"],
    featured: true,
    views: 2950,
    order: 3,
  },
];

export const initialLocalities = [
  {
    slug: "worli",
    name: "Worli",
    city: "Mumbai",
    avgPrice: "₹52,000/sq.ft",
    avgPriceNumeric: 52000,
    growthRate: "+8.5% YoY",
    rentalYield: "3.2%",
    connectivityScore: "9.8/10",
    description: "South Mumbai's undisputed luxury bastion. Home to ultra-exclusive residential skyscrapers overlooking the Arabian Sea, premier clubhouses, and direct connectivity via the Coastal Road and Sea Link.",
    metroLines: ["Metro Line 3 (Aqua)", "Coastal Road Arterial"],
    topProjects: ["Oberoi Three Sixty West", "Lodha World Towers"],
    order: 1,
  },
  {
    slug: "bandra-west",
    name: "Bandra West",
    city: "Mumbai",
    avgPrice: "₹64,000/sq.ft",
    avgPriceNumeric: 64000,
    growthRate: "+9.2% YoY",
    rentalYield: "2.9%",
    connectivityScore: "9.6/10",
    description: "The 'Queen of the Suburbs' blends colonial seaside charm with world-class fine dining, art galleries, and celebrity addresses on Carter Road and Bandstand.",
    metroLines: ["Metro Line 2B", "Bandra-Worli Sea Link"],
    topProjects: ["Rustomjee Paramount", "Beau Monde"],
    order: 2,
  },
  {
    slug: "indiranagar",
    name: "Indiranagar",
    city: "Bangalore",
    avgPrice: "₹18,500/sq.ft",
    avgPriceNumeric: 18500,
    growthRate: "+10.4% YoY",
    rentalYield: "4.8%",
    connectivityScore: "9.5/10",
    description: "Bangalore's cultural and gastronomy epicentre. Tree-canopied residential layouts flanked by 100 Feet Road and 12th Main, combining serene living with elite social life.",
    metroLines: ["Namma Metro Purple Line"],
    topProjects: ["Total Environment", "Embassy Habitat"],
    order: 3,
  },
  {
    slug: "golf-course-road",
    name: "Golf Course Road",
    city: "Delhi NCR",
    avgPrice: "₹29,000/sq.ft",
    avgPriceNumeric: 29000,
    growthRate: "+16.8% YoY",
    rentalYield: "3.5%",
    connectivityScore: "9.7/10",
    description: "The prestigious billionaire mile of Gurgaon. Home to DLF Camellias and Magnolias with world-class 16-lane signal-free expressway, rapid metro, and championship golf courses.",
    metroLines: ["Gurgaon Rapid Metro", "Golf Course Road Expressway"],
    topProjects: ["DLF The Camellias", "DLF The Magnolias"],
    order: 4,
  },
];

export const initialMarketTrends = [
  { city: "Mumbai", avgPrice: 34800, yoyGrowth: 7.8, rentalYield: 3.1, topMicroMarket: "Worli Sea Face", order: 1 },
  { city: "Bangalore", avgPrice: 12400, yoyGrowth: 11.2, rentalYield: 4.8, topMicroMarket: "Indiranagar", order: 2 },
  { city: "Delhi NCR", avgPrice: 18600, yoyGrowth: 14.6, rentalYield: 3.4, topMicroMarket: "Golf Course Road", order: 3 },
  { city: "Pune", avgPrice: 9200, yoyGrowth: 8.9, rentalYield: 4.2, topMicroMarket: "Koregaon Park", order: 4 },
  { city: "Hyderabad", avgPrice: 10800, yoyGrowth: 12.4, rentalYield: 4.5, topMicroMarket: "Kokapet Neopolis", order: 5 },
  { city: "Goa", avgPrice: 16500, yoyGrowth: 15.8, rentalYield: 7.2, topMicroMarket: "Assagao Valley", order: 6 },
  { city: "Thane", avgPrice: 14200, yoyGrowth: 9.1, rentalYield: 3.6, topMicroMarket: "Kolshet Road", order: 7 },
];

export const initialInquiries = [
  {
    type: "site-visit",
    name: "Vikramaditya Singhania",
    phone: "+91 98200 87654",
    email: "v.singhania@apexholding.in",
    propertyTitle: "Oberoi Forestville — 4 BHK Forest Vista",
    propertyLocation: "Kolshet Road, Thane West, Mumbai",
    propertyPrice: "₹3.85 Cr",
    propertyImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    date: "2026-11-02",
    timeSlot: "11:00 AM - 12:30 PM",
    visitType: "In-Person Guided Tour",
    status: "Confirmed",
    priority: "High",
    message: "Interested in the high-floor tower B unit with uninterrupted Yeoor Hills deck views. Need technical architect to discuss customized layout.",
    assignedAgent: {
      name: "Sunil Varma",
      phone: "+91 98201 44820",
      email: "sunil.varma@makaan4u.com",
      designation: "Senior Luxury Consultant",
    },
    adminNotes: [
      { text: "QR Pass dispatched via WhatsApp. Buyer pre-qualified through ICICI Wealth Desk.", author: "Admin" },
    ],
  },
  {
    type: "site-visit",
    name: "Meera Nair",
    phone: "+91 97401 22345",
    email: "meera.nair@techventures.io",
    propertyTitle: "DLF The Camellias — Ultra Luxury Penthouse",
    propertyLocation: "Golf Course Road, Gurgaon, Delhi NCR",
    propertyPrice: "₹35.00 Cr",
    propertyImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    date: "2026-11-04",
    timeSlot: "03:00 PM - 04:30 PM",
    visitType: "Private Executive Escort",
    status: "Requested",
    priority: "Urgent",
    message: "Relocating from Singapore next month. Seeking fully furnished turnkey residence with DLF Golf Club view.",
    assignedAgent: {
      name: "Rohit Malhotra",
      phone: "+91 98110 33456",
      email: "rohit.m@makaan4u.com",
      designation: "NCR Regional Director",
    },
  },
  {
    type: "callback",
    name: "Dr. Arvind Swaminathan",
    phone: "+91 98450 11998",
    email: "dr.arvind@apollohospitals.org",
    propertyTitle: "Prestige Kingfisher Towers — 4 BHK Imperial Residence",
    propertyLocation: "Lavelle Road, Ashok Nagar, Bangalore",
    propertyPrice: "₹28.50 Cr",
    propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
    message: "Requesting full title search report and maintenance fee schedule before signing token.",
    status: "New",
    priority: "High",
    assignedAgent: {
      name: "Pooja Hegde",
      phone: "+91 98800 77123",
      email: "pooja.h@makaan4u.com",
      designation: "Bangalore Prime Advisor",
    },
  },
  {
    type: "callback",
    name: "Rajeshwar Rao",
    phone: "+91 99890 44556",
    email: "r.rao@hyderabadtech.com",
    propertyTitle: "Luxury Penthouse with Private Terrace",
    propertyLocation: "Worli, South Mumbai",
    propertyPrice: "₹3.50 Cr",
    propertyImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80",
    message: "Need callback to discuss home loan eligibility under SBI High Net Worth NRI scheme.",
    status: "Contacted",
    priority: "Medium",
    assignedAgent: {
      name: "Sunil Varma",
      phone: "+91 98201 44820",
      email: "sunil.varma@makaan4u.com",
      designation: "Senior Luxury Consultant",
    },
  },
  {
    type: "contact-form",
    name: "Anita & Cyrus Godrej",
    phone: "+91 98210 55667",
    email: "anita.godrej@consortium.in",
    department: "Developer Partnerships",
    city: "Mumbai",
    message: "We have a 4.5-acre parcel in Alibaug suitable for gated ultra-luxury wellness villas. Requesting developer onboarding and title audit meeting at BKC office.",
    status: "New",
    priority: "Urgent",
  },
  {
    type: "contact-form",
    name: "Captain Devender Sharma",
    phone: "+91 98100 99887",
    email: "d.sharma@aviationgroup.com",
    department: "Private Client Advisory",
    city: "Goa",
    message: "Looking for a Portuguese heritage villa in North Goa (Assagao/Anjuna) with minimum 12,000 sq.ft plot and clear legal sanad. Budget ₹15-20 Cr.",
    status: "In Progress",
    priority: "High",
  },
];

/**
 * Idempotently seeds initial marketplace data into MongoDB collections
 */
export const seedMarketplaceData = async () => {
  try {
    const cityCount = await City.countDocuments();
    if (cityCount === 0) {
      console.log("🌱 Seeding initial City collection...");
      await City.insertMany(initialCities);
      console.log("✅ City collection seeded");
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log("🌱 Seeding initial Project collection...");
      await Project.insertMany(initialProjects);
      console.log("✅ Project collection seeded");
    }

    const devCount = await Developer.countDocuments();
    if (devCount === 0) {
      console.log("🌱 Seeding initial Developer collection...");
      await Developer.insertMany(initialDevelopers);
      console.log("✅ Developer collection seeded");
    }

    const insightCount = await Insight.countDocuments();
    if (insightCount === 0) {
      console.log("🌱 Seeding initial Insight collection...");
      await Insight.insertMany(initialInsights);
      console.log("✅ Insight collection seeded");
    }

    const locCount = await Locality.countDocuments();
    if (locCount === 0) {
      console.log("🌱 Seeding initial Locality collection...");
      await Locality.insertMany(initialLocalities);
      console.log("✅ Locality collection seeded");
    }

    const trendCount = await MarketTrend.countDocuments();
    if (trendCount === 0) {
      console.log("🌱 Seeding initial MarketTrend collection...");
      await MarketTrend.insertMany(initialMarketTrends);
      console.log("✅ MarketTrend collection seeded");
    }

    const inquiryCount = await ClientInquiry.countDocuments();
    if (inquiryCount === 0) {
      console.log("🌱 Seeding initial ClientInquiry collection...");
      await ClientInquiry.insertMany(initialInquiries);
      console.log("✅ ClientInquiry collection seeded");
    }
  } catch (error) {
    console.error("⚠️ Error seeding marketplace data:", error.message);
  }
};

