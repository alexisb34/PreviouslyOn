import { useEffect } from "react";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarPicker({ rate, current }) {
  const [hover, setHover] = useState(current);

  useEffect(() => {
    setHover(current);
  }, [current]);

  const stars = [<FaStar />, <FaStar />, <FaStar />, <FaStar />, <FaStar />];
  return (
    <div className="text-white flex px-2 text-3xl py-3 items-center gap-0 cursor-pointer">
      {stars.map((element, index) => {
        return (
          <element.type
            className={hover >= index + 1 ? "text-yellow-400" : ""}
            onMouseEnter={() => setHover(index + 1)}
            onMouseLeave={() => setHover(current)}
            onClick={() => rate(index + 1)}
          />
        );
      })}
    </div>
  );
}
