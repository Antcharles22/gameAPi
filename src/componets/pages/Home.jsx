
import React from 'react';
import homestore from './stores/homestore';
import { Link } from 'react-router-dom';

export default function Home() {
  const store = homestore();
  React.useEffect(() => {
    store.fetchGames()
  }, []);
  
  return (
    <div>
      <h1>games</h1>
      <div>
        {store.games.map(game => {
          return (
            <div key={confirm.id}>
              <Link to={`/game/${game.id}`} key={game.id}>
                {game.name}
                <img src={game.background_image} alt={game.name} />
              </Link>
            </div>
          );
        })}
      </div>
      <p>Welcome to the home page!</p>
      <div>
        
      </div>
    </div>
  );
}
