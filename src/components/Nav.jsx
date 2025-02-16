import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <nav className="nav">
      <ul>
        <li>
          <NavLink to="/">Explore</NavLink>
        </li>
        <li>
          <NavLink to="/categories">Categories</NavLink>
        </li>
        <li>
          <NavLink to="/my-exhibitions">My Exhibitions</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
