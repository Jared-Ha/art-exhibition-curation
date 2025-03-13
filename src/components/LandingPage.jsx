import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroVideo from "../assets/hero-video.mp4";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
import searchIcon from "../assets/icons/search-icon.png";
import filterIcon from "../assets/icons/filter-icon.png";
import curateIcon from "../assets/icons/curate-icon.png";

function LandingPage() {
  const [showLearnMore, setShowLearnMore] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Background Video */}
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Landing Content */}
      <div className="landing-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>
            <span className="highlight-explore">Explore</span> artwork &
            <span className="highlight-curate"> Curate</span> online Exhibitions
          </h1>
          <h2>
            Discover masterpieces and antiques from world-renowned collections{" "}
            <br></br>
            and build your own online exhibitions
          </h2>
          <button className="cta-button" onClick={() => navigate("/explore")}>
            Explore Now
          </button>
        </div>

        {/* Introductory Text */}
        <div className="intro-text">
          <p>
            CurateFlow is a platform that lets you search for and explore
            artwork and antiquities, and curate and save your very own virtual
            exhibitions from various museum collections.
          </p>
          <p>
            Your curated exhibitions are stored in your browser for your
            convenience and are not sent to any server. (
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                setShowLearnMore(!showLearnMore);
              }}
            >
              Learn more
            </a>
            )
          </p>
        </div>

        {/* Value Proposition */}
        <div className="value-proposition">
          <h3>Key Features</h3>
          <div className="features-list">
            <div className="feature">
              <img
                src={searchIcon}
                alt="Search icon"
                className="feature-icon"
              />
              <p>
                <strong>Search Artworks:</strong> Easily browse collections from
                museums like the V&A and MET.
              </p>
            </div>
            <div className="feature">
              <img
                src={filterIcon}
                alt="Filter & Sort icon"
                className="feature-icon"
              />
              <p>
                <strong>Filter & Sort:</strong> Refine your results by category,
                date range, artist, or title.
              </p>
            </div>
            <div className="feature">
              <img
                src={curateIcon}
                alt="Curate icon"
                className="feature-icon"
              />
              <p>
                <strong>Curate Exhibitions:</strong> Save your favorite artworks
                into personal exhibitions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Learn More Modal */}
      {showLearnMore && (
        <div className="modal-overlay">
          <div className="modal learn-more">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowLearnMore(false);
              }}
              className="close-modal"
            >
              ✖
            </button>
            <p>
              This site uses your browser's local storage to save your curated
              exhibitions so that they remain available even after you close
              your browser. Note that if you clear your browser data or use a
              different device, your exhibitions will not be available.
              <br />
              <br />
              Rest assured, your data is never sent to any server—it is stored
              locally on your PC or laptop, keeping it completely private.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
