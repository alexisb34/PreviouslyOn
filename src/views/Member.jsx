import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import context from "../context";
import Show from "../components/Show";
import Modal from "../components/Modal";
import { FaSpinner } from "react-icons/fa";

export default function Member() {
  const { id } = useParams();
  const [user] = useContext(context);
  const [member, setMember] = useState(false);
  const [shows, setShows] = useState(false);
  const [current_show, setCurrentShow] = useState(false);
  useEffect(() => {
    fetch("/members/infos?id=" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors.length > 0) {
          json.errors.forEach((error) => {});
          return;
        }
        setMember(json.member);
      });

    fetch("/shows/member?id=" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors.length > 0) {
          json.errors.forEach((error) => {});
          return;
        }
        setShows(json.shows);
      });
  }, [id]);
  return (
    <>
      {current_show ? (
        <Modal close={setCurrentShow} show={current_show} />
      ) : null}
      <div className="pt-20 w-full  flex justify-center">
        <div className="w-full md:w-6/12">
          <div className=" overflow-hidden min-w-fit bg-black bg-opacity-70 flex md:justify-start justify-center p-2 flex-col md:flex-row items-center gap-4">
            {member ? (
              <>
                <img className="rounded-full" src={member.avatar} alt="" />
                <div className="text-white text-3xl flex flex-col items-center">
                  <span className="underline">{member.login}</span>
                  <span className="text-2xl ">xp {member.xp}</span>
                </div>{" "}
              </>
            ) : (
              <div className="w-full text-4xl p-4 flex justify-center text-white">
                <span className="animate-spin">
                  <FaSpinner />
                </span>
              </div>
            )}
          </div>

          {shows ? (
            <div className=" backdrop-blur-[60px] blur-background my-8  pb-5 grid xxs:grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full cursor-pointer content-start justify-center overflow-clip">
              {shows.map((show) => (
                <Show show={show} setCurrentShow={setCurrentShow} />
              ))}
            </div>
          ) : (
            <div className="w-full text-4xl p-4 flex justify-center text-white">
              <span className="animate-spin">
                <FaSpinner />
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
