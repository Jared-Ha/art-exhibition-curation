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

    const effectiveTerm = term;
    setSearchTerm(effectiveTerm);
    setObjectType(type);
    setObjects([]);
    setLoading(true);
    setSearchAttempted(true);

    Promise.all([
      getVAObjects(effectiveTerm, type, dateBegin, dateEnd),
      getMetObjects(effectiveTerm, type, dateBegin, dateEnd),
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
