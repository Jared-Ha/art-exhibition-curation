import React from "react";

function ExhibitionCard({ exhibition, onDelete, onView }) {
  return (
    <div className="object-card">
      <div className="exhibition-info">
        <h3 onClick={() => onView(exhibition.id)}>{exhibition.name}</h3>
        <p>({exhibition.objects.length} items)</p>
      </div>

      <div className="exhibition-thumbnails">
        {exhibition.objects.slice(0, 5).map((obj) => (
          <div
            key={obj.id}
            className="thumbnail-wrapper"
            onClick={() => onView(exhibition.id)}
          >
            <img
              src={obj.primaryImage || obj.image}
              alt={obj.title}
              className="exhibition-thumbnail"
            />
          </div>
        ))}
      </div>

      <div className="exhibition-actions">
        <button onClick={() => onView(exhibition.id)}>View Exhibition</button>
        <button
          className="delete-button"
          onClick={() => onDelete(exhibition.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ExhibitionCard;
