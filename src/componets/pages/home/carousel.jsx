import React from 'react';
import homestore from '../stores/homestore';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


export default function Home() {
    const store = homestore();
    React.useEffect(() => {
      store.fetchGames()
    }, []);

    // Slider settings for react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Number of slides visible at once
    slidesToScroll: 1, // Number of slides to scroll at a time
    responsive: [
      {
        breakpoint: 768, // For smaller screens
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
    
    return (
            <div className='carousel'>
              <h1>Top Rated Games</h1>
        
              <Slider {...settings}>
                {store.games.map((game) => (
                  <div key={game.id}>
                    <Link to={`/game/${game.id}`}>
                      <h3>{game.name}</h3>
                      <img
                        src={game.background_image}
                        alt={game.name}
                      />
                    </Link>
                  </div>
                ))}
              </Slider>
              <p>Welcome to the home page!</p>
            </div>
    )
  }