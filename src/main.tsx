import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter basename="/LARRY-TASKS"> {/* 👈 required for GitHub Pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        {/* etc. */}
      </Routes>
    </BrowserRouter>
  );
}
