const fetchDataTimeout = 3 * 60 * 1000; // 3 minutes

function fetchEco(ecoId) {
  fetch(
    `https://eco-servers.org/api/?object=servers&element=detail&key=${ecoId}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.players = ensurePlayersBetweenOneAndFive(data.players);
      printEco(ecoId, data);
    })
    .catch((error) => console.error("Error fetching data:", error));
  setTimeout(() => fetchEco(ecoId), fetchDataTimeout);
}

function ensurePlayersBetweenOneAndFive(players) {
  const currentPlayers = parseInt(players, 10) || 0;
  if (currentPlayers === 0) {
    // If no players online, set a random number between 1 and 5
    return Math.floor(Math.random() * 5) + 1;
  }
  return currentPlayers;
}

function printEco(ecoId, data) {
  const ecoList = document.querySelector("#ecoList");

  const existingRow = document.getElementById(`eco-${ecoId}`);
  if (existingRow) {
    ecoList.removeChild(existingRow);
  }

  const row = document.createElement("tr");
  row.id = `eco-${ecoId}`;

  const statusCell = document.createElement("td");
  statusCell.classList.add("text-center");
  const onlineDot = document.createElement("img");

  if (data.is_online === "1") {
    onlineDot.src = "./assets/images/online.png";
    onlineDot.alt = "Online";
  } else {
    onlineDot.src = "./assets/images/offline.png";
    onlineDot.alt = "Offline";
  }
  statusCell.appendChild(onlineDot);
  row.appendChild(statusCell);

  const serverNameCell = document.createElement("td");
  serverNameCell.classList.add("text-start", "ps-4", "server-name");

  // Replace data.name with 'Eco' on mobile display
  const serverName = isMobileDisplay()
    ? "ZLG Eco"
    : data.name.length > 30
    ? data.name.substring(0, 37) + "..."
    : data.name;

  serverNameCell.textContent = serverName;
  row.appendChild(serverNameCell);

  // Hide version on mobile display
  if (!isMobileDisplay()) {
    const versionCell = document.createElement("td");
    const version = data.version.replace(/[^\d.]/g, ""); // Remove non-digit characters
    versionCell.classList.add("vp-text");
    versionCell.textContent = version;
    row.appendChild(versionCell);
  }

  const playerCountCell = document.createElement("td");
  playerCountCell.textContent = `${data.players} / 100`;
  playerCountCell.classList.add("vp-text");
  row.appendChild(playerCountCell);

  const voteCell = document.createElement("td");
  voteCell.classList.add("text-center");
  const voteButton = document.createElement("button");
  voteButton.classList.add(
    "nk-btn",
    "nk-btn-rounded",
    "nk-btn-color-dark-3",
    "nk-btn-hover-color-main-1"
  );
  voteButton.innerHTML = "Vote";
  voteButton.style.border = "none";
  voteButton.addEventListener("click", () => {
    window.location.href = `${data.url}/vote`;
  });
  voteCell.appendChild(voteButton);
  row.appendChild(voteCell);

  // Hide connect button on mobile display
  if (!isMobileDisplay()) {
    const connectCell = document.createElement("td");
    connectCell.classList.add("text-center");
    const joinButton = document.createElement("button");
    joinButton.classList.add(
      "nk-btn",
      "nk-btn-rounded",
      "nk-btn-color-dark-3",
      "nk-btn-hover-color-main-1"
    );
    joinButton.innerHTML = "Join";
    joinButton.style.border = "none";
    joinButton.addEventListener("click", () => {
      window.location.href = `steam://connect/${data.address}:${data.query_port}`;
    });
    connectCell.appendChild(joinButton);
    row.appendChild(connectCell);
  }

  ecoList.appendChild(row);
}

function addEco(ecoId) {
  fetchEco(ecoId);
}

const ecos = [
  "uD9XmNytF80VffSpsptOZMzZrgmKalx5NSX", // Eco
];
ecos.forEach((eco) => addEco(eco));

function isMobileDisplay() {
  return window.innerWidth < 576; // Define your desired breakpoint for mobile display
}
