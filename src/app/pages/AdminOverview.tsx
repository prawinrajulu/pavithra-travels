import { useEffect, useState } from 'react';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsSnapshot = await getDocs(collection(db, "bookings"));
        const bookings = bookingsSnapshot.docs.map(doc => doc.data());
        
        const recentQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(5));
        const recentSnapshot = await getDocs(recentQuery);
        setRecentBookings(recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const statsData = (bookings as any[]).reduce((acc: any, b: any) => {
          acc.totalBookings++;
          if (b.status?.toLowerCase() === 'confirmed') acc.confirmedBookings++;
          if (b.status?.toLowerCase() === 'pending' || !b.status) acc.pendingBookings++;
          acc.totalRevenue += (b.totalPrice || 0);
          return acc;
        }, { totalBookings: 0, confirmedBookings: 0, pendingBookings: 0, totalRevenue: 0 });

        setStats(statsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        // Data fetch complete
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: <Calendar className="text-blue-600" />, trend: '+12%', color: 'bg-blue-50' },
    { label: 'Confirmed', value: stats.confirmedBookings, icon: <CheckCircle2 className="text-green-600" />, trend: '85%', color: 'bg-green-50' },
    { label: 'Pending', value: stats.pendingBookings, icon: <Clock className="text-amber-600" />, trend: '-5%', color: 'bg-amber-50' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUp className="text-purple-600" />, trend: '+20%', color: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with Pavithra Travels today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-2xl`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-[#FF8C00] text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBookings.length > 0 ? recentBookings.map((b) => (
              <div key={b.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                    {b.customerName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{b.customerName || 'Unknown'}</h4>
                    <p className="text-sm text-gray-500">{b.destination}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                    b.status?.toLowerCase() === 'confirmed' ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {b.status || 'Pending'}
                  </div>
                  <p className="text-sm font-bold text-gray-900">₹{b.totalPrice?.toLocaleString() || '0'}</p>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-gray-400">No bookings yet.</div>
            )}
          </div>
        </div>

        {/* Quick Actions & System Info */}
        <div className="space-y-8">
          <div className="bg-[#0B132B] p-8 rounded-[2.5rem] text-white shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-[#FF8C00]" />
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Link to="/admin/media" className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl flex items-center justify-between transition-all group border border-white/5">
                <span className="font-medium">Add New Media</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/whatsapp" className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl flex items-center justify-between transition-all group border border-white/5">
                <span className="font-medium">Trigger Test Alert</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-[#FF8C00] p-8 rounded-[2.5rem] text-white shadow-xl shadow-[#FF8C00]/20">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Activity
            </h3>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Monitor real-time interactions with your travel chatbot and conversion rates from the landing page.
            </p>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[65%]"></div>
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-white/60">65% Target Achieved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
