"use client";

import React, { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 text-center sm:px-14">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-green-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-green-600/10 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-400">
            Stay Updated
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
            Get Exclusive Deals First
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
            Subscribe to our newsletter and be the first to know about flash sales, new arrivals, and special offers.
          </p>

          {submitted ? (
            <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600/20 px-6 py-3 text-sm font-semibold text-green-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You&apos;re subscribed! We&apos;ll be in touch soon.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
              />
              <button
                type="submit"
                className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500 active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-slate-500">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
