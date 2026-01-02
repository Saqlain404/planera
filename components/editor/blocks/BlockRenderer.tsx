import { Block } from "@/types/block";
import { usePagesStore } from "@/store/usePagesStore";
import TextBlock from "./TextBlock";
import TaskBlock from "./TaskBlock";
import { MutableRefObject } from "react";

const BlockRenderer = ({ block, dragBlockIdRef, index }: { block: Block; dragBlockIdRef: MutableRefObject<string | null>; index: number }) => {
  const moveBlock = usePagesStore((s) => s.moveBlock);
  const currentPageId = usePagesStore((s) => s.currentPageId);
  const moveBlockById = usePagesStore((s) => s.moveBlockById);

  const moveUp = () => {
    if (!currentPageId) return;
    moveBlock(currentPageId, block.id, "up");
  };
  const moveDown = () => {
    if (!currentPageId) return;
    moveBlock(currentPageId, block.id, "down");
  };

  const onDragStart = () => {
    dragBlockIdRef.current = block.id;
  };

  // 2️⃣ ALLOW DROP (THIS IS THE FIX)
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // ❗ REQUIRED
  };

  // 3️⃣ Drop = reorder
  const onDrop = () => {
    if (
      !dragBlockIdRef.current ||
      dragBlockIdRef.current === block.id ||
      !currentPageId
    )
      return;

    moveBlockById(
      currentPageId,
      dragBlockIdRef.current,
      block.id
    );

    dragBlockIdRef.current = null;
  };

  // 4️⃣ Cleanup
  const onDragEnd = () => {
    dragBlockIdRef.current = null;
  };

  return (
    <div className="group flex gap-2 items-start"  draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver} // ✅ REQUIRED
      onDrop={onDrop}
      onDragEnd={onDragEnd}>
      <div className="flex flex-col opacity-0 group-hover:opacity-100">
        <button onClick={moveUp} className="text-xs">
          ↑
        </button>
        <button onClick={moveDown} className="text-xs">
          ↓
        </button>
      </div>
      {block.type === "text" && (
        <TextBlock block={block} index={index} />
      )}
      {block.type === "task" && (
        <TaskBlock block={block} index={index} />
      )}
    </div>
  );
};
export default BlockRenderer;
