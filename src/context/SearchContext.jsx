import { createContext, useContext, useState, useEffect } from "react";
import { getVAObjects, getMetObjects } from "../api";

const SearchContext = createContext();

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [objectType, setObjectType] = useState("");
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const performSearch = (term, type = "", dateBegin, dateEnd) => {
    if (!term && !type && dateBegin == null && dateEnd == null) return;

    // If type is an empty string, use the existing objectType value from state.
    // Otherwise, use the passed type.
    const effectiveTerm = term;
    const effectiveType = type !== "" ? type : objectType;
    setSearchTerm(effectiveTerm);
    setObjectType(effectiveType);
    setObjects([]);
    setLoading(true);
    setSearchAttempted(true);
    console.log("here", effectiveTerm, effectiveType, dateBegin, dateEnd);

    Promise.all([
      getVAObjects(effectiveTerm, effectiveType, dateBegin, dateEnd),
      getMetObjects(effectiveTerm, effectiveType, dateBegin, dateEnd),
    ])
      .then(([vaResults, metResults]) => {
        setObjects([...vaResults, ...metResults]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log("Search objects:", objects);
  }, [objects]);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        objectType,
        objects,
        loading,
        searchAttempted,
        performSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
