"use client";

import type { Job } from "@/store/job-store";
import { useJobStore } from "@/store/job-store";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const addFilter = useJobStore((state) => state.addFilter);
  const filters = useJobStore((state) => state.filters);

  const allTags = [job.role, job.level, ...job.languages, ...job.tools];

  const handleTagClick = (tag: string) => {
    if (!filters.includes(tag)) {
      addFilter(tag);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 mb-6 relative ${"hover:border-l-4 border-teal-500"}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-start md:items-center gap-4 mb-4 md:mb-0">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
            {job.company === "Photosnap" && (
              <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs font-bold">
                PHOTOSNAP
              </div>
            )}
            {job.company === "Manage" && (
              <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                manage
              </div>
            )}
            {job.company === "Account" && (
              <div className="w-full h-full bg-purple-700 flex items-center justify-center text-white text-xs font-bold">
                ACCOUNT
              </div>
            )}
            {job.company === "MyHome" && (
              <div className="w-full h-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
                MYHOME
              </div>
            )}
            {job.company === "Loop Studios" && (
              <div className="w-full h-full bg-purple-900 flex items-center justify-center text-white text-xs font-bold">
                LOOP STUDIOS
              </div>
            )}
            {job.company === "FaceIt" && (
              <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                O
              </div>
            )}
            {job.company === "Shortly" && (
              <div className="w-full h-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                shortly
              </div>
            )}
            {job.company === "Insure" && (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold">
                INSURE
              </div>
            )}
            {job.company === "Eyecam Co." && (
              <div className="w-full h-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
                EYECAM
              </div>
            )}
            {job.company === "The Air Filter Company" && (
              <div className="w-full h-full bg-teal-700 flex items-center justify-center text-white text-xs font-bold">
                OO
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-teal-600 font-medium text-sm">
                {job.company}
              </span>
              {job.new && (
                <span className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-bold uppercase">
                  NEW!
                </span>
              )}
              {job.featured && (
                <span className="bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-bold uppercase">
                  FEATURED
                </span>
              )}
            </div>
            <h3 className="text-gray-800 font-bold text-lg mb-2 hover:text-teal-600 cursor-pointer">
              {job.position}
            </h3>
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <span>{job.postedAt}</span>
              <span>•</span>
              <span>{job.contract}</span>
              <span>•</span>
              <span>{job.location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200">
          {allTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="bg-teal-50 text-teal-600 px-3 py-1 rounded font-medium text-sm hover:bg-teal-600 hover:text-white transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
