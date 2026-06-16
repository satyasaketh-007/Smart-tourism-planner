export type Tier = "low" | "mid" | "high";

export interface Guide {
  id: string;
  name: string;
  phone: string;
  languages: string[];
  rating: number;
  experienceYears: number;
}

export interface Hotel {
  name: string;
  stars: number;
  pricePerNight: number;
  notes: string;
}

export interface IntraTravel {
  mode: string;
  description: string;
  pricePerDay: number;
}

export interface InterTravel {
  mode: string;
  description: string;
  pricePerPerson: number;
  duration: string;
}

export interface PackageOption {
  tier: Tier;
  name: string;
  tagline: string;
  nights: number;
  hotel: Hotel;
  intra: IntraTravel;
  inter: InterTravel[];
  guide: Guide;
  highlights: string[];
}

const GUIDES: Record<string, Guide[]> = {
  Rajasthan: [
    { id: "rj1", name: "Ramesh Singh", phone: "+91 98290 11122", languages: ["Hindi", "English"], rating: 4.3, experienceYears: 6 },
    { id: "rj2", name: "Anita Rathore", phone: "+91 98290 22334", languages: ["Hindi", "English", "French"], rating: 4.7, experienceYears: 9 },
    { id: "rj3", name: "Vikram Mehta", phone: "+91 98290 55667", languages: ["Hindi", "English", "Spanish", "German"], rating: 4.9, experienceYears: 14 },
  ],
  Kerala: [
    { id: "kl1", name: "Joseph Thomas", phone: "+91 94470 11223", languages: ["Malayalam", "English"], rating: 4.2, experienceYears: 5 },
    { id: "kl2", name: "Lakshmi Nair", phone: "+91 94470 33445", languages: ["Malayalam", "Hindi", "English"], rating: 4.6, experienceYears: 8 },
    { id: "kl3", name: "Arun Menon", phone: "+91 94470 66778", languages: ["Malayalam", "English", "French", "Tamil"], rating: 4.9, experienceYears: 13 },
  ],
  Goa: [
    { id: "ga1", name: "Diego Fernandes", phone: "+91 90490 11223", languages: ["Konkani", "English"], rating: 4.1, experienceYears: 4 },
    { id: "ga2", name: "Maria D'Souza", phone: "+91 90490 33445", languages: ["Konkani", "English", "Portuguese"], rating: 4.7, experienceYears: 10 },
    { id: "ga3", name: "Rohan Kamat", phone: "+91 90490 66778", languages: ["Konkani", "English", "Russian", "Hindi"], rating: 4.8, experienceYears: 12 },
  ],
  "Himachal Pradesh": [
    { id: "hp1", name: "Tashi Negi", phone: "+91 94180 11223", languages: ["Hindi", "English"], rating: 4.3, experienceYears: 6 },
    { id: "hp2", name: "Priya Thakur", phone: "+91 94180 33445", languages: ["Hindi", "English", "Punjabi"], rating: 4.6, experienceYears: 9 },
    { id: "hp3", name: "Dorje Lama", phone: "+91 94180 66778", languages: ["Hindi", "English", "Tibetan", "French"], rating: 4.9, experienceYears: 15 },
  ],
  Uttarakhand: [
    { id: "uk1", name: "Mahesh Bisht", phone: "+91 94120 11223", languages: ["Hindi", "English"], rating: 4.2, experienceYears: 5 },
    { id: "uk2", name: "Neha Pant", phone: "+91 94120 33445", languages: ["Hindi", "English", "Garhwali"], rating: 4.6, experienceYears: 8 },
    { id: "uk3", name: "Suresh Rawat", phone: "+91 94120 66778", languages: ["Hindi", "English", "German", "Garhwali"], rating: 4.8, experienceYears: 12 },
  ],
  "Tamil Nadu": [
    { id: "tn1", name: "Karthik Raja", phone: "+91 94440 11223", languages: ["Tamil", "English"], rating: 4.2, experienceYears: 5 },
    { id: "tn2", name: "Divya Iyer", phone: "+91 94440 33445", languages: ["Tamil", "English", "Hindi"], rating: 4.7, experienceYears: 9 },
    { id: "tn3", name: "Selvam Pillai", phone: "+91 94440 66778", languages: ["Tamil", "English", "French", "Hindi"], rating: 4.9, experienceYears: 14 },
  ],
  Maharashtra: [
    { id: "mh1", name: "Sachin Patil", phone: "+91 98200 11223", languages: ["Marathi", "Hindi", "English"], rating: 4.2, experienceYears: 5 },
    { id: "mh2", name: "Pooja Deshmukh", phone: "+91 98200 33445", languages: ["Marathi", "Hindi", "English"], rating: 4.6, experienceYears: 8 },
    { id: "mh3", name: "Aniket Joshi", phone: "+91 98200 66778", languages: ["Marathi", "Hindi", "English", "Japanese"], rating: 4.9, experienceYears: 13 },
  ],
  "Jammu & Kashmir": [
    { id: "jk1", name: "Bilal Ahmad", phone: "+91 99060 11223", languages: ["Kashmiri", "Urdu", "English"], rating: 4.3, experienceYears: 6 },
    { id: "jk2", name: "Mehraj Dar", phone: "+91 99060 33445", languages: ["Kashmiri", "Urdu", "Hindi", "English"], rating: 4.7, experienceYears: 10 },
    { id: "jk3", name: "Yasmeen Khan", phone: "+91 99060 66778", languages: ["Kashmiri", "Urdu", "English", "Arabic", "French"], rating: 4.9, experienceYears: 15 },
  ],
};

const HOTELS: Record<string, Hotel[]> = {
  Rajasthan: [
    { name: "Hotel Pearl Palace", stars: 3, pricePerNight: 1800, notes: "Cozy heritage stay in Jaipur" },
    { name: "Trident Udaipur", stars: 4, pricePerNight: 5500, notes: "Lakeside boutique hotel" },
    { name: "Taj Lake Palace", stars: 5, pricePerNight: 22000, notes: "Iconic floating heritage palace" },
  ],
  Kerala: [
    { name: "Backwater Inn", stars: 3, pricePerNight: 1700, notes: "Cozy stay near Alleppey" },
    { name: "Spice Tree Munnar", stars: 4, pricePerNight: 5200, notes: "Hillside resort with valley views" },
    { name: "Kumarakom Lake Resort", stars: 5, pricePerNight: 21000, notes: "Heritage lakefront luxury" },
  ],
  Goa: [
    { name: "Casa Anjuna Stay", stars: 3, pricePerNight: 1900, notes: "Beach-side guesthouse" },
    { name: "Novotel Candolim", stars: 4, pricePerNight: 6000, notes: "Beachfront resort with pool" },
    { name: "Taj Fort Aguada", stars: 5, pricePerNight: 23000, notes: "Cliffside luxury overlooking the Arabian Sea" },
  ],
  "Himachal Pradesh": [
    { name: "Hotel Snow Valley", stars: 3, pricePerNight: 1600, notes: "Comfortable Manali stay" },
    { name: "The Himalayan", stars: 4, pricePerNight: 5400, notes: "Castle-style boutique resort" },
    { name: "Wildflower Hall", stars: 5, pricePerNight: 24000, notes: "Oberoi luxury retreat in Shimla hills" },
  ],
  Uttarakhand: [
    { name: "Ganga View Inn", stars: 3, pricePerNight: 1500, notes: "Riverside Rishikesh stay" },
    { name: "The Naini Retreat", stars: 4, pricePerNight: 5300, notes: "Lake-view boutique hotel" },
    { name: "Ananda in the Himalayas", stars: 5, pricePerNight: 26000, notes: "World-class wellness resort" },
  ],
  "Tamil Nadu": [
    { name: "Hotel Tamilnadu", stars: 3, pricePerNight: 1600, notes: "Comfortable city stay" },
    { name: "Sterling Ooty", stars: 4, pricePerNight: 5100, notes: "Hill station resort" },
    { name: "Taj Coromandel", stars: 5, pricePerNight: 20000, notes: "Iconic Chennai luxury hotel" },
  ],
  Maharashtra: [
    { name: "Hotel Sahara Star", stars: 3, pricePerNight: 1900, notes: "Convenient Mumbai stay" },
    { name: "Fariyas Lonavala", stars: 4, pricePerNight: 5600, notes: "Hillside boutique resort" },
    { name: "The Taj Mahal Palace", stars: 5, pricePerNight: 28000, notes: "Iconic Mumbai heritage luxury" },
  ],
  "Jammu & Kashmir": [
    { name: "Hotel Akbar", stars: 3, pricePerNight: 1700, notes: "Comfortable Srinagar stay" },
    { name: "The Khyber Himalayan", stars: 4, pricePerNight: 6200, notes: "Gulmarg slope-side resort" },
    { name: "Taj Vivanta Dal View", stars: 5, pricePerNight: 22000, notes: "Luxury views over Dal Lake" },
  ],
};

const INTRA: Record<Tier, IntraTravel> = {
  low: { mode: "Shared cab / local bus", description: "Affordable shared transfers between cities and shared sightseeing transport.", pricePerDay: 600 },
  mid: { mode: "Private AC sedan", description: "Dedicated AC sedan with driver for all sightseeing and transfers.", pricePerDay: 2200 },
  high: { mode: "Luxury SUV with chauffeur", description: "Premium SUV (Innova/Fortuner class) with professional chauffeur, water & wifi.", pricePerDay: 4800 },
};

const INTER_OPTIONS = (state: string): InterTravel[] => [
  { mode: "Train (Sleeper / 3AC)", description: `Indian Railways to nearest station in ${state}`, pricePerPerson: 1200, duration: "16–28 hrs" },
  { mode: "Flight (Economy)", description: `One-way economy flight to ${state}'s main airport`, pricePerPerson: 5500, duration: "1.5–3 hrs" },
  { mode: "Flight (Business)", description: `Business class flight with priority boarding`, pricePerPerson: 18000, duration: "1.5–3 hrs" },
  { mode: "Volvo AC Bus", description: `Overnight AC sleeper bus to ${state}`, pricePerPerson: 1800, duration: "12–20 hrs" },
];

export const buildPackages = (state: string): PackageOption[] => {
  const hotels = HOTELS[state] ?? HOTELS.Rajasthan;
  const guides = GUIDES[state] ?? GUIDES.Rajasthan;
  const inter = INTER_OPTIONS(state);
  const highlights: Record<string, string[]> = {
    Rajasthan: ["Jaipur", "Udaipur", "Jaisalmer"],
    Kerala: ["Munnar", "Alleppey", "Kochi"],
    Goa: ["North Goa", "South Goa", "Old Goa"],
    "Himachal Pradesh": ["Shimla", "Manali", "Spiti"],
    Uttarakhand: ["Rishikesh", "Nainital", "Auli"],
    "Tamil Nadu": ["Chennai", "Madurai", "Ooty"],
    Maharashtra: ["Mumbai", "Lonavala", "Ajanta"],
    "Jammu & Kashmir": ["Srinagar", "Gulmarg", "Pahalgam"],
  };
  const hl = highlights[state] ?? [];

  return [
    {
      tier: "low",
      name: "Explorer",
      tagline: "Budget-friendly essentials",
      nights: 3,
      hotel: hotels[0],
      intra: INTRA.low,
      inter: [inter[0], inter[3]],
      guide: guides[0],
      highlights: hl,
    },
    {
      tier: "mid",
      name: "Voyager",
      tagline: "Most popular balance",
      nights: 5,
      hotel: hotels[1],
      intra: INTRA.mid,
      inter: [inter[1], inter[0]],
      guide: guides[1],
      highlights: hl,
    },
    {
      tier: "high",
      name: "Luxury",
      tagline: "Premium end-to-end",
      nights: 7,
      hotel: hotels[2],
      intra: INTRA.high,
      inter: [inter[2], inter[1]],
      guide: guides[2],
      highlights: hl,
    },
  ];
};

export const ALL_HOTELS = HOTELS;
export const ALL_GUIDES = GUIDES;
export const INTRA_TRAVEL = INTRA;
export const buildInterOptions = INTER_OPTIONS;

export const GUIDE_FEE_PER_DAY: Record<Tier, number> = {
  low: 800,
  mid: 1500,
  high: 3000,
};

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const calcPerPerson = (
  pkg: Pick<PackageOption, "hotel" | "intra" | "nights" | "tier"> & { inter: InterTravel },
  people: number
) => {
  const hotelTotal = pkg.hotel.pricePerNight * pkg.nights;
  const intraTotal = pkg.intra.pricePerDay * pkg.nights;
  const guideTotal = GUIDE_FEE_PER_DAY[pkg.tier] * pkg.nights;
  const sharedPerPerson = (hotelTotal + intraTotal + guideTotal) / Math.max(people, 1);
  return Math.round(sharedPerPerson + pkg.inter.pricePerPerson);
};
