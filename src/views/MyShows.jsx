import { useContext, useEffect, useState } from "react";
import Modal from "../components/Modal";
import context from "../context";
import headers from "../header";
import Navbar from "../components/Navbar";
import NavbarPhone from "../components/NavbarPhone";
import Show from "../components/Show";
export default function Home() {
  const user = useContext(context);
  const [shows, setShows] = useState([]);
  const [current_show, setCurrentShow] = useState(false);
  useEffect(() => {
    fetch("/shows/member", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user[0].token}`,
        "X-BetaSeries-Key": "dc7762e80561",
      },
    })
      .then((res) => res.json())
      .then((json) => setShows(json.shows));
  }, []);

  return (
    <div className="justify-center flex-col blur-background backdrop-blur-[60px] w-screen ">
      {current_show ? (
        <Modal close={setCurrentShow} show={current_show} />
      ) : null}
      <div className="flex justify-center  w-screen">
        <div className=" backdrop-blur-[60px] blur-background my-8 pt-20 px-2 pb-5 grid xxs:grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-10/12 cursor-pointer content-start justify-center overflow-clip">
          {shows.map((show) => (
            <Show show={show} setCurrentShow={setCurrentShow} />
          ))}
        </div>
      </div>
    </div>
  );
}
