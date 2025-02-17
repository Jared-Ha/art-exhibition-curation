import React from "react";

function ExhibitionCard({ exhibition, onDelete, onView }) {
  return (
    <div className="exhibition-card">
      <div className="exhibition-info">
        <h3>{exhibition.name}</h3>
        <p>({exhibition.objects.length} items)</p>
      </div>

      <div className="exhibition-thumbnails">
        {exhibition.objects.slice(0, 5).map((obj) => (
          <img
            key={obj.id}
            src={obj.primaryImage || obj.image}
            alt={obj.title}
            className="exhibition-thumbnail"
          />
        ))}
      </div>

      <div className="exhibition-actions">
        <button onClick={() => onView(exhibition.id)}>View Exhibition</button>
        <button onClick={() => onDelete(exhibition.id)}>
          Delete Exhibition
        </button>
      </div>
    </div>
  );
}

export default ExhibitionCard;
