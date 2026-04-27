import badrinathImg from "../../assets/destination/Badrinath Temple.jpg";
import kedarnathImg from "../../assets/destination/Kedarnath Temple.jpg";
import muktinathImg from "../../assets/destination/Muktinath Temple.jpg";
import amarnathImg from "../../assets/destination/Amarnath Yatra.jpg";
import shirdiImg from "../../assets/destination/Shirdi Darshan.jpg";
import gayaImg from "../../assets/destination/Gaya.jpg";
import prayagrajImg from "../../assets/destination/Prayagraj.jpg";
import ayodhyaImg from "../../assets/destination/ayodhya.jpg";
import JothirlingamImg from "../../assets/destination/12 Jothirlingam.jpg";

export interface Temple {
  id: string;
  slug: string;
  name: string;
  location: string;
  description: string;
  shortDescription: string;
  image: string;
  highlights: string[];
}

export const temples: Temple[] = [
  {
    id: "badrinath",
    slug: "badrinath",
    name: "Badrinath Temple",
    location: "Uttarakhand",
    shortDescription: "Divine abode in the Garhwal Himalayas",
    description: "Visit the sacred Badrinath Temple, dedicated to Lord Vishnu, located in the town of Badrinath in Uttarakhand. Part of the Char Dham pilgrimage, this temple sits along the Alaknanda River, surrounded by snow-capped peaks and natural hot springs.",
    image: badrinathImg,
    highlights: ["Lord Vishnu temple darshan", "Tapt Kund hot springs bath", "Mana village exploration", "Vasudhara Falls excursion", "Char Dham yatra completion"]
  },
  {
    id: "kedarnath",
    slug: "kedarnath",
    name: "Kedarnath Temple",
    location: "Uttarakhand",
    shortDescription: "Sacred Jyotirlinga in the Himalayas",
    description: "Embark on a spiritual journey to Kedarnath, one of the Char Dham pilgrimage sites nestled in the majestic Himalayas. This ancient temple dedicated to Lord Shiva is located at an altitude of 3,583 meters, offering both spiritual fulfillment and breathtaking mountain views.",
    image: kedarnathImg,
    highlights: ["High-altitude temple visit", "Stunning Himalayan scenery", "Spiritual trekking experience", "Visit to Gaurikund", "Mountain accommodation arrangements"]
  },
  {
    id: "muktinath",
    slug: "muktinath",
    name: "Muktinath Temple",
    location: "Nepal",
    shortDescription: "Sacred site of liberation in the Mustang mountains",
    description: "Muktinath is a sacred place for both Hindus and Buddhists, located in the Muktinath Valley at an altitude of 3,710 meters. It is known as the place of liberation (Mukti Kshetra) and features the sacred 108 water spouts and the eternal flame.",
    image: muktinathImg,
    highlights: ["108 sacred water spouts", "Eternal flame pilgrimage", "Saligram stone finding", "Panoramic mountain views", "Spiritual tranquility"]
  },
  {
    id: "amarnath",
    slug: "amarnath-yatra",
    name: "Amarnath Yatra",
    location: "Jammu & Kashmir",
    shortDescription: "Holy pilgrimage to the Ice Lingam cave",
    description: "The Amarnath Yatra is one of the most significant Hindu pilgrimages, leading to the holy cave where an ice stalagmite forms the Shiva Lingam. Surrounded by the majestic Himalayas, this spiritual journey offers a once-in-a-lifetime experience.",
    image: amarnathImg,
    highlights: ["Ice Lingam darshan", "Himalayan trek experience", "Baltal spiritual camp", "Spiritual chanting and hymns", "Pristine mountain lakes view"]
  },
  {
    id: "jyotirlinga",
    slug: "12-jyotirlinga-temples",
    name: "12 Jyotirlinga Temples",
    location: "Pan India",
    shortDescription: "Grand tour of the 12 sacred Shiva abodes",
    description: "Experience the ultimate spiritual journey by visiting all 12 Jyotirlingas, the most sacred shrines dedicated to Lord Shiva across India. This unified tour takes you through ancient temples with deep spiritual and architectural significance.",
    image: JothirlingamImg,
    highlights: ["Somnath & Nageshwar (Gujarat)", "Mallikarjuna (Andhra)", "Mahakaleshwar & Omkareshwar (MP)", "Kedarnath (Uttarakhand)", "Bhimashankar, Trimbakeshwar, Grishneshwar (Maharashtra)", "Kashi Vishwanath (UP)", "Vaidyanath (Jharkhand)", "Ramanathaswamy (Tamil Nadu)"]
  },
  {
    id: "shirdi",
    slug: "shirdi-darshan",
    name: "Shirdi Darshan",
    location: "Maharashtra",
    shortDescription: "Abode of Sai Baba's spiritual teachings",
    description: "Shirdi is a world-renowned spiritual center where Sai Baba lived and taught the message of universal love and faith. Millions of devotees visit the Samadhi Mandir every year to seek blessings and experience the divine peace of the premises.",
    image: shirdiImg,
    highlights: ["Sai Baba Samadhi Mandir", "Dwarkamai mosque visit", "Chavadi evening aarti", "Khandoba Temple", "Spiritual serenity"]
  },
  {
    id: "gaya",
    slug: "gaya",
    name: "Gaya",
    location: "Bihar",
    shortDescription: "Sacred city for ancestral rites and rituals",
    description: "Gaya is a major pilgrimage center of high religious importance for performing Pinda Daan (rituals for ancestors). It is also home to the ancient Vishnupad Temple on the banks of the Falgu River, believed to feature the footprint of Lord Vishnu.",
    image: gayaImg,
    highlights: ["Vishnupad Temple darshan", "Pinda Daan at Falgu River", "Bodhi Tree (Bodh Gaya nearby)", "Ancient temple architecture", "Spiritual heritage tour"]
  },
  {
    id: "prayagraj",
    slug: "prayagraj",
    name: "Prayagraj",
    location: "Uttar Pradesh",
    shortDescription: "Holy confluence of three sacred rivers",
    description: "Prayagraj, formerly Allahabad, is the site of the Triveni Sangam, the sacred confluence of the Ganges, Yamuna, and the mythical Saraswati rivers. It is one of the most prominent spiritual destinations in India, especially during the Kumbh Mela.",
    image: prayagrajImg,
    highlights: ["Triveni Sangam holy dip", "Akshayavat (Sacred Banyan Tree)", "Prayagraj Fort", "Anand Bhavan visit", "Spiritual historical tour"]
  },
  {
    id: "ayodhya",
    slug: "ayodhya",
    name: "Ayodhya",
    location: "Uttar Pradesh",
    shortDescription: "Birthplace of Lord Rama and divine heritage",
    description: "Ayodhya is an ancient temple city on the banks of the Sarayu River, celebrated as the birthplace of Lord Rama. The city is a centerpiece of Indian heritage, featuring the grand Ram Janmabhoomi Temple and numerous sacred ghats and shrines.",
    image: ayodhyaImg,
    highlights: ["Ram Janmabhoomi Mandir", "Hanuman Garhi Temple", "Sarayu River Aarti", "Kanak Bhawan", "City of divine history"]
  }
];
