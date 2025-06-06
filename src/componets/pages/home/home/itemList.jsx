

import React from "react";
import { Link } from "react-router-dom";

export default function ItemList({ game }) {
  return (
    <div className="item-list">
      <Link to={`/game/${game.id}`}>
        <img src={game.background_image} alt={game.name} />
        <h3>{game.name}</h3>
        <p>Rating: {game.rating}</p>
        <p>Released: {game.released}</p>
        <p>Genre: {game.genres ? game.genres.join(', ') : 'N/A'}</p>
        <p>Platforms: {game.platforms ? game.platforms.join(', ') : 'N/A'}</p>
      </Link>
    </div>
  );
}