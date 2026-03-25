'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import Image from 'next/image';

type BlogImageUploadProps = {
  /** Current featured image */
  value: { src: string; alt: string } | null;
  /** Called when image changes */
  onChange: (image: { src: string; alt: string } | null) => void;
};

export function BlogFeaturedImageUpload({ value, onChange }: BlogImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [alt, setAlt] = useState(value?.alt || '');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `featured/${Date.now()}-${file.name}`);
      formData.append('bucket', 'blog');

      const res = await fetch('/api/admin/storage/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Erreur upload: ${err.error}`);
        return;
      }

      const { publicUrl } = await res.json();
      onChange({ src: publicUrl, alt: alt || file.name });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Image principale
      </label>

      {value?.src ? (
        <div className="relative border border-slate-200 rounded-lg overflow-hidden">
          <div className="relative w-full h-48">
            <Image
              src={value.src}
              alt={value.alt}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="p-3 bg-slate-50 flex items-center gap-2">
            <input
              type="text"
              value={alt}
              onChange={(e) => {
                setAlt(e.target.value);
                onChange({ ...value, alt: e.target.value });
              }}
              placeholder="Texte alternatif (description de l'image)"
              className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#8B4513] outline-none"
            />
            <button
              type="button"
              onClick={() => { onChange(null); setAlt(''); }}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Supprimer l'image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-[#8B4513] hover:bg-[#f6f1e9]/30 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="mx-auto h-8 w-8 text-slate-400 animate-spin" />
          ) : (
            <ImageIcon className="mx-auto h-8 w-8 text-slate-400" />
          )}
          <p className="mt-2 text-sm text-slate-600">
            {uploading ? 'Upload en cours...' : 'Cliquez pour ajouter une image'}
          </p>
          <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP — max 10 Mo</p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

type ContentImageInsertProps = {
  /** Ref to the content textarea, used to read cursor position */
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** Called with the cursor position and markdown image string to insert */
  onInsert: (markdown: string, cursorPos: number) => void;
};

export function BlogContentImageInsert({ textareaRef, onInsert }: ContentImageInsertProps) {
  const [uploading, setUploading] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [alt, setAlt] = useState('');
  const [savedCursorPos, setSavedCursorPos] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClickUpload() {
    // Sauvegarder la position du curseur AVANT d'ouvrir le file picker
    const ta = textareaRef.current;
    if (ta) {
      setSavedCursorPos(ta.selectionStart);
    }
    inputRef.current?.click();
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `content/${Date.now()}-${file.name}`);
      formData.append('bucket', 'blog');

      const res = await fetch('/api/admin/storage/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Erreur upload: ${err.error}`);
        return;
      }

      const { publicUrl } = await res.json();
      setPendingUrl(publicUrl);
      setAlt('');
    } finally {
      setUploading(false);
    }
  }

  function handleConfirm() {
    if (!pendingUrl) return;
    onInsert(`![${alt || 'image'}](${pendingUrl})`, savedCursorPos);
    setPendingUrl(null);
    setAlt('');
  }

  function handleCancel() {
    setPendingUrl(null);
    setAlt('');
  }

  return (
    <div className="flex items-center gap-2">
      {pendingUrl ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Description de l'image"
            className="px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-[#8B4513] outline-none w-48"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirm(); } }}
          />
          <button
            type="button"
            onClick={handleConfirm}
            className="px-2 py-1 text-xs font-medium text-white bg-[#8B4513] hover:bg-[#6d3610] rounded transition-colors"
          >
            OK
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClickUpload}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Upload...' : 'Insérer une image'}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
