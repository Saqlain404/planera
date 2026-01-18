"use client";

import { TaskBlock as TaskBlockType } from "@/types/block";
import { usePagesStore } from "@/store/usePagesStore";
import { insertBlockAfter, removeBlock } from "@/utils/blockUtils";

const TaskBlock = ({
  block,
  index,
}: {
  block: TaskBlockType;
  index: number;
}) => {
  const pages = usePagesStore((s) => s.pages);
  const currentPageId = usePagesStore((s) => s.currentPageId);
  const updateCurrentPage = usePagesStore((s) => s.updatePage);
  const moveBlock = usePagesStore((s) => s.moveBlock);

  const currentPage = pages.find((page) => page.id === currentPageId);

  if (!currentPage) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      updateCurrentPage({
        ...currentPage,
        blocks: insertBlockAfter(currentPage.blocks, index, {
          id: crypto.randomUUID(),
          type: "task",
          content: "",
          completed: false,
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

  const toggleTask = () => {
    updateCurrentPage({
      ...currentPage,
      blocks: currentPage.blocks.map((b) =>
        b.id === block.id ? { ...b, completed: !block.completed } : b
      ),
    });
  };

  const updateText = (value: string) => {
    updateCurrentPage({
      ...currentPage,
      blocks: currentPage.blocks.map((b) =>
        b.id === block.id ? { ...b, content: value } : b
      ),
    });
  };

  const handleMoveBlock = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      className="editor-block group relative flex items-center gap-3"
      onKeyDown={handleMoveBlock}
    >
    

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={block.completed}
        onChange={toggleTask}
        className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
        aria-label="Toggle task"
      />

      {/* Input */}
      <input
        type="text"
        className={`editor-input text-base ${
          block.completed
            ? "line-through text-slate-400"
            : "text-slate-900"
        }`}
        placeholder="Add a task..."
        value={block.content}
        onChange={(e) => updateText(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Delete button - hidden until hover */}
      <button
        onClick={() =>
          updateCurrentPage({
            ...currentPage,
            blocks: removeBlock(currentPage.blocks, block.id),
          })
        }
        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-colors ml-auto"
        aria-label="Delete task"
      >
        ✕
      </button>
    </div>
  );
};

export default TaskBlock;