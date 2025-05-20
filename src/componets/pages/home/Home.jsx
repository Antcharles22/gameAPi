
import React from 'react';
import homestore from '../stores/homestore';
import { Link } from 'react-router-dom';
import Carousel from './carousel';

export default function Home() {
  const store = homestore();
  React.useEffect(() => {
    store.fetchGames()
  }, []);
  
  return (
    <div>
      <Carousel />
    </div>
  );
}
