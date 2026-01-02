"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePagesStore } from "@/store/usePagesStore";

export default function Home() {
  const { pages } = usePagesStore();
  const router = useRouter();

  useEffect(() => {
    if (pages.length) {
      router.replace(`/workspace/${pages[0].id}`);
    }
  }, [pages, router]);

  return null;
}
