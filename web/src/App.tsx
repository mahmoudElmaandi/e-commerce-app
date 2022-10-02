import './App.css';
import { ListProducts } from "./pages/list-products";

import { Routes, Route, Link } from "react-router-dom";
import { Signup } from './pages/signup';
import { Signin } from './pages/signin';
import { UserDashboard } from './pages/user-dashboard';


function App() {
  return (
    <>
      <Routes>
        <Route path="/products" element={<ListProducts />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/user' element={<UserDashboard />} />
      </Routes>
    </>
  );
}

export default App;
