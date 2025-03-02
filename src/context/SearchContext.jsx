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

  const performSearch = (term, type = "") => {
    if (!term && !type) return;
    if (term === searchTerm && type === objectType) return;

    setSearchTerm(term);
    setObjectType(type);
    setLoading(true);
    setSearchAttempted(true);

    Promise.all([getVAObjects(term, type), getMetObjects(term, type)])
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
