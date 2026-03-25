'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Loader2, X, Eye, Pencil, ImageIcon, AlignLeft, AlignRight, Maximize2, Minus, Plus } from 'lucide-react';
import { parseMarkdownBlocks, type MarkdownBlock } from '@/components/MarkdownRenderer';

type BlogContentEditorProps = {
  value: string;
  onChange: (content: string) => void;
};

// ── Image Upload Helper ──────────────────────────────────────────────────

async function uploadImage(file: File): Promise<string | null> {
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
    return null;
  }

  const { publicUrl } = await res.json();
  return publicUrl;
}

function buildImageMarkdown(src: string, alt: string, width: number, float?: string): string {
  const parts: string[] = [];
  if (width !== 100) parts.push(`width=${width}`);
  if (float) parts.push(`float=${float}`);
  const attrs = parts.length > 0 ? `{${parts.join(',')}}` : '';
  return `![${alt}](${src})${attrs}`;
}

function parseImageAttrs(raw: string): { alt: string; src: string; width: number; float?: string } {
  const match = raw.match(/^!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?$/);
  if (!match) return { alt: '', src: '', width: 100 };

  const alt = match[1] || '';
  const src = match[2];
  const attrs: Record<string, string> = {};
  if (match[3]) {
    match[3].split(',').forEach((pair) => {
      const [k, v] = pair.trim().split('=');
      if (k && v) attrs[k.trim()] = v.trim();
    });
  }

  return {
    alt,
    src,
    width: attrs.width ? parseInt(attrs.width) : 100,
    float: attrs.float,
  };
}

// ── Insertion Zone ───────────────────────────────────────────────────────

function InsertZone({ onInsert }: { onInsert: (markdown: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [alt, setAlt] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);
    if (url) {
      setPendingUrl(url);
    }
  }

  function handleConfirm() {
    if (!pendingUrl) return;
    onInsert(buildImageMarkdown(pendingUrl, alt || 'image', 100));
    setPendingUrl(null);
    setAlt('');
  }

  if (pendingUrl) {
    return (
      <div className="flex items-center gap-2 py-2 px-3 bg-amber-50 border border-amber-200 rounded">
        <input
          type="text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Description de l'image"
          className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-[#8B4513] outline-none"
          autoFocus
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirm(); } }}
        />
        <button type="button" onClick={handleConfirm} className="px-2 py-1 text-xs font-medium text-white bg-[#8B4513] hover:bg-[#6d3610] rounded">
          OK
        </button>
        <button type="button" onClick={() => { setPendingUrl(null); setAlt(''); }} className="p-1 text-slate-400 hover:text-red-500">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="group relative py-1">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-transparent group-hover:bg-[#8B4513]/20 transition-colors" />
      <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-[#8B4513] bg-[#f6f1e9] border border-[#8B4513]/20 rounded-full hover:bg-[#8B4513] hover:text-white transition-colors disabled:opacity-50 z-10"
        >
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
          {uploading ? 'Upload...' : 'Insérer une image'}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ── Resizable Image Block ────────────────────────────────────────────────

function ResizableImage({
  block,
  onUpdate,
  onDelete,
}: {
  block: MarkdownBlock & { type: 'image' };
  onUpdate: (newRaw: string) => void;
  onDelete: () => void;
}) {
  const parsed = parseImageAttrs(block.raw);
  const [selected, setSelected] = useState(false);
  const [width, setWidth] = useState(parsed.width);
  const [float, setFloat] = useState<string | undefined>(parsed.float);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  function applyChange(newWidth: number, newFloat?: string) {
    setWidth(newWidth);
    setFloat(newFloat);
    onUpdate(buildImageMarkdown(parsed.src, parsed.alt, newWidth, newFloat));
  }

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const parentWidth = containerEl.parentElement?.clientWidth || containerEl.clientWidth;
    const currentPixelWidth = containerEl.clientWidth;
    dragRef.current = { startX: e.clientX, startWidth: currentPixelWidth };

    function handleMouseMove(ev: MouseEvent) {
      if (!dragRef.current) return;
      const diff = ev.clientX - dragRef.current.startX;
      const newPixelWidth = Math.max(100, dragRef.current.startWidth + diff);
      const newPercent = Math.round(Math.min(100, Math.max(10, (newPixelWidth / parentWidth) * 100) / 5) * 5);
      setWidth(newPercent);
    }

    function handleMouseUp(ev: MouseEvent) {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (!dragRef.current) return;
      const diff = ev.clientX - dragRef.current.startX;
      const newPixelWidth = Math.max(100, dragRef.current.startWidth + diff);
      const newPercent = Math.round(Math.min(100, Math.max(10, (newPixelWidth / parentWidth) * 100) / 5) * 5);
      dragRef.current = null;
      applyChange(newPercent, float);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  const containerStyle: React.CSSProperties = { width: `${width}%` };
  if (float === 'left') {
    containerStyle.float = 'left';
    containerStyle.marginRight = '1.5rem';
  } else if (float === 'right') {
    containerStyle.float = 'right';
    containerStyle.marginLeft = '1.5rem';
  } else if (width < 100) {
    containerStyle.marginLeft = 'auto';
    containerStyle.marginRight = 'auto';
  }

  return (
    <div
      ref={containerRef}
      className={`relative my-4 group/img cursor-pointer ${selected ? 'ring-2 ring-[#8B4513] ring-offset-2' : ''}`}
      style={containerStyle}
      onClick={(e) => { e.stopPropagation(); setSelected(!selected); }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={parsed.src}
        alt={parsed.alt}
        className="w-full h-auto rounded-lg"
        draggable={false}
      />

      {/* Resize handle — bottom-right corner */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute bottom-0 right-0 w-5 h-5 bg-[#8B4513] rounded-tl-md cursor-se-resize opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Maximize2 size={10} className="text-white rotate-90" />
      </div>

      {/* Width indicator */}
      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
        {width}%
      </div>

      {/* Toolbar when selected */}
      {selected && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-slate-200 shadow-lg rounded-lg px-2 py-1.5 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Size controls */}
          <button
            type="button"
            onClick={() => applyChange(Math.max(10, width - 10), float)}
            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            title="Réduire"
          >
            <Minus size={14} />
          </button>
          <span className="text-xs text-slate-600 font-medium w-8 text-center">{width}%</span>
          <button
            type="button"
            onClick={() => applyChange(Math.min(100, width + 10), float)}
            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            title="Agrandir"
          >
            <Plus size={14} />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          {/* Float controls */}
          <button
            type="button"
            onClick={() => applyChange(width, float === 'left' ? undefined : 'left')}
            className={`p-1 rounded ${float === 'left' ? 'bg-[#8B4513] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            title="Image à gauche"
          >
            <AlignLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => applyChange(width, undefined)}
            className={`p-1 rounded ${!float ? 'bg-[#8B4513] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            title="Centré"
          >
            <Maximize2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => applyChange(width, float === 'right' ? undefined : 'right')}
            className={`p-1 rounded ${float === 'right' ? 'bg-[#8B4513] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            title="Image à droite"
          >
            <AlignRight size={14} />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
            title="Supprimer l'image"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Preview Block Renderer ───────────────────────────────────────────────

function renderInlinePreview(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const linkParts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(part)) !== null) {
      if (match.index > lastIndex) linkParts.push(part.slice(lastIndex, match.index));
      linkParts.push(
        <span key={`link-${idx}-${match.index}`} className="text-[#8B4513] underline">{match[1]}</span>
      );
      lastIndex = match.index + match[0].length;
    }
    if (linkParts.length > 0) {
      if (lastIndex < part.length) linkParts.push(part.slice(lastIndex));
      return <span key={idx}>{linkParts}</span>;
    }
    return part;
  });
}

function PreviewBlock({
  block,
  onUpdateImage,
  onDeleteImage,
}: {
  block: MarkdownBlock;
  onUpdateImage: (newRaw: string) => void;
  onDeleteImage: () => void;
}) {
  switch (block.type) {
    case 'image':
      return <ResizableImage block={block} onUpdate={onUpdateImage} onDelete={onDeleteImage} />;
    case 'h2':
      return <h2 className="text-2xl font-display font-bold text-slate-900 mt-8 mb-3">{block.text}</h2>;
    case 'h3':
      return <h3 className="text-xl font-display font-semibold text-slate-900 mt-6 mb-2">{block.text}</h3>;
    case 'list':
      return (
        <ul className="list-disc pl-6 space-y-1 my-3">
          {block.items.map((item, i) => (
            <li key={i} className="text-slate-700 leading-relaxed text-sm">{renderInlinePreview(item)}</li>
          ))}
        </ul>
      );
    case 'paragraph':
      return <p className="text-slate-700 leading-relaxed my-3 text-sm">{renderInlinePreview(block.text)}</p>;
    default:
      return null;
  }
}

// ── Main Editor Component ────────────────────────────────────────────────

export default function BlogContentEditor({ value, onChange }: BlogContentEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Helpers for manipulating content by line index ──

  const insertAtLineIndex = useCallback(
    (lineIndex: number, markdown: string) => {
      const lines = value.split('\n');
      lines.splice(lineIndex, 0, markdown);
      onChange(lines.join('\n'));
    },
    [value, onChange]
  );

  const updateLine = useCallback(
    (lineIndex: number, newRaw: string) => {
      const lines = value.split('\n');
      // Find how many lines the original block occupies (usually 1 for images)
      if (lineIndex >= 0 && lineIndex < lines.length) {
        lines[lineIndex] = newRaw;
        onChange(lines.join('\n'));
      }
    },
    [value, onChange]
  );

  const deleteLine = useCallback(
    (lineIndex: number) => {
      const lines = value.split('\n');
      if (lineIndex >= 0 && lineIndex < lines.length) {
        lines.splice(lineIndex, 1);
        // Also remove adjacent empty line if exists
        if (lineIndex < lines.length && lines[lineIndex].trim() === '') {
          lines.splice(lineIndex, 1);
        } else if (lineIndex > 0 && lines[lineIndex - 1].trim() === '') {
          lines.splice(lineIndex - 1, 1);
        }
        onChange(lines.join('\n'));
      }
    },
    [value, onChange]
  );

  // ── Edit mode upload (for textarea) ──

  const [uploading, setUploading] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [pendingAlt, setPendingAlt] = useState('');
  const [savedCursor, setSavedCursor] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleEditUploadClick() {
    const ta = textareaRef.current;
    if (ta) setSavedCursor(ta.selectionStart);
    fileInputRef.current?.click();
  }

  async function handleEditFileChange(file: File) {
    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);
    if (url) {
      setPendingUrl(url);
      setPendingAlt('');
    }
  }

  function handleEditConfirm() {
    if (!pendingUrl) return;
    const md = `![${pendingAlt || 'image'}](${pendingUrl})`;
    const before = value.slice(0, savedCursor);
    const after = value.slice(savedCursor);
    onChange(before + '\n' + md + '\n' + after);
    setPendingUrl(null);
    setPendingAlt('');
    setTimeout(() => {
      const ta = textareaRef.current;
      if (ta) {
        ta.focus();
        const pos = savedCursor + md.length + 2;
        ta.setSelectionRange(pos, pos);
      }
    }, 0);
  }

  // ── Render ──

  const blocks = parseMarkdownBlocks(value);
  const visibleBlocks = blocks.filter((b) => b.type !== 'empty');

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-slate-700">
          Contenu *
        </label>
        <div className="flex items-center gap-2">
          {mode === 'edit' && (
            pendingUrl ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pendingAlt}
                  onChange={(e) => setPendingAlt(e.target.value)}
                  placeholder="Description de l'image"
                  className="px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-[#8B4513] outline-none w-48"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleEditConfirm(); } }}
                />
                <button type="button" onClick={handleEditConfirm} className="px-2 py-1 text-xs font-medium text-white bg-[#8B4513] hover:bg-[#6d3610] rounded">OK</button>
                <button type="button" onClick={() => { setPendingUrl(null); setPendingAlt(''); }} className="p-1 text-slate-400 hover:text-red-500"><X size={14} /></button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleEditUploadClick}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploading ? 'Upload...' : 'Insérer une image'}
              </button>
            )
          )}
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded transition-colors ${mode === 'edit' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Pencil size={12} />
              Écrire
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded transition-colors ${mode === 'preview' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Eye size={12} />
              Aperçu
            </button>
          </div>
        </div>
      </div>

      {/* Edit mode */}
      {mode === 'edit' && (
        <>
          <textarea
            ref={textareaRef}
            rows={20}
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none font-mono text-sm"
            placeholder={"## Titre de section\n\nParagraphe de texte avec **gras** et [lien](/url).\n\n![description](url-image)\n\n- Point 1\n- Point 2"}
          />
          <p className="text-xs text-slate-400 mt-1">
            Markdown : ## H2, ### H3, **gras**, - listes, [texte](/lien), ![description](image)
          </p>
        </>
      )}

      {/* Preview mode */}
      {mode === 'preview' && (
        <div
          className="min-h-[400px] border border-slate-300 rounded-lg p-6 bg-white overflow-auto"
          onClick={() => {
            // Deselect all images when clicking on empty area
          }}
        >
          {visibleBlocks.length === 0 && (
            <p className="text-slate-400 text-sm italic">Commencez à écrire du contenu en mode Écrire, puis revenez en Aperçu pour le visualiser.</p>
          )}

          {/* Insert zone at the top */}
          <InsertZone onInsert={(md) => insertAtLineIndex(0, md)} />

          {visibleBlocks.map((block, idx) => (
            <div key={`block-${block.lineIndex}`}>
              {/* Clear floats before non-image blocks that follow a float */}
              {block.type !== 'image' && idx > 0 && visibleBlocks[idx - 1].type === 'image' && (
                <div className="clear-both" />
              )}
              <PreviewBlock
                block={block}
                onUpdateImage={(newRaw) => updateLine(block.lineIndex, newRaw)}
                onDeleteImage={() => deleteLine(block.lineIndex)}
              />
              {/* Insert zone after each block */}
              <InsertZone onInsert={(md) => {
                // Insert after this block's line
                const nextLineIndex = block.lineIndex + 1;
                insertAtLineIndex(nextLineIndex, md);
              }} />
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleEditFileChange(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
