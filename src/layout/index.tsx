import { Outlet } from "react-router-dom";
import MainFooter from "./Footer";
import Header from "./Header";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <MainFooter />
    </>
  );
}
