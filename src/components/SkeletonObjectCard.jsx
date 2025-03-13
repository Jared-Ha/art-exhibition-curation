import React from "react";

function SkeletonObjectCard() {
  return (
    <div className="object-card skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-artist"></div>
      <div className="skeleton skeleton-date"></div>
    </div>
  );
}

export default SkeletonObjectCard;
