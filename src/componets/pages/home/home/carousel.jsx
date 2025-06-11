import React from 'react';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function Carousel({ games }) {
  // Slider settings for react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4.15,
    slidesToScroll: 1,
    swipeToSlide: true,
    draggable: true,
    accessibility: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className='carousel'>
      <h1>Top Rated Games</h1>
      <Slider {...settings} tabIndex={0}>
        {games.map((game) => (
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
    </div>
  );
}