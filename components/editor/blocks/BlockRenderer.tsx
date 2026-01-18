import { Block } from "@/types/block";
import { usePagesStore } from "@/store/usePagesStore";
import TextBlock from "./TextBlock";
import TaskBlock from "./TaskBlock";
import { MutableRefObject } from "react";
import { useHistoryStore } from "@/stores/history.store";

const BlockRenderer = ({
  block,
  dragBlockIdRef,
  index,
}: {
  block: Block;
  dragBlockIdRef: MutableRefObject<string | null>;
  index: number;
}) => {
  const moveBlockById = usePagesStore((s) => s.moveBlockById);
  const currentPageId = usePagesStore((s) => s.currentPageId);
  const startBatch = useHistoryStore((s) => s.startBatch);
  const endBatch = useHistoryStore((s) => s.endBatch);

  const onDragStart = () => {
    dragBlockIdRef.current = block.id;
    startBatch();
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = () => {
    if (
      !dragBlockIdRef.current ||
      dragBlockIdRef.current === block.id ||
      !currentPageId
    )
      return;

    moveBlockById(currentPageId, dragBlockIdRef.current, block.id);
    endBatch();
    dragBlockIdRef.current = null;
  };

  const onDragEnd = () => {
    if (dragBlockIdRef.current) {
      endBatch();
    }
    dragBlockIdRef.current = null;
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
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