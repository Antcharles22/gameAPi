import React from "react";
import { Link } from "react-router-dom";

export default function ItemList({ game }) {
  // Safely extract genre names
  const genreNames = game.genres
    ? game.genres.map(g => g.name).join(', ')
    : 'N/A';

  // Safely extract platform names
  const platformNames = game.platforms
    ? game.platforms.map(p => p.platform?.name || '').join(', ')
    : 'N/A';

  return (
    <div className="item-list">
      <Link to={`/game/${game.id}`}>
        <h3>{game.name}</h3>
        <img src={game.background_image} alt={game.name} />
        <p>Rating: {game.rating}</p>
        <p>Released: {game.released}</p>
        <p>Genre: {genreNames}</p>
        <p>Platforms: {platformNames}</p>
      </Link>
    </div>
  );
}