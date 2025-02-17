import { useState, useEffect } from "react";
import { getExhibitions, saveExhibitions } from "../utils/exhibitionStorage";

function ExhibitionList() {
  const [exhibitions, setExhibitions] = useState([]);
  const [newExhibitionName, setNewExhibitionName] = useState("");

  useEffect(() => {
    const storedExhibitions = getExhibitions();
    setExhibitions(storedExhibitions);
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
        <ul>
          {exhibitions.map((exhibition) => (
            <li key={exhibition.id}>
              <strong>{exhibition.name}</strong> ({exhibition.objects.length}{" "}
              items)
              <ul>
                {exhibition.objects.map((obj) => (
                  <li key={obj.id}>
                    <img src={obj.image} alt={obj.title} width="50" />
                    {obj.title} - {obj.artist}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ExhibitionList;
