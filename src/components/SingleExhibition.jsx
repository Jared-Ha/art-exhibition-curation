import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getExhibitions, saveExhibitions } from "../utils/exhibitionStorage";

function SingleExhibition() {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);
  const [objectToRemove, setObjectToRemove] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);

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
      {console.log("here", exhibition)}

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

            <div className="button-group">
              <button onClick={() => setSelectedObject(object)}>View</button>
              <button onClick={() => setObjectToRemove(object)}>Remove</button>
            </div>
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

      {selectedObject && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedObject.title}</h3>
            <p>
              <strong>Artist:</strong>{" "}
              {selectedObject.artistDisplayName || "Unknown Artist"}
            </p>
            <p>
              <strong>Year:</strong> {selectedObject.objectDate || "Unknown"}
            </p>
            <img
              src={selectedObject.primaryImage || selectedObject.image}
              alt={selectedObject.title}
              width="250"
            />
            <p>{selectedObject.description || "No description available."}</p>
            <div className="modal-actions">
              <button onClick={() => setSelectedObject(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SingleExhibition;
