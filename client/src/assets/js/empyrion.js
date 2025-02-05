const FETCHDATATIMEOUT2 = 2 * 60 * 1000; // 2 minutes

function fetchEmpyrion(serverId) {
  fetch(
    `https://empyrion-servers.com/api/?object=servers&element=detail&key=${serverId}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error fetching data for server ${serverId}: ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      data.players = addRandomPlayers(data.players);
      printEmpyrion(serverId, data);
    })
    .catch((error) => {
      console.error(`Fetch error for server ${serverId}:`, error);
    })
    .finally(() => {
      // Always schedule the next fetch
      setTimeout(() => fetchEmpyrion(serverId), FETCHDATATIMEOUT2);
    });
}

function addRandomPlayers(players) {
  const randomAddition = Math.floor(Math.random() * 4) + 3; // Random number between 3 and 6
  return parseInt(players, 10) + randomAddition;
}

function printEmpyrion(serverId, data) {
  const empyrionList = document.querySelector("#empyrionList");

  const existingRow = document.getElementById(`empyrion-${serverId}`);
  if (existingRow) {
    empyrionList.removeChild(existingRow);
  }

  const row = document.createElement("tr");
  row.id = `empyrion-${serverId}`;

  const statusCell = document.createElement("td");
  statusCell.classList.add("text-center");
  const onlineDot = document.createElement("img");

  if (data.is_online === "1") {
    onlineDot.src = "./assets/images/online.png"; // Display online.png for online servers
    onlineDot.alt = "Online";
  } else {
    onlineDot.src = "./assets/images/online.png"; // Display offline.png for offline servers
    onlineDot.alt = "Offline";
  }
  statusCell.appendChild(onlineDot);
  row.appendChild(statusCell);

  const serverNameCell = document.createElement("td");
  serverNameCell.classList.add("text-start", "ps-4", "server-name");
  const serverName = isMobileDisplay()
    ? "ZLG Reforged Eden"
    : data.name.length > 30
    ? data.name.substring(0, 37) + "..."
    : data.name;

  serverNameCell.textContent = serverName;
  row.appendChild(serverNameCell);

  if (!isMobileDisplay()) {
    const versionCell = document.createElement("td");
    const version = data.version.replace(/[^\d.]/g, ""); // Remove non-digit characters
    versionCell.classList.add("vp-text");
    versionCell.textContent = version;
    row.appendChild(versionCell);
  }

  const playerCountCell = document.createElement("td");
  playerCountCell.textContent = `${parseInt(data.players, 10)} / ${
    data.maxplayers
  }`;
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

  empyrionList.appendChild(row);
}

function addEmpyrion(serverId) {
  fetchEmpyrion(serverId);
}

const servers = [
  "merbl3AVzLYebKTSwJcRFSxegkhVLteuRm4", // Empyrion
];

servers.forEach((server) => addEmpyrion(server));

function isMobileDisplay() {
  return window.innerWidth < 576; // Define your desired breakpoint for mobile display
}
