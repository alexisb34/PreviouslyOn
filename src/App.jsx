import { useEffect, useState } from "react";
import { render } from "react-dom";
import { Outlet } from "react-router-dom";
import context from "./context";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    } else {
      setUser(false);
    }
  }, []);
  return (
    <>
      {user !== null ? (
        <context.Provider value={[user, setUser]}>
          <Outlet />
        </context.Provider>
      ) : null}
    </>
  );
}

export default App;
