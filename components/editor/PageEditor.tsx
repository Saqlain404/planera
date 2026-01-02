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
    <div className="space-y-2">
      {currentPage.blocks.map((block, index) => (
        <BlockRenderer
          key={block.id}
          block={block}
          index={index}
          dragBlockIdRef={dragBlockIdRef}
        />
      ))}
    </div>
  );
};

export default PageEditor;
