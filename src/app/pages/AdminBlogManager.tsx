import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { MediaUploader } from '../components/MediaUploader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Save, X, Edit3, Trash2, MapPin, Tag, 
  Layers, Type, AlignLeft, Info, CheckCircle2, AlertCircle, Loader2,
  Calendar, User, Globe
} from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface Blog {
  id: string;
  title: string;
  location: string;
  description: string;
  storyContent: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  createdAt: any;
}

export default function AdminBlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    storyContent: '',
    category: 'Adventure',
    tags: '',
    author: 'Admin',
    coverImage: ''
  });
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getBlogs();
      if (response.success) {
        setBlogs(response.blogs || []);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    const newMedia = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image'
    }));
    setSelectedMedia(prev => [...prev, ...newMedia].slice(0, 10));
  };

  const removeMedia = (index: number) => {
    setSelectedMedia(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setUploadProgress(10);

      // 1. Prepare Blog Data
      const blogPayload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        mediaFiles: []
      };

      // 2. Create or Update Blog record first to get ID if needed
      let blogId = editingId;
      if (!editingId) {
        const createRes = await apiClient.createBlog(blogPayload);
        if (createRes.success) {
          blogId = createRes.blog.id;
        } else throw new Error('Failed to create blog record');
      }

      setUploadProgress(30);

      // 3. Upload Media if any
      if (selectedMedia.length > 0) {
        const uploadData = new FormData();
        uploadData.append('blogId', blogId!);

        // Compress images before upload
        const compressedFiles = await Promise.all(selectedMedia.map(async (m) => {
          if (m.type === 'image') {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
            return await imageCompression(m.file, options);
          }
          return m.file;
        }));

        compressedFiles.forEach(file => uploadData.append('media', file));

        const uploadRes = await apiClient.uploadBlogMedia(uploadData);
        if (uploadRes.success) {
          blogPayload.mediaFiles = uploadRes.files;
          if (!blogPayload.coverImage && uploadRes.files.length > 0) {
            blogPayload.coverImage = uploadRes.files[0].url;
          }
        }
      }

      setUploadProgress(70);

      // 4. Update Blog with Media URLs
      await apiClient.updateBlog(blogId!, blogPayload);
      
      setUploadProgress(100);
      setTimeout(() => {
        resetForm();
        fetchBlogs();
      }, 500);

    } catch (err) {
      console.error('Error submitting blog:', err);
      alert('Failed to save blog. Check console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      description: '',
      storyContent: '',
      category: 'Adventure',
      tags: '',
      author: 'Admin',
      coverImage: ''
    });
    setSelectedMedia([]);
    setEditingId(null);
    setShowForm(false);
    setUploadProgress(0);
  };

  const handleEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title || '',
      location: blog.location || '',
      description: blog.description || '',
      storyContent: blog.storyContent || '',
      category: blog.category || 'Adventure',
      tags: blog.tags ? blog.tags.join(', ') : '',
      author: blog.author || 'Admin',
      coverImage: blog.coverImage || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      const response = await apiClient.deleteBlog(id);
      if (response.success) {
        alert('Blog deleted successfully!');
        fetchBlogs();
      } else {
        alert('Failed to delete blog.');
      }
    } catch (err: any) {
      console.error('Error deleting blog:', err);
      alert(err.response?.status === 403 ? 'Permission denied. Admin rights required.' : 'Failed to delete blog. Check console.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Blog <span className="text-primary">Console</span></h1>
          <p className="text-slate-500 font-medium">Create and manage your premium travel stories</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancel Entry' : 'New Story'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 mb-16"
          >
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Basic Info */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                      <Type size={18} className="text-primary" /> Story Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., The Hidden Waterfalls of Bali"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                        <MapPin size={18} className="text-primary" /> Location
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Ubud, Indonesia"
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                        <Layers size={18} className="text-primary" /> Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                      >
                        <option>Adventure</option>
                        <option>Culture</option>
                        <option>Food</option>
                        <option>Nature</option>
                        <option>Luxury</option>
                        <option>Budget</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                      <AlignLeft size={18} className="text-primary" /> Short Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="A brief hook for your blog card..."
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-primary/20 transition-all h-24 resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                      <Tag size={18} className="text-primary" /> Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="nature, waterfalls, adventure (comma separated)"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Right Column: Full Story */}
                <div className="space-y-8">
                  <div className="space-y-4 h-full flex flex-col">
                    <label className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                      <Globe size={18} className="text-primary" /> Full Story Content
                    </label>
                    <textarea
                      required
                      value={formData.storyContent}
                      onChange={e => setFormData({ ...formData, storyContent: e.target.value })}
                      placeholder="Tell your complete story here..."
                      className="w-full flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-primary/20 transition-all min-h-[400px]"
                    />
                  </div>
                </div>
              </div>

              {/* Media Upload Section */}
              <div className="pt-12 border-t border-slate-100">
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Gallery & Media</h3>
                  <p className="text-slate-500 font-medium">Add up to 10 high-quality images and videos</p>
                </div>
                
                <MediaUploader
                  selectedFiles={selectedMedia}
                  onFilesSelected={handleFilesSelected}
                  onRemove={removeMedia}
                  uploading={submitting}
                  progress={uploadProgress}
                />
              </div>

              {/* Form Actions */}
              <div className="pt-12 border-t border-slate-100 flex justify-end gap-6">
                 <button 
                  type="button"
                  onClick={resetForm}
                  className="px-10 py-4 bg-slate-100 text-slate-500 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-12 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {editingId ? 'Update Story' : 'Publish Story'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog List Grid */}
      {loading ? (
        <div className="flex justify-center py-40">
           <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <motion.div
              key={blog.id}
              layout
              className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 group"
            >
              <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                   <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black text-primary uppercase">{blog.category}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">{blog.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{blog.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(blog)}
                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <Link to={`/blog/${blog.id}`} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                   <Globe size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-100 border-dashed">
           <Info className="mx-auto text-slate-200 mb-4" size={64} />
           <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Stories Published Yet</h3>
           <p className="text-slate-400 text-sm mt-2">Start your first adventure by clicking "New Story"</p>
        </div>
      )}
    </div>
  );
}
