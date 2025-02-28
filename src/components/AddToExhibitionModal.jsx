import React from "react";

function AddToExhibitionModal({
  show,
  onClose,
  newExhibitionName,
  setNewExhibitionName,
  selectedExhibition,
  setSelectedExhibition,
  exhibitions,
  onSave,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-modal" onClick={onClose}>
          ✖
        </button>
        <h3>Add to Exhibition</h3>
        <label>
          Create new exhibition:
          <input
            type="text"
            value={newExhibitionName}
            onChange={(e) => setNewExhibitionName(e.target.value)}
          />
        </label>
        <label>
          Or select existing:
          <select
            value={selectedExhibition}
            onChange={(e) => setSelectedExhibition(e.target.value)}
          >
            <option value="">-- Select Exhibition --</option>
            {exhibitions.map((exhibition) => (
              <option key={exhibition.id} value={exhibition.name}>
                {exhibition.name} ({exhibition.objects.length} items)
              </option>
            ))}
          </select>
        </label>
        <div className="modal-actions">
          <button className="save-button" onClick={onSave}>
            Save
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddToExhibitionModal;
