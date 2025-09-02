import { create } from "zustand";

export interface Job {
  id: number;
  company: string;
  logo: string;
  new: boolean;
  featured: boolean;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  tools: string[];
}

interface JobStore {
  jobs: Job[];
  filters: string[];
  setJobs: (jobs: Job[]) => void;
  addFilter: (filter: string) => void;
  removeFilter: (filter: string) => void;
  clearFilters: () => void;
  filteredJobs: () => Job[];
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  filters: [],
  setJobs: (jobs) => set({ jobs }),
  addFilter: (filter) =>
    set((state) => ({
      filters: [...state.filters, filter],
    })),
  removeFilter: (filter) =>
    set((state) => ({
      filters: state.filters.filter((f) => f !== filter),
    })),
  clearFilters: () => set({ filters: [] }),
  filteredJobs: () => {
    const { jobs, filters } = get();
    if (filters.length === 0) return jobs;

    return jobs.filter((job) => {
      const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
      return filters.every((filter) => jobTags.includes(filter));
    });
  },
}));
