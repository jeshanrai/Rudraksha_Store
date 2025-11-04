import React from "react";
import "./FeaturesSection.css";
import {
  ShieldCheck,
  Globe,
  Users,
  Truck,
  BadgeCheck,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <ShieldCheck />,
      title: "SECURE PAYMENT",
      desc: "Encrypted & Safe Checkout",
    },
    {
      icon: <BadgeCheck />,
      title: "ISO 9001 COMPLIANT OPERATION",
      desc: "Certified. Verified. Trusted.",
    },
    {
      icon: <Users />,
      title: "CONSUMER-CENTRIC CARE",
      desc: "Designed with your well-being and transformation in mind.",
    },
    {
      icon: <Truck />,
      title: "SAFE AND SECURE WORLDWIDE SHIPPING",
      desc: "Encrypted & Safe Checkout",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        {features.map((item, index) => (
          <div className="feature-item" key={index}>
            <div className="icon-circle">{item.icon}</div>
            <h3 className="feature-title">{item.title}</h3>
            <p className="feature-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
