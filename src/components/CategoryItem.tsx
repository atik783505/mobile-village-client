"use client";

import React from "react";

interface CategoryItem {
  id: string;
  name: string;
  countLabel: string;
  icon: React.ReactNode;
}

const categories: CategoryItem[] = [
  { id: "phones", name: "Smartphones", countLabel: "24+ items", icon: <span>📱</span> },
  { id: "audio", name: "Earbuds & Audio", countLabel: "18+ items", icon: <span>🎧</span> },
  { id: "chargers", name: "Fast Chargers", countLabel: "15+ items", icon: <span>⚡</span> },
  { id: "watches", name: "Smartwatches", countLabel: "12+ items", icon: <span>⌚</span> },
  { id: "cases", name: "Cases & Glass", countLabel: "30+ items", icon: <span>🛡️</span> },
];

export function CategoryStrip({ onSelect }: { onSelect?: (id: string) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Browse by Type
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Shop Categories
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onSelect?.("all")}
          className="text-sm font-medium text-slate-600 transition hover:text-green-600"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect?.(cat.id)}
            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green-500/60 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-xl transition group-hover:bg-green-600 group-hover:text-white">
              {cat.icon}
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-green-700">
                {cat.name}
              </p>
              <p className="text-xs text-slate-500">{cat.countLabel}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}