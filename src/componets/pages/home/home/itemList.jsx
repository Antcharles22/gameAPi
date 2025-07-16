
import React from "react";
import { Link } from "react-router-dom";

// Platform icon map
const platformIcons = {
  pc: "💻",
  playstation: "🎮",
  xbox: "🟩",
  nintendo: "🟥",
  mac: "🍎",
  linux: "🐧",
  ios: "📱",
  android: "🤖",
  web: "🌐",
};

export default function ItemList({ game }) {
  // Extract genre names
  const genreNames = game.genres
    ? game.genres.map(g => g.name).join(', ')
    : 'N/A';

  // Extract platform icons
  const platformIconsList = game.platforms
    ? game.platforms.map(p => {
        const slug = p.platform?.slug;
        const icon = platformIcons[slug] || "❓";
        return <span key={slug} title={p.platform?.name}>{icon}</span>;
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