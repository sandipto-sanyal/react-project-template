import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `mr-4 px-3 py-1 rounded transition-colors ${
    isActive
      ? "bg-white text-blue-600 font-semibold underline underline-offset-4"
      : "text-gray-700 hover:bg-white/60"
  }`;

export default function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-[#eee]">
        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
        <NavLink to="/about" className={navLinkClass}>About</NavLink>
        <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );

}