import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./NavbarStyles.css";

function NavBar() {
  return (
    <nav className="bg-blue-500 text-white flex items-center py-3 px-28 justify-between">
      <h1 className="text-xl font-bold">
        <Link to="/">Finance Analyzer</Link>
      </h1>
      <ul className="flex gap-x-9 font-semibold">
        <li className="hover:text-gray-300">
          <Link to="/TimedGraph">TimeGraph</Link>
        </li>
        <li className="hover:text-gray-300">
          <Link to="/NonTimed">Non-TimeGraph</Link>
        </li>
        <li className="hover:text-gray-300">
          <Link to="/RiskAnalysis">Risk Analysis</Link>
        </li>
        <li className="hover:text-gray-300">
          <Link to="/Others">Others</Link>
        </li>
      </ul>
      {/* <div className="container1233">
      <Navbar className="navbar-custom" expand="lg">
        <Navbar.Brand as={Link} to="/">
          Finance Analyzer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/TimedGraph">
              TimeGraph
            </Nav.Link>
            <Nav.Link as={Link} to="/NonTimed">
              Non-TimedGraph
            </Nav.Link>
            <Nav.Link as={Link} to="/RiskAnalysis">
              Risk Analysis
            </Nav.Link>
            <Nav.Link as={Link} to="/Others">
              Others
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div> */}
    </nav>
  );
}

export default NavBar;
