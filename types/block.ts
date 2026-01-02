export type BlockType = "text" | "task";

export type BaseBlock = {
  id: string;
  type: BlockType;
};

export type TextBlock = BaseBlock & {
  type: "text";
  content: string;
};

export type TaskBlock = BaseBlock & {
  type: "task";
  content: string;
  completed: boolean;
};

export type Block = TextBlock | TaskBlock;