import { useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import context from "../context";

export default function NoAuth({ Element }) {
  const [user] = useContext(context);
  const navigate = useNavigate();
  const source = useParams();
  useEffect(() => {
    console.log(source);
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return <Element />;
}
