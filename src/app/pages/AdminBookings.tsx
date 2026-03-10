import { useEffect,useState } from "react";
import { db } from "../../config/firebase";
import { collection,getDocs } from "firebase/firestore";

export default function AdminBookings(){

  const [bookings,setBookings] = useState<any[]>([]);

  useEffect(()=>{

    const fetchBookings = async()=>{

      const snapshot = await getDocs(collection(db,"bookings"));

      const data = snapshot.docs.map(doc=>doc.data());

      setBookings(data);
    }

    fetchBookings();

  },[])

  return(

    <div>

      <h2>Customer Bookings</h2>

      {bookings.map((b,i)=>(
        <div key={i}>
          <h4>{b.customerName}</h4>
          <p>{b.destination}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}

    </div>
  )
}