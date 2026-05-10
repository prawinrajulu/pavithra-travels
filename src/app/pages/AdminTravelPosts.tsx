import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../services/apiClient';
import { compressImage } from '../../utils/imageCompression';
import { UploadProgress } from '../components/ui/UploadProgress';
import {
  Plus,
  Trash2,
  Edit3,
  MapPin,
  Calendar,
  Image as ImageIcon,
  X,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import '../styles/TravelPosts.css';

interface TravelPost {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  createdAt: any;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white font-semibold transition-all animate-in slide-in-from-bottom-4 duration-300 ${
        toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
      }`}
    >
      {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      {toast.message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}

export function AdminTravelPosts() {
  const [posts, setPosts] = useState<TravelPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<TravelPost | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
    // Cleanup preview URL on unmount
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPosts();
      console.log('[DEBUG] Fetch posts success:', response);
      if (response.success) {
        setPosts(response.posts || []);
      }
    } catch (error) {
      console.error('[DEBUG] Error fetching posts:', error);
      showToast('error', 'Failed to load posts. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Basic type validation
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid image file.');
      return;
    }

    console.log(`[DEBUG] Image selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    // Instant preview
    if (filePreview) URL.revokeObjectURL(filePreview);
    const preview = URL.createObjectURL(file);
    
    setSelectedFile(file);
    setFilePreview(preview);
    setUploadStatus('idle'); // Reset status when new file selected
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setSelectedFile(null);
    setFilePreview(null);
    setUploadStatus('idle');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    if (filePreview) URL.revokeObjectURL(filePreview);
    setSelectedFile(null);
    setFilePreview(null);
    setExistingImageUrl(null);
    setEditingPost(null);
    setShowForm(false);
    setUploadProgress(0);
    setUploadStatus('idle');
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    if (!selectedFile && !existingImageUrl) {
      showToast('error', 'Please upload an image.');
      return;
    }

    try {
      setSubmitting(true);
      setUploadError(null);
      setUploadStatus('uploading');
      setUploadProgress(0);

      let imageUrl = existingImageUrl || '';

      if (selectedFile) {
        // 1. Compress Image
        console.log('[DEBUG] Starting image optimization...');
        const compressedFile = await compressImage(selectedFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        });

        // 2. Upload to Cloudinary via Backend
        console.log('[DEBUG] Uploading to Cloudinary...');
        const formData = new FormData();
        formData.append('image', compressedFile);

        const uploadResponse = await apiClient.uploadImage(formData);
        if (uploadResponse.success) {
          imageUrl = uploadResponse.imageUrl;
          setUploadProgress(100);
        } else {
          throw new Error(uploadResponse.message || 'Cloudinary upload failed');
        }
      }

      // 3. Save Post Data to Firestore
      const postData = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        imageUrl
      };

      console.log('[DEBUG] Saving post data to Firestore...');
      const response = editingPost 
        ? await apiClient.updatePostJson(editingPost.id, postData as any)
        : await apiClient.createPostJson(postData as any);

      if (response.success) {
        setUploadStatus('success');
        showToast('success', editingPost ? 'Post updated!' : 'Post created!');
        
        // Brief delay to show success state in progress bar
        setTimeout(() => {
          resetForm();
          fetchPosts();
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to save post data');
      }
    } catch (error: any) {
      console.error('[DEBUG] Save/Upload error:', error);
      setUploadStatus('error');
      setUploadError(error.message || 'An unexpected error occurred during upload.');
      showToast('error', error.message || 'Failed to save post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  const handleEdit = (post: TravelPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setLocation(post.location);
    setExistingImageUrl(post.imageUrl);
    setSelectedFile(null);
    setFilePreview(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, postTitle: string) => {
    if (!window.confirm(`Delete "${postTitle}"? This action cannot be undone.`)) return;

    try {
      const response = await apiClient.deletePost(id);
      if (response.success) {
        showToast('success', `"${postTitle}" deleted successfully.`);
        setPosts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error: any) {
      console.error('Error deleting post:', error);
      showToast('error', 'Failed to delete post. Please try again.');
    }
  };

  return (
    <div className="travel-posts-admin">
      {/* Toast */}
      {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0B132B]">Travel Experiences</h1>
          <p className="text-slate-500 mt-1">Manage blog posts and traveler stories • {posts.length} posts total</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#FF8C00] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#FF8C00]/20 hover:scale-105 transition-all"
          >
            <Plus size={20} />
            Add New Post
          </button>
        )}
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="post-form-container mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0B132B]">
                {editingPost ? '✏️ Edit Travel Experience' : '✨ Create New Travel Experience'}
              </h2>
            </div>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-all">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column: Text fields */}
              <div className="space-y-5">
                <div className="input-group">
                  <label className="input-label">Post Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Magical Sunset at Varanasi"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      className="form-input pl-12"
                      placeholder="e.g., Varanasi, Uttar Pradesh"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Description *</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: '180px', resize: 'vertical' }}
                    placeholder="Tell the story of this trip in detail..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Right column: Image Upload */}
              <div className="space-y-5">
                <div className="input-group">
                  <label className="input-label">Post Image *</label>

                  {/* Upload zone */}
                  {!filePreview && !existingImageUrl && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#FF8C00] hover:bg-orange-50/40 transition-all group"
                    >
                      <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-orange-50 transition-all">
                        <Upload className="text-slate-400 group-hover:text-[#FF8C00] transition-colors" size={26} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-slate-700">Click to upload image</p>
                        <p className="text-sm text-slate-400 mt-1">PNG, JPG or WEBP • Max 5MB</p>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  )}

                  {/* Preview */}
                  {(filePreview || existingImageUrl) && (
                    <div className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-video">
                      <img src={filePreview || existingImageUrl || ''} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                         <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className="p-3 bg-white rounded-full text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition-all"
                          title="Change image"
                        >
                          <Upload size={20} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { setExistingImageUrl(null); removeFile(); }}
                          className="p-3 bg-white rounded-full text-slate-700 hover:bg-red-50 hover:text-red-500 transition-all"
                          title="Remove image"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload progress */}
            <UploadProgress 
              progress={uploadProgress} 
              status={uploadStatus} 
              errorMessage={uploadError || undefined} 
            />

            {/* Action buttons */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3 flex-wrap">
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-[#0B132B] text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-[#0B132B]/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 min-w-[160px] justify-center"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Post List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="animate-spin text-[#FF8C00] mb-4" size={44} />
          <p className="text-slate-500 font-medium">Loading travel posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ImageIcon className="text-slate-300" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-[#0B132B] mb-2">No travel posts yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">Share your first travel experience and inspire others to explore the world.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-[#FF8C00] font-bold flex items-center gap-2 mx-auto hover:gap-4 transition-all"
          >
            <Plus size={20} />
            Create your first post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-image-container">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt={post.title} className="post-image" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#0B132B] flex items-center gap-1 shadow-sm">
                  <MapPin size={10} className="text-[#FF8C00]" />
                  {post.location}
                </div>
              </div>

              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-description line-clamp-3">{post.description}</p>

                <div className="post-meta">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <Calendar size={13} />
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="btn-admin btn-edit flex items-center gap-1.5"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="btn-admin btn-delete flex items-center gap-1.5"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

