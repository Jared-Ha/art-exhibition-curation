import { createContext, useContext, useState } from "react";
import { getVAObjects, getMetObjects } from "../api";

const SearchContext = createContext();

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const performSearch = async (term) => {
    if (!term || term === searchTerm) return;

    setSearchTerm(term);
    setLoading(true);
    setSearchAttempted(true);

    try {
      const [vaResults, metResults] = await Promise.all([
        getVAObjects(term),
        getMetObjects(term),
      ]);
      setObjects([...vaResults, ...metResults]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider
      value={{ searchTerm, objects, loading, searchAttempted, performSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}
