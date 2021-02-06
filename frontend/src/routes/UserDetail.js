import React, { useState, useEffect } from "react";
import Post from "../component/Post";
import { useDispatch, useSelector } from "react-redux";
import { getUserposts } from "../_actions/postAction";
import { useHistory, useParams } from "react-router-dom";

import FollowComponent from "../component/FollowComponent";

function UserDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const userid = params.userid;

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    dispatch(getUserposts(userid)).then((res) => {
      setPosts(res.payload);
      console.log("불러옴");
    });
  }, []);
  return (
    <div>
      <div style={{ marginLeft: "150px" }}>
        <h2>{userid}</h2>
        <FollowComponent userid={userid} />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "80%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
          {posts
            ? posts.map((post) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  key={post._id}
                >
                  <Post
                    key={post._id}
                    postid={post._id}
                    owner={post.owner}
                    title={post.title}
                    description={post.description}
                    files={post.files}
                    tags={post.tags}
                    posttime={post.posttime}
                    likecnt={post.likecnt}
                    viewcnt={post.viewcnt}
                    commentcnt={post.commentcnt}
                  />
                </div>
              ))
            : ""}
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
