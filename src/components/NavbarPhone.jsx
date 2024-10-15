import { React, useContext } from "react";
import { TbLogout } from "react-icons/tb";
import { FaUserFriends } from "react-icons/fa";
import { CgScreen } from "react-icons/cg";
import { Link } from "react-router-dom";
import logo from "../assets/images/previously_on_only.png";
import context from "../context";

export default function NavbarPhone() {
  const [user, setUser] = useContext(context);

  function logout() {
    sessionStorage.removeItem("user");
    setUser(false);
  }

  return (
    <div className="z-10 sm:hidden flex justify-between w-screen h-16 bg-black fixed">
      <div className="flex">
        <Link to="/" className="flex">
          <img
            src={logo}
            alt="logo website"
            className="m-4 pl-3 hover:scale-110 cursor-pointer transition-transform duration-300"
          />
        </Link>
        {/* <button className="text-2xl btn m-3 px-4"><CgScreen/></button> */}
        <Link to="/my_shows" className="flex">
          <button className="text-2xl btn m-3 px-4">
            <CgScreen />
          </button>
        </Link>
        <Link to="/friends" className="flex">
          <button className="text-2xl btn m-3 px-4">
            <FaUserFriends />
          </button>
        </Link>
      </div>
      <div className="flex justify-end mr-4">
        <button className="text-2xl btn m-3 px-4" onClick={logout}>
          <TbLogout />
        </button>
      </div>
    </div>
  );
}
