import { Block } from "@/types/block";

export const insertBlockAfter = (
  blocks: Block[],
  index: number,
  newBlock: Block
) => {
  const updated = [...blocks];
  updated.splice(index + 1, 0, newBlock);
  return updated;
};

export const removeBlock = (blocks: Block[], blockId: string) => {
  return blocks.filter(b => b.id !== blockId);
};
