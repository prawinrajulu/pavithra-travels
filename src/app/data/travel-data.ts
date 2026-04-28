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

export interface TravelPackage {
  id: number;
  slug: string;
  name: string;
  location: string;
  image: string;
}

export const travelData: TravelPackage[] = [
  {
    id: 1,
    slug: "badrinath",
    name: "Badrinath Temple",
    location: "Uttarakhand",
    image: badrinathImg
  },
  {
    id: 2,
    slug: "kedarnath",
    name: "Kedarnath Temple",
    location: "Uttarakhand",
    image: kedarnathImg
  },
  {
    id: 3,
    slug: "muktinath",
    name: "Muktinath Temple",
    location: "Nepal",
    image: muktinathImg
  },
  {
    id: 4,
    slug: "amarnath-yatra",
    name: "Amarnath Yatra",
    location: "Jammu & Kashmir",
    image: amarnathImg
  },
  {
    id: 5,
    slug: "12-jyotirlinga-temples",
    name: "12 Jyotirlinga Temples",
    location: "India",
    image: JothirlingamImg
  },
  {
    id: 6,
    slug: "shirdi-darshan",
    name: "Shirdi Darshan",
    location: "Maharashtra",
    image: shirdiImg
  },
  {
    id: 7,
    slug: "gaya",
    name: "Gaya",
    location: "Bihar",
    image: gayaImg
  },
  {
    id: 8,
    slug: "prayagraj",
    name: "Prayagraj",
    location: "Uttar Pradesh",
    image: prayagrajImg
  },
  {
    id: 9,
    slug: "ayodhya",
    name: "Ayodhya",
    location: "Uttar Pradesh",
    image: ayodhyaImg
  },
  {
    id: 10,
    slug: "kerala",
    name: "Kerala",
    location: "Kerala",
    image: keralaImg
  },
  {
    id: 11,
    slug: "kerala-backwaters",
    name: "Kerala Backwaters",
    location: "Kerala",
    image: keralaBackwaterImg
  },
  {
    id: 12,
    slug: "gujarat",
    name: "Gujarat",
    location: "Gujarat",
    image: gujaratImg
  },
  {
    id: 13,
    slug: "rajasthan",
    name: "Rajasthan",
    location: "Rajasthan",
    image: rajasthanImg
  },
  {
    id: 14,
    slug: "kashmir",
    name: "Kashmir",
    location: "Jammu & Kashmir",
    image: kashmirImg
  },
  {
    id: 15,
    slug: "munnar",
    name: "Munnar",
    location: "Kerala",
    image: munnarImg
  },
  {
    id: 16,
    slug: "dehradun",
    name: "Dehradun",
    location: "Uttarakhand",
    image: dehradunImg
  },
  {
    id: 17,
    slug: "kullu",
    name: "Kullu",
    location: "Himachal Pradesh",
    image: kulluImg
  },
  {
    id: 18,
    slug: "manali",
    name: "Manali",
    location: "Himachal Pradesh",
    image: manaliImg
  },
  {
    id: 19,
    slug: "shimla",
    name: "Shimla",
    location: "Himachal Pradesh",
    image: shimlaImg
  },
  {
    id: 20,
    slug: "coorg",
    name: "Coorg",
    location: "Karnataka",
    image: coorgImg
  },
  {
    id: 21,
    slug: "mysore",
    name: "Mysore",
    location: "Karnataka",
    image: mysoreImg
  },
  {
    id: 22,
    slug: "darjeeling",
    name: "Darjeeling",
    location: "West Bengal",
    image: darjeelingImg
  },
  {
    id: 23,
    slug: "assam",
    name: "Assam",
    location: "Assam",
    image: assamImg
  },
  {
    id: 24,
    slug: "amritsar",
    name: "Amritsar",
    location: "Punjab",
    image: amritsarImg
  },
  {
    id: 25,
    slug: "attari-border",
    name: "Attari Border",
    location: "Punjab",
    image: attariBorderImg
  },
  {
    id: 26,
    slug: "sri-lanka",
    name: "Sri Lanka",
    location: "Sri Lanka",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162"
  },
  {
    id: 27,
    slug: "nepal",
    name: "Nepal",
    location: "Nepal",
    image: nepalCoverImg
  },
  {
    id: 28,
    slug: "bhutan",
    name: "Bhutan",
    location: "Bhutan",
    image: bhutanCoverImg
  },
  {
    id: 29,
    slug: "sikkim",
    name: "Sikkim",
    location: "Sikkim",
    image: sikkimImg
  },
  {
    id: 30,
    slug: "dwarka",
    name: "Dwarka",
    location: "Gujarat",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3"
  },
  {
    id: 31,
    slug: "somnath",
    name: "Somnath",
    location: "Gujarat",
    image: "https://images.unsplash.com/photo-1629255286259-2821f57f6d48"
  },
  {
    id: 32,
    slug: "bhavnagar",
    name: "Bhavnagar",
    location: "Gujarat",
    image: "https://images.unsplash.com/photo-1620023617300-36a524a1e944"
  }
];
