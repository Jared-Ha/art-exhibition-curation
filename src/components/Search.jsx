import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";

function Search() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const { performSearch } = useSearch();

  const handleChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!searchInput.trim()) return;
    performSearch(searchInput.trim());
    setSearchInput("");
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Search artworks, sculptures, or antiques..."
        value={searchInput}
        onChange={handleChange}
        className="search-input"
      />
      <button type="submit" className="search-button">
        🔍
      </button>
    </form>
  );
}

export default Search;
