import { useContext, useEffect, useRef, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { Link } from "react-router-dom";
import context from "../context";
import headers from "../header";

export function CommentList({ episode, getComment }) {
  const [comments, setComments] = useState(false);
  const [newcomment, setNewComment] = useState("");
  const user = useContext(context);
  const area = useRef();

  useEffect(() => {
    fetch(`/comments/comments?type=episode&id=${episode.id}`, {
      method: "GET",
      headers,
    })
      .then((res) => res.json())
      .then((json) => setComments(json.comments));
  }, []);

  useEffect(() => {
    getComment(area);
  }, []);

  function comment() {
    fetch(`/comments/comment?type=episode&id=${episode.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user[0].token}`,
        "Content-Type": "application/json",
        "X-BetaSeries-Key": "dc7762e80561",
      },
      body: JSON.stringify({
        type: "episode",
        id: episode.id,
        text: newcomment,
      }),
    })
      .then((res) => res.json())
      .then((json) => setComments([...comments, json.comment]));
  }

  return (
    <div className="flex gap-6 flex-col">
      <div className="w-full flex gap-4 flex-col">
        <textarea
          className="focus:outline-none bg-white p-2 h-36 w-full resize-none"
          value={newcomment}
          onChange={(e) => setNewComment(e.target.value)}
          ref={area}
        ></textarea>
        <input
          type="button"
          onClick={comment}
          value="Ajouter un commentaire"
          className="p-2 bg-slate-500 text-white rounded-sm w-72 active:bg-slate-400 cursor-pointer self-end"
        />
      </div>
      <div className="flex flex-col gap-3 text-white">
        {comments ? (
          comments
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((comment) => (
              <div key={comment.id} className="bg-slate-600 p-3">
                <div className="flex justify-between w-full">
                  <Link to={"/member/" + comment.user_id}>
                    <div className="text-lg border-b border-slate-500 ">
                      {comment.login}
                    </div>
                  </Link>{" "}
                  <span className="text-sm text-slate-300 italic">
                    {comment.date}
                  </span>
                </div>
                <div>{comment.text}</div>
              </div>
            ))
        ) : (
          <div className="w-full text-white flex justify-center">
            <CgSpinner size={40} className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
