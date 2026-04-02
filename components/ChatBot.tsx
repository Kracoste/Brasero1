'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { GREETING_MESSAGE } from '@/lib/chatbot/knowledge-base';

type ChatProduct = {
  slug: string;
  name: string;
  price: number;
  category: string;
  availability: string;
  image: string | null;
  diameter: number | null;
  short_description: string | null;
};

type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  products?: ChatProduct[];
  showCallbackForm?: boolean;
  timestamp: number;
};

const STORAGE_KEY = 'lbf-chatbot-history';
const MAX_HISTORY = 50;

function loadHistory(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
  } catch { /* quota exceeded */ }
}

/** Suggestions rapides affichées au début */
const QUICK_SUGGESTIONS = [
  'Quel brasero choisir ?',
  'Quels sont vos prix ?',
  'Délai de livraison ?',
  'Comment nous contacter ?',
  'Je souhaite plus de renseignements',
];

/** Rend du markdown basique (gras, liens, listes) en JSX */
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Liste à puces
    if (line.startsWith('• ') || line.startsWith('- ')) {
      const content = line.replace(/^[•\-]\s*/, '');
      elements.push(
        <li key={i} className="ml-4 list-disc text-sm">
          {renderInline(content)}
        </li>
      );
      continue;
    }

    // Liste numérotée
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      elements.push(
        <li key={i} className="ml-4 list-decimal text-sm">
          {renderInline(numberedMatch[2])}
        </li>
      );
      continue;
    }

    // Ligne vide
    if (line.trim() === '') {
      elements.push(<br key={i} />);
      continue;
    }

    // Paragraphe normal
    elements.push(
      <p key={i} className="text-sm">
        {renderInline(line)}
      </p>
    );
  }

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  // Gras **text** et liens [text](url)
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Chercher le prochain marqueur
    const boldIdx = remaining.indexOf('**');
    const linkIdx = remaining.indexOf('[');

    // Aucun marqueur trouvé
    if (boldIdx === -1 && linkIdx === -1) {
      parts.push(remaining);
      break;
    }

    // Trouver le premier marqueur
    let nextIdx = Infinity;
    if (boldIdx !== -1) nextIdx = Math.min(nextIdx, boldIdx);
    if (linkIdx !== -1) nextIdx = Math.min(nextIdx, linkIdx);

    // Texte avant le marqueur
    if (nextIdx > 0) {
      parts.push(remaining.slice(0, nextIdx));
      remaining = remaining.slice(nextIdx);
    }

    // Gras
    if (remaining.startsWith('**')) {
      const endBold = remaining.indexOf('**', 2);
      if (endBold !== -1) {
        parts.push(
          <strong key={key++} className="font-semibold">
            {remaining.slice(2, endBold)}
          </strong>
        );
        remaining = remaining.slice(endBold + 2);
        continue;
      }
    }

    // Lien [text](url)
    if (remaining.startsWith('[')) {
      const closeBracket = remaining.indexOf(']');
      const openParen = remaining.indexOf('(', closeBracket);
      const closeParen = remaining.indexOf(')', openParen);
      if (closeBracket !== -1 && openParen === closeBracket + 1 && closeParen !== -1) {
        const linkText = remaining.slice(1, closeBracket);
        const linkUrl = remaining.slice(openParen + 1, closeParen);
        parts.push(
          <Link key={key++} href={linkUrl} className="text-amber-700 underline hover:text-amber-800">
            {linkText}
          </Link>
        );
        remaining = remaining.slice(closeParen + 1);
        continue;
      }
    }

    // Si le marqueur n'a pas de paire fermante, le traiter comme du texte
    parts.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return <>{parts}</>;
}

/** Formulaire de demande de rappel intégré dans le chat */
function CallbackForm({ onSubmitted }: { onSubmitted: (success: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || phone.trim().length < 8) {
      setError('Veuillez remplir correctement les deux champs.');
      return;
    }
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/chatbot/callback-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), phone: phone.trim() }),
      });
      if (res.ok) {
        onSubmitted(true);
      } else {
        setError('Une erreur est survenue, réessayez.');
        onSubmitted(false);
      }
    } catch {
      setError('Erreur de connexion, réessayez.');
      onSubmitted(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
      <p className="text-xs font-medium text-amber-800">Laissez-nous vos coordonnées, nous vous rappelons rapidement :</p>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Votre email"
        required
        className="w-full rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
      />
      <input
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="Votre numéro de téléphone"
        required
        className="w-full rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-md bg-amber-700 py-1.5 text-sm font-medium text-white transition hover:bg-amber-800 disabled:opacity-50"
      >
        {sending ? 'Envoi en cours...' : 'Demander un rappel'}
      </button>
    </form>
  );
}

function ProductCard({ product }: { product: ChatProduct }) {
  return (
    <Link
      href={`/produits/${product.slug}`}
      className="flex gap-3 rounded-lg border border-stone-200 bg-white p-2 transition hover:border-amber-300 hover:shadow-sm"
    >
      {product.image && (
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-stone-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      )}
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-sm font-medium text-stone-800 truncate">{product.name}</span>
        <span className="text-xs text-stone-500">
          {product.diameter ? `Ø${product.diameter}cm · ` : ''}{product.availability}
        </span>
        <span className="text-sm font-bold text-amber-700">{product.price.toLocaleString('fr-FR')}€</span>
      </div>
    </Link>
  );
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  // Charger l'historique au montage
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const history = loadHistory();
    if (history.length > 0) {
      setMessages(history);
    }
  }, []);

  // Sauvegarder à chaque changement
  useEffect(() => {
    if (messages.length > 0) {
      saveHistory(messages);
    }
  }, [messages]);

  // Auto-scroll en bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Détecter si on est scrollé vers le haut
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 60;
    setShowScrollDown(!isAtBottom);
  }, []);

  // Focus input à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Détecter demande de renseignements / rappel
    const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const wantsCallback = ['renseignement', 'rappel', 'etre rappele', 'être rappelé', 'plus d\'info', "plus d'info", 'rappeler', 'appeler'].some(
      t => normalized.includes(t.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
    );

    if (wantsCallback) {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'Bien sûr ! Remplissez le formulaire ci-dessous et nous vous recontacterons dans les plus brefs délais.',
        showCallbackForm: true,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.answer || 'Désolé, une erreur est survenue.',
        products: data.products,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: 'Désolé, je rencontre un problème technique. Réessayez dans un instant.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const showGreeting = messages.length === 0;

  return (
    <>
      {/* Bulle flottante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-stone-700 hover:bg-stone-800 rotate-0'
            : 'bg-gradient-to-br from-amber-600 to-amber-800 hover:scale-110 hover:brightness-110'
        }`}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>

      {/* Panneau de chat */}
      <div
        className={`fixed bottom-24 left-6 z-[60] flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ width: 'min(380px, calc(100vw - 3rem))', height: 'min(560px, calc(100vh - 8rem))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-amber-700 to-amber-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
              🔥
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Atelier LBF</h3>
              <p className="text-xs text-amber-200">Votre assistant brasero</p>
            </div>
          </div>
          <button
            onClick={clearHistory}
            className="text-xs text-amber-200 hover:text-white transition"
            title="Effacer l'historique"
          >
            Effacer
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {/* Greeting */}
          {showGreeting && (
            <div className="space-y-3">
              <div className="rounded-xl rounded-tl-sm bg-white px-4 py-3 shadow-sm border border-stone-100 max-w-[90%]">
                {renderMarkdown(GREETING_MESSAGE)}
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 transition hover:bg-amber-100 hover:border-amber-400"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'rounded-tr-sm bg-amber-700 text-white shadow-sm'
                    : 'rounded-tl-sm bg-white text-stone-800 shadow-sm border border-stone-100'
                }`}
              >
                {msg.role === 'bot' ? renderMarkdown(msg.content) : <p className="text-sm">{msg.content}</p>}

                {/* Produits recommandés */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.products.map(product => (
                      <ProductCard key={product.slug} product={product} />
                    ))}
                  </div>
                )}

                {/* Formulaire de rappel */}
                {msg.showCallbackForm && (
                  <CallbackForm
                    onSubmitted={(success) => {
                      if (success) {
                        const confirmMsg: Message = {
                          id: Date.now().toString(),
                          role: 'bot',
                          content: 'Merci ! Votre demande a bien été enregistrée. Nous vous rappellerons très prochainement. En attendant, n\'hésitez pas à poser d\'autres questions !',
                          timestamp: Date.now(),
                        };
                        setMessages(prev => prev.map(m =>
                          m.id === msg.id ? { ...m, showCallbackForm: false } : m
                        ).concat(confirmMsg));
                      }
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-xl rounded-tl-sm bg-white px-4 py-3 shadow-sm border border-stone-100">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bouton scroll down */}
        {showScrollDown && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-white border border-stone-200 p-1.5 shadow-md transition hover:bg-stone-50"
          >
            <ChevronDown size={18} className="text-stone-600" />
          </button>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-stone-200 bg-white px-3 py-2.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question..."
            className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            disabled={isLoading}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-700 text-white transition hover:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Envoyer"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
}
