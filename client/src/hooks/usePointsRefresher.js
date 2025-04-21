import { useEffect } from "react";
import { getUserMembership } from "../managers/userProfileManager";

export function usePointsRefresher(setUserPoints, loggedInUser) {
  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (e.key === "zlg-points-updated" && loggedInUser) {
        getUserMembership()
          .then((membership) => {
            if (membership?.points != null) {
              setUserPoints(membership.points);
            }
          })
          .catch((err) =>
            console.error("❌ Failed to refresh points after Tebex:", err)
          );
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [loggedInUser, setUserPoints]);
}
