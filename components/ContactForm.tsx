"use client";

import { FormEvent, useState } from "react";

export const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'envoi");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-slate-200 bg-white p-6 shadow-lg">
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-slate-900">
          Nom complet
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          disabled={status === "loading"}
          className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-slate-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={status === "loading"}
          className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-semibold text-slate-900">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          disabled={status === "loading"}
          className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {status === "loading" ? "Envoi en cours..." : "Envoyer"}
      </button>
      {status === "success" && (
        <p className="text-center text-sm font-semibold text-green-700">
          Merci ! Nous revenons vers vous sous 24h ouvrées.
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-sm font-semibold text-red-600">
          {errorMessage || "Une erreur est survenue. Veuillez réessayer."}
        </p>
      )}
    </form>
  );
};
