"use client";

import { TextBlock as TextBlockType } from "@/types/block";
import { usePagesStore } from "@/store/usePagesStore";
import { insertBlockAfter, removeBlock } from "@/utils/blockUtils";

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

  const currentPage = pages.find(
    (page) => page.id === currentPageId
  );

  if (!currentPage) return null;


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
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
      blocks: currentPage.blocks.map(b =>
        b.id === block.id ? { ...b, content: value } : b
      ),
    });
  };

  const handleMoveBlock = (e: React.KeyboardEvent) => {
    const isMac = navigator.platform.includes("Mac");
    const cmd = isMac ? e.metaKey : e.ctrlKey;

    if(!cmd || !currentPageId) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveBlock(currentPageId, block.id, "up");
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveBlock(currentPageId, block.id, "down");
    }
  }

  return (
    <div className="w-full flex items-start gap-2 group border p-2 rounded border-purple-800 bg-purple-900"
      onKeyDown={handleMoveBlock}>
    <textarea
      className="w-full resize-none outline-none bg-transparent "
      placeholder="Write something..."
      value={block.content}
      onChange={e => updateText(e.target.value)}
      onKeyDown={handleKeyDown}
    />
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
  );
};

export default TextBlock;
