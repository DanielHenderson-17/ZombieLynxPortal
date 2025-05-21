import { useEffect } from "react";
import { scrollToBottom } from "../utils/scrollToBottom";

export function useAutoScrollToBottom(ref, dependencies = []) {
  useEffect(() => {
    scrollToBottom(ref);
  }, dependencies);
}
