export async function fetchServerData(serverName) {
  const endpoints = {
    "Ark:SE": "/api/server/ark-se",
    "Ark:SA": "/api/server/ark-sa",
    Eco: "/api/server/eco",
    Minecraft: "/api/server/minecraft",
    Empyrion: "/api/server/empyrion",
  };

  const endpoint = endpoints[serverName];
  if (!endpoint) {
    console.error(`No endpoint defined for server: ${serverName}`);
    return [];
  }

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch server data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching data for ${serverName}:`, error);
    return [];
  }
}
