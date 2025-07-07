import React from "react";
import "../CSS/Features.css";

const features = [
  { image: "/images/map.png", title: "Search Nearby", description: "Find panel beaters within 5km." },
  { image: "/images/filter.png", title: "Filter by Part", description: "Get results tailored to your needs." },
  { image: "/images/request.png", title: "Request Quotations", description: "Receive transparent pricing." },
  { image: "/images/chat.png", title: "Communicate Directly", description: "Stay connected with professionals." },
];

const Features = () => {
  return (
    <section className="features" id="features">
      {features.map((feature, index) => (
        <div key={index} className="feature-block">
          <img src={feature.image} alt={feature.title} />
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </section>
  );
};

export default Features;