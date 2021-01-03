import React from "react";
import { SERVER_API } from "../_actions/config";


function Post({ post }) {
  const postid = post.postid;
  return (
    <a href={`${SERVER_API}/postDetail/${postid}`}>
      <div
        style={{
          borderStyle: "solid",
          width: 300,
          height: 400,
          margin: "5px 5px 5px 10px",
        }}
      >
        {/* 제일 첫번째 사진 보여주기 */}
        <img
          src={`${SERVER_API}/${post.photos[0].path}`}
          style={{ width: 290, height: 290 }}
        />
        <div
          style={{
            width: "90%",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div>{post.title}</div>
          <div>{post.description}</div>
          <div>Date: {post.posttime}</div>
          <div>
            Like: {post.likecnt} View: {post.viewcnt}
          </div>
        </div>
      </div>
    </a>
  );
}

export default Post;
