import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Home from "./views/Home";
import NoAuth from "./components/NoAuth";
import NeedAuth from "./components/NeedAuth";
import Friends from "./views/Friends";
import MyShows from "./views/MyShows";
import Layout from "./components/Layout";
import Member from "./views/Member";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="login" element={<NoAuth Element={Login} />} />
        <Route element={<Layout />}>
          <Route index element={<NeedAuth Element={Home} />} />
          <Route
            path="/my_shows"
            exact
            element={<NeedAuth Element={MyShows} />}
          />
          <Route
            path="/friends"
            exact
            element={<NeedAuth Element={Friends} />}
          />
          <Route path="/member" exact>
            <Route path=":id" element={<NeedAuth Element={Member} />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
