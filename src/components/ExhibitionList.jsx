import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getExhibitions,
  saveExhibitions,
  deleteExhibition,
} from "../utils/exhibitionStorage";
import ExhibitionCard from "./ExhibitionCard";

function ExhibitionList() {
  const [exhibitions, setExhibitions] = useState([]);
  const [newExhibitionName, setNewExhibitionName] = useState("");
  const [exhibitionToDelete, setExhibitionToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setExhibitions(getExhibitions());
  }, []);

  const handleCreateExhibition = () => {
    if (!newExhibitionName.trim()) return;

    const newExhibition = {
      id: `exhibition-${Date.now()}`,
      name: newExhibitionName,
      objects: [],
    };

    const updatedExhibitions = [...exhibitions, newExhibition];
    saveExhibitions(updatedExhibitions);
    setExhibitions(updatedExhibitions);
    setNewExhibitionName("");
  };

  const handleDeleteExhibition = (exhibitionId) => {
    deleteExhibition(exhibitionId);
    setExhibitions(getExhibitions());
    setExhibitionToDelete(null); // Close the modal
  };

  const handleViewExhibition = (exhibitionId) => {
    navigate(`/exhibition/${exhibitionId}`);
  };

  return (
    <section>
      <h2>Your Curated Exhibitions</h2>

      <div>
        <input
          type="text"
          value={newExhibitionName}
          onChange={(e) => setNewExhibitionName(e.target.value)}
          placeholder="Enter exhibition name"
        />
        <button onClick={handleCreateExhibition}>Create Exhibition</button>
      </div>

      {exhibitions.length === 0 ? (
        <p>No exhibitions yet. Start adding artworks!</p>
      ) : (
        <div className="exhibition-grid">
          {exhibitions.map((exhibition) => (
            <ExhibitionCard
              key={exhibition.id}
              exhibition={exhibition}
              onDelete={() => setExhibitionToDelete(exhibition)}
              onView={() => handleViewExhibition(exhibition.id)}
            />
          ))}
        </div>
      )}

      {exhibitionToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Exhibition?</h3>
            <p>Are you sure you want to delete "{exhibitionToDelete.name}"?</p>
            <div className="modal-actions">
              <button
                className="delete-confirm-btn"
                onClick={() => handleDeleteExhibition(exhibitionToDelete.id)}
              >
                Yes, Delete
              </button>
              <button
                className="cancel-button"
                onClick={() => setExhibitionToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ExhibitionList;
