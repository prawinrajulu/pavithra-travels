import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, FileVideo, Plus, Loader2, CheckCircle2 } from 'lucide-react';

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface MediaUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onRemove: (index: number) => void;
  selectedFiles: MediaFile[];
  uploading: boolean;
  progress: number;
}

export function MediaUploader({ 
  onFilesSelected, 
  onRemove, 
  selectedFiles, 
  uploading, 
  progress 
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onFilesSelected(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesSelected(droppedFiles);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[2.5rem] p-12 text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-slate-200 hover:border-primary hover:bg-slate-50'
        }`}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
            <Upload size={40} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Upload Visual Assets</h3>
            <p className="text-slate-500 text-sm mt-1 font-medium">Drag & drop your travel photos and videos here</p>
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">Max 10 files • Images & Videos supported</p>
          </div>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2.5rem] z-10">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between text-sm font-black text-slate-900 uppercase tracking-widest">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {selectedFiles.map((media, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-3xl overflow-hidden shadow-lg border border-slate-100 group"
              >
                {media.type === 'video' ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <video src={media.preview} className="w-full h-full object-cover opacity-60" />
                    <FileVideo size={32} className="text-white absolute" />
                  </div>
                ) : (
                  <img src={media.preview} alt="Preview" className="w-full h-full object-cover" />
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-lg"
                >
                  <X size={16} />
                </button>

                <div className="absolute bottom-3 left-3 flex gap-2">
                   {media.type === 'image' ? <FileImage size={14} className="text-white drop-shadow-md" /> : <FileVideo size={14} className="text-white drop-shadow-md" />}
                </div>
              </motion.div>
            ))}
            
            {selectedFiles.length < 10 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary hover:bg-slate-50 transition-all group"
              >
                <Plus size={32} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Add More</span>
              </button>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
