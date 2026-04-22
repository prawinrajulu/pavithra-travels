import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Star, 
  Package, 
  MapPin, 
  Calendar,
  IndianRupee,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface Destination {
  id: string;
  slug: string;
  name: string;
  state: string;
  isSpecial: boolean;
  category: string;
  region: string;
  duration: string;
  durationDays: number;
  budget: string;
  estimatedCost: number;
  description: string;
  imageUrl: string;
  highlights: string[];
}

export default function AdminSpecialTrips() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Destination>>({
    name: '',
    slug: '',
    state: '',
    isSpecial: false,
    category: 'temple',
    region: 'south',
    duration: '',
    durationDays: 1,
    budget: '',
    estimatedCost: 0,
    description: '',
    imageUrl: '',
    highlights: []
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getDestinations();
      if (response.success) {
        setDestinations(response.destinations);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (destination?: Destination) => {
    if (destination) {
      setFormData(destination);
      setEditingId(destination.id);
    } else {
      setFormData({
        name: '',
        slug: '',
        state: '',
        isSpecial: true, // Default to true for this page
        category: 'temple',
        region: 'south',
        duration: '',
        durationDays: 1,
        budget: '',
        estimatedCost: 0,
        description: '',
        imageUrl: '',
        highlights: []
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await apiClient.updateDestination(editingId, formData);
      } else {
        await apiClient.createDestination(formData);
      }
      await fetchDestinations();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving destination:', error);
      alert('Failed to save trip. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      await apiClient.deleteDestination(id);
      setDestinations(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting destination:', error);
    }
  };

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="h-8 w-8 text-[#FF8C00]" />
            Trip Management
          </h1>
          <p className="text-gray-500 mt-1">Manage and feature special trips on your home page.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#FF8C00] text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" /> Add Special Trip
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by destination name or state..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#FF8C00]/20 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-[#FF8C00] animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Fetching destinations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((trip) => (
            <div key={trip.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={trip.imageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'} 
                  alt={trip.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {trip.isSpecial && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Star className="h-3 w-3 fill-current" /> Featured
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{trip.name}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(trip)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(trip.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 text-[#FF8C00]" /> {trip.state}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 text-[#FF8C00]" /> {trip.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <IndianRupee className="h-4 w-4 text-green-600" /> {trip.estimatedCost.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-gray-400 line-clamp-2">
                  {trip.description}
                </div>
              </div>
            </div>
          ))}

          {filteredDestinations.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No trips found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col scale-in-center">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Trip Details' : 'Add New Special Trip'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold text-gray-700 ml-1">Trip Name</span>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full mt-1.5 px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[#FF8C00]/20 border-none transition-all"
                      placeholder="e.g. Manali Adventure"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-gray-700 ml-1">Slug (URL Name)</span>
                    <input 
                      type="text" 
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full mt-1.5 px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[#FF8C00]/20 border-none transition-all"
                      placeholder="e.g. manali-adventure"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-gray-700 ml-1">State</span>
                    <input 
                      type="text" 
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full mt-1.5 px-4 py-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[#FF8C00]/20 border-none transition-all"
                      placeholder="e.g. Himachal Pradesh"
                    />
                  </label>
                </div>

                {/* Logistics */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm font-bold text-gray-700 ml-1">Duration (Text)</span>
                      <input 
                        type="text" 
                        required
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        className="w-full mt-1.5 px-4 py-3 bg-gray-50 rounded-xl border-none transition-all"
                        placeholder="e.g. 3 Days, 2 Nights"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-gray-700 ml-1">Duration (Days)</span>
                      <input 
                        type="number" 
                        required
                        value={formData.durationDays}
                        onChange={(e) => setFormData({...formData, durationDays: parseInt(e.target.value)})}
                        className="w-full mt-1.5 px-4 py-3 bg-gray-50 rounded-xl border-none transition-all"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm font-bold text-gray-700 ml-1">Price (Budget Text)</span>
                      <input 
                        type="text" 
                        required
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        className="w-full mt-1.5 px-4 py-3 bg-gray-50 rounded-xl border-none transition-all"
                        placeholder="e.g. ₹5,000 - ₹8,000"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-gray-700 ml-1">Price (Numeric)</span>
                      <input 
                        type="number" 
                        required
                        value={formData.estimatedCost}
                        onChange={(e) => setFormData({...formData, estimatedCost: parseInt(e.target.value)})}
                        className="w-full mt-1.5 px-4 py-3 bg-gray-50 rounded-xl border-none transition-all"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.isSpecial ? 'bg-amber-500' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isSpecial ? 'translate-x-7' : 'translate-x-1'}`} />
                      </div>
                      <span className="font-bold text-gray-700">Feature on Home Page</span>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={formData.isSpecial}
                        onChange={(e) => setFormData({...formData, isSpecial: e.target.checked})}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Categorization */}
              <div className="grid grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-sm font-bold text-gray-700 ml-1">Category</span>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full mt-1.5 px-4 py-3 bg-gray-50 rounded-xl border-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="temple">Temple Tour</option>
                    <option value="family">Family Vacation</option>
                    <option value="adventure">Adventure Trip</option>
                    <option value="beach">Beach Holiday</option>
                    <option value="hill-station">Hill Station</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-gray-700 ml-1">Region</span>
                  <select 
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full mt-1.5 px-4 py-3 bg-gray-50 rounded-xl border-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="north">North India</option>
                    <option value="south">South India</option>
                    <option value="east">East India</option>
                    <option value="west">West India</option>
                    <option value="central">Central India</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-gray-700 ml-1">Image URL</span>
                <input 
                  type="text" 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full mt-1.5 px-4 py-3 bg-gray-50 rounded-xl border-none transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-gray-700 ml-1">Trip Description</span>
                <textarea 
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full mt-1.5 px-4 py-3 bg-gray-50 rounded-xl border-none transition-all resize-none"
                  placeholder="Describe the trip experience..."
                />
              </label>
            </form>

            <div className="p-8 border-t border-gray-50 flex justify-end gap-4 bg-gray-50/50">
              <button 
                onClick={handleCloseModal}
                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-[#FF8C00] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {editingId ? 'Update Trip' : 'Save Special Trip'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scale-in-center {
          animation: scale-in-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        }
        @keyframes scale-in-center {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
