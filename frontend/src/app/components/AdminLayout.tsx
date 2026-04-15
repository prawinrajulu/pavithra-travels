import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Image as ImageIcon, 
  MessageSquare, 
  LogOut, 
  ChevronRight,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview', end: true },
    { to: '/admin/bookings', icon: <BookOpen size={20} />, label: 'Bookings' },
    { to: '/admin/media', icon: <ImageIcon size={20} />, label: 'Media Library' },
    { to: '/admin/whatsapp', icon: <MessageSquare size={20} />, label: 'WhatsApp' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B132B] text-white flex flex-col fixed inset-y-0 left-0 z-50 transition-all">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#FF8C00] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#FF8C00]/20">
              <span className="text-white font-bold text-xl leading-none">P</span>
            </div>
            <div>
              <span className="block font-bold text-lg leading-tight">Pavithra</span>
              <span className="block text-xs text-slate-400 font-medium tracking-widest uppercase">Travels</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
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
      <main className="flex-1 ml-64 min-h-screen relative">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
