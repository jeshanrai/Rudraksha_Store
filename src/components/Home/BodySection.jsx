import React, { useRef, useEffect } from "react";
import "./BodySection.css";
import { motion, useAnimation, useInView } from "framer-motion";

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

  // ✅ Detect Section Visibility
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("center");
    }
  }, [inView, controls]);

  // ✅ Animation Variants
  const cardVariants = {
    center: {
      opacity: 0,
      scale: 0.6,
      x: 0,
      y: 0,
    },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="body-section" ref={sectionRef}>
      <div className="cards-grid">
        {cards.map((card, index) => {
          const isCenter = index === 1 || index === 4;

          return (
           <motion.div
  key={index}
  custom={index}
  className={`info-card ${card.dark ? "dark" : "light"} ${
    isCenter ? "tall-card" : ""
  }`}
  variants={cardVariants}
  initial="center"
  animate={controls}
  whileHover={{ y: -6 }}   
  transition={{ type: "spring", stiffness: 120 }}
>

              <div
                className="card-image"
                style={{ backgroundImage: `url(${card.image})` }}
              ></div>

              <div className="card-overlay">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-text">{card.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default BodySection;
