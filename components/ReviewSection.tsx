'use client';

import { useEffect, useState, useCallback } from 'react';

interface Review {
  id: string;
  product_slug: string;
  author_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface ReviewsData {
  reviews: Review[];
  average: number;
  count: number;
}

function StarRating({
  rating,
  interactive = false,
  onRate,
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (value: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} disabled:cursor-default`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
        >
          <svg
            className={`w-5 h-5 ${
              star <= (hovered || rating) ? 'text-amber-400' : 'text-slate-200'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ReviewSection({ productSlug }: { productSlug: string }) {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [authorName, setAuthorName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?slug=${encodeURIComponent(productSlug)}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [productSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (rating === 0) {
      setErrorMessage('Veuillez sélectionner une note.');
      return;
    }

    if (authorName.trim().length < 2) {
      setErrorMessage('Veuillez entrer votre nom (minimum 2 caractères).');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_slug: productSlug,
          author_name: authorName.trim(),
          email: email.trim() || undefined,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMessage('Merci ! Votre avis sera publié après validation.');
        setAuthorName('');
        setEmail('');
        setRating(0);
        setComment('');
        setShowForm(false);
      } else {
        setErrorMessage(json.error || 'Une erreur est survenue.');
      }
    } catch {
      setErrorMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
        <div className="mt-4 space-y-3">
          <div className="h-20 bg-slate-50 rounded animate-pulse" />
          <div className="h-20 bg-slate-50 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <section className="py-8">
      {/* En-tête : moyenne + nombre d'avis */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Avis clients</h2>
          {data && data.count > 0 && (
            <span className="text-sm text-slate-600">
              {data.average}/5 — {data.count} avis
            </span>
          )}
          {data && data.count === 0 && (
            <span className="text-sm text-slate-500">Aucun avis pour le moment</span>
          )}
        </div>
        {!showForm && !successMessage && (
          <button
            onClick={() => {
              setShowForm(true);
              setErrorMessage('');
            }}
            className="text-sm font-medium text-slate-700 border border-slate-300 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors"
          >
            Laisser un avis
          </button>
        )}
      </div>

      {/* Message de succès */}
      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-slate-900">Laisser un avis</h3>

          {/* Note */}
          <div>
            <label className="block text-sm text-slate-700 mb-1">Votre note</label>
            <StarRating rating={rating} interactive onRate={setRating} />
          </div>

          {/* Nom */}
          <div>
            <label htmlFor="review-name" className="block text-sm text-slate-700 mb-1">
              Votre nom
            </label>
            <input
              id="review-name"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Jean D."
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="review-email" className="block text-sm text-slate-700 mb-1">
              Email <span className="text-slate-400">(facultatif, non affiché)</span>
            </label>
            <input
              id="review-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="jean@exemple.fr"
            />
          </div>

          {/* Commentaire */}
          <div>
            <label htmlFor="review-comment" className="block text-sm text-slate-700 mb-1">
              Votre commentaire
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={2000}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-vertical"
              placeholder="Partagez votre expérience avec ce produit..."
            />
          </div>

          {/* Erreur */}
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Envoi...' : 'Envoyer mon avis'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setErrorMessage('');
              }}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste des avis */}
      {data && data.reviews.length > 0 && (
        <div className="space-y-4">
          {data.reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900">
                    {review.author_name}
                  </span>
                  <StarRating rating={review.rating} />
                </div>
                <span className="text-xs text-slate-400">
                  {formatDate(review.created_at)}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
