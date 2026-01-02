"use client";

import { usePagesStore } from "@/store/usePagesStore";

const AddBlock = () => {
    const pages = usePagesStore((s) => s.pages);
    const currentPageId = usePagesStore((s) => s.currentPageId);
    const updateCurrentPage = usePagesStore((s) => s.updatePage);

    const currentPage = pages.find(
    (page) => page.id === currentPageId
    );

  const addBlock = (type: "text" | "task") => {
    if (!currentPage) return;

    const newBlock = type === "task"
      ? {
          id: crypto.randomUUID(),
          type: "task" as const,
          content: "",
          completed: false,
        }
      : {
          id: crypto.randomUUID(),
          type: "text" as const,
          content: "",
        };

    updateCurrentPage({
      ...currentPage,
      blocks: [...currentPage.blocks, newBlock],
    });
  };

  return (
    <div className="flex gap-2 mb-4">
      <button onClick={() => addBlock("text")} className="p-2 bg-amber-500 rounded text-black">+ Text</button>
      <button onClick={() => addBlock("task")} className="p-2 bg-amber-500 rounded text-black">+ Task</button>
    </div>
  );
};

export default AddBlock;
