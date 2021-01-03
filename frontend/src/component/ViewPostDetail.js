import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SERVER_API } from "../_actions/config";

import { useDispatch } from "react-redux";
import { getPostDetail } from "../_actions/postAction";

//PostDetail 페이지의 해당 포스트 보여주기
function ViewPostDetail() {
  //주소로 넘어온 파라미터 받기
  const param = useParams();
  const dispatch = useDispatch();

  const [Post, setPost] = useState([]);
  const [Photos, setPhotos] = useState([]);

  useEffect(() => {
    dispatch(getPostDetail(param)).then((res) => {
      setPost(res.payload.posts);
      setPhotos(res.payload.posts.photos);
    });
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          borderStyle: "solid",
          width: 900,
          height: 1200,
          margin: "5px 5px 5px 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          {/* 사진들 보여주기 */}
          {Photos.map((photo) => (
            <img
              src={`${SERVER_API}/${photo.path}`}
              style={{ width: 290, height: 290 }}
            />
          ))}
        </div>

        <div
          style={{
            width: "90%",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <p>{Post.title}</p>
          <div>{Post.description}</div>
          <div>Date: {Post.posttime}</div>
          <div>
            Like: {Post.likecnt} View: {Post.viewcnt}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPostDetail;
