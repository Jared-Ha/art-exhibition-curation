import React, { useState } from "react";

function LandingPage() {
  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <div className="landing-page">
      <h1>Welcome to CurateFlow</h1>
      <p>
        CurateFlow is a platform that lets you explore, search, and curate
        virtual exhibitions from various museum collections.
      </p>
      <p>
        To get started, simply use the navigation above to search artworks or
        view your curated exhibitions.
      </p>
      <p>
        Your curated exhibitions are stored in your browser for your convenience
        and are not sent to any server. (
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
      {showLearnMore && (
        <div class="modal-overlay">
          <div class="modal view-exhibition-object learn-more">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowLearnMore(!showLearnMore);
              }}
              class="close-modal"
            >
              ✖
            </button>

            <p>
              This site uses your browser's local storage to save your curated
              exhibitions so that they remain available even after you close
              your browser. Note that if you clear your browser data or use a
              different device, your exhibitions will not be available.
              <br></br> <br></br>
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
