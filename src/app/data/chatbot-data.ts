import badrinathImg from "../../assets/destination/Badrinath Temple.jpg";
import kedarnathImg from "../../assets/destination/Kedarnath Temple.jpg";
import muktinathImg from "../../assets/destination/Muktinath Temple.jpg";
import amarnathImg from "../../assets/destination/Amarnath Yatra.jpg";
import shirdiImg from "../../assets/destination/Shirdi Darshan.jpg";
import gayaImg from "../../assets/destination/Gaya.jpg";
import prayagrajImg from "../../assets/destination/Prayagraj.jpg";
import keralaImg from "../../assets/destination/Kerala.jpg";
import keralaBackwaterImg from "../../assets/destination/Kerala backwater.jpg";
import gujaratImg from "../../assets/destination/gujarath.jpg";
import rajasthanImg from "../../assets/destination/Rajasthan.jpg";
import kashmirImg from "../../assets/destination/Kashmir.jpg";
import munnarImg from "../../assets/destination/Munnar.jpg";
import dehradunImg from "../../assets/destination/Dehradun.jpg";
import kulluImg from "../../assets/destination/Kullu.jpg";
import manaliImg from "../../assets/destination/Manali.jpg";
import shimlaImg from "../../assets/destination/Shimla.jpg";
import coorgImg from "../../assets/destination/Coorg.jpg";
import mysoreImg from "../../assets/destination/Mysore.jpg";
import darjeelingImg from "../../assets/destination/Darjeeling.jpg";
import assamImg from "../../assets/destination/Assam.jpg";
import amritsarImg from "../../assets/destination/Amritsar.jpg";
import attariBorderImg from "../../assets/destination/Attari Border.jpg";
import sikkimImg from "../../assets/destination/Sikkim.jpg";
import nepalCoverImg from "../../assets/destination/Nepal.png";
import bhutanCoverImg from "../../assets/destination/Bhutan.png";
import ayodhyaImg from "../../assets/destination/ayodhya.jpg";
import JothirlingamImg from "../../assets/destination/12 Jothirlingam.jpg";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  state: string;
  category: "temple" | "family" | "adventure" | "beach" | "hill-station";
  region: "north" | "south" | "east" | "west" | "central";
  duration: string;
  durationDays: number;
  bestSeason: string;
  highlights: string[];
  description: string;
  imageUrl?: string;
  rating?: number;
}

export const destinations: Destination[] = [
  // Spiritual & Temple Tours
  {
    id: "badrinath",
    slug: "badrinath",
    name: "Badrinath Temple",
    state: "Uttarakhand",
    category: "temple",
    region: "north",
    duration: "4-5 Days",
    durationDays: 5,


    bestSeason: "May to June, September to October",
    highlights: ["Char Dham yatra", "Tapt Kund hot springs", "Neelkanth peak views"],
    description: "Divine journey to Lord Vishnu's sacred abode in the Himalayas",
    imageUrl: badrinathImg
  },
  {
    id: "kedarnath",
    slug: "kedarnath",
    name: "Kedarnath Temple",
    state: "Uttarakhand",
    category: "temple",
    region: "north",
    duration: "4-5 Days",
    durationDays: 5,


    bestSeason: "April To June, Sep to April",
    highlights: ["Char Dham pilgrimage", "Himalayan trek", "Mandakini river views"],
    description: "Himalayan pilgrimage to one of the twelve Jyotirlingas",
    imageUrl: kedarnathImg
  },
  {
    id: "muktinath",
    slug: "muktinath",
    name: "Muktinath Temple",
    state: "Nepal",
    category: "temple",
    region: "north",
    duration: "5-6 Days",
    durationDays: 6,


    bestSeason: "March to May, September to November",
    highlights: ["Holy bath in 108 waterspouts", "Eternal flame", "Himalayan backdrop"],
    description: "Sacred site for both Hindus and Buddhists in the Mustang valley",
    imageUrl: muktinathImg
  },
  {
    id: "amarnath",
    slug: "amarnath-yatra",
    name: "Amarnath Yatra",
    state: "Jammu & Kashmir",
    category: "temple",
    region: "north",
    duration: "4-5 Days",
    durationDays: 5,


    bestSeason: "July to August",
    highlights: ["Ice Lingam darshan", "Scenic Baltal/Pahalgam route", "Spiritual atmosphere"],
    description: "Holy pilgrimage to the cave of Lord Shiva in the Kashmir Himalayas",
    imageUrl: amarnathImg
  },
  {
    id: "jyotirlinga",
    slug: "12-jyotirlinga-temples",
    name: "12 Jyotirlinga Temples",
    state: "Pan India",
    category: "temple",
    region: "central",
    duration: "15-20 Days",
    durationDays: 15,


    bestSeason: "Year-round",
    highlights: ["Visit all 12 sacred Shiva shrines", "Major spiritual tour", "Cultural immersion"],
    description: "Cover the twelve most sacred abodes of Lord Shiva across India",
    imageUrl: JothirlingamImg
  },
  {
    id: "shirdi",
    slug: "shirdi-darshan",
    name: "Shirdi Darshan",
    state: "Maharashtra",
    category: "temple",
    region: "west",
    duration: "2-3 Days",
    durationDays: 3,


    bestSeason: "October To June",
    highlights: ["Sai Baba Temple", "Dwarkamai", "Chavadi"],
    description: "Spiritual visit to the home of Sai Baba, a universal saint",
    imageUrl: shirdiImg
  },
  {
    id: "gaya",
    slug: "gaya",
    name: "Gaya",
    state: "Bihar",
    category: "temple",
    region: "east",
    duration: "2-3 Days",
    durationDays: 3,


    bestSeason: "October To June",
    highlights: ["Vishnupad Temple", "Pinda Daan rituals", "Falgu River"],
    description: "Ancient city known for spiritual rituals and religious significance",
    imageUrl: gayaImg
  },
  {
    id: "prayagraj",
    slug: "prayagraj",
    name: "Prayagraj",
    state: "Uttar Pradesh",
    category: "temple",
    region: "north",
    duration: "2-3 Days",
    durationDays: 3,


    bestSeason: "October to July",
    highlights: ["Triveni Sangam", "Kumbh Mela site", "Allahabad Fort"],
    description: "City of the sacred confluence of three holy rivers",
    imageUrl: prayagrajImg
  },
  {
    id: "ayodhya",
    slug: "ayodhya",
    name: "Ayodhya",
    state: "Uttar Pradesh",
    category: "temple",
    region: "north",
    duration: "2-3 Days",
    durationDays: 3,


    bestSeason: "October to March",
    highlights: ["Ram Mandir", "Hanuman Garhi", "Sarayu River Aarti"],
    description: "Birthplace of Lord Rama and a major spiritual center",
    imageUrl: ayodhyaImg
  },

  // Scenic & Nature Tours
  {
    id: "kerala-state",
    slug: "kerala",
    name: "Kerala",
    state: "Kerala",
    category: "family",
    region: "south",
    duration: "5-7 Days",
    durationDays: 6,


    bestSeason: "September to March",
    highlights: ["Hill stations", "Spice plantations", "Cultural performances"],
    description: "Explore the lush landscapes and rich culture of God's Own Country",
    imageUrl: keralaImg
  },
  {
    id: "kerala-backwaters",
    slug: "kerala-backwaters",
    name: "Kerala Backwaters",
    state: "Kerala",
    category: "family",
    region: "south",
    duration: "2-3 Days",
    durationDays: 3,


    bestSeason: "November to February",
    highlights: ["Houseboat cruise", "Village life experience", "Vembanad Lake"],
    description: "Serene boat journeys through tropical palm-fringed waterways",
    imageUrl: keralaBackwaterImg
  },
  {
    id: "gujarat",
    slug: "gujarat",
    name: "Gujarat",
    state: "Gujarat",
    category: "family",
    region: "west",
    duration: "5-6 Days",
    durationDays: 6,


    bestSeason: "November to February",
    highlights: ["Rann of Kutch", "Gir National Park", "Somnath Temple"],
    description: "Land of vibrant festivals, diverse wildlife, and historic sites",
    imageUrl: gujaratImg
  },
  {
    id: "rajasthan",
    slug: "rajasthan",
    name: "Rajasthan",
    state: "Rajasthan",
    category: "family",
    region: "west",
    duration: "6-8 Days",
    durationDays: 7,


    bestSeason: "October to March",
    highlights: ["Desert safari", "Royal palaces", "Colorful markets"],
    description: "Magnificent land of kings, forts, and heritage sites",
    imageUrl: rajasthanImg
  },
  {
    id: "kashmir",
    slug: "kashmir",
    name: "Kashmir",
    state: "Jammu & Kashmir",
    category: "family",
    region: "north",
    duration: "5-7 Days",
    durationDays: 6,


    bestSeason: "January to June, September to December",
    highlights: ["Shikara ride on Dal Lake", "Gulmarg snow fields", "Pahalgam meadows"],
    description: "Paradise on Earth with breathtaking valleys and snowy peaks",
    imageUrl: kashmirImg
  },
  {
    id: "munnar",
    slug: "munnar",
    name: "Munnar",
    state: "Kerala",
    category: "hill-station",
    region: "south",
    duration: "3-4 Days",
    durationDays: 3,


    bestSeason: "September to May",
    highlights: ["Tea gardens", "Eravikulam National Park", "Mattupetty Dam"],
    description: "Picturesque hill station famous for its tea plantations",
    imageUrl: munnarImg
  },
  {
    id: "dehradun",
    slug: "dehradun",
    name: "Dehradun",
    state: "Uttarakhand",
    category: "hill-station",
    region: "north",
    duration: "2-3 Days",
    durationDays: 3,


    bestSeason: "March to June, October to December",
    highlights: ["Sahastradhara", "Robber's Cave", "Mindrolling Monastery"],
    description: "Lush capital of Uttarakhand in the Himalayan foothills",
    imageUrl: dehradunImg
  },
  {
    id: "kullu",
    slug: "kullu",
    name: "Kullu",
    state: "Himachal Pradesh",
    category: "adventure",
    region: "north",
    duration: "2-3 Days",
    durationDays: 3,


    bestSeason: "March to June, September to November",
    highlights: ["River rafting", "Beas River", "Kullu Shawls"],
    description: "Famous valley known for its river rafting and scenic beauty",
    imageUrl: kulluImg
  },
  {
    id: "manali",
    slug: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    category: "hill-station",
    region: "north",
    duration: "4-5 Days",
    durationDays: 4,


    bestSeason: "March to June, October to February",
    highlights: ["Solang Valley", "Hadimba Temple", "Old Manali"],
    description: "Popular Himalayan resort known for its stunning mountain views",
    imageUrl: manaliImg
  },
  {
    id: "shimla",
    slug: "shimla",
    name: "Shimla",
    state: "Himachal Pradesh",
    category: "hill-station",
    region: "north",
    duration: "3-4 Days",
    durationDays: 3,


    bestSeason: "March to June, October to February",
    highlights: ["The Ridge", "Mall Road", "Jakhu Temple"],
    description: "Former colonial capital with charming architecture and hills",
    imageUrl: shimlaImg
  },
  {
    id: "coorg",
    slug: "coorg",
    name: "Coorg",
    state: "Karnataka",
    category: "hill-station",
    region: "south",
    duration: "3-4 Days",
    durationDays: 3,


    bestSeason: "October to April",
    highlights: ["Abbey Falls", "Coffee estates", "Namdroling Monastery"],
    description: "Scotland of India, known for its coffee and mist-covered hills",
    imageUrl: coorgImg
  },
  {
    id: "mysore",
    slug: "mysore",
    name: "Mysore",
    state: "Karnataka",
    category: "family",
    region: "south",
    duration: "2-3 Days",
    durationDays: 2,


    bestSeason: "October to March",
    highlights: ["Mysore Palace", "Chamundi Hill", "Brindavan Gardens"],
    description: "Historic city known for its royal heritage and grand palaces",
    imageUrl: mysoreImg
  },
  {
    id: "darjeeling",
    slug: "darjeeling",
    name: "Darjeeling",
    state: "West Bengal",
    category: "hill-station",
    region: "east",
    duration: "3-4 Days",
    durationDays: 4,


    bestSeason: "March to May, September to November",
    highlights: ["Tiger Hill sunrise", "Toy Train", "Tea gardens"],
    description: "Famous hill station known for its tea and views of Kanchenjunga",
    imageUrl: darjeelingImg
  },
  {
    id: "assam",
    slug: "assam",
    name: "Assam",
    state: "Assam",
    category: "family",
    region: "east",
    duration: "4-6 Days",
    durationDays: 5,


    bestSeason: "October to April",
    highlights: ["Kaziranga National Park", "Kamakhya Temple", "Tea gardens"],
    description: "Land of the one-horned rhino and vibrant tea culture",
    imageUrl: assamImg
  },
  {
    id: "amritsar",
    slug: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    category: "temple",
    region: "north",
    duration: "2-3 Days",
    durationDays: 2,


    bestSeason: "October to March",
    highlights: ["Golden Temple", "Jallianwala Bagh", "Langar meal"],
    description: "Spiritual home of Sikhism with the stunning Golden Temple",
    imageUrl: amritsarImg
  },
  {
    id: "attari-border",
    slug: "attari-border",
    name: "Attari Border",
    state: "Punjab",
    category: "family",
    region: "north",
    duration: "1 Day",
    durationDays: 1,


    bestSeason: "October to March",
    highlights: ["Beating Retreat ceremony", "Patriotic atmosphere", "Wagah border site"],
    description: "Historic border between India and Pakistan with powerful ceremonies",
    imageUrl: attariBorderImg
  },

  // International & Border Destinations
  {
    id: "sri-lanka",
    slug: "sri-lanka",
    name: "Sri Lanka",
    state: "Sri Lanka",
    category: "family",
    region: "south",
    duration: "5-7 Days",
    durationDays: 6,


    bestSeason: "December to April",
    highlights: ["Tea estates", "Wildlife safaris", "Historic temples"],
    description: "Island nation with beautiful beaches, history, and lush nature",
    imageUrl: "https://images.unsplash.com/photo-1546708973-b339540b5162"
  },
  {
    id: "nepal",
    slug: "nepal",
    name: "Nepal",
    state: "Nepal",
    category: "family",
    region: "north",
    duration: "5-6 Days",
    durationDays: 5,


    bestSeason: "March to May, September to November",
    highlights: ["Kathmandu Valley", "Pokhara Lake", "Himalayan panoramic views"],
    description: "Mountain kingdom with ancient culture and majestic peaks",
    imageUrl: nepalCoverImg
  },
  {
    id: "bhutan",
    slug: "bhutan",
    name: "Bhutan",
    state: "Bhutan",
    category: "family",
    region: "east",
    duration: "5-7 Days",
    durationDays: 6,


    bestSeason: "March to May, September to November",
    highlights: ["Tiger's Nest Monastery", "Thimphu Valley", "Pure Himalayan air"],
    description: "The land of Gross National Happiness and spiritual peace",
    imageUrl: bhutanCoverImg
  },
  {
    id: "sikkim",
    slug: "sikkim",
    name: "Sikkim",
    state: "Sikkim",
    category: "hill-station",
    region: "east",
    duration: "4-6 Days",
    durationDays: 5,


    bestSeason: "March to May, October to December",
    highlights: ["Gangtok city", "Nathula Pass", "Buddhist monasteries"],
    description: "Beautiful Himalayan state with diverse culture and landscapes",
    imageUrl: sikkimImg
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
