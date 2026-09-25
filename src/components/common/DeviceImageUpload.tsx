import React, { useRef, useState } from 'react';
import { Upload, X, Link as LinkIcon, AlertCircle, Check, Loader2 } from 'lucide-react';

interface DeviceImageUploadProps {
  label?: string;
  value?: string;
  onChange: (base64OrUrl: string) => void;
  required?: boolean;
  hint?: string;
  id?: string;
}

export const DeviceImageUpload: React.FC<DeviceImageUploadProps> = ({
  label = 'Upload Image from Device',
  value,
  onChange,
  required = false,
  hint = 'Supports PNG, JPG, JPEG, WEBP (Auto-optimized for web)',
  id = 'device-img-input',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compress & resize image to safe dimensions (<1280px, ~100-200KB)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.82 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Failed to parse image.'));
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const optimizedDataUrl = await compressImage(file);
      onChange(optimizedDataUrl);
    } catch (err) {
      console.error('Image compression error:', err);
      setErrorMessage('Could not process this image. Please try another.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setCustomUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-slate-300 font-bold text-xs flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-rose-400">*</span>}
          </label>
          <div className="flex items-center gap-2">
            {value && (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Image Ready
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LinkIcon className="w-3 h-3" />
              {showUrlInput ? 'Hide URL' : 'Use Web URL'}
            </button>
          </div>
        </div>
      )}

      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 animate-in fade-in">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/venture-image.jpg"
            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {value ? (
        <div className="relative rounded-2xl border border-slate-700/80 bg-slate-900/90 p-2.5 flex items-center gap-3 shadow-inner">
          <img
            src={value}
            alt="Uploaded Preview"
            className="w-20 h-16 object-cover rounded-xl border border-slate-700 shrink-0 bg-slate-950"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Image Attached & Verified</p>
            <p className="text-[10px] text-slate-400 truncate">Stored dynamically in Firestore</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              {isProcessing ? 'Processing...' : 'Change'}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-amber-400/70 rounded-2xl p-5 text-center bg-slate-950/60 hover:bg-slate-900/60 transition-all cursor-pointer group"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <p className="text-xs font-bold text-white">
              {isProcessing ? 'Optimizing image...' : 'Click to browse & upload from this device'}
            </p>
            <p className="text-[11px] text-slate-400">{hint}</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
