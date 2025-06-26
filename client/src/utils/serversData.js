import arkThumb from "../assets/server/ark-thumb.webp";
import arkMain from "../assets/server/ark-main.webp";
import arkSAThumb from "../assets/server/arkSA-thumb.webp";
import arkSAMain from "../assets/server/arkSA-main.webp";
import ecoThumb from "../assets/server/eco-thumb.webp";
import ecoMain from "../assets/server/eco-main.webp";
import minecraftThumb from "../assets/server/minecraft-thumb.webp";
import minecraftMain from "../assets/server/minecraft-main.webp";
import empyrionThumb from "../assets/server/empyrion-thumb.webp";
import empyrionMain from "../assets/server/empyrion-main.webp";

export const servers = [
  {
    id: 1,
    title: "ARK: SURVIVAL EVOLVED",
    thumbImg: arkThumb,
    mainImg: arkMain,
    category: "MMO Survival",
    description:
      "We host 12 cross Ark servers that feature vote rewards, login points, and weekly events.",
  },
  {
    id: 2,
    title: "ARK: SURVIVAL ASCENDED",
    thumbImg: arkSAThumb,
    mainImg: arkSAMain,
    category: "MMO Survival",
    description:
      "Ark: Survival Evolved remastered on Unreal Engine 5. Benefits include vote rewards and an in-game shop.",
  },
  {
    id: 3,
    title: "ECO: GLOBAL SURVIVAL",
    thumbImg: ecoThumb,
    mainImg: ecoMain,
    category: "Sandbox Simulation",
    description:
      "Eco is a sandbox simulation game where you work together to prevent a meteor from destroying the planet.",
  },
  {
    id: 4,
    title: "MINECRAFT: JAVA EDITION",
    thumbImg: minecraftThumb,
    mainImg: minecraftMain,
    category: "Sandbox",
    description:
      "We host Survival, Creative, BedWars, Parkour, and many other servers. Earn points and vote rewards, with an in-game shop.",
  },
  {
    id: 5,
    title: "EMPYRION: GALACTIC SURVIVAL",
    thumbImg: empyrionThumb,
    mainImg: empyrionMain,
    category: "Space Survival",
    description:
      "Empyrion is our longest-running server with a loyal player base. Explore the infinite universe of Reforged Eden.",
  },
];
