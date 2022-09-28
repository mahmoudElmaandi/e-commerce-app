import './App.css';
import { ListProducts } from "./pages/list-products";

import { Routes, Route, Link } from "react-router-dom";


function App() {
  return (
    <>
      <Routes>
        <Route path="/products" element={<ListProducts />} />
      </Routes>
    </>
  );
}

export default App;
