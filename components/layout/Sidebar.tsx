"use client";
import { usePagesStore } from "@/store/usePagesStore";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const pages = usePagesStore((s) => s.pages);
  const currentPageId = usePagesStore((s) => s.currentPageId);
  const createPage = usePagesStore((s) => s.createPage);
  const deletePage = usePagesStore((s) => s.deletePage);


  return (
    <aside className="w-64 h-screen border-r border-slate-200/50 bg-white flex flex-col">
      <div className="p-4 border-b border-slate-200/50">
        <h1 className="text-lg font-semibold text-slate-900">Planera</h1>
        <p className="text-xs text-slate-500 mt-1">Plan & Execute</p>
      </div>
      <div className="p-4">
        <button
          onClick={() => {
            const id = createPage();
            router.push(`/workspace/${id}`);
          }}
          className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Page
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        {pages.length === 0 ? (
          <p className="px-3 py-2 text-sm text-slate-400">
            No pages yet. Create one to get started.
          </p>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="group flex items-center gap-2"
            >
              <button
                onClick={() => router.push(`/workspace/${page.id}`)}
                className={`flex-1 text-left sidebar-item ${
                  page.id === currentPageId ? "active" : ""
                }`}
              >
                {page.title || "Untitled"}
              </button>
              <button
                onClick={() => deletePage(page.id)}
                className="icon-btn opacity-0 group-hover:opacity-100"
                aria-label="Delete page"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200/50 text-xs text-slate-500">
        <p>v0.1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;