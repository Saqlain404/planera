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
    <div
      className={`px-3 py-2 rounded text-sm flex justify-between items-center
        ${isLatest ? "bg-amber-200 text-black" : "bg-gray-100 text-black"}
      `}
    >{pending && <span className="text-xs italic">(pending)</span>}
      <span>{getHistoryLabel(entry)}</span>
      <span className="text-xs text-gray-500">
        {new Date(entry.timestamp).toLocaleTimeString()}
        
      </span>
    </div>
  );
};

export default HistoryItem;
