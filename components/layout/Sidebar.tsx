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
    <aside className="w-64 border-r p-4 ">
      <h2 className="font-bold text-xl text-blue-500 mb-4">Planera</h2>

      <button
       onClick={() => {
          const id = createPage();
          router.push(`/workspace/${id}`);
        }}
        className="mb-4 w-full text-white py-2 rounded bg-green-600 "
      >
        + New Page
      </button>

      <ul className="space-y-2">
        {pages.map((page) => (
          <li
            key={page.id}
            className={`flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-200 hover:text-black ${
              page.id === currentPageId ? "bg-gray-500 font-semibold" : ""
            } group`}
          >
          
            
            <span onClick={() => router.push(`/workspace/${page.id}`)} className="w-4/3">{page.title}</span>
            <button
              onClick={() => deletePage(page.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
