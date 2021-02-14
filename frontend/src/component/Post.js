import React from "react";
import { useHistory } from "react-router-dom";
import { SERVER_API } from "../_actions/config";

import Comment from "@material-ui/icons/Comment";
import Visibility from "@material-ui/icons/Visibility";
import FavoriteComponent from "../component/FavoriteComponent";

function Post({
  postid,
  owner,
  title,
  description,
  files,
  tags,
  posttime,
  likecnt,
  viewcnt,
  commentcnt,
  auth,
}) {
  const history = useHistory();

  const posttimeView = (posttime) => {
    const Year = posttime.substring(0, 4);
    const Month = posttime.substring(5, 7);
    const Date = posttime.substring(8, 10);
    return (
      <div>
        Date: {Year}. {Month}. {Date}.
      </div>
    );
  };

  return (
    <div
      style={{
        borderStyle: "solid",
        height: 480,
        margin: "5px 5px 0 5px",
        padding: "7px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* 자신의 아이디 클릭시 마이페이지로,  */}
      {/* 다른 유저의 아이디 클릭시 유저페이지로 */}
      <button
        type='button'
        style={{ border: "none", background: "none", cursor:'pointer' }}
        onClick={() => {
          if (auth && auth.userid === owner) {
            history.push("/mypage");
          } else {
            history.push(`/userDetail/${owner}`);
          }
        }}
      >
        {owner}
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 295,
          height: 295,
          margin: "8px 5px",
        }}
      >
        <a href={`/postDetail/${postid}`}>
          {/* 제일 첫번째 사진 보여주기 */}
          <img
            src={`${SERVER_API}/images/${files[0].filename}`}
            style={{
              maxWidth: 295,
              maxHeight: 295,
              width: "auto",
              height: "auto",
            }}
          />
        </a>
      </div>
      <div
        style={{
          width: "90%",
          height: 114,
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <a href={`/postDetail/${postid}`}>
          <div>{title}</div>
        </a>
        <div>{description}</div>
        <div>
          {tags
            ? tags.map((tag) => (
                <div key={tag} style={{ display: "inline" }}>
                  #{tag}{" "}
                </div>
              ))
            : ""}
        </div>
        {posttimeView(posttime)}
        <div
          style={{
            width: "60%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <FavoriteComponent postid={postid} postlikecnt={likecnt} />
          <div>
            <Visibility /> {viewcnt}
          </div>

          <div>
            <Comment />
            {commentcnt}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
