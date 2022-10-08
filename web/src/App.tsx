import './App.css';
import { ListProducts } from "./pages/list-products";

import { Routes, Route } from "react-router-dom";
import { Signup } from './pages/signup';
import { Signin } from './pages/signin';
import { UserDashboard } from './pages/user-dashboard';
import { ListCartItems } from './pages/list-cart-items';
import { SucceededPayment } from './pages/payment-success';
import { NavBar } from './components/nav-bar';


function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/products" element={<ListProducts />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/user' element={<UserDashboard />} />
        <Route path='/cart' element={<ListCartItems />} />
        <Route path='/success' element={<SucceededPayment />} />
      </Routes>
    </>
  );
}

export default App;
