import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getExhibitions, saveExhibitions } from "../utils/exhibitionStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

function SingleExhibition() {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);
  const [objectToRemove, setObjectToRemove] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [removalMessage, setRemovalMessage] = useState("");
  const autoCloseTimerRef = useRef(null);

  useEffect(() => {
    const exhibitions = getExhibitions();
    const foundExhibition = exhibitions.find((ex) => ex.id === id);
    setExhibition(foundExhibition || null);
  }, [id]);

  const clearAutoCloseTimer = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  };

  const handleRemoveObject = (objectId) => {
    if (!exhibition) return;

    const removedObject = exhibition.objects.find((obj) => obj.id === objectId);

    const updatedExhibition = {
      ...exhibition,
      objects: exhibition.objects.filter((obj) => obj.id !== objectId),
    };

    const allExhibitions = getExhibitions().map((ex) =>
      ex.id === exhibition.id ? updatedExhibition : ex
    );

    saveExhibitions(allExhibitions);
    setExhibition(updatedExhibition);

    setRemovalMessage(
      `Successfully removed "${removedObject.title}" from "${exhibition.name}"`
    );

    // close the modal after 3 seconds.
    autoCloseTimerRef.current = setTimeout(() => {
      setObjectToRemove(null);
      setRemovalMessage("");
      autoCloseTimerRef.current = null;
    }, 3000);
  };

  const closeModal = () => {
    clearAutoCloseTimer();
    setObjectToRemove(null);
    setRemovalMessage("");
  };

  if (!exhibition) return <p>Exhibition not found.</p>;

  return (
    <section>
      <h2>{exhibition.name}</h2>
      <p>{exhibition.objects.length} items</p>

      <div className="exhibition-grid">
        {exhibition.objects.map((object) => (
          <div key={object.id} className="object-card">
            <div
              className="clickable-image"
              onClick={() => setSelectedObject(object)}
            >
              <img
                src={object.primaryImage || object.image}
                alt={object.title}
                width="150"
              />
            </div>
            <h3>{object.title}</h3>
            <p>
              {object.artistDisplayName ||
                object.record?.artistMakerPerson[0]?.name?.text ||
                "Unknown Artist"}
            </p>
            <div className="button-group">
              <button onClick={() => setSelectedObject(object)}>View</button>
              <button
                className="delete-button"
                onClick={() => setObjectToRemove(object)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Remove Object Modal */}
      {/* Removal Confirmation Banner */}
      {removalMessage && (
        <div className="remove-item-confirmation success">
          <h3>{removalMessage}</h3>
          <button className="close-modal" onClick={closeModal}>
            ✖
          </button>
        </div>
      )}

      {/* Remove Object Modal (only if no removal message is showing) */}
      {objectToRemove && !removalMessage && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Remove Object?</h3>
            <p>
              Are you sure you want to remove "{objectToRemove.title}" from "
              {exhibition.name}"?
            </p>
            <div className="modal-actions">
              <button
                className="delete-confirm-btn"
                onClick={() => handleRemoveObject(objectToRemove.id)}
              >
                Yes, Remove
              </button>
              <button className="cancel-button" onClick={closeModal}>
                Cancel
              </button>
            </div>
            <button className="close-modal" onClick={closeModal}>
              ✖
            </button>
          </div>
        </div>
      )}

      {/* View Object Modal */}
      {selectedObject && (
        <div className="modal-overlay">
          <div className="modal view-exhibition-object">
            <button
              className="close-modal"
              onClick={() => setSelectedObject(null)}
            >
              ✖
            </button>
            <h3>{selectedObject.title || "Untitled"}</h3>
            <img
              src={selectedObject.primaryImage || selectedObject.image}
              alt={selectedObject.title}
              width="250"
            />
            <p>
              <strong>Artist:</strong>{" "}
              {selectedObject.artistDisplayName ||
                selectedObject.record?.artistMakerPerson?.[0]?.name?.text ||
                "Unknown"}
            </p>
            <p>
              <strong>Artist Bio:</strong>{" "}
              {selectedObject.artistDisplayBio || "No bio available"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {selectedObject.objectDate ||
                selectedObject.record?.productionDates?.[0]?.date?.text ||
                "Unknown"}
            </p>
            <p>
              <strong>Medium:</strong>{" "}
              {selectedObject.medium ||
                selectedObject.record?.materialsAndTechniques ||
                "Not specified"}{" "}
            </p>
            <p>
              <strong>Dimensions:</strong>{" "}
              {selectedObject.dimensions ||
                (selectedObject.record?.dimensions &&
                  selectedObject.record.dimensions
                    .map((d) => `${d.dimension}: ${d.value} ${d.unit}`)
                    .join(", ")) ||
                "Not specified"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedObject.description ||
                selectedObject.physicalDescription ||
                selectedObject.briefDescription ||
                "No description available."}
            </p>
            {selectedObject.objectURL && (
              <p>
                <a
                  href={selectedObject.objectURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  View on Museum Site{" "}
                  <FontAwesomeIcon icon={faUpRightFromSquare} />
                </a>
              </p>
            )}
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setSelectedObject(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SingleExhibition;
