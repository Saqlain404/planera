"use client";

import { useHistoryStore } from "@/stores/history.store";
import { usePagesStore } from "@/store/usePagesStore";



const EditorToolbar = () => {
  //Subscribe to BOTH past and future to trigger re-render
  const past = useHistoryStore((s) => s.past);
  const future = useHistoryStore((s) => s.future);
  
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

 

  const undo = () => {
    const entry = useHistoryStore.getState().undo();
    if (entry) {
      usePagesStore.getState().applySnapshot(entry.snapshot);
    }
  };

  const redo = () => {
    const entry = useHistoryStore.getState().redo();
    if (entry) {
      usePagesStore.getState().applySnapshot(entry.snapshot);
    }
  };

  return (
    <div className="flex items-center gap-1 mb-6 pb-4 border-b border-slate-200/50">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="btn-minimal"
        title="Undo (Cmd+Z)"
      >
        ⟲ Undo
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        className="btn-minimal"
        title="Redo (Cmd+Shift+Z)"
      >
        ⟳ Redo
      </button>
    </div>
  );
};

export default EditorToolbar;