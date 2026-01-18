"use client";

import { HistoryEntry } from "@/stores/history.store";
import { getHistoryLabel } from "./historyLabels";

type Props = {
  entry: HistoryEntry;
  isLatest: boolean;
  pending?: boolean;
};

const HistoryItem = ({ entry, isLatest, pending }: Props) => {
  return (
    <button
      className={`w-full history-entry group ${
        pending ? "history-entry.pending" : ""
      } ${isLatest ? "bg-blue-50 border border-blue-100" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {pending && (
            <span className="inline-block w-2 h-2 bg-amber-400 rounded-full flex-shrink-0 animate-pulse"></span>
          )}
          {isLatest && !pending && (
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
          )}
          <span className="text-sm text-slate-700 truncate font-medium">
            {getHistoryLabel(entry)}
          </span>
          {pending && (
            <span className="text-xs text-slate-500 ml-auto flex-shrink-0">
              Recording...
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">
          {new Date(entry.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </button>
  );
};

export default HistoryItem;