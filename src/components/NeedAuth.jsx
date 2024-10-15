import { useContext, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import context from "../context";

export default function NoAuth({ Element }) {
  const [user, setUser] = useContext(context);
  const navigate = useNavigate();

  if (user) {
    return <Element />;
  } else {
    return <Navigate to="/login" />;
  }
}
