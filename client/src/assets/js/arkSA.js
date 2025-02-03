const FETCHDATATIMEOUT = 3 * 60 * 1000; // 3 minutes

function fetchArk(arkId) {
  fetch(
    `https://ark-servers.net/api/?object=servers&element=detail&key=${arkId}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data:", data);
      data.players = ensurePlayersBetweenOneAndFive(data.players);
      printArkSA(arkId, data);
    })
    .catch((error) => console.error("Error fetching data:", error));
  setTimeout(() => fetchArk(arkId), FETCHDATATIMEOUT);
}

function ensurePlayersBetweenOneAndFive(players) {
  const currentPlayers = parseInt(players, 10) || 0;
  if (currentPlayers === 0) {
    // If no players online, set a random number between 1 and 5
    return Math.floor(Math.random() * 5) + 1;
  }
  return currentPlayers;
}

function printArkSA(arkId, data) {
  console.log("Print Ark function called.");

  const arkSAList = document.querySelector("#arkSAList");
  console.log("arkSAList:", arkSAList);

  const existingRow = document.getElementById(`ark-${arkId}`);
  if (existingRow) {
    arkSAList.removeChild(existingRow);
  }

  const row = document.createElement("tr");
  row.id = `ark-${arkId}`;
  console.log("Row:", row);

  const statusCell = document.createElement("td");
  statusCell.classList.add("text-center");
  const onlineDot = document.createElement("img");

  if (data.is_online == "1") {
    onlineDot.src = "./assets/images/online.png"; // Display online.png for online servers
    onlineDot.alt = "Online";
  } else {
    onlineDot.src = "./assets/images/offline.png"; // Display offline.png for offline servers
    onlineDot.alt = "Offline";
  }
  onlineDot.classList.add("shadow-lg");
  statusCell.appendChild(onlineDot);
  row.appendChild(statusCell);

  const serverNameCell = document.createElement("td");
  serverNameCell.classList.add("text-start", "ps-4", "server-name");

  // Display data.map on mobile and data.name on desktop
  if (window.innerWidth < 768) {
    serverNameCell.textContent = data.map;
  } else {
    serverNameCell.textContent = data.name;
  }
  row.appendChild(serverNameCell);

  const versionCell = document.createElement("td");
  versionCell.classList.add("vp-text");
  versionCell.textContent = data.version;

  // Hide Version column on mobile
  if (window.innerWidth >= 768) {
    row.appendChild(versionCell);
  }

  const playerCountCell = document.createElement("td");
  playerCountCell.classList.add("vp-text");
  playerCountCell.textContent = `${data.players} / ${data.maxplayers}`;
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
  voteButton.classList.add(
    "vp-text",
    "shadow",
    "mx-auto",
    "d-flex",
    "justify-content-center"
  );
  voteCell.appendChild(voteButton);
  row.appendChild(voteCell);

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
    window.location.href = `https://zlg.gg/discord`;
  });
  joinButton.classList.add("vp-text", "shadow");
  connectCell.appendChild(joinButton);

  // Hide Connect column on mobile
  if (window.innerWidth >= 768) {
    row.appendChild(connectCell);
  }

  arkSAList.appendChild(row);
}

function addArk(arkId) {
  fetchArk(arkId);
}

const arkSA = [
  "HIjl7hbXWAcf74ypA0MW878KJMagFNtnLF", // TheIsland
  "QYH8VpRofkbyOzwelMiMRbrzlSMchZEeO4K", // TheCenter
  "sSaD4BxOkI94kKcGJF8n0IiZEy6Vbl3EwC", // ScorchedEarth
  "M1DLUX8A8EOchDfVOYR3pXma18JgTSll28R", // Aberration
];

arkSA.forEach((ark) => addArk(ark));

console.log("Ark SA script loaded.");
