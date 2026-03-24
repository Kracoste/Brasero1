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
  /** Called with the markdown image string to insert */
  onInsert: (markdown: string) => void;
};

export function BlogContentImageInsert({ onInsert }: ContentImageInsertProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const alt = prompt('Description de l\'image (texte alternatif) :') || file.name;
      onInsert(`![${alt}](${publicUrl})`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors disabled:opacity-50"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? 'Upload...' : 'Insérer une image'}
      </button>
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
    </>
  );
}
