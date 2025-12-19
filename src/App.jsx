import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";


function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        dispatch(login(user));
      } else {
        dispatch(logout());
      }
      setLoading(false);
    };
    loadUser();
  }, [dispatch]);

  if (loading) return null;

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
