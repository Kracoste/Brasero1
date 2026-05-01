'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Upload, Type, X, ChevronDown } from 'lucide-react';
import type { FaceCustomization } from '@/lib/schema';

/** Polices disponibles pour la gravure texte */
const AVAILABLE_FONTS = [
  { id: 'serif', name: 'Classique', family: 'Georgia, serif' },
  { id: 'sans', name: 'Moderne', family: 'Arial, sans-serif' },
  { id: 'script', name: 'Cursive', family: "'Brush Script MT', cursive" },
  { id: 'mono', name: 'Machine', family: "'Courier New', monospace" },
  { id: 'display', name: 'Décoratif', family: "'Impact', sans-serif" },
];

export type FacesCustomization = Record<number, FaceCustomization>;

type CustomizationSelectorProps = {
  priceSupplement: number;
  numberOfFaces?: number;
  schemaImage?: string;
  onChange: (faces: FacesCustomization | null) => void;
};

type FaceMode = 'none' | 'image' | 'text';

type FaceState = {
  mode: FaceMode;
  imageUrl?: string;
  fileName?: string;
  uploading?: boolean;
  text?: string;
  font?: string;
};

function buildInitialFaces(count: number): Record<number, FaceState> {
  const faces: Record<number, FaceState> = {};
  for (let i = 1; i <= count; i++) {
    faces[i] = { mode: 'none' };
  }
  return faces;
}

export function CustomizationSelector({
  priceSupplement,
  numberOfFaces = 3,
  schemaImage,
  onChange,
}: CustomizationSelectorProps) {
  const [enabled, setEnabled] = useState(false);
  const [faces, setFaces] = useState<Record<number, FaceState>>(() => buildInitialFaces(numberOfFaces));

  const faceNumbers = useMemo(() => Array.from({ length: numberOfFaces }, (_, i) => i + 1), [numberOfFaces]);

  const hasAnyCustomization = Object.values(faces).some(f => f.mode !== 'none');

  // Notifier le parent des changements via useEffect (évite setState pendant le rendu)
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (!enabled) return;
    const output: FacesCustomization = {};
    for (const [key, face] of Object.entries(faces)) {
      const num = Number(key);
      if (face.mode === 'image' && face.imageUrl) {
        output[num] = { type: 'image', imageUrl: face.imageUrl, fileName: face.fileName };
      } else if (face.mode === 'text' && face.text?.trim()) {
        output[num] = { type: 'text', text: face.text.trim(), font: (face.font as FaceCustomization['font']) || 'serif' };
      }
    }
    onChange(output);
  }, [faces, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFace = useCallback((faceNum: number, update: Partial<FaceState>) => {
    setFaces(prev => ({ ...prev, [faceNum]: { ...prev[faceNum], ...update } }));
  }, []);

  const handleToggle = () => {
    if (enabled) {
      setEnabled(false);
      setFaces(buildInitialFaces(numberOfFaces));
      onChange(null);
    } else {
      setEnabled(true);
      onChange({});
    }
  };

  const handleFileUpload = async (faceNum: number, file: File) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Format non autorisé. Utilisez JPG ou PNG.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Fichier trop volumineux (max 10 Mo).');
      return;
    }

    updateFace(faceNum, { uploading: true });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('face', String(faceNum));

      const res = await fetch('/api/customization/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erreur lors de l'upload");
        updateFace(faceNum, { uploading: false });
        return;
      }

      updateFace(faceNum, {
        mode: 'image',
        imageUrl: data.publicUrl,
        fileName: data.fileName,
        uploading: false,
      });
    } catch {
      alert("Erreur lors de l'upload. Réessayez.");
      updateFace(faceNum, { uploading: false });
    }
  };

  const removeFace = (faceNum: number) => {
    updateFace(faceNum, { mode: 'none', imageUrl: undefined, fileName: undefined, text: undefined, font: undefined });
  };

  return (
    <div className="space-y-4">
      {/* Toggle principal */}
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between rounded-lg border-2 px-4 py-3 transition-all ${
          enabled
            ? 'border-[#0f172a] bg-[#0f172a]/5'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
            enabled ? 'border-[#0f172a] bg-[#0f172a]' : 'border-slate-300'
          }`}>
            {enabled && (
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm font-semibold text-slate-800">
            Personnaliser mon brasero — Découpe laser
          </span>
        </div>
        <span className="text-sm font-bold text-[#0f172a]">
          +{priceSupplement.toFixed(0)} € HT
        </span>
      </button>

      {/* Contenu personnalisation */}
      {enabled && (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          {/* Image schéma du socle */}
          {schemaImage && (
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <Image
                  src={schemaImage}
                  alt="Schéma du socle — faces numérotées"
                  width={500}
                  height={400}
                  className="w-full h-auto object-contain rounded-lg"
                  sizes="(max-width: 640px) 100vw, 500px"
                />
              </div>
            </div>
          )}

          <p className="text-sm text-slate-600 text-center">
            Choisissez une image ou un texte pour chaque face. Vous pouvez personnaliser de 1 à {numberOfFaces} face{numberOfFaces > 1 ? 's' : ''}.
          </p>

          {/* Les faces */}
          <div className={`grid grid-cols-1 ${numberOfFaces >= 2 ? 'sm:grid-cols-2' : ''} gap-3`}>
            {faceNumbers.map(faceNum => {
              const face = faces[faceNum];
              return (
                <div key={faceNum} className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Vue {faceNum}
                    </span>
                    {face.mode !== 'none' && (
                      <button type="button" onClick={() => removeFace(faceNum)} className="text-slate-400 hover:text-red-500 transition">
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {face.mode === 'none' && (
                    <div className="flex gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-3 py-3 cursor-pointer hover:border-[#0f172a] hover:bg-[#0f172a]/5 transition">
                        <Upload size={16} className="text-slate-400" />
                        <span className="text-xs font-medium text-slate-600">Image</span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(faceNum, file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => updateFace(faceNum, { mode: 'text', font: 'serif' })}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-3 py-3 hover:border-[#0f172a] hover:bg-[#0f172a]/5 transition"
                      >
                        <Type size={16} className="text-slate-400" />
                        <span className="text-xs font-medium text-slate-600">Texte</span>
                      </button>
                    </div>
                  )}

                  {face.uploading && (
                    <div className="flex items-center justify-center py-4">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#0f172a]" />
                      <span className="ml-2 text-xs text-slate-500">Upload en cours...</span>
                    </div>
                  )}

                  {face.mode === 'image' && face.imageUrl && !face.uploading && (
                    <div className="space-y-1">
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100">
                        <Image
                          src={face.imageUrl}
                          alt={`Personnalisation vue ${faceNum}`}
                          fill
                          className="object-contain"
                          sizes="300px"
                        />
                      </div>
                      <p className="text-xs text-slate-500 truncate">{face.fileName}</p>
                    </div>
                  )}

                  {face.mode === 'text' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Votre texte..."
                        value={face.text || ''}
                        onChange={e => updateFace(faceNum, { text: e.target.value })}
                        maxLength={50}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]/20 focus:outline-none"
                        style={{ fontFamily: AVAILABLE_FONTS.find(f => f.id === face.font)?.family }}
                      />
                      <div className="relative">
                        <select
                          value={face.font || 'serif'}
                          onChange={e => updateFace(faceNum, { font: e.target.value })}
                          className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm cursor-pointer focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]/20 focus:outline-none"
                        >
                          {AVAILABLE_FONTS.map(font => (
                            <option key={font.id} value={font.id} style={{ fontFamily: font.family }}>
                              {font.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDown size={14} className="text-slate-400" />
                        </div>
                      </div>
                      {face.text && (
                        <div
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center"
                          style={{ fontFamily: AVAILABLE_FONTS.find(f => f.id === face.font)?.family }}
                        >
                          <span className="text-lg text-slate-800">{face.text}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Résumé */}
          {hasAnyCustomization && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
              <p className="text-sm font-medium text-emerald-800">
                Personnalisation activée — +{priceSupplement.toFixed(0)} € HT
              </p>
              <ul className="mt-1 text-xs text-emerald-700 space-y-0.5">
                {faceNumbers.map(n => {
                  const f = faces[n];
                  if (f.mode === 'none') return null;
                  return (
                    <li key={n}>
                      Vue {n} : {f.mode === 'image' ? `Image (${f.fileName})` : `Texte "${f.text}"`}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
