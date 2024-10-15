import { useContext, useEffect, useState } from "react";
import context from "../context";
import headers from "../header";
import Navbar from "../components/Navbar";
import NavbarPhone from "../components/NavbarPhone";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineUserAdd } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { BsCheckLg } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Friends() {
  const user = useContext(context);
  const [search, setSearch] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pseudo, setPseudo] = useState({ login: "" });
  const [friendRequest, setFriendrequest] = useState([]);

  useEffect(() => {
    fetch("/friends/requests?received=true", {
      method: "GET",
      headers: {
        Accepts: "application/json",
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
        Authorization: `Bearer ${user[0].token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => setFriendrequest(json.users));
  }, []);

  useEffect(() => {
    fetch("/friends/list", {
      method: "GET",
      headers: {
        Accepts: "application/json",
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
        Authorization: `Bearer ${user[0].token}`,
      },
      maxRedirects: 20,
    })
      .then((res) => res.json())
      .then((json) => setFriends(json.users));
  }, []);

  function searchMembers(login, e) {
    // console.log(login)
    e.preventDefault();
    fetch(`/members/search?login=%${login.login}%`, {
      method: "GET",
      headers,
    })
      .then((res) => res.json())
      .then((json) => setSearch(json.users));
  }

  function deleteFriend(id, e, source = "list") {
    e.preventDefault();
    toast(
      "Ce membre sera supprimé de votre liste d'amis d'ici quelques minutes"
    );
    fetch(`/friends/friend?id=${id}`, {
      method: "DELETE",
      headers: {
        Accepts: "application/json",
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
        Authorization: `Bearer ${user[0].token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors) {
          json.errors.forEach((error) => {
            toast(error);
          });
          return;
        }
        if (source === "list") {
          setFriends((state) => [
            ...state.filter((friend) => !(friend.id === json.member.id)),
          ]);
        } else {
          setFriendrequest((state) => [
            ...state.filter((friend) => !(friend.id === json.member.id)),
          ]);
        }
      });
  }

  function addFriend(id, e, source = "search") {
    e.preventDefault();
    toast(
      "Ce membre sera ajouté dans votre liste d'amis d'ici quelques minutes"
    );
    console.log("ere");
    fetch(`/friends/friend?id=${id}`, {
      method: "POST",
      headers: {
        Accepts: "application/json",
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
        Authorization: `Bearer ${user[0].token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (source === "search") {
          setFriends([...friends, json.member]);
        } else {
          setFriendrequest((state) =>
            state.filter((user) => !(user.id === json.member.id))
          );
          setFriends([...friends, json.member]);
        }
      });
  }
  return (
    <div className="backdrop-blur-[60px] pt-20 pb-20 justify-center min-h-screen flex">
      <div className="block sm:flex justify-center w-4/5">
        <div className="justify-center sm:w-3/4 pt-16">
          <form
            onSubmit={(e) => searchMembers(pseudo, e)}
            className="w-full xs:w-auto min-w-[270px] block justify-between sm:justify-start"
          >
            <div className="flex">
              <input
                type="text"
                placeholder="Chercher des amis"
                className="opacity-50 bg-black text-center h-8 rounded-sm text-white"
                value={pseudo.value}
                name="login"
                onChange={(e) =>
                  setPseudo({ ...pseudo, login: e.target.value })
                }
              />
              <button className="btn ml-3 h-8 p-1 xs:px-3 w-1/4">
                Valider
              </button>
            </div>

            <div className="opacity-50 bg-black rounded-sm mt-6">
              {search.map((result) => (
                <div
                  key={result.id}
                  className=" text-white border-b flex justify-between"
                >
                  <p className="p-1">
                    <span className="font-light italic text-slate-400">
                      pseudo: &nbsp;
                    </span>
                    {result.login}
                  </p>
                  <p className="p-1 flex">
                    <span className="font-light italic text-slate-400">
                      XP:&nbsp;
                    </span>{" "}
                    {result.xp}
                    <button
                      onClick={(e) => addFriend(result.id, e)}
                      className="p-1 pl-6 cursor-pointer hover:scale-125 transition-transform duration-300"
                    >
                      <AiOutlineUserAdd title="Ajouter en ami" />
                    </button>
                  </p>
                </div>
              ))}
            </div>
          </form>
          <h2 className="mt-6 text-lime-600 uppercase text-sm p-1">
            Vos amis:
          </h2>
          {/* {JSON.stringify(user)}  */}
          <div className="opacity-50 bg-black rounded-sm min-w-[270px]">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className=" text-white border-b flex justify-between"
              >
                <p className="p-1">
                  <span className="font-light italic text-slate-400">
                    pseudo: &nbsp;
                  </span>
                  {friend.login}
                </p>
                <p className="p-1 flex">
                  <span className="font-light italic text-slate-400">
                    XP:&nbsp;
                  </span>{" "}
                  {friend.xp}
                  <button
                    onClick={(e) => deleteFriend(friend.id, e)}
                    className="p-1 pl-6 cursor-pointer hover:scale-125 transition-transform duration-300"
                  >
                    <IoTrashOutline title="Supprimer de ma liste d'amis" />
                  </button>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="sm:mx-5 sm:w-3/4 sm:max-w-[300px] mt-8 sm:mt-16 min-w-[270px] bg-opacity-60 flex justify-start rounded-sm min-h-[200px] sm:max-h-96 text-white text-lg  bg-black row-start-1">
          <div className="text-gray-400 w-full">
            <h2 className="text-sm p-2 font-bold pt-1">Vos demandes:</h2>
            {friendRequest?.login != "" ? (
              friendRequest.map((ask) => (
                <div key={ask.id}>
                  <p className="p-2 flex justify-between w-full">
                    <div>
                      <span className="text-sm text-lime-600">{ask.login}</span>
                      <span className="text-xs italic">
                        {" "}
                        vous a demandé en ami
                      </span>
                      &nbsp;
                    </div>
                    <div>
                      <button
                        className="text-lime-600 text-xs"
                        title="Accepter comme ami"
                        onClick={(e) => addFriend(ask?.id, e, "invite")}
                      >
                        <BsCheckLg />
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button
                        className="text-red-600 text-xs pr-1"
                        title="Refuser comme ami"
                        onClick={(e) => deleteFriend(ask?.id, e, "invite")}
                      >
                        <ImCross />
                      </button>
                    </div>
                  </p>
                </div>
              ))
            ) : (
              <span className="justify-center items-center flex text-center mt-5">
                Si vous avez des demandes d'amis, elles seront visible ici
              </span>
            )}
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        toastClassName={`opacity-50 bg-black text-white`}
      />
    </div>
  );
}
