import React from "react";
import "./BodySection.css";

const BodySection = () => {
  const cards = [
    {
      title: "Benefits",
      text: "Brings wealth, luxury, protection, and spiritual growth.",
      image: "/images/benefits.jpg",
      dark: true,
    },
    {
      title: "Quality and Size",
      text: "Superior quality, medium to large size, with well-defined mukhis.",
      image: "/images/quality.jpg",
      dark: false,
    },
    {
      title: "Certification",
      text: "Includes authenticity certification.",
      image: "/images/certification.jpg",
      dark: true,
    },
    {
      title: "X-Ray",
      text: "Verified with X-ray for authenticity.",
      image: "/images/xray.jpg",
      dark: false,
    },
    {
      title: "Who should wear",
      text: "For those seeking immense wealth, prosperity, and spiritual growth.",
      image: "/images/wear.jpg",
      dark: true,
    },
    {
      title: "Beej Mantra",
      text: 'The Beej Mantra for 21 Mukhi is “Om Hreem Hoom Shivmitraye Namah”.',
      image: "/images/mantra.jpg",
      dark: false,
    },
  ];

  return (
    <section className="body-section">
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`info-card ${card.dark ? "dark" : "light"}`}
          >
            <h3 className="card-title">{card.title}</h3>
            <div className="image-circle">
              <img src={card.image} alt={card.title} />
            </div>
            <p className="card-text">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BodySection;
