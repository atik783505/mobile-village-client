import React from "react";

const perks = [
  {
    title: "100% Authentic Gear",
    desc: "Verified official & brand-sealed gadgets with zero compromises.",
    accent: "bg-green-600",
  },
  {
    title: "Express Dispatch",
    desc: "Fast doorstep delivery with live order status updates.",
    accent: "bg-slate-900",
  },
  {
    title: "Easy Warranty Support",
    desc: "Hassle-free replacement & support coverage on eligible items.",
    accent: "bg-green-600",
  },
  {
    title: "Transparent Pricing",
    desc: "Clear upfront pricing with seasonal deals and promo offers.",
    accent: "bg-slate-900",
  },
];

export function TrustStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map((perk) => (
          <div
            key={perk.title}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <span className={`mb-3 inline-block h-2 w-8 rounded-full ${perk.accent}`} />
            <h3 className="text-base font-bold text-slate-900">{perk.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {perk.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
} 