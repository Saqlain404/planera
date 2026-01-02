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
      className="w-full flex justify-between gap-2 group border p-2 rounded border-green-800 bg-teal-950"
      onKeyDown={handleMoveBlock}
    >
      <div className="flex items-center gap-2 w-full ">
        <input
          type="checkbox"
          checked={block.completed}
          onChange={toggleTask}
        />
        <input
          className={`outline-none bg-transparent w-full ${
            block.completed ? "line-through text-gray-400" : ""
          }`}
          value={block.content}
          placeholder="Task..."
          onChange={(e) => updateText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div>
        <button
          onClick={() =>
            updateCurrentPage({
              ...currentPage,
              blocks: removeBlock(currentPage.blocks, block.id),
            })
          }
          className="opacity-0 group-hover:opacity-100 text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TaskBlock;
