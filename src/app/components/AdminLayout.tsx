import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Image as ImageIcon, 
  MessageSquare, 
  LogOut, 
  ChevronRight,
  User,
  Package,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBackVisible, setIsBackVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setIsBackVisible(true);
      } else {
        setIsBackVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview', end: true },
    { to: '/admin/bookings', icon: <BookOpen size={20} />, label: 'Bookings' },
    { to: '/admin/media', icon: <ImageIcon size={20} />, label: 'Media Library' },
    { to: '/admin/whatsapp', icon: <MessageSquare size={20} />, label: 'WhatsApp' },
    { to: '/admin/special-trips', icon: <Package size={20} />, label: 'Special Trips' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-[#0B132B] text-white flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300
        lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#FF8C00] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#FF8C00]/20">
              <span className="text-white font-bold text-xl leading-none">P</span>
            </div>
            <div>
              <span className="block font-bold text-lg leading-tight">Pavithra</span>
              <span className="block text-xs text-slate-400 font-medium tracking-widest uppercase">Travels</span>
            </div>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={`px-4 mb-4 transition-all duration-500 ${isBackVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-[#FF8C00] transition-all font-bold border border-white/5"
          >
            <ArrowLeft size={20} />
            <span>Back to Website</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded-xl transition-all group
                ${isActive 
                  ? 'bg-[#FF8C00] text-white shadow-lg shadow-[#FF8C00]/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity`} />
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
              <User size={20} className="text-slate-400" />
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen relative flex flex-col">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-white border-b border-gray-100 p-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Link 
              to="/" 
              className={`p-2 text-[#FF8C00] hover:bg-orange-50 rounded-lg transition-all duration-500 ${isBackVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}
            >
              <ArrowLeft size={24} />
            </Link>
          </div>
          <div className="font-bold text-gray-900">Admin Dashboard</div>
          <div className="w-10" /> {/* Spacer */}
        </header>

        <div className="p-4 sm:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
