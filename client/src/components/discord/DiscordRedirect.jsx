import { useEffect } from "react";

export default function DiscordRedirect() {
  useEffect(() => {
    window.location.href = "https://discord.gg/FrWtShumut";
  }, []);

  return <p>Redirecting to Discord...</p>;
}
