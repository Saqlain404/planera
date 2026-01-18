/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { TextBlock as TextBlockType } from "@/types/block";
import { usePagesStore } from "@/store/usePagesStore";
import { insertBlockAfter, removeBlock } from "@/utils/blockUtils";
import { useRef, useEffect } from "react";

const TextBlock = ({
  block,
  index,
}: {
  block: TextBlockType;
  index: number;
}) => {
  const pages = usePagesStore((s) => s.pages);
  const currentPageId = usePagesStore((s) => s.currentPageId);
  const updateCurrentPage = usePagesStore((s) => s.updatePage);
  const moveBlock = usePagesStore((s) => s.moveBlock);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const currentPage = pages.find(
    (page) => page.id === currentPageId
  );

  if (!currentPage) return null;

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(textarea.scrollHeight, 24)}px`;
    }
  }, [block.content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      updateCurrentPage({
        ...currentPage,
        blocks: insertBlockAfter(currentPage.blocks, index, {
          id: crypto.randomUUID(),
          type: "text",
          content: "",
        }),
      });
    }

    if (e.key === "Backspace" && block.content === "") {
      e.preventDefault();

      updateCurrentPage({
        ...currentPage,
        blocks: removeBlock(currentPage.blocks, block.id),
      });
    }
  };

  const updateText = (value: string) => {
    updateCurrentPage({
      ...currentPage,
      blocks: currentPage.blocks.map((b) =>
        b.id === block.id ? { ...b, content: value } : b
      ),
    });
  };

  const handleMoveBlock = (e: React.KeyboardEvent) => {
    const isMac = navigator.platform.includes("Mac");
    const cmd = isMac ? e.metaKey : e.ctrlKey;

    if (!cmd || !currentPageId) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveBlock(currentPageId, block.id, "up");
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveBlock(currentPageId, block.id, "down");
    }
  };

  return (
    <div
      className="editor-block group relative flex items-start gap-2"
      onKeyDown={handleMoveBlock}
    >

      {/* Textarea */}
      <textarea
      ref={textareaRef}
        className="editor-input resize-none text-base"
        placeholder="Type here..."
        value={block.content}
        onChange={(e) => updateText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
      />

      {/* Delete button - hidden until hover */}
      <button
        onClick={() =>
          updateCurrentPage({
            ...currentPage,
            blocks: removeBlock(currentPage.blocks, block.id),
          })
        }
        className="opacity-0 group-hover:opacity-100 ml-auto text-slate-400 hover:text-red-500 transition-colors"
        aria-label="Delete block"
      >
        ✕
      </button>
    </div>
  );
};

export default TextBlock;