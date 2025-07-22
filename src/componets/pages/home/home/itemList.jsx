
import React from "react";
import { Link } from "react-router-dom";
import { FaWindows , FaPlaystation , FaXbox, FaAndroid, FaLinux } from "react-icons/fa";
import { NintendoSwitchIcon, Iso, MacOs } from "../../svg";



// ...existing imports...

const platformIcons = {
  pc: <FaWindows />,
  playstation: <FaPlaystation />,
  xbox: <FaXbox />,
  "nintendo-switch": <NintendoSwitchIcon />,
  macos: <MacOs style={{ color: "#fff" }} />,
  linux: <FaLinux />,
  ios: <Iso style={{ color: "#fff" }} />,
  android: <FaAndroid />,
  web: "🌐",
};
function getPlatformFamilies(platforms) {
  const families = new Set();
  platforms.forEach(p => {
    const slug = p.platform?.slug;
    if (slug?.includes("playstation") || slug === "ps-vita") {
      families.add("playstation");
    } else if (slug?.includes("xbox")) {
      families.add("xbox");
    } else {
      families.add(slug);
    }
  });
  return Array.from(families);
}


// FIX: Use getPlatformFamilies in your ItemList component
export default function ItemList({ game }) {
  const genreNames = game.genres
    ? game.genres.map(g => g.name).join(', ')
    : 'N/A';

  const platformIconsList = game.platforms
    ? getPlatformFamilies(game.platforms).map((slug, idx) => {
        const icon = platformIcons[slug] || "❓";
        return <span
          key={slug}
          title={slug}
           style={{ padding: "0 2px", display: "inline-block", verticalAlign: "middle" }}
        >

          {icon}
          </span>;
      })
    : 'N/A';

  return (
    <div className="item-list">
      <Link to={`/game/${game.id}`}>
        <h3>{game.name}</h3>
        <img src={game.background_image} alt={game.name} />
        <p>Rating: {game.rating}</p>
        <p>Released: {game.released}</p>
        <p>Genre: {genreNames}</p>
        <p>Platforms: {platformIconsList}</p>
      </Link>
    </div>
  );
}