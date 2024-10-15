import { React, useContext } from "react";
import logo from "../assets/images/previously_on_logo_white.png";
import context from "../context";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useContext(context);

  function logout() {
    sessionStorage.removeItem("user");
    setUser(false);
  }
  //   z-10 hidden sm:flex w-screen h-16 bg-black fixed

  return (
    <div className="z-10 hidden sm:block w-screen h-16 bg-black fixed">
      <div className="flex justify-between">
        <div className="inline-flex w-auto h-16 text-white">
          <Link to="/" className="flex">
            <img
              src={logo}
              alt="logo website"
              className="flex m-3 pt-1 pr-2 pl-5 hover:scale-110 cursor-pointer transition-transform duration-300"
            />
          </Link>

          <Link to="my_shows" className="btn m-3 px-4 py-2">
            Mes séries
          </Link>
          <Link to="/friends">
            <button className="btn m-3 px-4 py-2">Mes amis</button>
          </Link>
        </div>
        <div className="flex mr-4">
          <button className="btn m-3 px-4 leading-4" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
