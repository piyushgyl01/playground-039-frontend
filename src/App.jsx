import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Post from "./pages/Post";
import Update from "./pages/Update";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/details/:id" element={<Details/>} />
        <Route path="/post" element={<Post/>} />
        <Route path="/update/:id" element={<Update/>} />
      </Routes>
    </Router>
  );
}
