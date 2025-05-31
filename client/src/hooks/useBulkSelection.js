import { useState, useEffect } from "react";

/**
 * Custom hook for managing bulk user selection
 * @param {Array} visibleUsers
 */
export default function useBulkSelection(visibleUsers) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Keep selection in sync when visibleUsers changes (e.g., new filter)
  useEffect(() => {
    setSelectedIds((prev) => {
      const updated = new Set();
      for (const user of visibleUsers) {
        if (prev.has(user.id)) updated.add(user.id);
      }
      return updated;
    });
  }, [visibleUsers]);

  const isSelected = (userId) => selectedIds.has(userId);

  const toggleUser = (userId) => {
    setSelectedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(userId)) {
        updated.delete(userId);
      } else {
        updated.add(userId);
      }
      return updated;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(visibleUsers.map((u) => u.id)));
  };

  const clearAll = () => {
    setSelectedIds(new Set());
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === visibleUsers.length) {
      clearAll();
    } else {
      selectAll();
    }
  };

  return {
    selectedIds,
    isSelected,
    toggleUser,
    selectAll,
    clearAll,
    toggleSelectAll,
    hasSelections: selectedIds.size > 0,
    isAllSelected:
      selectedIds.size === visibleUsers.length && visibleUsers.length > 0,
  };
}
