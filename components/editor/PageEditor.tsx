"use client";

import { usePagesStore } from "@/store/usePagesStore";
import BlockRenderer from "./blocks/BlockRenderer";
import { useRef } from "react";


const PageEditor = () => {
  const pages = usePagesStore((s) => s.pages);
  const currentPageId = usePagesStore((s) => s.currentPageId);

  const currentPage = pages.find(
    (page) => page.id === currentPageId
  );

  const dragBlockIdRef = useRef<string | null>(null);
  if (!currentPage) {
    return <p>Select a page</p>;
  }

  return (
    <div className="w-full mx-auto space-y-0">
      {currentPage.blocks.map((block, index) => (
        <BlockRenderer
          key={block.id}
          block={block}
          index={index}
          dragBlockIdRef={dragBlockIdRef}
        />
      ))}
      {currentPage.blocks.length === 0 && (
        <div className="py-12 text-center text-slate-400">
          <p>Start typing to create your first block...</p>
        </div>
      )}
    </div>
  );
};

export default PageEditor;
