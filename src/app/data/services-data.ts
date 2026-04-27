import badrinathImg from "../../assets/destination/Badrinath Temple.jpg";
import kedarnathImg from "../../assets/destination/Kedarnath Temple.jpg";
import muktinathImg from "../../assets/destination/Muktinath Temple.jpg";
import amarnathImg from "../../assets/destination/Amarnath Yatra.jpg";
import shirdiImg from "../../assets/destination/Shirdi Darshan.jpg";
import keralaImg from "../../assets/destination/Kerala.jpg";
import keralaBackwaterImg from "../../assets/destination/Kerala backwater.jpg";
import rajasthanImg from "../../assets/destination/Rajasthan.jpg";
import munnarImg from "../../assets/destination/Munnar.jpg";
import shimlaImg from "../../assets/destination/Shimla.jpg";
import coorgImg from "../../assets/destination/Coorg.jpg";
import manaliImg from "../../assets/destination/Manali.jpg";
import kulluImg from "../../assets/destination/Kullu.jpg";
import kashmirImg from "../../assets/destination/Kashmir.jpg";
import mysoreImg from "../../assets/destination/Mysore.jpg";
import ayodhyaImg from "../../assets/destination/ayodhya.jpg";
import JothirlingamImg from "../../assets/destination/12 Jothirlingam.jpg";

export interface ServiceDestination {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  rating: number;
  image: string;
}

export const servicesData: ServiceDestination[] = [
  // Temple Trips
  { id: "t1", slug: "badrinath", title: "Badrinath Temple", category: "temple", location: "Uttarakhand", rating: 5, image: badrinathImg },
  { id: "t2", slug: "kedarnath", title: "Kedarnath Temple", category: "temple", location: "Uttarakhand", rating: 5, image: kedarnathImg },
  { id: "t3", slug: "muktinath", title: "Muktinath Temple", category: "temple", location: "Nepal", rating: 5, image: muktinathImg },
  { id: "t4", slug: "amarnath-yatra", title: "Amarnath Yatra", category: "temple", location: "Jammu & Kashmir", rating: 5, image: amarnathImg },
  { id: "t5", slug: "12-jyotirlinga-temples", title: "12 Jyotirlinga Temples", category: "temple", location: "Pan India", rating: 5, image: JothirlingamImg },
  { id: "t6", slug: "shirdi-darshan", title: "Shirdi Darshan", category: "temple", location: "Maharashtra", rating: 5, image: shirdiImg },
  { id: "t7", slug: "ayodhya", title: "Ayodhya Ram Mandir", category: "temple", location: "Uttar Pradesh", rating: 5, image: ayodhyaImg },
  
  // Family Trips
  { id: "f1", slug: "kerala", title: "Kerala Nature Tour", category: "family", location: "Kerala", rating: 5, image: keralaImg },
  { id: "f2", slug: "kerala-backwaters", title: "Kerala Backwaters", category: "family", location: "Kerala", rating: 5, image: keralaBackwaterImg },
  { id: "f3", slug: "rajasthan", title: "Rajasthan Heritage", category: "family", location: "Rajasthan", rating: 5, image: rajasthanImg },
  { id: "f4", slug: "mysore", title: "Mysore Palace", category: "family", location: "Karnataka", rating: 5, image: mysoreImg },
  
  // Honeymoon & Hill Stations
  { id: "h1", slug: "munnar", title: "Munnar Tea Gardens", category: "honeymoon", location: "Kerala", rating: 5, image: munnarImg },
  { id: "h2", slug: "shimla", title: "Shimla Hills", category: "honeymoon", location: "Himachal Pradesh", rating: 5, image: shimlaImg },
  { id: "h3", slug: "coorg", title: "Coorg Coffee Estates", category: "honeymoon", location: "Karnataka", rating: 5, image: coorgImg },
  
  // Adventure Trips
  { id: "a1", slug: "manali", title: "Manali Adventure", category: "adventure", location: "Himachal Pradesh", rating: 5, image: manaliImg },
  { id: "a2", slug: "kullu", title: "Kullu River Rafting", category: "adventure", location: "Himachal Pradesh", rating: 5, image: kulluImg },
  { id: "a3", slug: "kashmir", title: "Kashmir Valley", category: "adventure", location: "Jammu & Kashmir", rating: 5, image: kashmirImg }
];
