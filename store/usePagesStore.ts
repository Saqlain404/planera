import { create } from "zustand";
import { Page } from "@/types/page";
import { useHistoryStore } from "@/stores/history.store";
import { getFromStorage, saveToStorage } from "@/services/storageService";

type PagesState = {
  pages: Page[];
  currentPageId: string | null;
  isLoading: boolean;

  // page actions
  createPage: () => string;
  deletePage: (id: string) => void;
  setCurrentPage: (id: string) => void;
  updatePage: (page: Page) => void;

  // block actions
  moveBlock: (
    pageId: string,
    blockId: string,
    direction: "up" | "down"
  ) => void;

  moveBlockById: (
    pageId: string,
    fromBlockId: string,
    toBlockId: string
  ) => void;

  // history integration
  applySnapshot: (snapshot: Page[]) => void;
  
  // initialization
  initializeFromStorage: () => void;
};

// Load initial pages from localStorage
const loadInitialPages = (): Page[] => {
  const stored = getFromStorage("planera_pages");
  return Array.isArray(stored) ? stored : [];
};

export const usePagesStore = create<PagesState>((set, get) => ({
  pages: loadInitialPages(),
  currentPageId: null,
  isLoading: true,

  /* -------------------- Init -------------------- */

  initializeFromStorage: () => {
    const pages = loadInitialPages();
    set({ pages, isLoading: false });
    // Initialize history with current state
    useHistoryStore.getState().record(pages, { type: "initialize" });
  },

  /* -------------------- Pages -------------------- */

  createPage: () => {
    const newPage: Page = {
      id: crypto.randomUUID(),
      title: "Untitled",
      blocks: [],
    };

    const pages = [...get().pages, newPage];
    
    set({ pages, currentPageId: newPage.id });
    saveToStorage("planera_pages", pages);
    
    // Record after state update
    useHistoryStore.getState().record(pages, {
  type: "page-create",
  meta: { pageId: newPage.id },
});

    return newPage.id;
  },

  deletePage: (id) => {
    const pages = get().pages.filter((p) => p.id !== id);
    
    set({ pages, currentPageId: pages[0]?.id || null });
    saveToStorage("planera_pages", pages);
    
    // Record after state update
    useHistoryStore.getState().record(pages, {
      type: "page-delete",
      meta: { pageId: id },
    });
  },

  setCurrentPage: (id) => {
    set({ currentPageId: id });
  },

  updatePage: (updatedPage) => {
    const pages = get().pages.map((p) =>
      p.id === updatedPage.id ? updatedPage : p
    );

    set({ pages });
    saveToStorage("planera_pages", pages);

    // Record, respecting batching
    useHistoryStore.getState().record(pages, {
      type: "page-update",
      meta: { pageId: updatedPage.id },
    });
  },

  /* -------------------- Blocks -------------------- */

  moveBlock: (pageId, blockId, direction) => {
    const pages = structuredClone(get().pages);
    const page = pages.find((p) => p.id === pageId);
    if (!page) return;

    const index = page.blocks.findIndex((b) => b.id === blockId);
    if (index === -1) return;

    const target = direction === "up" ? index - 1 : index + 1;

    if (target < 0 || target >= page.blocks.length) return;

    [page.blocks[index], page.blocks[target]] = [
      page.blocks[target],
      page.blocks[index],
    ];

    set({ pages });
    saveToStorage("planera_pages", pages);

    // Record, respecting batching
    useHistoryStore.getState().record(pages, {
      type: "block-move",
      meta: { pageId, blockId, direction },
    });
  },

  moveBlockById: (pageId, fromId, toId) => {
    const pages = structuredClone(get().pages);
    const page = pages.find((p) => p.id === pageId);
    if (!page) return;

    const fromIndex = page.blocks.findIndex((b) => b.id === fromId);
    const toIndex = page.blocks.findIndex((b) => b.id === toId);

    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = page.blocks.splice(fromIndex, 1);
    page.blocks.splice(toIndex, 0, moved);

    set({ pages });
    saveToStorage("planera_pages", pages);

    // Record, respecting batching
    useHistoryStore.getState().record(pages, {
      type: "block-move-by-id",
      meta: { pageId, fromId, toId },
    });
  },

  /* -------------------- History -------------------- */

  applySnapshot: (snapshot) => {
    set({ pages: snapshot });
    saveToStorage("planera_pages", snapshot);
  },
}));