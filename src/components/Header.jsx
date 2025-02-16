import { Link } from "react-router-dom";
import Nav from "./Nav"; // Import Nav
import logo from "../assets/curateFlow-logo.jpg"; // Import Logo

function Header() {
  return (
    <header className="header">
      <div className="logo-title">
        <Link to="/" className="logo-container">
          <img src={logo} alt="CurateFlow Logo" className="logo" />
        </Link>
        <h1>CurateFlow</h1>
      </div>
      <Nav />
    </header>
  );
}

export default Header;
