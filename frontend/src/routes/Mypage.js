import React, { useEffect, useMemo, useState } from "react";
import Post from "../component/Post";
import { connect } from "react-redux";
import { getUserposts } from "../_actions/postAction";
import { getFavoriteposts } from "../_actions/postAction";
import Loading from "../component/Loading";

function Mypage(props) {
  const auth = props.auth;

  const [Menu, setMenu] = useState("myposts");
  const [MyPosts, setMyPosts] = useState([]);
  const [FavoritePosts, setFavoritePosts] = useState([]);

  useEffect(() => {
    //auth action에서 userData를 가져올 때 까지 기다리기
    if (auth.status.auth === "SUCCESS" && auth.isAuth) {
      let userid = auth.userData.userid;
      props.getUserposts(userid).then((res) => {
        setMyPosts(res.payload);
      });
      props.getFavoriteposts(userid).then((res) => {
        setFavoritePosts(res.payload);
      })
    }
  }, [auth.status.auth]);

  const onMyPost = () => {
    setMenu("myposts");
  };

  const onFavoritePost = () => {
    setMenu("favoriteposts");
  };

  const ViewMyPosts = (
    <>
      {MyPosts.length !== 0 ? (
        MyPosts.map((post) => (
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
      ) : (
        <div
          style={{
            width: "1000px",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          게시물이 없습니다...
        </div>
      )}
    </>
  );

  const ViewFavoritePosts = (
    <>
      {FavoritePosts.length !== 0 ? (
        FavoritePosts.map((post) => (
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
      ) : (
        <div
          style={{
            width: "1000px",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          게시물이 없습니다...
        </div>
      )}
    </>
  );

  if (auth.status.auth === "SUCCESS") {
    return (
      <div style={{ marginLeft: "100px" }}>
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 150,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button type='button' onClick={onMyPost}>
            내 게시물
          </button>
          <button type='button' onClick={onFavoritePost}>
            내가 좋아하는 게시물
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {Menu === "myposts" ? (
            <div>{auth.userData.userid}님의 게시물 입니다</div>
          ) : (
            <div>{auth.userData.userid}님이 좋아한 게시물 입니다</div>
          )}
          <div
            style={{
              width: "90%",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            {Menu === "myposts" ? ViewMyPosts : ViewFavoritePosts}
          </div>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getUserposts, getFavoriteposts })(
  Mypage
);
