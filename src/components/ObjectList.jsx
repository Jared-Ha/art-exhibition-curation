import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";
import { getExhibitions, addToExhibition } from "../utils/exhibitionStorage";
import ObjectCard from "./ObjectCard";

const RESULTS_PER_PAGE = 10;

function ObjectList() {
  const { searchTerm, objects, loading, searchAttempted } = useSearch();
  const [exhibitions, setExhibitions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setExhibitions(getExhibitions());
  }, []);

  const handleAddToExhibition = (exhibitionName, object) => {
    const result = addToExhibition(exhibitionName, object);
    setExhibitions(getExhibitions());
    return result;
  };

  // Calculate the items to display on the current page
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const currentObjects = objects.slice(startIndex, endIndex);

  // Determine total pages
  const totalPages = Math.ceil(objects.length / RESULTS_PER_PAGE);

  // Calculate result numbers for display
  const startResult = objects.length > 0 ? startIndex + 1 : 0;
  const endResult = Math.min(currentPage * RESULTS_PER_PAGE, objects.length);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div>
      <h2>Search Results</h2>
      {loading && searchTerm && (
        <p>
          <strong>"{searchTerm}"</strong> results loading...
        </p>
      )}
      {!loading && searchTerm && (
        <>
          <p>
            Showing results {startResult}-{endResult} for:{" "}
            <strong>{searchTerm}</strong>
          </p>
          <p>Total results: {objects.length}</p>
        </>
      )}
      {loading && <p></p>}
      {!loading && searchAttempted && objects.length === 0 && (
        <p>No results found</p>
      )}

      <ul className="object-grid">
        {currentObjects.map((obj, index) => (
          <ObjectCard
            key={index}
            object={obj}
            exhibitions={exhibitions}
            onAddToExhibition={handleAddToExhibition}
          />
        ))}
      </ul>

      {objects.length > RESULTS_PER_PAGE && (
        <div className="pagination">
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ObjectList;
