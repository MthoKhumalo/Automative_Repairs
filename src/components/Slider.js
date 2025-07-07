import React, { useState, useEffect } from "react";
import "../CSS/Slide.css";

const slides = [
  { image: "/images/body_paint.jpg" },
  { image: "/images/wheel.jpg" },
  { image: "/images/gear.jpg" },
  { image: "/images/engine_fix.jpg" },
  { image: "/images/front_bumper.jpg" },
  { image: "/images/exhaust.jpg" },
  { image: "/images/tail_lights.png" },
  { image: "/images/window.jpg" },
  { image: "/images/stock_body.jpg" },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 3) % slides.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, []);

  // Calculate the visible slides
  const visibleSlides = slides.slice(currentSlide, currentSlide + 3);

  return (
    <div className="slider">
      <div
        className="slider-wrapper"
        style={{
          transform: `translateX(-${(currentSlide / 3) * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div className="image-block" key={index}>
            <img src={slide.image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
