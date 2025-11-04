import React from "react";
import "./BodySection.css";

const BodySection = () => {
  const cards = [
    {
      title: "Benefits",
      text: "Brings wealth, luxury, protection, and spiritual growth.",
      image: "/rudraksha_image/benefits.png",
      dark: true,
    },
    {
      title: "Quality and Size",
      text: "Superior quality, medium to large size, with well-defined mukhis.",
      image: "/rudraksha_image/collection.png",
      dark: false,
    },
    {
      title: "Certification",
      text: "Includes authenticity certification.",
      image: "/rudraksha_image/certification.png",
      dark: true,
    },
    {
      title: "X-Ray",
      text: "Verified with X-ray for authenticity.",
      image: "/rudraksha_image/xray.png",
      dark: false,
    },
    {
      title: "Who should wear",
      text: "For those seeking immense wealth, prosperity, and spiritual growth.",
      image: "/rudraksha_image/trustimage.png",
      dark: true,
    },
    {
      title: "Beej Mantra",
      text: 'The Beej Mantra for 21 Mukhi is “Om Hreem Hoom Shivmitraye Namah”.',
      image: "/rudraksha_image/mantra.png",
      dark: false,
    },
  ];

  return (
    <section className="body-section">
      <div className="cards-grid">
        {cards.map((card, index) => {
          const isCenter = index === 1 || index === 4; // top + bottom center

          return (
            <div
              key={index}
              className={`info-card ${card.dark ? "dark" : "light"} ${
                isCenter ? "tall-card" : ""
              }`}
            >
              {/* ✅ Full background image */}
              <div
                className="card-image"
                style={{ backgroundImage: `url(${card.image})` }}
              ></div>

              {/* ✅ Overlay content */}
              <div className="card-overlay">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-text">{card.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BodySection;
