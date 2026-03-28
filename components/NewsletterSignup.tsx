'use client'

import { useState, FormEvent } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setErrorMessage('Veuillez entrer une adresse email valide.')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Une erreur est survenue. Veuillez réessayer.')
      }

      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Une erreur est survenue.')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-md">
        <p className="text-sm font-semibold text-gray-900">Merci ! Vous êtes inscrit.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <p className="text-sm font-semibold text-gray-900">Restez informé</p>
      <p className="text-xs text-gray-600 mt-1">
        Recevez nos offres exclusives et conseils brasero. Pas de spam, promis.
      </p>
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="Votre adresse email"
          className="flex-1 rounded-lg sm:rounded-l-lg sm:rounded-r-none border border-slate-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8B4513]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="mt-2 sm:mt-0 rounded-lg sm:rounded-r-lg sm:rounded-l-none bg-[#8B4513] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#723a0f] disabled:opacity-60"
        >
          {status === 'loading' ? '...' : "S'inscrire"}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}
