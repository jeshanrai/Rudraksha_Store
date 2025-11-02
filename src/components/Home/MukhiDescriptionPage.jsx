import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./MukhiDescriptionPage.css";

const mukhiData = [
  {
    mukhi: 2,
    name: "2 Mukhi Rudraksha",
    description: `
The 2 Mukhi Rudraksha symbolizes the sacred union of Lord Shiva and Goddess Parvati, representing harmony, love, and togetherness. 
It brings peace to relationships and balances the emotional and logical aspects of the mind. Ideal for those seeking partnership stability and inner harmony.`,
    image: "/rudraksha_image/2mukhi.png",
  },
  {
    mukhi: 3,
    name: "3 Mukhi Rudraksha",
    description: `
The 3 Mukhi Rudraksha embodies Lord Agni (Fire). It purifies past karmas and transforms negativity into strength. 
It brings courage, confidence, and self-expression. Ideal for those seeking freedom from guilt or emotional burdens.`,
    image: "/rudraksha_image/3mukhi.png",
  },
  {
    mukhi: 4,
    name: "4 Mukhi Rudraksha",
    description: `
Representing Lord Brahma, the 4 Mukhi Rudraksha enhances creativity, intelligence, and communication. 
It sharpens memory and helps in gaining knowledge. Perfect for students, teachers, and those in creative professions.`,
    image: "/rudraksha_image/4mukhi.png",
  },
  {
    mukhi: 5,
    name: "5 Mukhi Rudraksha",
    description: `
The 5 Mukhi Rudraksha represents Lord Kalagni Rudra. It promotes spiritual growth and inner peace. 
It balances the mind, regulates blood pressure, and instills calmness. The most common Rudraksha for meditation and well-being.`,
    image: "/rudraksha_image/5mukhi.png",
  },
  {
    mukhi: 6,
    name: "6 Mukhi Rudraksha",
    description: `
Blessed by Lord Kartikeya, the 6 Mukhi Rudraksha enhances focus, courage, and emotional balance. 
It removes laziness and boosts willpower — ideal for leaders, students, and professionals.`,
    image: "/rudraksha_image/6mukhi.png",
  },
  {
    mukhi: 7,
    name: "7 Mukhi Rudraksha",
    description: `
The 7 Mukhi Rudraksha is ruled by Goddess Mahalaxmi, bringing wealth, success, and abundance. 
It removes financial worries and fills life with positivity and prosperity.`,
    image: "/rudraksha_image/7mukhi.png",
  },
  {
    mukhi: 8,
    name: "8 Mukhi Rudraksha",
    description: `
Ruled by Lord Ganesha, the 8 Mukhi Rudraksha removes obstacles and grants wisdom. 
It brings success in work and helps overcome challenges with clarity and intelligence.`,
    image: "/rudraksha_image/8mukhi.png",
  },
  {
    mukhi: 9,
    name: "9 Mukhi Rudraksha",
    description: `
The 9 Mukhi Rudraksha represents Goddess Durga. It empowers the wearer with energy, courage, and protection from negativity. 
It’s ideal for spiritual seekers and those facing constant obstacles.`,
    image: "/rudraksha_image/9mukhi.png",
  },
  {
    mukhi: 10,
    name: "10 Mukhi Rudraksha",
    description: `
Blessed by Lord Vishnu, the 10 Mukhi Rudraksha provides protection from negative energies and evil influences. 
It brings peace of mind, balance, and divine grace.`,
    image: "/rudraksha_image/10mukhi.png",
  },
  {
    mukhi: 11,
    name: "11 Mukhi Rudraksha",
    description: `
Representing Lord Hanuman, this bead symbolizes strength, intelligence, and devotion. 
It removes fear, enhances willpower, and is excellent for meditation and discipline.`,
    image: "/rudraksha_image/11mukhi.png",
  },
  {
    mukhi: 12,
    name: "12 Mukhi Rudraksha",
    description: `
The 12 Mukhi Rudraksha is ruled by the Sun (Surya). 
It gives vitality, leadership, and confidence. Perfect for those in authority or public life.`,
    image: "/rudraksha_image/12mukhi.png",
  },
  {
    mukhi: 13,
    name: "13 Mukhi Rudraksha",
    description: `
Blessed by Lord Indra and Kamadeva, this Rudraksha enhances charm, success, and material prosperity. 
It boosts attraction and confidence in relationships and social life.`,
    image: "/rudraksha_image/13mukhi.png",
  },
  {
    mukhi: 14,
    name: "14 Mukhi Rudraksha",
    description: `
Known as Deva Mani, the 14 Mukhi Rudraksha connects the wearer to Lord Hanuman and Lord Shiva. 
It enhances intuition, courage, and decision-making while removing fears.`,
    image: "/rudraksha_image/14mukhi.png",
  },
  {
    mukhi: 15,
    name: "15 Mukhi Rudraksha",
    description: `
The 15 Mukhi Rudraksha brings unconditional love, emotional healing, and abundance. 
It aligns the heart chakra, promotes compassion, and enhances emotional strength.`,
    image: "/rudraksha_image/15mukhi.png",
  },
  {
    mukhi: 16,
    name: "16 Mukhi Rudraksha",
    description: `
Ruled by Lord Rama, it offers protection from fear, enemies, and negativity. 
It strengthens determination and is beneficial in legal or personal conflicts.`,
    image: "/rudraksha_image/16mukhi.png",
  },
  {
    mukhi: 17,
    name: "17 Mukhi Rudraksha",
    description: `
Ruled by Goddess Katyayani, this Rudraksha grants success, wealth, and fulfillment of desires. 
It’s a symbol of luxury and spiritual wisdom combined.`,
    image: "/rudraksha_image/17mukhi.png",
  },
  {
    mukhi: 18,
    name: "18 Mukhi Rudraksha",
    description: `
Blessed by Bhoomi Devi (Mother Earth), it offers stability, prosperity, and grounding energy. 
It connects the wearer to abundance and confidence.`,
    image: "/rudraksha_image/18mukhi.png",
  },
  {
    mukhi: 19,
    name: "19 Mukhi Rudraksha",
    description: `
Ruled by Lord Vishnu, it brings wealth, success, and peace. 
It fulfills desires and promotes growth in career and spirituality.`,
    image: "/rudraksha_image/19mukhi.png",
  },
  {
    mukhi: 20,
    name: "20 Mukhi Rudraksha",
    description: `
Representing Lord Brahma, this Rudraksha sharpens intellect, creativity, and insight. 
Ideal for spiritual aspirants, researchers, and artists.`,
    image: "/rudraksha_image/20mukhi.png",
  },
  {
    mukhi: 21,
    name: "21 Mukhi Rudraksha",
    description: `
The rarest of all, the 21 Mukhi Rudraksha represents Lord Kubera — the God of wealth. 
It brings immense prosperity, spiritual awakening, and divine blessings.`,
    image: "/rudraksha_image/21mukhi.png",
  },
];

const MukhiDescriptionPage = () => {
  const { mukhiId } = useParams();
  const navigate = useNavigate();
  const mukhi = mukhiData.find((m) => m.mukhi === Number(mukhiId));

  if (!mukhi) {
    return (
      <div className="mukhi-description not-found">
        <h1>Mukhi Not Found</h1>
        <button className="back-btn" onClick={() => navigate("/mukhi")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mukhi-page">
      <aside className="mukhi-sidebar glass">
  <div className="sidebar-header">
    <button className="back-btn" onClick={() => navigate("/")}>
      ← Back to Shop
    </button>
    <h3 className="sidebar-title">All Mukhis</h3>
  </div>

  <ul className="mukhi-list">
    {mukhiData.map((item) => (
      <li key={item.mukhi}>
        <Link
          to={`/mukhi/${item.mukhi}`}
          className={`mukhi-link ${
            Number(mukhiId) === item.mukhi ? "active" : ""
          }`}
        >
          {item.mukhi} Mukhi
        </Link>
      </li>
    ))}
  </ul>
</aside>


      {/* Main content */}
      <main className="mukhi-content fade-in">
        <div className="mukhi-card-detail">
          <h1 className="mukhi-heading gradient-text">{mukhi.name}</h1>
          <div className="mukhi-detail-grid">
            <img
              src={mukhi.image}
              alt={mukhi.name}
              className="mukhi-detail-img glow"
            />
            <div className="mukhi-info">
              <p className="mukhi-description-text">{mukhi.description}</p>
              <button
  className="view-product-btn"
  onClick={() => navigate(`/products?mukhi=${mukhi.mukhi}`)}
>
  🔮 View Product
</button>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MukhiDescriptionPage;
