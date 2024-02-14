import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./NavbarStyles.css";

function NavBar() {
  return (
    <nav class="bg-sky-950 p-3">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold text-white">
          <a href="/">Finance Analyzer</a>
        </h1>
        <ul class="flex space-x-8">
          <li>
            <a href="/TimedGraph" class="text-white hover:text-sky-900 text-lg">
              TimeGraph
            </a>
          </li>
          <li>
            <a href="/NonTimed" class="text-white hover:text-gray-200 text-lg">
              Non-TimeGraph
            </a>
          </li>
          <li>
            <a
              href="/RiskAnalysis"
              class="text-white hover:text-gray-200 text-lg"
            >
              Risk Analysis
            </a>
          </li>
          <li>
            <a href="/Others" class="text-white hover:text-gray-200 text-lg">
              Others
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
