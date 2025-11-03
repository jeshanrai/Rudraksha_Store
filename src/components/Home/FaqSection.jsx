import React, { useState } from "react";
import "./FaqSection.css";

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is Rudraksha?",
      answer:
        "Rudraksha is a sacred seed from the tree Elaeocarpus ganitrus, mainly found in the Himalayan region of Nepal. The word 'Rudraksha' means 'the eye of Lord Shiva.' It is believed that Rudraksha originated from the tears of Lord Shiva after deep meditation. People use it for meditation, prayer, and spiritual practices for thousands of years.",
    },
    {
      question: "Who can wear Rudraksha?",
      answer:
        "Anyone can wear Rudraksha regardless of age, gender, or religion. It is meant for those who seek peace, protection, good health, and spiritual growth.",
    },
    {
      question: "Why do people wear Rudraksha?",
      answer:
        "Rudraksha is worn to balance the mind and body, enhance focus, attract positive energy, and reduce stress. It is also said to provide spiritual upliftment and protection from negative energies.",
    },
    {
      question: "How should I wear Rudraksha?",
      answer:
        "Rudraksha should be worn after proper energization and chanting of the Beej Mantra. It can be worn as a mala or bracelet and should be kept clean and sacred. Avoid wearing it while sleeping or during impure activities.",
    },
    {
      question: "How to find whether Rudraksha is fake or original?",
      answer:
        "A genuine Rudraksha can be verified through an X-ray or water test. Real Rudraksha beads have natural partitions (mukhis) and should not be glued or artificially joined. Always buy from a trusted certified source.",
    },
    {
      question: "Can I wear multiple Rudraksha beads?",
      answer:
        "Yes, you can wear multiple Rudrakshas together. In fact, combining different mukhis (faces) enhances their spiritual and energetic effects.",
    },
    {
      question: "Does Rudraksha cure diseases?",
      answer:
        "Rudraksha is known to have positive effects on the nervous and cardiovascular systems. While it is not a medical cure, it supports mental balance, calmness, and stress relief, which indirectly promote overall well-being.",
    },
    {
      question: "Can Rudraksha help me concentrate better?",
      answer:
        "Yes, many wearers report improved focus, clarity, and emotional stability. It helps calm the mind, making meditation and study more effective.",
    },
    {
      question: "Can I give Rudraksha as a gift?",
      answer:
        "Yes, gifting Rudraksha is considered highly auspicious. It symbolizes blessings of peace, health, and prosperity for the recipient.",
    },
    {
      question:
        "Do you ship worldwide and what is shipping time? And where are you located?",
      answer:
        "Yes, we offer worldwide shipping. Orders are usually processed within 24–48 hours, and delivery time depends on your location. We are based in Nepal, the natural origin of authentic Rudraksha beads.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-image">
          <img src="/images/rudraksha-hand.jpg" alt="Rudraksha beads" />
        </div>
        <div className="faq-content">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </div>

                <div
                  className={`faq-answer-wrapper ${
                    activeIndex === index ? "open" : ""
                  }`}
                >
                  <div className="faq-answer">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
