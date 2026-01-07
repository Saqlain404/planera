"use client";

import { useEffect } from "react";
import { useHistoryStore } from "@/stores/history.store";

const EditorShortcuts = () => {
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.includes("Mac");
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      }

      if (ctrlKey && e.shiftKey && e.key === "z") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
};

export default EditorShortcuts;
