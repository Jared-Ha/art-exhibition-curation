import { useState, useEffect } from "react";
import { getVAObjects, getMetObjects } from "../api";
import { getExhibitions, addToExhibition } from "../utils/exhibitionStorage";
import ObjectCard from "./ObjectCard";

function ObjectList({ searchTerm }) {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    setExhibitions(getExhibitions());
  }, []);

  useEffect(() => {
    if (!searchTerm) return;

    setLoading(true);
    setSearchAttempted(true);

    Promise.all([getVAObjects(searchTerm), getMetObjects(searchTerm)])
      .then(([vaResults, metResults]) =>
        setObjects([...vaResults, ...metResults])
      )
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const handleAddToExhibition = (exhibitionName, object) => {
    addToExhibition(exhibitionName, object);
    setExhibitions(getExhibitions());
  };

  return (
    <div>
      <h2>Search Results</h2>
      {searchTerm && (
        <p>
          Showing results for: <strong>{searchTerm}</strong>
        </p>
      )}
      {loading && <p>Loading...</p>}
      {!loading && searchAttempted && objects.length === 0 && (
        <p>No results found</p>
      )}
      <ul className="object-grid">
        {objects.length > 0 &&
          objects.map((obj, index) => (
            <ObjectCard
              key={index}
              object={obj}
              exhibitions={exhibitions}
              onAddToExhibition={handleAddToExhibition}
            />
          ))}
      </ul>
    </div>
  );
}

export default ObjectList;
