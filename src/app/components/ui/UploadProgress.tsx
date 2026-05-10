import { Progress } from './progress';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export function UploadProgress({ progress, status, errorMessage }: UploadProgressProps) {
  if (status === 'idle') return null;

  return (
    <div className="mt-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {status === 'uploading' && <Loader2 className="animate-spin text-blue-500" size={20} />}
          {status === 'success' && <CheckCircle2 className="text-emerald-500" size={20} />}
          {status === 'error' && <AlertCircle className="text-red-500" size={20} />}
          
          <span className={`text-sm font-black uppercase tracking-widest ${
            status === 'error' ? 'text-red-600' : 'text-slate-700'
          }`}>
            {status === 'uploading' && `Uploading ${Math.round(progress)}%`}
            {status === 'success' && 'Upload Complete'}
            {status === 'error' && 'Upload Failed'}
          </span>
        </div>
        
        {status === 'uploading' && (
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            Optimizing...
          </span>
        )}
      </div>

      <Progress value={progress} className={`h-2 transition-all duration-500 ${
        status === 'success' ? 'bg-emerald-100 [&>div]:bg-emerald-500' : 
        status === 'error' ? 'bg-red-100 [&>div]:bg-red-500' : 
        'bg-blue-100 [&>div]:bg-blue-500'
      }`} />

      {status === 'error' && errorMessage && (
        <p className="mt-3 text-xs font-medium text-red-500 flex items-center gap-1.5">
          <AlertCircle size={12} />
          {errorMessage}
        </p>
      )}
      
      {status === 'success' && (
        <p className="mt-3 text-xs font-medium text-emerald-600 flex items-center gap-1.5">
          <CheckCircle2 size={12} />
          Image successfully compressed and uploaded.
        </p>
      )}
    </div>
  );
}
