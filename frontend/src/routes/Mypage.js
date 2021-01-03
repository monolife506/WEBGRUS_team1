import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_API } from "../_actions/config";
import Post from "../component/Post";
import { useDispatch, useSelector } from "react-redux";
import { getMyposts } from "../_actions/postAction";

function Mypage() {
  const [Posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const userid = useSelector((state) => state.userid);

  useEffect(() => {
    dispatch(getMyposts(userid)).then((res) => {
      setPosts(res.payload.posts);
    });
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "80vw", display: "flex", justifyContent: "center" }}>
        {Posts.map((post) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Post post={post} key={post.postid} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Mypage;
