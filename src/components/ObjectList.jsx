import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";
import { getExhibitions, addToExhibition } from "../utils/exhibitionStorage";
import ObjectCard from "./ObjectCard";
import { getSortDate } from "../utils/getSortDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const RESULTS_PER_PAGE = 10;

export const objectTypes = [
  { label: "All", value: "" },
  { label: "Paintings", value: "painting" },
  { label: "Sculptures", value: "sculpture" },
  { label: "Ceramics", value: "ceramic" },
  { label: "Drawings", value: "drawing" },
  { label: "Prints", value: "print" },
  { label: "Reliefs", value: "relief" },
  { label: "Manuscripts", value: "manuscript" },
  { label: "Mosaics", value: "mosaic" },
  { label: "Artifacts", value: "artifact" },
  { label: "Antiquities", value: "antiquities" },
  { label: "Textiles", value: "textile" },
];

const formatObjectType = (type) => {
  if (!type) return "";
  let formatted = type.charAt(0).toUpperCase() + type.slice(1);
  if (!formatted.endsWith("s")) formatted += "s";
  return formatted;
};

function ObjectList() {
  const {
    searchTerm,
    objectType,
    objects,
    loading,
    searchAttempted,
    performSearch,
  } = useSearch();
  const [exhibitions, setExhibitions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  // useEffect(() => {
  //   setCurrentPage(1);
  //   const effectiveYearFrom = yearFrom ? yearFrom : undefined;
  //   const effectiveYearTo = yearTo ? yearTo : undefined;
  //   performSearch(searchTerm, objectType, effectiveYearFrom, effectiveYearTo);
  // }, [searchTerm, objectType, yearFrom, yearTo]);

  useEffect(() => {
    setExhibitions(getExhibitions());
  }, [objectType]);

  let headerMessage;
  if (searchTerm && objectType) {
    headerMessage = `"${searchTerm}" in ${formatObjectType(objectType)}`;
  } else if (searchTerm) {
    headerMessage = `"${searchTerm}"`;
  } else if (objectType) {
    headerMessage = formatObjectType(objectType);
  } else {
    headerMessage = "all";
  }

  const sortedObjects = [...objects].sort((a, b) => {
    if (sortCriteria === "date") {
      const dateA = getSortDate(a);
      const dateB = getSortDate(b);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortCriteria === "artist") {
      const artistA = (
        a.artistDisplayName ||
        a.record?.artistMakerPerson?.[0]?.name?.text ||
        a.culture ||
        "Unknown"
      ).toLowerCase();
      const artistB = (
        b.artistDisplayName ||
        b.record?.artistMakerPerson?.[0]?.name?.text ||
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

  const applyDateFilter = () => {
    // const effectiveYearFrom = yearFrom ? yearFrom : -500000;
    // const effectiveYearTo = yearTo ? yearTo : 2100;
    performSearch(searchTerm, objectType, yearFrom, yearTo);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Container for all controls */}
      <div className="controls-container">
        {/* Row that holds sorting and filtering side by side */}
        <div className="sort-filter-row">
          {/* Category filter */}
          <div className="filter-controls">
            <label htmlFor="objectType">Category:</label>
            <select
              id="objectType"
              value={objectType}
              onChange={(e) => {
                setCurrentPage(1);
                performSearch(searchTerm, e.target.value, yearFrom, yearTo);
              }}
            >
              {objectTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date filter */}
          <div className="filter-controls">
            <div className="date-field">
              <label htmlFor="yearFrom">Year from:</label>
              <input
                type="number"
                id="yearFrom"
                value={yearFrom}
                onChange={(e) => {
                  setYearFrom(e.target.value);
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyDateFilter();
                }}
              />
            </div>
            <div className="date-field">
              <label htmlFor="yearTo">To:</label>
              <input
                type="number"
                id="yearTo"
                value={yearTo}
                onChange={(e) => {
                  setYearTo(e.target.value);
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyDateFilter();
                }}
              />
            </div>
            <button onClick={applyDateFilter}>Apply</button>
          </div>
          {/* Sorting controls */}
          <div className="sorting-controls">
            <label htmlFor="sortCriteria">Sort by:</label>
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

            <button
              className="order-toggle"
              onClick={() => {
                const newOrder = sortOrder === "asc" ? "desc" : "asc";
                setSortOrder(newOrder);
                setCurrentPage(1);
              }}
            >
              {sortOrder === "asc" ? "↑ asc" : "↓ desc"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading / results info */}
      {loading ? (
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faSpinner} spin size="5x" />
        </div>
      ) : searchTerm || objectType ? (
        <>
          <p>
            Showing results {startResult}-{endResult} for:{" "}
            <strong>{headerMessage}</strong>
          </p>
          <p>Total results: {objects.length}</p>
        </>
      ) : null}

      {!loading && searchAttempted && objects.length === 0 && (
        <p>No results found</p>
      )}

      {/* Render the object cards */}
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

      {/* Pagination */}
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
