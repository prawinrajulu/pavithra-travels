import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { MapPin, User, Info, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snapshot = await getDocs(collection(db, "bookings"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Customer Bookings</h2>
          <p className="text-gray-500">Manage and track all travel requests</p>
        </div>
        <div className="bg-[#FF8C00]/10 text-[#FF8C00] px-4 py-2 rounded-full text-sm font-bold">
          Total: {bookings.length}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b, i) => (
            <div key={b.id || i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{b.customerName || b.name || "Unknown Guest"}</h4>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <Info className="h-3.5 w-3.5" />
                    <span>{b.email || b.phone || "No contact info"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg">
                <MapPin className="h-4 w-4 text-[#FF8C00]" />
                <span className="font-medium text-gray-700">{b.destination}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold border ${
                  b.status?.toLowerCase() === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                  b.status?.toLowerCase() === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                  'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {getStatusIcon(b.status)}
                  {b.status || 'Pending'}
                </div>
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No bookings found yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}