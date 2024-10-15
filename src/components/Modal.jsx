import { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import context from "../context";
import {
  FaCheckDouble,
  FaChevronCircleLeft,
  FaComment,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaSpinner,
  FaRuler,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { GoDiffAdded, GoDiffRemoved } from "react-icons/go";
import { ToastContainer, toast } from "react-toastify";

import { BsFillArchiveFill } from "react-icons/bs";
import { AiOutlineLoading } from "react-icons/ai";
import { CommentList } from "./CommentList";
import { IoClose } from "react-icons/io5";
import StarPicker from "./StarPicker";

const marked_as_watched = (bulk, method, user, id) =>
  fetch(`/episodes/watched?bulk=${bulk}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-BetaSeries-Key": "dc7762e80561",
      Authorization: `Bearer ${user[0].token}`,
    },
    body: JSON.stringify({
      id,
    }),
  });

export default function Modal({ close, show }) {
  const user = useContext(context);
  const [current_show, setCurrentShow] = useState(false);
  const [seasons, setSeason] = useState([]);
  const [episode, setEpisode] = useState(false);
  const [area, setArea] = useState(false);
  const [loading, setLoading] = useState(false);
  const top = useRef();
  const [filter, setFilter] = useState("false");
  const [similars, setSimilars] = useState(false);
  const modal = useRef();

  // useEffect(() => {
  //   console.log(area);
  // }, [area]);

  useEffect(() => {
    console.log(modal);
    if (modal.current) {
      modal.current.scrollTop = 0;
    }
  }, [episode]);
  useEffect(() => {
    if (show) {
      const headers = {
        Authorization: `Bearer ${user[0].token}`,
        "X-BetaSeries-Key": "dc7762e80561",
      };
      fetch("/shows/display?id=" + show, {
        method: "GET",
        headers,
      })
        .then((res) => res.json())
        .then((json) => {
          setCurrentShow(json.show);
        });

      fetch("/shows/seasons?id=" + show, {
        headers,
      })
        .then((res) => res.json())
        .then((json) => setSeason(json.seasons));
    }
  }, [show]);

  function archive({ id }) {
    if (loading) {
      return;
    }

    fetch("/shows/archive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
        Authorization: `Bearer ${user[0].token}`,
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors.length > 0) {
          json.errors.forEach((error) => {
            toast(error.text);
          });
          return;
        }
        toast(
          "Cela peut mettre plusieurs minutes à apparaitre dans votre compte"
        );
        setCurrentShow((state) => ({ ...json.show, images: state.images }));
      });
  }

  function add_to_account({ id }, method) {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch("/shows/show", {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
        Authorization: `Bearer ${user[0].token}`,
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);

        if (json.errors.length > 0) {
          json.errors.forEach((error) => {
            toast(error.text);
          });
          return;
        }
        toast(
          "Cela peut mettre plusieurs minutes à apparaitre dans votre compte"
        );
        setCurrentShow((state) => ({ ...json.show, images: state.images }));
      });
  }

  function rate(note) {
    fetch("/shows/note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
        Authorization: `Bearer ${user[0].token}`,
      },
      body: JSON.stringify({
        id: current_show.id,
        note,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors.length > 0) {
          json.errors.forEach((error) => {
            toast(error.text);
          });
          return;
        }

        setCurrentShow(json.show);
      });
  }

  function rate_episode(note) {
    if (!episode) return;

    fetch("/episodes/note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
        Authorization: `Bearer ${user[0].token}`,
      },
      body: JSON.stringify({
        id: episode.id,
        note,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors.length > 0) {
          json.errors.forEach((error) => {
            toast(error.text);
          });
          return;
        }
        setEpisode({
          ...json.episode,
          note: { ...json.episode.note, user: json.note },
        });
      });
  }

  function unarchive({ id }) {
    if (loading) {
      return;
    }
    fetch("/shows/archive", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
        Authorization: `Bearer ${user[0].token}`,
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors.length > 0) {
          json.errors.forEach((error) => {
            toast(error.text);
          });
          return;
        }

        toast(
          "Cela peut mettre plusieurs minutes à apparaitre dans votre compte"
        );
        setCurrentShow((state) => ({ ...json.show, images: state.images }));
      });
  }
  return ReactDOM.createPortal(
    <div
      id="defaultModal"
      tabIndex="-1"
      aria-hidden="true"
      className=" hide-scroll bg-black bg-opacity-70 backdrop-blur-3xl overflow-y-auto overflow-x-hidden flex justify-center fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full"
    >
      <ToastContainer
        position="bottom-right"
        toastClassName={`opacity-75 hover:opacity-100 bg-black text-white transition`}
      />
      {current_show ? (
        <div
          ref={modal}
          className="p-4 w-full hide-scroll max-w-3xl md:h-auto overflow-x-hidden flex flex-nowrap flex-row  "
        >
          {/* <p className="text-white ">{JSON.stringify(current_show)}</p> */}
          <div
            className={`${
              episode ? "-translate-x-[calc(100%+20px)]" : ""
            } transition-transform min-w-full `}
          >
            <div className="relative">
              <span
                className="cursor-pointer group absolute flex text-white items-center"
                onClick={() => close(false)}
              >
                <IoClose size={30} />{" "}
                <span className="group-hover:underline">Fermer</span>
              </span>
              <img src={current_show.images.banner} />
              <div className="absolute text-white left-0 bottom-0 right-0 bg-black text-3xl p-1 bg-opacity-50 flex justify-between">
                <span>{current_show.title}</span>
                <span className="text-base flex items-center pr-3">
                  <FaStar className=" mr-1 text-orange-400" />{" "}
                  {current_show?.notes.mean.toFixed(1)}
                </span>
              </div>
            </div>
            <div className=" bg-black shadow p-2 text-lg">
              <div className="flex gap-6 p-3 text-base justify-around">
                <div className="text-white">
                  Saison{current_show.seasons > 1 ? "s" : ""}:
                  <span className="text-gray-50"> {current_show.seasons}</span>
                </div>
                <div className="text-white">
                  Nombre d'épisodes:
                  <span className="text-gray-50"> {current_show.episodes}</span>
                </div>
                <div className="text-white">
                  Durée :{" "}
                  <span className="text-gray-50">
                    {" "}
                    {current_show.length} min
                  </span>
                </div>
                <div className="text-white">
                  Status:{" "}
                  <span className="text-gray-50"> {current_show.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 text-sm p-1">
                {Object.keys(current_show.genres).map((genre) => (
                  <span
                    key={genre.id}
                    className="text-white rounded-full p-1 border text-center select-none"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p className="text-white py-2 px-3">{current_show.description}</p>
              {current_show.in_account && (
                <StarPicker
                  rate={(score) => rate(score)}
                  current={current_show.notes.user ?? 0}
                />
              )}

              <div className="w-full p-2 flex justify-between">
                {current_show.in_account ? (
                  <div className="text-white flex items-start">
                    {!current_show.user.archived && current_show.in_account ? (
                      <div className="flex flex-col justify-center items-center relative pb-7 pr-1 pl-1">
                        <button
                          onClick={() => archive(current_show)}
                          className="w-min bg-gradient-to-t from-gray-400 to-gray-500 shadow transition rounded-md text-white p-2 text-lg"
                        >
                          <BsFillArchiveFill size={30} />
                        </button>
                        <span className="absolute bottom-0"> Archive</span>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center relative pb-7 pr-1 pl-1">
                        <button
                          onClick={() => unarchive(current_show)}
                          className="bg-gradient-to-t from-gray-400 to-gray-500 shadow transition rounded-md text-white p-2 text-lg"
                        >
                          <BsFillArchiveFill size={30} />
                        </button>
                        <span className="absolute bottom-0">Unarchive</span>
                      </div>
                    )}
                    <button
                      onClick={() => add_to_account(current_show, "DELETE")}
                      className={
                        "text-white p-2 text-bold flex items-center gap-2"
                      }
                    >
                      {loading ? (
                        <FaSpinner size={30} className="animate-spin" />
                      ) : (
                        <GoDiffAdded size={30} />
                      )}
                      Supprimer du compte
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => add_to_account(current_show, "POST")}
                    className={
                      "text-white p-2 text-bold flex items-center gap-2"
                    }
                  >
                    {loading ? (
                      <FaSpinner size={30} className="animate-spin" />
                    ) : (
                      <GoDiffAdded size={30} />
                    )}{" "}
                    Ajouter à mon compte
                  </button>
                )}

                <select onChange={(e) => setFilter(e.target.value)}>
                  <option value={false}>Non vu</option>

                  <option value={true}>Vu</option>
                  <option value={"tout"}>Tout</option>
                </select>
              </div>
              <div className="grid grid-flow-row grid-cols-1 gap-4 hide-scroll ">
                {seasons.map((season) => (
                  <Season
                    area={area}
                    key={season.id}
                    number={season.number}
                    showId={current_show.id}
                    openEpisode={setEpisode}
                    filter={filter}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className={`${
              episode ? "-translate-x-[calc(100%)]" : "translate-x-[20px]"
            } transition w-full min-w-full  `}
          >
            <div className="bg-slate-700 p-2">
              <button
                className="text-white text-3xl justify-center items-center flex borderp-1 rounded"
                onClick={() => {
                  setEpisode(false);
                  setArea(null);
                }}
              >
                <FaChevronCircleLeft className="text-2xl text-gray-400 hover:text-gray-500" />{" "}
                &nbsp;<span className="text-gray-400 text-2xl">Retour</span>
              </button>
              {episode ? (
                <div className="p-1 pt-5 flex gap-3 flex-col">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-8/12 flex gap-2 flex-col">
                      <div className="flex flex-row gap-5 items-baseline justify-start md:w-8/12">
                        <span className="text-white text-3xl">
                          {episode.title}
                        </span>
                        <span className="text-white flex items-center gap-1">
                          <FaStar /> {episode?.note.mean.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-white text-lg md:flex hidden">
                        {episode.description}
                      </p>
                      {episode.user.seen ? (
                        <StarPicker
                          rate={rate_episode}
                          current={episode.note.user ?? 0}
                        />
                      ) : null}{" "}
                    </div>

                    <div className="w-full md:w-4/12 text-center">
                      <img
                        className="w-full mb-1"
                        src={`https://api.betaseries.com/pictures/episodes?id=${episode.id}&key=dc7762e80561&width=720&height=480`}
                        alt=""
                        srcset=""
                      />
                      <span className="text-white bg-red-500 w-full">
                        Date de sortie:
                        {"  " + new Date(episode.date).toLocaleDateString("fr")}
                      </span>
                    </div>
                  </div>

                  <p className="text-white text-lg md:hidden">
                    {episode.description}
                  </p>
                  <div className="w-full border-t border-slate-100 ">
                    <span className="text-white text-3xl my-2">
                      Commentaire
                    </span>
                    <CommentList episode={episode} getComment={setArea} />
                  </div>
                </div>
              ) : (
                "Loading..."
              )}
            </div>
          </div>
        </div>
      ) : (
        "Loading.."
      )}
    </div>,
    document.getElementById("root")
  );
}

const Season = ({ number, showId, openEpisode, area, filter }) => {
  const [episodes, setEpisodes] = useState(false);
  const user = useContext(context);
  const [isFocus, setFocus] = useState(false);
  const [isLoading, setLoading] = useState(false);

  function expand(params) {
    if (episodes) {
      setEpisodes(false);
      return;
    }
    setLoading(true);

    fetch(
      `/shows/episodes?id=${showId}&season=${number}&subtitles=all&locale=en`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-BetaSeries-Key": "dc7762e80561",
          Authorization: `Bearer ${user[0].token}`,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setLoading(false);
        setEpisodes(json.episodes);
      });
  }

  function bulk_watched({ id }, e) {
    e.stopPropagation();
    marked_as_watched(true, "POST", user, id).then(() => {
      fetch(
        `/shows/episodes?id=${showId}&season=${number}&subtitles=all&locale=en`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-BetaSeries-Key": "dc7762e80561",
            Authorization: `Bearer ${user[0].token}`,
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          if (json.errors.length > 0) {
            json.errors.forEach((error) => {
              toast(error);
            });
            return;
          }
          toast("Cette action peut prendre plusieurs minute.");
          setEpisodes(json.episodes);
        });
    });
  }

  useEffect(() => {
    if (isFocus) {
      if (area.current) {
        setFocus(false);
        setTimeout(() => {
          area.current.focus();
          area.current.scrollIntoView();
        }, 100);
      }
    }
  }, [area]);

  return (
    <>
      <div
        className={`bg-slate-800 text-white shadow-lg  backdrop-blur-lg flex flex-col justify-between items-center cursor-pointer`}
      >
        <div
          onClick={() => expand(number)}
          className="w-full flex justify-between p-3 cursor-pointer relative"
        >
          {isLoading && (
            <div className="absolute left1/2 right-1/2 top-1/2 bottom-1/2-translate-x-1/2 -translate-y-1/2">
              <FaSpinner className="animate-spin" />
            </div>
          )}
          <span className="cursor-pointer">Saison {number}</span>
          <span className="text-3xl mr-4">
            {episodes ? <FaChevronDown /> : <FaChevronUp />}
          </span>
        </div>
        <div className="grid grid-flow-row grid-cols-1 gap-2 w-full">
          {episodes
            ? episodes
                .filter((episode) => {
                  if (filter == "false" && episode.user.seen === false) {
                    return true;
                  }

                  if (filter == "true" && episode.user.seen === true) {
                    return true;
                  }
                  if (filter == "tout") {
                    return true;
                  }
                })
                .map((episode) => (
                  <div
                    key={episode.id}
                    onClick={() => openEpisode(episode)}
                    className="group w-full flex flex-col justify-start hover:scale-110 bg-slate-800 transition-transform"
                  >
                    {/* {filter ==} */}
                    <div className="flex flex-row">
                      <div className=" aspect-video w-4/12 hidden sm:block  overflow-hidden relative">
                        <img
                          className=" h-full w-full  group-hover:scale-125 translate-z-[0] group-hover:blur-sm transition"
                          src={`https://api.betaseries.com/pictures/episodes?id=${episode.id}&key=dc7762e80561&width=320&height=180`}
                          alt=""
                          srcset=""
                        />
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="active:scale-105 active:text-green-200 absolute top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2 text-4xl hidden opcaity-0 group-hover:opacity-100 group-hover:block transition "
                        >
                          <FaEye />
                        </button>
                      </div>
                      <div className="text-white p-2 transition sm:w-8/12">
                        <div className="flex justify-between relative">
                          <div className="flex flex-wrap items-center">
                            <span className="bg-red-500">{episode.code}</span>{" "}
                            <span className="mx-2">-</span>
                            <span className="flex">{episode.title} </span>
                            <span className="block ml-2 text-green-400">
                              {episode?.user.seen ? <FaEye /> : null}
                            </span>
                          </div>
                        </div>
                        <br />
                        {episode?.user.seen ? (
                          <span className="opacity-20">
                            {episode.description.slice(0, 150)}{" "}
                          </span>
                        ) : (
                          episode.description.slice(0, 150)
                        )}
                        ...
                      </div>
                    </div>
                    <div className="grid grid-flow-col grid-cols-3 place-items-center gap-4 p-1">
                      <Watched
                        setEpisodes={setEpisodes}
                        user={user}
                        episode={episode}
                      />

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setFocus(true);
                          openEpisode(episode);
                          console.log(area);
                        }}
                      >
                        <span className="text-xs cursor-pointer group-hover:flex hidden hover:underline">
                          Ajouter un commentaire
                        </span>
                        <FaComment className="sm:hidden" />
                      </div>

                      <div>
                        <span
                          onClick={(e) => bulk_watched(episode, e)}
                          className="text-xs cursor-pointer group-hover:flex hidden hover:underline"
                        >
                          Marquer précédent comme vu
                        </span>
                        <FaCheckDouble className="sm:hidden" />
                      </div>
                    </div>
                  </div>
                ))
            : null}
        </div>
      </div>
    </>
  );
};

const Watched = ({ setEpisodes, user, episode }) => {
  const [isLoading, setLoading] = useState(false);

  function watched(e, { id }, method, bulk) {
    e.stopPropagation();
    setLoading(true);

    marked_as_watched(bulk, method, user, id)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setLoading(false);

        if (json.errors.length > 0) {
          json.errors.forEach((error) => {
            toast(error.text);
          });
          return;
        }

        setEpisodes((state) =>
          state.map((episode) => {
            if (episode.id === json.episode.id) {
              return json.episode;
            }
            return episode;
          })
        );
      });
  }

  return (
    <>
      {!isLoading ? (
        !episode?.user.seen ? (
          <div onClick={(e) => watched(e, episode, "POST", false)}>
            <span className="hover:underline group-hover:block hidden text-sm self-center  cursor-pointer  right-0">
              Marquer comme vu
            </span>
            <FaEye className="sm:hidden" />
          </div>
        ) : (
          <>
            <div onClick={(e) => watched(e, episode, "DELETE")}>
              <span className="hover:underline p-1 group-hover:block hidden text-xs self-center  cursor-pointer  right-0">
                Marquer comme non vu
              </span>
              <FaEyeSlash className="sm:hidden" />
            </div>
          </>
        )
      ) : (
        <div className="p-1 cursor-wait w-full flex justify-center ">
          <AiOutlineLoading className="animate-spin" />
        </div>
      )}
    </>
  );
};
