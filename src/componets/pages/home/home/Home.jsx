import React from 'react';
import homestore from '../../stores/homestore';
import Carousel from './carousel';
import Nav from './Nav';
import ItemList from './itemList';
import TwitchStreams from './getStreamers';

export default function Home() {
  const store = homestore();

  React.useEffect(() => {
    store.fetchCarouselGames();      // Fetch games for the carousel on mount
    store.fetchSearchResults();      // Fetch initial search results (all games)
  }, []);

  return (
    <div className='home'>
      <div className='carousel'>
        <Carousel games={store.carouselGames} />
      </div>

      <div className='navbar'>
        <Nav />
      </div>

      <div className='search'>
        <h2>Search for Games</h2>
        <div className='search-bar'>
          <input //search bar *//
            type="text"
            placeholder="Search for games..."
            value={store.query}
            onChange={(e) => store.setQuery(e)}
          />
        </div>

        <div className='search-results'>
          {store.searchResults.map(game => (
            <ItemList key={game.id} game={game}/>
          ))}
        </div>
        <div>
          <TwitchStreams />
        </div>

      </div>
    </div>
  );
}

