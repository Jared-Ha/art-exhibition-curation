import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <nav class="nav">
      <ul>
        <li>
          <NavLink to="/" activeClassName="active">
            Explore
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories" activeClassName="active">
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-exhibitions" activeClassName="active">
            My Exhibitions
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
