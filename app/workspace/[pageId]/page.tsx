"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import PageEditor from "@/components/editor/PageEditor";
import AddBlock from "@/components/editor/AddBlock";
import { usePagesStore } from "@/store/usePagesStore";
import EditorToolbar from "@/components/editor/EditorToolbar";
import HistoryPanel from "@/components/history/HistoryPanel";

export default function WorkspacePage() {
  const { pageId } = useParams();

  const pages = usePagesStore((s) => s.pages);
  const isLoading = usePagesStore((s) => s.isLoading);
  const setCurrentPage = usePagesStore((s) => s.setCurrentPage);
  const initializeFromStorage = usePagesStore((s) => s.initializeFromStorage);

  const currentPage = pages.find((page) => page.id === pageId);

  // Initialize from storage on mount
  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    if (pageId) {
      setCurrentPage(pageId as string);
    }
  }, [pageId, setCurrentPage]);

  // ✅ FIX: Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6 flex items-center justify-center text-gray-500">
          Loading...
        </main>
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6 flex items-center justify-center text-gray-500">
          Create a new page
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <input
          className="text-2xl font-bold mb-4 outline-none bg-transparent w-full"
          value={currentPage.title}
          onChange={(e) =>
            usePagesStore
              .getState()
              .updatePage({ ...currentPage, title: e.target.value })
          }
        />

        <EditorToolbar />
        <AddBlock />
        <PageEditor />
        <HistoryPanel/>
      </main>
    </div>
  );
}