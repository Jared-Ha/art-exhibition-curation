import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";
import { getExhibitions, addToExhibition } from "../utils/exhibitionStorage";
import ObjectCard from "./ObjectCard";
import { getSortDate } from "../utils/getSortDate";

const RESULTS_PER_PAGE = 10;

function ObjectList() {
  const { searchTerm, objects, loading, searchAttempted } = useSearch();
  const [exhibitions, setExhibitions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting criteria: only "date" for now
  const [sortCriteria, setSortCriteria] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    setExhibitions(getExhibitions());
  }, []);

  const sortedObjects = [...objects].sort((a, b) => {
    if (sortCriteria === "date") {
      const dateA = getSortDate(a);
      const dateB = getSortDate(b);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortCriteria === "artist") {
      const artistA = (
        a.artistDisplayName ||
        a.record?.artistMakerPerson?.[0].name?.text ||
        a.culture ||
        "Unknown"
      ).toLowerCase();
      const artistB = (
        b.artistDisplayName ||
        b.record?.artistMakerPerson?.[0].name?.text ||
        b.culture ||
        "Unknown"
      ).toLowerCase();
      return sortOrder === "asc"
        ? artistA.localeCompare(artistB)
        : artistB.localeCompare(artistA);
    } else if (sortCriteria === "title") {
      const titleA = (
        a.record?.titles?.[0]?.title ||
        a.title ||
        "Untitled"
      ).toLowerCase();
      const titleB = (
        b.record?.titles?.[0]?.title ||
        b.title ||
        "Untitled"
      ).toLowerCase();
      return sortOrder === "asc"
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    }
    return 0;
  });

  // Calculate the items to display on the current page.
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const currentObjects = sortedObjects.slice(startIndex, endIndex);

  const totalPages = Math.ceil(objects.length / RESULTS_PER_PAGE);
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

  const handleAddToExhibition = (exhibitionName, object) => {
    const result = addToExhibition(exhibitionName, object);
    setExhibitions(getExhibitions());
    return result;
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

      {/* Sorting controls */}
      <div className="sorting-controls">
        <label htmlFor="sortCriteria">Sort by: </label>
        <select
          id="sortCriteria"
          value={sortCriteria}
          onChange={(e) => {
            setSortCriteria(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="date">Date</option>
          <option value="artist">Artist / Culture</option>
          <option value="title">Title</option>
        </select>

        <label htmlFor="sortOrder"> Order: </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

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
