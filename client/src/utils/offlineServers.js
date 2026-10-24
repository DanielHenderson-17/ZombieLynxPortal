// Permanent sunset roster. Keep this independent of server-listing APIs.
const serverNamesByGame = {
  "Ark:SE": [
    "TheIsland", "TheCenter", "Ragnarok", "ScorchedEarth",
    "Aberration", "Extinction", "Valguero", "Genesis1",
    "CrystalIsles", "Genesis2", "LostIsland", "Fjordur",
  ],
  // No individual ASA servers are configured in the archived API settings.
  "Ark:SA": ["ARK: Survival Ascended"],
  Eco: ["Eco"],
  Minecraft: ["Minecraft"],
  Empyrion: ["ZLG Empyrion"],
};

export const offlineServers = Object.fromEntries(
  Object.entries(serverNamesByGame).map(([game, names]) => [
    game,
    names.map((name) => ({
      serverName: name,
      name,
      isOnline: false,
      players: 0,
      version: "—",
    })),
  ])
);
