import * as React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Films from "./pages/films/Films";

const App = () => {
  return (
    <div className="App">
      <h1>Welcome to React Router!</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="films" element={<Films />} />
      </Routes>
    </div>
  );
}

export default App;
