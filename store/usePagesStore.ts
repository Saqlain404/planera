import { create } from "zustand";
import { Page } from "@/types/page";
import { getFromStorage, saveToStorage } from "@/services/storageService";

type PagesState = {
  pages: Page[];
  currentPageId: string | null;
  history: Page[][];
  future: Page[][];

  createPage: () => string;
  deletePage: (id: string) => void;
  setCurrentPage: (id: string) => void;
  updatePage: (page: Page) => void;
  undo: () => void;
  redo: () => void;
  moveBlock: (pageId: string, blockId: string, direction: "up" | "down") => void;
  moveBlockById: (pageId: string, sourceId: string, targetId: string) => void;
};

const storedPages = getFromStorage("planera_pages") || [];

export const usePagesStore = create<PagesState>((set, get) => ({
  pages: Array.isArray(storedPages) ? storedPages : [],
  currentPageId: null,
  history: [],
  future: [],
  setCurrentPage: (id) => set({ currentPageId: id }),

  createPage: () => {
    const newPage: Page = {
      id: crypto.randomUUID(),
      title: "Untitled Page",
      blocks: [],
    };

    const pages = [...get().pages, newPage];
    saveToStorage("planera_pages", pages);

    set({
      pages,
      currentPageId: newPage.id,
    });

    return newPage.id;
  },
  updatePage: (updatedPage) => {
    const prevPages = get().pages;

    const pages = prevPages.map((p) =>
      p.id === updatedPage.id ? updatedPage : p
    );

    set({
      pages,
      history: [...get().history, prevPages],
      future: [], // clear redo stack
    });

    saveToStorage("planera_pages", pages);
  },

  deletePage: (id) => {
    const pages = get().pages.filter((p) => p.id !== id);
    saveToStorage("planera_pages", pages);

    set({
      pages,
      currentPageId: pages[0]?.id || null,
    });
  },

  undo: () => {
    const { history, pages } = get();
    if (!history.length) return;

    const previous = history[history.length - 1];

    set({
      pages: previous,
      history: history.slice(0, -1),
      future: [pages, ...get().future],
    });

    saveToStorage("planera_pages", previous);
  },
  
  redo: () => {
    const { future, pages } = get();
    if (!future.length) return;

    const next = future[0];

    set({
      pages: next,
      future: future.slice(1),
      history: [...get().history, pages],
    });

    saveToStorage("planera_pages", next);
  },

  moveBlock: (pageId: string, blockId: string, direction: "up" | "down") => {
    const {pages, currentPageId} = get();
    const page = pages.find((page) => page.id === pageId);
    if(!page) return;

    const index = page.blocks.findIndex((block) => block.id === blockId);
    if(index === -1) return;

    if(direction === "up" && index === 0) return;
    if(direction === "down" && index === page.blocks.length - 1) return;

    const snapshot = {
      page,
      currentPageId
    }

    const newBlocks = [...page.blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];

    const updatedPages = pages.map((page) => page.id === pageId ? {...page, blocks: newBlocks} : page)

    set({
      pages: updatedPages,
      history: [...get().history, snapshot.page ? pages : get().pages],
      future: [],
    });
  },
  moveBlockById: (pageId: string, sourceId: string, targetId: string) => {
    const {pages} = get();
    const page = pages.find((page) => page.id === pageId);
    if(!page) return;

    const sourceIndex = page.blocks.findIndex((block) => block.id === sourceId);
    const targetIndex = page.blocks.findIndex((block) => block.id === targetId);

    if(sourceIndex === -1 || targetIndex === -1) return;

    const snapshot = {
      pages,
      currentPageId: get().currentPageId,
    };
    const newBlocks = [...page.blocks];
    const [movedBlock] = newBlocks.splice(sourceIndex, 1);
    newBlocks.splice(targetIndex, 0, movedBlock);
    
    set({
      pages: pages.map((page) => 
      page.id === pageId ? {...page, blocks: newBlocks} : page),
      history: [...get().history, snapshot.pages],
      future: [],
    })
  }

}));

