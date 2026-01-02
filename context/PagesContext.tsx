"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Page } from "@/types/page";
import { getFromStorage, saveToStorage } from "@/services/storageService";

type PagesContextType = {
  pages: Page[];
  currentPage: Page | null;
  createPage: () => void;
  deletePage: (id: string) => void;
  setCurrentPage: (id: string) => void;
  updateCurrentPage: (page: Page) => void;
  reorderPages: (from: number, to: number) => void;
};

const PagesContext = createContext<PagesContextType | null>(null);
export const PagesProvider = ({ children }: { children: React.ReactNode }) => {
  const [pages, setPages] = useState<Page[]>(() => {
    const storedPages = getFromStorage("planera_pages") || [];
    return storedPages;
  });
  const [currentPage, setCurrentPageState] = useState<Page | null>(() => {
    const storedPages = getFromStorage("planera_pages") || [];
    return storedPages[0] || null;
  });

  useEffect(() => {
    saveToStorage("planera_pages", pages);
  }, [pages]);



  const createPage = () => {
    const newPage: Page = {
      id: crypto.randomUUID(),
      title: `Page ${pages.length + 1}`,
      blocks: [],
    };

    setPages((prevPages) => [...prevPages, newPage]);
    setCurrentPageState(newPage);

    return newPage.id;
  };

  const deletePage = (id: string) => {
  setPages(prev => prev.filter(p => p.id !== id));

  if (currentPage?.id === id) {
    const remaining = pages.filter(p => p.id !== id);
    setCurrentPageState(remaining[0] || null);
  }
};


  const setCurrentPage = (id: string) => {
    const page = pages.find((p) => p.id === id) || null;
    setCurrentPageState(page);
  };

  const updateCurrentPage = (updatedPage: Page) => {
  setPages(prev =>
    prev.map(page =>
      page.id === updatedPage.id ? updatedPage : page
    )
  );

  setCurrentPageState(updatedPage);
};

const reorderPages = (from: number, to: number) => {
  setPages(prev => {
    const updated = [...prev];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    return updated;
  });
};


  return (
    <PagesContext.Provider
      value={{ pages, currentPage, createPage, setCurrentPage, updateCurrentPage, deletePage, reorderPages }}
    >
      {children}
    </PagesContext.Provider>
  );
};
export const usePages = () => {
  const ctx = useContext(PagesContext);
  if (!ctx) throw new Error("usePages must be used within a PagesProvider");
  return ctx;
};
