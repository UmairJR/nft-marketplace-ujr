import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CardUI from './Card';

const CardCarouselUI = ({ items }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className='w-3/4 m-auto mt-20'>
      <Slider {...settings}>
        {items.map((item, idx) => (
          <div key={idx} className="outline-none focus:outline-none">
            <CardUI item={item} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CardCarouselUI;