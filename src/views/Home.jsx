import { useContext, useEffect, useState } from "react";
import Modal from "../components/Modal";
import context from "../context";
import headers from "../header";
import Navbar from "../components/Navbar";
import NavbarPhone from "../components/NavbarPhone";
import Show from "../components/Show";
import { FaSpinner } from "react-icons/fa";
export default function Home() {
  const user = useContext(context);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current_show, setCurrentShow] = useState(false);
  const [searchText, setSearch] = useState("");

  useEffect(() => {
    fetch("/shows/discover", {
      method: "GET",
      headers: {
        "X-BetaSeries-Key": "dc7762e80561",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setShows(json.shows);
        setLoading(false);
      });
  }, []);

  function search(e) {
    e.preventDefault();
    setLoading(true);

    fetch(`/search/shows?text=${searchText}`, {
      headers,
      method: "GET",
    })
      .then((res) => res.json())
      .then((json) => {
        const transformed = json.shows.map((show) => {
          return {
            ...show,
            images: {
              poster: show.poster,
            },
          };
        });
        setShows(transformed);
        setLoading(false);
      });
  }

  return (
    <div className="justify-center flex-col blur-background backdrop-blur-[60px] w-screen ">
      {current_show ? (
        <Modal close={setCurrentShow} show={current_show} />
      ) : null}
      <div className="pt-20  w-full flex justify-center px-2">
        <form onSubmit={search} className="w-10/12">
          <input
            type="text"
            name=""
            id=""
            placeholder="Rechercher"
            value={searchText}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xl transition focus:opacity-100 py-3 px-2 justify-self-center w-full focus:outline-none bg-black text-white opacity-70"
          />
        </form>
      </div>
      {shows.length === 0 && loading === false ? (
        <div className="flex justify-center text-3xl text-white px-2">
          {" "}
          <div className="flex bg-black bg-opacity-80 w-10/12 justify-center ">
            <span>Aucun resultat</span>
          </div>
        </div>
      ) : null}

      <div className="flex justify-center  w-screen ">
        {!loading ? (
          <div className=" backdrop-blur-[60px] blur-background my-8 px-2 pb-5 grid xxs:grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-10/12 cursor-pointer content-start justify-center overflow-clip">
            {shows.map((show) => (
              <Show show={show} setCurrentShow={setCurrentShow} />
            ))}
          </div>
        ) : (
          <div className="h-76 flex items-center justify-center">
            <FaSpinner size={60} className="animate-spin text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
