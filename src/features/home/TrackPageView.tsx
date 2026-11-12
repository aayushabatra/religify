"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function TrackPageView({ page }: { page: string }) {
  useEffect(() => {
    track({
      name: "page_view",
      payload: { page_title: page, page_path: "/" },
    });
  }, [page]);

  return null;
}
