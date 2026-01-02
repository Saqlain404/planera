"use client";

import { useEffect } from "react";
import { usePagesStore } from "@/store/usePagesStore";

const EditorShortcuts = () => {
  const undo = usePagesStore((s) => s.undo);
  const redo = usePagesStore((s) => s.redo);

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
