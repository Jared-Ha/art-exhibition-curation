import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";  Import global search state
import { getExhibitions, addToExhibition } from "../utils/exhibitionStorage";
import ObjectCard from "./ObjectCard";

function ObjectList() {
  const { searchTerm, objects, loading, searchAttempted } = useSearch(); 
  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    setExhibitions(getExhibitions());
  }, []);

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
