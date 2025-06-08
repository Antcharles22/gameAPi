
import React from 'react';
import homestore from '../../stores/homestore';
import Carousel from './carousel';
import Nav from './Nav';
import ItemList from './itemList';

export default function Home() {
  const store = homestore();
  React.useEffect(() => {
    store.fetchGames()
  }, []);
  
  return (
    <>
    <div className='home'>
      <div className='carousel'>
      <Carousel />
      </div>
      <div className='navbar'>
        <Nav />
      </div>

      <div className='search'>
        <h2>Search for Games</h2>
        <div className='search-bar'>
          <input
            type="text"
            placeholder="Search for games..."
            value={store.query}
            onChange={(e) => store.setQuery(e.target.value)}
          />
         </div>
          <div className='search-results'>
            {store.games.map(game => (
            <ItemList key={game.id} game={game}/>
            ))}
            </div>
          
        </div>
    </div>
     </>
  );
}
