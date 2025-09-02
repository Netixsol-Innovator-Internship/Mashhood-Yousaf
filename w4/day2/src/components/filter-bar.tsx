"use client";

import { useJobStore } from "@/store/job-store";
import { X } from "lucide-react";

export function FilterBar() {
  const filters = useJobStore((state) => state.filters);
  const removeFilter = useJobStore((state) => state.removeFilter);
  const clearFilters = useJobStore((state) => state.clearFilters);

  if (filters.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center bg-teal-50 text-teal-600 rounded overflow-hidden"
          >
            <span className="px-3 py-1 font-medium text-sm">{filter}</span>
            <button
              onClick={() => removeFilter(filter)}
              className="bg-teal-600 text-white p-1 hover:bg-teal-700 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={clearFilters}
        className="text-teal-600 hover:underline font-medium text-sm"
      >
        Clear
      </button>
    </div>
  );
}
