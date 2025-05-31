import { useState, useEffect } from "react";

/**
 * Custom hook for managing bulk user selection
 * @param {Array<{id: any}>} visibleUsers
 */
export default function useBulkSelection(visibleUsers) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    const newVisibleIds = visibleUsers.map((u) => u.id);
    const newSet = new Set();

    // Retain only selected IDs that are still visible
    for (const id of selectedIds) {
      if (newVisibleIds.includes(id)) {
        newSet.add(id);
      }
    }

    // Only update state if the new set differs
    if (newSet.size !== selectedIds.size) {
      setSelectedIds(newSet);
    }
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
