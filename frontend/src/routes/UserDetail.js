import React, { useState, useEffect } from "react";
import Post from "../component/Post";
import { useDispatch } from "react-redux";
import { getUserposts } from "../_actions/postAction";
import { useParams } from "react-router-dom";

import FollowComponent from "../component/FollowComponent";

function UserDetail() {
  const params = useParams();
  const dispatch = useDispatch();

  const userid = params.userid;

  const [posts, setPosts] = useState([]);
  const [postsNum, myPostsNum] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let page = 1;
    //해당 유저가 올린 게시물 가져오기
    dispatch(getUserposts({ userid, page })).then((res) => {
      setPosts(res.payload);
      myPostsNum(res.payload.length); //게시물 개수 저장
    });
  }, []);

  //페이지 클릭 버튼 로드
  const SelectPage = () => {
    let array = [];

    //페이지 개수만큼 배열 만들기 [1,2,3,...]
    for (var i = 1; i < parseInt(postsNum / 10) + 2; i++) {
      array.push(i);
    }

    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {
          // 페이지 개수만큼 버튼 만들기
          array.map((page) => (
            <button
              type='button'
              name={page}
              onClick={(e) => {
                ChangePage(page);
              }}
            >
              {page}
            </button>
          ))
        }
      </div>
    );
  };

  //선택한 페이지 로드
  const ChangePage = (page) => {
    //현재 페이지와 선택한 페이지가 같지 않을 때만 로드
    if (currentPage !== page) {
      dispatch(getUserposts({ userid, page })).then((res) => {
        setPosts(res.payload);
        myPostsNum(res.payload.length); //게시물 개수 저장
      });
    }
  };

  return (
    <div>
      <div style={{ marginLeft: "150px" }}>
        <h2>{userid}</h2>
        <FollowComponent userid={userid} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems:'center'
        }}
      >
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
              ))
            : ""}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {SelectPage()}
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
