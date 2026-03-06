export interface Temple {
  id: string;
  name: string;
  location: string;
  description: string;
  shortDescription: string;
  image: string;
  highlights: string[];
}

export const temples: Temple[] = [
  {
    id: "tirupati",
    name: "Tirupati Balaji",
    location: "Andhra Pradesh",
    shortDescription: "One of the most visited pilgrimage centers in the world",
    description: "Experience the divine blessings at the sacred Tirupati Balaji Temple, nestled in the seven hills of Tirumala. This ancient temple dedicated to Lord Venkateswara attracts millions of devotees every year, making it one of the most visited religious sites globally.",
    image: "https://images.unsplash.com/photo-1609876634007-76c04c5863cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaXJ1cGF0aSUyMHRlbXBsZSUyMEluZGlhfGVufDF8fHx8MTc3MjI5MTgzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: [
      "Darshan of Lord Venkateswara",
      "Scenic hill drive experience",
      "Comfortable accommodation arrangements",
      "Guidance through temple rituals",
      "Visit to nearby sacred sites"
    ]
  },
  {
    id: "rameswaram",
    name: "Rameswaram Temple",
    location: "Tamil Nadu",
    shortDescription: "Sacred Jyotirlinga temple in the island city",
    description: "Visit the magnificent Ramanathaswamy Temple in Rameswaram, one of the twelve Jyotirlinga temples. Located on Pamban Island, this temple is renowned for its impressive corridors, sacred water tanks, and its significance in the Ramayana epic.",
    image: "https://images.unsplash.com/photo-1759509334486-3ae81c4dcb01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSYW1lc3dhcmFtJTIwdGVtcGxlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjI5MTgzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: [
      "Jyotirlinga darshan",
      "Sacred bath in 22 holy wells",
      "Visit to Dhanushkodi beach",
      "Pamban Bridge sightseeing",
      "Historical and spiritual tour"
    ]
  },
  {
    id: "madurai",
    name: "Madurai Meenakshi Temple",
    location: "Tamil Nadu",
    shortDescription: "Historic temple with stunning Dravidian architecture",
    description: "Explore the breathtaking Meenakshi Amman Temple in Madurai, a masterpiece of Dravidian architecture. With its towering gopurams adorned with thousands of colorful sculptures, this temple is dedicated to Goddess Meenakshi and Lord Sundareswarar.",
    image: "https://images.unsplash.com/photo-1692173248120-59547c3d4653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWR1cmFpJTIwTWVlbmFrc2hpJTIwdGVtcGxlfGVufDF8fHx8MTc3MjI5MTgzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: [
      "Marvel at towering gopurams",
      "Witness evening aarti ceremony",
      "Explore the thousand pillar hall",
      "Local cultural experiences",
      "Traditional South Indian cuisine"
    ]
  },
  {
    id: "varanasi",
    name: "Kashi Vishwanath",
    location: "Varanasi, Uttar Pradesh",
    shortDescription: "Ancient temple on the banks of holy Ganges",
    description: "Journey to the spiritual capital of India and visit the Kashi Vishwanath Temple, one of the most sacred Shiva temples. Experience the mystical Ganga Aarti, take a holy dip in the Ganges, and immerse yourself in the ancient spiritual traditions of Varanasi.",
    image: "https://images.unsplash.com/photo-1717323821798-8cee2f6826ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWYXJhbmFzaSUyMEdhbmdlcyUyMHRlbXBsZXxlbnwxfHx8fDE3NzIyOTE4Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: [
      "Kashi Vishwanath temple darshan",
      "Ganga Aarti at Dashashwamedh Ghat",
      "Boat ride on the Ganges",
      "Visit to Sarnath Buddhist site",
      "Spiritual city exploration"
    ]
  },
  {
    id: "kedarnath",
    name: "Kedarnath Temple",
    location: "Uttarakhand",
    shortDescription: "Sacred Jyotirlinga in the Himalayas",
    description: "Embark on a spiritual journey to Kedarnath, one of the Char Dham pilgrimage sites nestled in the majestic Himalayas. This ancient temple dedicated to Lord Shiva is located at an altitude of 3,583 meters, offering both spiritual fulfillment and breathtaking mountain views.",
    image: "https://images.unsplash.com/photo-1577516311194-eb14c570a137?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZWRhcm5hdGglMjBIaW1hbGF5YSUyMHRlbXBsZXxlbnwxfHx8fDE3NzIyOTE4Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: [
      "High-altitude temple visit",
      "Stunning Himalayan scenery",
      "Spiritual trekking experience",
      "Visit to Gaurikund",
      "Mountain accommodation arrangements"
    ]
  },
  {
    id: "badrinath",
    name: "Badrinath Temple",
    location: "Uttarakhand",
    shortDescription: "Divine abode in the Garhwal Himalayas",
    description: "Visit the sacred Badrinath Temple, dedicated to Lord Vishnu, located in the picturesque town of Badrinath in Uttarakhand. Part of the Char Dham pilgrimage, this temple sits along the Alaknanda River, surrounded by snow-capped peaks and natural hot springs.",
    image: "https://images.unsplash.com/photo-1722067487813-3650fb50f028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYWRyaW5hdGglMjBtb3VudGFpbiUyMHRlbXBsZXxlbnwxfHx8fDE3NzIyOTE4Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: [
      "Lord Vishnu temple darshan",
      "Tapt Kund hot springs bath",
      "Mana village exploration",
      "Vasudhara Falls excursion",
      "Char Dham yatra completion"
    ]
  }
];
