"use client";

import { useHistoryStore } from "@/stores/history.store";
import HistoryItem from "./HistoryItem";
import { useState } from "react";

const HistoryPanel = () => {
   const [isOpen, setIsOpen] = useState(false);
  const past = useHistoryStore((store) => store.past);
  const batchEntry = useHistoryStore((s) => s.batchEntry);

  const isEmpty = past.length === 0 && !batchEntry;

 if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 icon-btn text-slate-500 hover:text-slate-700 text-xl"
        title="History"
      >
        🕐
      </button>
    );
  }
  return (
    <>
    {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 bg-white rounded-lg border border-slate-200/50 shadow-xl max-h-96 flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200/50 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="font-semibold text-slate-900">History</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {past.length} {past.length === 1 ? "entry" : "entries"}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close history"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-1 p-3">
            {isEmpty ? (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">
                  No history yet. Start editing to see changes.
                </p>
              </div>
            ) : (
              <>
                {/* Pending entry */}
                {batchEntry && (
                  <HistoryItem
                    entry={batchEntry}
                    isLatest={true}
                    pending={true}
                  />
                )}

                {/* History entries - newest first */}
                {past
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <HistoryItem
                      key={`${entry.timestamp}-${index}`}
                      entry={entry}
                      isLatest={index === 0 && !batchEntry}
                      pending={false}
                    />
                  ))}
              </>
            )}
          </div>
        </div>
      )}</>
  );
};

export default HistoryPanel;
