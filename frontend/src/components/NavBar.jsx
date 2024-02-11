import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./NavbarStyles.css";

function NavBar() {
  return (
    <div className="navbar bg-primary text-white  ">
      <div className="flex-1 mx-20">
        <h1 className="text-xl font-bold">
          <Link to="/">Finance Analyzer</Link>
        </h1>
      </div>
      <div className="flex-none mx-20">
        <ul className="menu menu-horizontal px-1">
          <li className="text-lg">
            <Link to="/TimedGraph">TimeGraph</Link>
          </li>
          <li className="text-lg">
            <Link to="/NonTimed">Non-TimeGraph</Link>
          </li>
          <li className="text-lg">
            <Link to="/RiskAnalysis">Risk Analysis</Link>
          </li>
          <li className="text-lg">
            <Link to="/Others">Others</Link>
          </li>
        </ul>
      </div>

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
    </div>
  );
}

export default NavBar;
