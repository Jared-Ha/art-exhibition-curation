import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getExhibitions, saveExhibitions } from "../utils/exhibitionStorage";

function SingleExhibition() {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);
  const [objectToRemove, setObjectToRemove] = useState(null);

  useEffect(() => {
    const exhibitions = getExhibitions();
    const foundExhibition = exhibitions.find((ex) => ex.id === id);
    setExhibition(foundExhibition || null);
  }, [id]);

  const handleRemoveObject = (objectId) => {
    if (!exhibition) return;

    const updatedExhibition = {
      ...exhibition,
      objects: exhibition.objects.filter((obj) => obj.id !== objectId),
    };

    const allExhibitions = getExhibitions().map((ex) =>
      ex.id === exhibition.id ? updatedExhibition : ex
    );

    saveExhibitions(allExhibitions);
    setExhibition(updatedExhibition);
    setObjectToRemove(null);
  };

  if (!exhibition) return <p>Exhibition not found.</p>;

  return (
    <section>
      <h2>{exhibition.name}</h2>
      <p>{exhibition.objects.length} items</p>

      <div className="exhibition-grid">
        {exhibition.objects.map((object) => (
          <div key={object.id} className="object-card">
            <img
              src={object.primaryImage || object.image}
              alt={object.title}
              width="150"
            />
            <h3>{object.title}</h3>
            <p>{object.artistDisplayName || "Unknown Artist"}</p>

            <button onClick={() => setObjectToRemove(object)}>Remove</button>
          </div>
        ))}
      </div>

      {objectToRemove && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Remove Object?</h3>
            <p>
              Are you sure you want to remove "{objectToRemove.title}" from "
              {exhibition.name}"?
            </p>
            <div className="modal-actions">
              <button onClick={() => handleRemoveObject(objectToRemove.id)}>
                Yes, Remove
              </button>
              <button onClick={() => setObjectToRemove(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SingleExhibition;
