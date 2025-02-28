import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Search from "./components/Search";
import ObjectList from "./components/ObjectList";
import CategoryList from "./components/CategoryList";
import ExhibitionList from "./components/ExhibitionList";
import SingleObject from "./components/SingleObject";
import SingleExhibition from "./components/SingleExhibition";
import { SearchProvider } from "./context/SearchContext"; // Import global provider

function App() {
  return (
    <SearchProvider>
      <Header />
      <Search />
      <Routes>
        <Route path="/" element={<ObjectList />} />
        <Route path="/object/:id" element={<SingleObject />} />
        <Route path="/my-exhibitions" element={<ExhibitionList />} />
        <Route path="/exhibition/:id" element={<SingleExhibition />} />
        <Route path="/categories" element={<CategoryList />} />
      </Routes>
    </SearchProvider>
  );
}

export default App;
