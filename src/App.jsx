import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Search from "./components/Search";
import ObjectList from "./components/ObjectList";
import CategoryList from "./components/CategoryList";
import ExhibitionList from "./components/ExhibitionList";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Header />
      <Search setSearchTerm={setSearchTerm} />
      <Routes>
        <Route path="/" element={<ObjectList searchTerm={searchTerm} />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/my-exhibitions" element={<ExhibitionList />} />
      </Routes>
    </>
  );
}

export default App;
