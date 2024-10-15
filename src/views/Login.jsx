import { useContext, useState } from "react";
import md5 from "md5";
import { useNavigate } from "react-router-dom";
import headers from "../header";
import context from "../context";
import logo from "../assets/images/previously_on_logo.png";
import { toast, ToastContainer } from "react-toastify";
export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useContext(context);

  const [credential, setCredential] = useState({
    login: "",
    password: "",
  });
  function login(e) {
    e.preventDefault();
    fetch("/members/auth", {
      method: "POST",
      headers,
      body: JSON.stringify(credential),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors.length > 0) {
          json.errors.forEach((error) => {
            toast(error.text);
          });
          return;
        }
        sessionStorage.setItem("user", JSON.stringify(json));
        setUser(json);
      });
  }

  return (
    <>
      <ToastContainer
        position="bottom-right"
        toastClassName={`opacity-50 bg-black text-white`}
      />
      <div className="relative">
        <div className="w-screen h-screen bg-cover"></div>

        <form
          onSubmit={login}
          className="justify-center opacity-80 h-72 w-96 center left-2/4 top-2/4 absolute translate-x-[-50%] translate-y-[-50%]  backdrop-blur-[20px] "
        >
          <img
            src={logo}
            alt="logo website"
            className="hover:scale-110 transition-transform duration-300 w-44 flex mt-6 absolute left-[27%]"
          />
          {/* <label htmlFor="login">Nom d'utilisateur:</label> */}
          <input
            type="email"
            value={credential.value}
            placeholder="email"
            className="m-auto w-64 text-center rounded-sm bg-gray-100 flex mt-28 h-9 opacity-100"
            name="login"
            onChange={(e) =>
              setCredential({ ...credential, login: e.target.value })
            }
          />
          <br></br>
          <input
            type="password"
            name="password"
            placeholder="mot de passe"
            className="m-auto w-64 rounded-sm text-center bg-gray-100 flex h-9"
            onChange={(e) =>
              setCredential({
                ...credential,
                password: md5(e.target.value),
              })
            }
          />
          <button className="btn text-center flex mx-auto mt-6 p-2 px-8">
            Se Connecter
          </button>
          {/* {JSON.stringify(credential)} */}
        </form>
      </div>
    </>
  );
}
