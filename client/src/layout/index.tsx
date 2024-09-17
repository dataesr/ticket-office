import { Outlet } from "react-router-dom";
import MainFooter from "./footer";
import Header from "./header";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <MainFooter />
    </>
  );
}
