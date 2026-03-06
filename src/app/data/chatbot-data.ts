export interface Destination {
  id: string;
  name: string;
  state: string;
  category: "temple" | "family" | "adventure" | "beach" | "hill-station";
  region: "north" | "south" | "east" | "west" | "central";
  duration: string;
  durationDays: number;
  budget: string;
  estimatedCost: number;
  bestSeason: string;
  highlights: string[];
  description: string;
  imageUrl: string;
}

export const destinations: Destination[] = [
  // Temple Tours
  {
    id: "tirupati",
    name: "Tirupati Balaji",
    state: "Andhra Pradesh",
    category: "temple",
    region: "south",
    duration: "2-3 Days",
    durationDays: 3,
    budget: "₹8,000 - ₹15,000",
    estimatedCost: 11500,
    bestSeason: "October to March",
    highlights: ["Darshan booking assistance", "Scenic hill drive", "TTD accommodation guidance"],
    description: "Sacred pilgrimage to Lord Venkateswara Temple in the seven hills",
    imageUrl: "tirupati-temple.jpg"
  },
  {
    id: "rameswaram",
    name: "Rameswaram",
    state: "Tamil Nadu",
    category: "temple",
    region: "south",
    duration: "2-3 Days",
    durationDays: 3,
    budget: "₹10,000 - ₹18,000",
    estimatedCost: 14000,
    bestSeason: "October to April",
    highlights: ["Ramanathaswamy Temple", "Dhanushkodi beach", "22 sacred wells"],
    description: "Visit the sacred Jyotirlinga temple on Pamban Island",
    imageUrl: "rameswaram.jpg"
  },
  {
    id: "varanasi",
    name: "Varanasi (Kashi)",
    state: "Uttar Pradesh",
    category: "temple",
    region: "north",
    duration: "3-4 Days",
    durationDays: 4,
    budget: "₹15,000 - ₹25,000",
    estimatedCost: 20000,
    bestSeason: "November to February",
    highlights: ["Kashi Vishwanath Temple", "Ganga Aarti ceremony", "Boat ride on Ganges"],
    description: "Experience the spiritual capital and oldest living city of India",
    imageUrl: "varanasi.jpg"
  },
  {
    id: "kedarnath",
    name: "Kedarnath Dham",
    state: "Uttarakhand",
    category: "temple",
    region: "north",
    duration: "4-5 Days",
    durationDays: 5,
    budget: "₹20,000 - ₹35,000",
    estimatedCost: 27500,
    bestSeason: "May to June, September to October",
    highlights: ["Char Dham pilgrimage", "Himalayan trek", "Mandakini river views"],
    description: "Himalayan pilgrimage to one of the twelve Jyotirlingas",
    imageUrl: "kedarnath.jpg"
  },
  {
    id: "badrinath",
    name: "Badrinath Temple",
    state: "Uttarakhand",
    category: "temple",
    region: "north",
    duration: "4-5 Days",
    durationDays: 5,
    budget: "₹20,000 - ₹35,000",
    estimatedCost: 27500,
    bestSeason: "May to June, September to October",
    highlights: ["Char Dham yatra", "Tapt Kund hot springs", "Neelkanth peak views"],
    description: "Divine journey to Lord Vishnu's sacred abode in the Himalayas",
    imageUrl: "badrinath.jpg"
  },
  {
    id: "madurai",
    name: "Madurai Meenakshi Temple",
    state: "Tamil Nadu",
    category: "temple",
    region: "south",
    duration: "2 Days",
    durationDays: 2,
    budget: "₹6,000 - ₹12,000",
    estimatedCost: 9000,
    bestSeason: "October to March",
    highlights: ["Meenakshi Amman Temple", "1000 pillar hall", "Evening ceremony"],
    description: "Ancient temple city with magnificent Dravidian architecture",
    imageUrl: "madurai.jpg"
  },

  // Family Trips
  {
    id: "ooty",
    name: "Ooty Hill Station",
    state: "Tamil Nadu",
    category: "hill-station",
    region: "south",
    duration: "3-4 Days",
    durationDays: 4,
    budget: "₹12,000 - ₹20,000",
    estimatedCost: 16000,
    bestSeason: "April to June, September to November",
    highlights: ["Botanical gardens", "Ooty Lake", "Nilgiri Mountain Railway"],
    description: "Queen of hill stations with tea gardens and scenic beauty",
    imageUrl: "ooty.jpg"
  },
  {
    id: "goa",
    name: "Goa Beaches",
    state: "Goa",
    category: "beach",
    region: "west",
    duration: "4-5 Days",
    durationDays: 5,
    budget: "₹18,000 - ₹30,000",
    estimatedCost: 24000,
    bestSeason: "November to February",
    highlights: ["Beach hopping", "Water sports", "Portuguese heritage sites"],
    description: "Beach paradise with sun, sand, and vibrant culture",
    imageUrl: "goa.jpg"
  },
  {
    id: "kerala",
    name: "Kerala Backwaters",
    state: "Kerala",
    category: "family",
    region: "south",
    duration: "5-6 Days",
    durationDays: 6,
    budget: "₹25,000 - ₹40,000",
    estimatedCost: 32500,
    bestSeason: "September to March",
    highlights: ["Houseboat cruise", "Munnar tea estates", "Thekkady wildlife"],
    description: "God's Own Country with serene backwaters and lush greenery",
    imageUrl: "kerala.jpg"
  },
  {
    id: "manali",
    name: "Manali Adventure",
    state: "Himachal Pradesh",
    category: "adventure",
    region: "north",
    duration: "5-6 Days",
    durationDays: 6,
    budget: "₹20,000 - ₹35,000",
    estimatedCost: 27500,
    bestSeason: "May to June, October to February",
    highlights: ["Rohtang Pass", "Solang Valley", "Adventure sports"],
    description: "Himalayan adventure with snow peaks and valleys",
    imageUrl: "manali.jpg"
  },
  {
    id: "rajasthan",
    name: "Rajasthan Heritage Tour",
    state: "Rajasthan",
    category: "family",
    region: "north",
    duration: "6-7 Days",
    durationDays: 7,
    budget: "₹30,000 - ₹50,000",
    estimatedCost: 40000,
    bestSeason: "October to March",
    highlights: ["Jaipur palaces", "Udaipur lakes", "Desert safari"],
    description: "Royal heritage tour through the land of kings",
    imageUrl: "rajasthan.jpg"
  }
];

export const operatingHours = {
  weekdays: "Monday to Saturday: 10:00 AM - 9:00 PM",
  sunday: "Sunday: Holiday",
  openTime: 10, // 10 AM
  closeTime: 21  // 9 PM
};

export function isOperatingHours(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  
  // Sunday is 0
  if (day === 0) return false;
  
  // Check if within operating hours
  return hour >= operatingHours.openTime && hour < operatingHours.closeTime;
}

export function isSunday(): boolean {
  return new Date().getDay() === 0;
}
