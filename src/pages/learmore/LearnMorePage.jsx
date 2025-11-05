import React, { useEffect, useState } from 'react';
import './LearnMorePage.css';
const LearnMorePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>

      <div className={`learn-more-container ${isVisible ? 'fade-in' : ''}`}>
        {/* Header */}
       <header className="page-header">
  <div className="overlay"></div>

  <div className="header-content">
    <h1>Understanding Rudraksha</h1>
    <p className="subtitle">Ancient Sacred Beads with Divine Energy</p>
  </div>
</header>


        {/* Section 1: What is Rudraksha */}
        <section className="section glass-effect">
          <h2 className="section-title">What is Rudraksha?</h2>
          <div className="content-wrapper">
            <div className="text-content">
              <p>
                Rudraksha is a sacred seed that comes from the Elaeocarpus ganitrus tree.
                It is considered holy in Hinduism and is believed to carry strong spiritual, emotional, and healing energies.
                Each bead naturally forms lines called "Mukhi" that determine its type and benefits.
              </p>
            </div>
            <div className="image-container banner-image">
              <div className="image-placeholder">
                <img 
                  src="/images/asli-aur-nakli-rudraksha-ki-pehchan-kaise-kare2-1709721967.jpg" 
                  alt="Sacred Rudraksha bead close-up"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: How to Count Mukhis */}
        <section className="section glass-effect">
          <h2 className="section-title">How to Count Mukhis (Faces)</h2>
          <div className="content-grid">
            <div className="text-content">
              <ul className="mukhi-list">
                <li>Every Rudraksha has natural vertical lines running from the top to the bottom.</li>
                <li>These lines are called <strong>Mukhis</strong> or <strong>Faces</strong>.</li>
                <li>
                  <strong>How to count:</strong>
                  <ul className="sub-list">
                    <li>Look for natural deep grooves</li>
                    <li>Count each line once</li>
                    <li>Don't count scratches</li>
                    <li>Use magnifying light for small beads</li>
                  </ul>
                </li>
                <li>Example: 1 line = 1 Mukhi, 5 lines = 5 Mukhi, etc.</li>
                <li>A true Mukhi line never breaks in the middle.</li>
              </ul>
            </div>
            <div className="side-image">
              <div className="image-placeholder">
                <img 
                  src="/images/learnmore2.png" 
                  alt="Macro view of Rudraksha mukhi lines"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Origin of Rudraksha */}
        <section className="section glass-effect">
          <h2 className="section-title">Origin of Rudraksha</h2>
          <div className="origin-grid">
            <div className="origin-card">
              <div className="image-placeholder small-image">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" 
                  alt="Nepal Himalayan forest"
                />
              </div>
              <h3>Nepal</h3>
              <p>Most powerful, rare, deeper lines, high energy</p>
              <p className="image-prompt small">
                <strong>Prompt:</strong> "Himalayan forest with Rudraksha trees, morning light, mystical atmosphere."
              </p>
            </div>

            <div className="origin-card">
              <div className="image-placeholder small-image">
                <img 
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80" 
                  alt="Indonesian tropical forest"
                />
              </div>
              <h3>Indonesia</h3>
              <p>Small size, smooth surface, affordable, comfortable</p>
              <p className="image-prompt small">
                <strong>Prompt:</strong> "Tropical Indonesian forest with Rudraksha tree imagery, soft ambient light."
              </p>
            </div>

            <div className="origin-card">
              <div className="image-placeholder small-image">
                <img 
                  src="https://images.unsplash.com/photo-1563630423918-b58f07336ac1?w=400&q=80" 
                  alt="Indian forest landscape"
                />
              </div>
              <h3>India</h3>
              <p>Limited production, mostly for malas</p>
              <p className="image-prompt small">
                <strong>Prompt:</strong> "Rudraksha tree representation in Meghalaya/Haridwar forest style, natural warm colors."
              </p>
            </div>
          </div>
          <p className="highlight-text">Nepali Rudraksha is the most energetic.</p>
        </section>

        {/* Section 4: Identifying Genuine Rudraksha */}
        <section className="section glass-effect">
          <h2 className="section-title">Identifying a Genuine Rudraksha</h2>
          <div className="content-wrapper">
            <div className="text-content">
              <ul className="authenticity-list">
                <li>Natural Mukhi lines (continuous)</li>
                <li>X-ray test (chambers match mukhi count)</li>
                <li>Water test is not always accurate</li>
                <li>No seam or joint (fake ones are carved/glued)</li>
                <li>Texture & weight feel natural</li>
              </ul>
            </div>
            <div className="image-container">
              <div className="image-placeholder">
                <img 
                  src="/images/learnmore0.png" 
                  alt="Genuine vs fake Rudraksha comparison"
                />
              </div>
              <p className="image-prompt">
                <strong>Image Prompt:</strong> "Real vs fake Rudraksha comparison, natural texture vs carved lines, clean neutral background."
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="page-footer">
          <p>© 2025 Rudraksha Knowledge Center. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default LearnMorePage;