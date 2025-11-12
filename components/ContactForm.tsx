"use client";

import { FormEvent, useState } from "react";

export const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("success");
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-lg">
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-clay-900">
          Nom complet
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-inner focus:border-clay-500 focus:outline-none focus:ring-2 focus:ring-clay-200"
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-clay-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-inner focus:border-clay-500 focus:outline-none focus:ring-2 focus:ring-clay-200"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-semibold text-clay-900">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-inner focus:border-clay-500 focus:outline-none focus:ring-2 focus:ring-clay-200"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-clay-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-clay-800"
      >
        Envoyer
      </button>
      {status === "success" && (
        <p className="text-center text-sm font-semibold text-green-700">
          Merci ! Nous revenons vers vous sous 24h ouvrées.
        </p>
      )}
    </form>
  );
};
