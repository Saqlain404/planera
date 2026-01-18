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
      <div className="flex h-screen bg-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-slate-400">Loading...</div>
        </main>
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 mb-4">Create a new page to start</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="border-b border-slate-200/50 bg-white p-4">
          <input
            className="text-2xl font-bold outline-none bg-transparent text-slate-900 placeholder-slate-300"
            placeholder="Untitled"
            value={currentPage.title}
            onChange={(e) =>
              usePagesStore
                .getState()
                .updatePage({ ...currentPage, title: e.target.value })
            }
          />
        </div>

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <EditorToolbar />
            <AddBlock />
            <PageEditor />
          </div>
        </div>

        {/* History panel - optional overlay */}
        <HistoryPanel />
      </main>
    </div>
  );
}