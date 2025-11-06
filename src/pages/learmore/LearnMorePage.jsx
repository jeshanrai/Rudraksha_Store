import React, { useEffect, useState } from 'react';
import './LearnMorePage.css';
const LearnMorePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div>
      <div className="learnmoreBody">
      <div className={`learn-more-container ${isVisible ? 'fade-in' : ''}`}>
    <header
      className="page-header"
      style={{ backgroundImage: "url('/images/learnmore0.png')" }}
    >
      <div className="overlay"></div>
      <div className="header-content">
        <h1>Understanding Rudraksha</h1>
        <p className="subtitle">Ancient Sacred Beads with Divine Energy</p>
      </div>
    </header>




        {/* Section 1: What is Rudraksha */}
        <section className="section glass-effect">
          <h2 className="section-title-learn">What is Rudraksha?</h2>
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
          <h2 className="section-title-learn">How to Count Mukhis (Faces)</h2>
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
          <h2 className="section-title-learn">Origin of Rudraksha</h2>
          <div className="origin-grid">
            <div className="origin-card">
              <div className="image-placeholder small-image">
                <img 
                  src="/images/20mukhi.png" 
                  alt="Nepal Himalayan forest"
                />
              </div>
              <h3>Nepal</h3>
              <p>Most powerful, rare, deeper lines, high energy</p>
             
            </div>

            <div className="origin-card">
              <div className="image-placeholder small-image">
                <img 
                  src="/images/indo.png" 
                  alt="Indonesian tropical forest"
                />
              </div>
              <h3>Indonesia</h3>
              <p>Small size, smooth surface, affordable, comfortable</p>
            </div>

            <div className="origin-card">
              <div className="image-placeholder small-image">
                <img 
                  src="/images/india.png" 
                  alt="Indian forest landscape"
                />
              </div>
              <h3>India</h3>
              <p>Limited production, mostly for malas</p>
            </div>
          </div>
          <p className="highlight-text">Nepali Rudraksha carries the highest vibration, radiating purity, protection, and inner awakening.</p>

        </section>


        <section className="section origin-section glass-effect">
  <h2 className="section-title-learn">Origin of Our Rudraksha</h2>

  <div className="content-wrapper reverse-layout">
   <div className="text-content">
  <p className="origin-desc">
    Our Rudraksha beads come from the sacred
    <span className="highlight"> Arun Valley region of Eastern Nepal</span>
    one of the deepest, purest, and most spiritually awakened valleys on earth.
    Surrounded by untouched Himalayan forests, flowing crystalclear rivers,
    and naturally magnetic soil, the Arun region produces Rudraksha with
    exceptional vibration, clarity, and authenticity.
  </p>

  <p className="origin-desc">
    Every bead is nurtured in a high-energy environment where the air is fresh,
    the altitude is ideal, and the trees grow in complete natural harmony.
    This unique geography allows the Rudraksha to develop strong mukhi lines,
    balanced density, and powerful spiritual resonance, making them highly
    cherished by seekers, meditators, and energy practitioners worldwide.
  </p>

  <ul className="origin-benefits">
    <li>Handpicked from naturally grown, decades-old Rudraksha trees</li>
    <li>Zero chemical polishing—100% natural surface and energy</li>
    <li>Sorted, graded, and cleaned by experienced Himalayan farmers</li>
    <li>Ethically sourced with complete transparency and purity</li>
    <li>High-vibration beads known for stability, protection, and spiritual clarity</li>
    <li>Direct farm-to-user deliveryensuring untouched authenticity</li>
  </ul>
</div>


    <div className="video-container">
      <div className="video-wrapper">
   <video
  className="origin-video"
  src="/video/91f34ab1-3c92-4689-8ab1-5bc2bad19c4f.mp4"
  preload="metadata"
  poster="/images/arun-poster.jpg"
  loop
  autoPlay
  muted
  playsInline
></video>


      </div>
    </div>
  </div>
</section>

        {/* Section 5: Identifying Genuine Rudraksha */}
        <section className="section glass-effect">
          <h2 className="section-title-learn">Identifying a Genuine Rudraksha</h2>
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
                  src="/images/fakereal.png" 
                  alt="Genuine vs fake Rudraksha comparison"
                />
              </div>
              
            </div>
          </div>
        </section>



        {/* Footer */}
        <footer className="page-footer">
          <p>© 2025 Rudraksha Knowledge Center. All rights reserved.</p>
        </footer>
      </div>
    </div>
    </div>
  );
};

export default LearnMorePage;