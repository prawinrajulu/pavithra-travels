import { useEffect, useState } from "react";
import { apiClient } from "../../services/apiClient";
import { MapPin, User, Info, CheckCircle, Clock, XCircle, Users, Calendar, Check } from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const response = await apiClient.getAllBookings();
      if (response.success) {
        setBookings(response.bookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      setActionLoading(bookingId);
      const response = await apiClient.updateBookingStatus(bookingId, newStatus);
      if (response.success) {
        // Refresh bookings to show updated status
        await fetchBookings();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const statusColors: any = {
    completed: 'bg-blue-50 text-blue-700 border-blue-100',
    confirmed: 'bg-green-50 text-green-700 border-green-100',
    cancelled: 'bg-red-50 text-red-700 border-red-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Customer Bookings</h2>
          <p className="text-slate-500 mt-2 text-lg">Manage and track travel requests across the platform</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-orange-50 text-orange-600 px-6 py-3 rounded-2xl text-lg font-bold border border-orange-100 shadow-sm">
            Total bookings: {bookings.length}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent shadow-lg"></div>
          <p className="text-slate-400 font-medium animate-pulse text-lg">Loading booking records...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((b) => (
            <div 
              key={b.bookingId || b.id} 
              className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden"
            >
              {/* Status Indicator Strip */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                b.status === 'completed' ? 'bg-blue-500' :
                b.status === 'confirmed' ? 'bg-green-500' :
                b.status === 'cancelled' ? 'bg-red-500' :
                'bg-orange-400'
              }`} />

              <div className="flex items-center gap-6 flex-1">
                <div className="bg-slate-100 p-4 rounded-2xl group-hover:bg-orange-50 transition-colors duration-300">
                  <User className="h-8 w-8 text-slate-600 group-hover:text-orange-600 transition-colors duration-300" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-bold text-slate-900">{b.name || "Guest Traveller"}</h4>
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase border border-slate-100">
                      {b.bookingId}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 gap-x-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[200px]">{b.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-300 font-light">•</span>
                      <span>{b.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Data Grid */}
              <div className="grid grid-cols-2 md:flex md:items-center gap-6 flex-1">
                <div className="space-y-1 min-w-[140px]">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Destination</p>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="font-semibold truncate">{b.destinationName || b.destination}</span>
                  </div>
                </div>
                <div className="space-y-1 min-w-[120px]">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Travel Date</p>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-sm">
                      {b.travelDate ? new Date(b.travelDate).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 min-w-[80px]">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pax</p>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-sm">{b.passengers} Adults</span>
                  </div>
                </div>
              </div>

              {/* Actions & Status */}
              <div className="flex lg:flex-col items-center lg:items-end gap-3 min-w-[160px]">
                <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold border ${statusColors[b.status?.toLowerCase()] || statusColors.pending}`}>
                  {getStatusIcon(b.status)}
                  <span className="uppercase tracking-wider">{b.status || 'Pending'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {b.status !== 'completed' && b.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusUpdate(b.bookingId, 'completed')}
                      disabled={actionLoading === b.bookingId}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2 text-sm font-semibold"
                      title="Mark as Completed & Notify Customer"
                    >
                      {actionLoading === b.bookingId ? (
                         <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span>Complete</span>
                    </button>
                  )}
                  
                  {b.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(b.bookingId, 'confirmed')}
                      disabled={actionLoading === b.bookingId}
                      className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
                      title="Confirm Booking"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}

                  {b.status !== 'cancelled' && b.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusUpdate(b.bookingId, 'cancelled')}
                      disabled={actionLoading === b.bookingId}
                      className="bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 p-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                      title="Cancel Booking"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No bookings yet</h3>
              <p className="text-slate-500">When customers book trips, they will appear here for your management.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}