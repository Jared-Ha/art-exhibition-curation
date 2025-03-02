import React from "react";
import { useSearch } from "../context/SearchContext";
import { objectTypes } from "./ObjectList";
import { useNavigate } from "react-router-dom";

function CategoryList() {
  const { performSearch } = useSearch();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryValue) => {
    performSearch("", categoryValue, "", "");
    navigate("/");
  };

  return (
    <div className="category-list">
      {objectTypes
        .filter((cat) => cat.value !== "")
        .map((cat) => (
          <div
            key={cat.value}
            className="category-card"
            onClick={() => handleCategoryClick(cat.value)}
          >
            <h3>{cat.label}</h3>
          </div>
        ))}
    </div>
  );
}

export default CategoryList;
