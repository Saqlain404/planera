"use client";

import { useHistoryStore } from "@/stores/history.store";
import HistoryItem from "./HistoryItem";

const HistoryPanel = () => {
    const past = useHistoryStore((store) => store.past);
    const batchEntry = useHistoryStore((s) => s.batchEntry);


    if(past.length === 0) {
        return <div className="p-4 text-sm text-gray-500">No history yet</div>;
    }
    return (
        <div className="w-64 border-l h-full flex flex-col">
            <div className="p-3 border-b font-semibold text-sm">History</div>
            <div className="flex-1 overflow-y-auto space-y-1 p-2">
                {batchEntry && (
  <HistoryItem
    entry={batchEntry}
    isLatest
    pending
  />
)}
                {[...past].reverse().map((entry, index) => (
                    <HistoryItem
                    key={entry.timestamp}
                    entry={entry}
                    isLatest={index === 0}
                />
                ))}
                </div>
        </div>
        
    )
}

export default HistoryPanel;