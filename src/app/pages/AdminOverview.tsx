import { useEffect, useState } from 'react';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Key,
  Mail,
  AlertTriangle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../../services/apiClient';
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
  const { user: currentUser } = useAuth();
  const [resetState, setResetState] = useState({
    email: '',
    newPassword: '',
    loading: false,
    message: '',
    error: ''
  });
  const [showResetModal, setShowResetModal] = useState(false);

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetState(prev => ({ ...prev, loading: true, message: '', error: '' }));
    try {
      // Find user by email first (we need UID)
      // Note: In a real app, you'd list users or have a search. 
      // For now, we'll assume the super admin knows the user ID or we'll need an endpoint to find user by email.
      
      const response = await apiClient.resetPassword(resetState.email, resetState.newPassword);
      if (response.success) {
        setResetState(prev => ({ ...prev, loading: false, message: 'Password reset successfully!', newPassword: '' }));
        setTimeout(() => setShowResetModal(false), 2000);
      }
    } catch (err: any) {
      setResetState(prev => ({ ...prev, loading: false, error: err.response?.data?.error || 'Failed to reset password' }));
    }
  };

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: <Calendar className="text-blue-600" />, trend: '+12%', color: 'bg-blue-50' },
    { label: 'Confirmed', value: stats.confirmedBookings, icon: <CheckCircle2 className="text-green-600" />, trend: '85%', color: 'bg-green-50' },
    { label: 'Pending', value: stats.pendingBookings, icon: <Clock className="text-amber-600" />, trend: '-5%', color: 'bg-amber-50' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUp className="text-purple-600" />, trend: '+20%', color: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with Pavithra Travels today.</p>
        </div>
        
        {currentUser?.role === 'super_admin' && (
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-orange-100 p-2 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logged in as</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{currentUser.email}</span>
                <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Super Admin</span>
              </div>
            </div>
          </div>
        )}
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
              
              {currentUser?.role === 'super_admin' && (
                <button 
                  onClick={() => setShowResetModal(true)}
                  className="w-full bg-orange-500/10 hover:bg-orange-500/20 p-4 rounded-2xl flex items-center justify-between transition-all group border border-orange-500/20 text-orange-500"
                >
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5" />
                    <span className="font-bold">Reset Password</span>
                  </div>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Password Reset Modal */}
          {showResetModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Key className="text-orange-500" />
                    Reset Admin Password
                  </h3>
                  <button onClick={() => setShowResetModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-2xl mb-6 flex gap-3 items-start">
                  <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-800">
                    This action will permanently change the password for the selected admin account. Only <strong>Super Admins</strong> can perform this action.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Admin Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={resetState.email}
                        onChange={(e) => setResetState(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="admin@pavithratravels.com"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">New Secure Password</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={resetState.newPassword}
                        onChange={(e) => setResetState(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {resetState.error && (
                    <p className="text-red-500 text-sm font-medium text-center">{resetState.error}</p>
                  )}
                  {resetState.message && (
                    <p className="text-green-500 text-sm font-medium text-center">{resetState.message}</p>
                  )}

                  <button
                    type="submit"
                    disabled={resetState.loading}
                    className="w-full bg-[#0B132B] text-white py-4 rounded-2xl font-bold hover:bg-orange-500 transition-all shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                  >
                    {resetState.loading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>Update Password</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

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
