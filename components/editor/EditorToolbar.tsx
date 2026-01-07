"use client";

import { useHistoryStore } from "@/stores/history.store";
import { usePagesStore } from "@/store/usePagesStore";
import { useEffect, useState } from "react";



const EditorToolbar = () => {
  //Subscribe to BOTH past and future to trigger re-render
  const past = useHistoryStore((s) => s.past);
  const future = useHistoryStore((s) => s.future);
  
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const [update ,setUpdate] = useState(0);

  useEffect(() => {
  console.log("HISTORY STATE", useHistoryStore.getState());
}, [update]);

  const undo = () => {
    const entry = useHistoryStore.getState().undo();
    if (entry) {
      usePagesStore.getState().applySnapshot(entry.snapshot);
    }
    setUpdate(update + 1);
  };

  const redo = () => {
    const entry = useHistoryStore.getState().redo();
    if (entry) {
      usePagesStore.getState().applySnapshot(entry.snapshot);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-4 border-b pb-2">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`px-2 py-1 rounded ${
          canUndo ? "hover:bg-gray-600" : "opacity-40"
        }`}
      >
        ⟲ Undo
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        className={`px-2 py-1 rounded ${
          canRedo ? "hover:bg-gray-600" : "opacity-40"
        }`}
      >
        ⟳ Redo
      </button>
    </div>
  );
};

export default EditorToolbar;