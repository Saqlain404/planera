"use client";

import { usePagesStore } from "@/store/usePagesStore";

const EditorToolbar = () => {
  const undo = usePagesStore((s) => s.undo);
  const redo = usePagesStore((s) => s.redo);
  const canUndo = usePagesStore((s) => s.history.length > 0);
  const canRedo = usePagesStore((s) => s.future.length > 0);

  return (
    <div className="flex items-center gap-2 mb-4 border-b pb-2 ">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`px-2 py-1 rounded ${
          canUndo ? "hover:bg-gray-200" : "opacity-40"
        }`}
      >
        ⟲ Undo
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        className={`px-2 py-1 rounded ${
          canRedo ? "hover:bg-gray-200" : "opacity-40"
        }`}
      >
        ⟳ Redo
      </button>
    </div>
  );
};

export default EditorToolbar;
