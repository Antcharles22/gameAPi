
import React from "react";
import { Link } from "react-router-dom";
import { FaWindows , FaPlaystation , FaXbox, } from "react-icons/fa";



// Platform icon map
const platformIcons = {
  pc: <FaWindows />,
  playstation5: <FaPlaystation />,
  "xbox-series-x": <FaXbox />,
  "nintendo-switch": "N",
  macos: "🍎", 
  linux: "🐧",
  ios: "📱", // Use an emoji for iOS
  android: "🤖",
  web: "🌐",
};

export default function ItemList({ game }) {
  // Extract genre names
   console.log(game.platforms?.map(p => p.platform?.slug));
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