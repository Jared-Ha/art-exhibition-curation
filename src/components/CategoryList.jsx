import React from "react";
import { useSearch } from "../context/SearchContext";
import { objectTypes } from "./ObjectList";
import { useNavigate } from "react-router-dom";
import paintingIcon from "../assets/category-icons/painting.webp";
import sculptureIcon from "../assets/category-icons/sculpture.webp";
import ceramicsIcon from "../assets/category-icons/ceramic.webp";
import drawingIcon from "../assets/category-icons/drawing.jpg";
import printsIcon from "../assets/category-icons/print.jpg";
import reliefIcon from "../assets/category-icons/relief.jpg";
import manuscriptIcon from "../assets/category-icons/manuscript.jpg";
import mosaicIcon from "../assets/category-icons/mosaic.jpg";
import textileIcon from "../assets/category-icons/textile.jpg";
import placeholderImage from "../assets/placeholder-image.jpg";

const categoryIcons = {
  painting: paintingIcon,
  sculpture: sculptureIcon,
  ceramic: ceramicsIcon,
  drawing: drawingIcon,
  print: printsIcon,
  relief: reliefIcon,
  manuscript: manuscriptIcon,
  mosaic: mosaicIcon,
  textile: textileIcon,
};

function CategoryList() {
  const { performSearch } = useSearch();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryValue) => {
    performSearch("", categoryValue, "", "");
    navigate("/explore");
  };

  return (
    <div className="category-list page">
      {objectTypes
        .filter((cat) => cat.value !== "")
        .map((cat) => {
          const iconSrc = categoryIcons[cat.value] || placeholderImage;

          return (
            <div
              key={cat.value}
              className="category-card"
              onClick={() => handleCategoryClick(cat.value)}
            >
              <img
                src={iconSrc}
                alt={`${cat.label} icon`}
                className="category-icon"
              />
              <h3>{cat.label}</h3>
            </div>
          );
        })}
    </div>
  );
}

export default CategoryList;
