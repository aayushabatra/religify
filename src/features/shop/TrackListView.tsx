"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type TrackListViewProps = {
  listName: string;
  itemCount: number;
  query?: string;
};

/** Fires PLP analytics once per mount. */
export function TrackListView({ listName, itemCount, query }: TrackListViewProps) {
  useEffect(() => {
    track({
      name: "view_item_list",
      payload: {
        item_list_name: listName,
        item_count: itemCount,
      },
    });

    if (query !== undefined) {
      track({
        name: "search",
        payload: {
          search_term: query,
          result_count: itemCount,
        },
      });
    }
  }, [listName, itemCount, query]);

  return null;
}
