
import React from 'react';
import homestore from '../stores/homestore';
import Carousel from './carousel';
import Nav from './Nav';

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
    </div>
     </>
  );
}
