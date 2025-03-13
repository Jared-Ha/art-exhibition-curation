import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Search from "./components/Search";
import LandingPage from "./components/LandingPage";
import ObjectList from "./components/ObjectList";
import CategoryList from "./components/CategoryList";
import ExhibitionList from "./components/ExhibitionList";
import SingleObject from "./components/SingleObject";
import SingleExhibition from "./components/SingleExhibition";
import { SearchProvider } from "./context/SearchContext";

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/"; // Check if on Landing Page

  return (
    <div className={`app-background ${isLandingPage ? "no-bg" : ""}`}>
      <SearchProvider>
        <Header />
        <Search />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ObjectList />} />
          <Route path="/object/:id" element={<SingleObject />} />
          <Route path="/my-exhibitions" element={<ExhibitionList />} />
          <Route path="/exhibition/:id" element={<SingleExhibition />} />
          <Route path="/categories" element={<CategoryList />} />
        </Routes>
      </SearchProvider>
    </div>
  );
}

export default App;
