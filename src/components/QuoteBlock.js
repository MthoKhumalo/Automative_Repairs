import React, { useState, useEffect } from "react";
import "../CSS/QuoteBlock.css";

const informationSections = [
  {
    title: "FixIT: Revolutionizing Vehicle Repair and Maintenance",
    content: "FixIT simplifies the process of finding reliable panel beaters and streamlining vehicle repair services. It addresses common challenges in locating trusted professionals for vehicle body part repairs and facilitates seamless communication.",
  },
  {
    title: "Search Nearby Panel Beaters",
    content: "Leverage location services to identify panel beaters within a 5km radius, ensuring quick and efficient access to nearby professionals.",
  },
  {
    title: "Filter by Car Body Part Type",
    content: "Refine your search based on specific body parts, such as a dented fender or cracked bumper, saving time and avoiding generic results.",
  },
  {
    title: "Request Quotations",
    content: "Submit intuitive forms to request detailed quotations from selected panel beaters, ensuring transparency in pricing and service expectations.",
  },
  {
    title: "Enable Direct Communication",
    content: "FixIT bridges the gap between users and panel beaters with built-in communication tools, ensuring smooth negotiations and updates.",
  },
  {
    title: "Our Mission",
    content: "FixIT aims to bring convenience, transparency, and trust to vehicle repairs, empowering users with better choices while supporting local businesses.",
  },
];

const QuoteBlock = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % informationSections.length);
    }, 5000); // Slide changes every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="information-block">
      {/* Bouncing balls (always visible and floating) */}
      <div className="bouncing-balls">
        <div className="ball ball-1"></div>
        <div className="ball ball-2"></div>
        <div className="ball ball-3"></div>
      </div>

      <div className="info-content fade">
        <h2>{informationSections[currentIndex].title}</h2>
        <p>{informationSections[currentIndex].content}</p>
      </div>
      <div className="info-indicators">
        {informationSections.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default QuoteBlock;
