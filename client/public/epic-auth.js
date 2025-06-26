async function checkEpicStatus() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    document.getElementById("status-title").innerText = "No Discord Linked";
    document.getElementById("status-message").innerText =
      "Please link your Discord account to continue.";
    return;
  }

  try {
    const res = await fetch("/api/Epic/linked", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await res.json();

    if (!data || !data.eosId) {
      console.warn(
        "⚠️ No Epic account linked - Checking if Discord is linked..."
      );

      const discordRes = await fetch("/api/Discord/linked", {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      });
      const discordData = await discordRes.json();

      if (discordData?.discordId) {
        const linkRes = await fetch("/api/Epic/link-epic", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (linkRes.ok) {
          location.reload();
        } else {
          console.error("❌ Auto-link failed, showing manual instructions.");
          showManualLinkUI();
        }
      } else {
        showManualLinkUI();
      }
    } else {
      document.getElementById("status-title").innerText =
        "Epic Linked Successfully";
      document.getElementById("epic-username").innerText =
        data.epicName || "Unknown";
      document.getElementById("epic-info-container").classList.remove("d-none");

      if (window.opener) {
        window.opener.postMessage(
          {
            type: "EPIC_AUTH_SUCCESS",
            eosId: data.eosId,
            epicName: data.epicName,
          },
          window.location.origin
        );
      }

      setTimeout(() => window.close(), 5000);
    }
  } catch (err) {
    console.error("❌ Error checking Epic status:", err);
    document.getElementById("status-title").innerText = "Error";
    document.getElementById("status-message").innerText =
      "Something went wrong.";
  }
}

function showManualLinkUI() {
  document.getElementById("status-title").innerText = "Link Your Epic Account";
  document.getElementById("epic-link-container").classList.remove("d-none");
  document
    .getElementById("link-epic-btn")
    .addEventListener("click", openEpicAuthWindow);
}

function openEpicAuthWindow() {
  const popup = window.open(
    "/auth/epic-start", // or your actual Epic login endpoint
    "EpicAuthWindow",
    "width=600,height=700"
  );

  if (!popup || popup.closed || typeof popup.closed === "undefined") {
    alert("Popup blocked! Please allow popups for this site.");
  }
}

// ✅ Run on page load
checkEpicStatus();
