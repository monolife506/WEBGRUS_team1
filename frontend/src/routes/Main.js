import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";

import { getAllpost } from "../_actions/postAction";

import Post from "../component/Post";
import Loading from "../component/Loading";
import useInfinteScroll from "../hoc/infiniteScroll";

function Main(props) {
  const dispatch = useDispatch();

  const targetRef = useRef(null);

  const [sortMode, setSortMode] = useState('times');
  const [Posts, setPosts] = useState([]);
  const [lastPage, setLastPage] = useState(0);

  const changeSortMode = (sort) => {
    setSortMode(sort);
    dispatch(getAllpost(sortMode, 1)).then((res) => {
      setPosts(res.payload);
      setLastPage(1);
    });
  }

  useEffect(() => {
    dispatch(getAllpost('times', 1)).then((res) => {
      setPosts(res.payload);
      setLastPage(1);
    });
  }, []);

  useInfinteScroll({
    target: targetRef.current,
    onIntersect: ([{ isIntersecting }]) => {
      if (isIntersecting) {
        dispatch(getAllpost(sortMode, lastPage + 1)).then((res) => {
          const posts = Posts.concat(res.payload);
          setPosts(posts);
          setLastPage(lastPage + 1);
        });
      }
    }
  });


  //모든 포스트 가져오는 액션이 끝난 후 로드
  if (props.post.allpost) {
    return (
      <>
        {/* 정렬버튼 */}
        <div>
          <button
            type='button'
            name='times'
            onClick={() => {
              changeSortMode('times');
            }}
          >
            최신순
          </button>
          <button
            type='button'
            name='views'
            onClick={() => {
              changeSortMode('views');
            }}
          >
            조회순
          </button>
          <button
            type='button'
            name='likes'
            onClick={() => {
              changeSortMode('likes');
            }}
          >
            인기순
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "80vw",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            {Posts
              ? Posts.map((post) => (
                <div
                  key={post._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
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
                    auth={props.auth.userData}
                  />
                </div>
              ))
              : ""}
          </div>
        </div>
        <div ref={targetRef} />
      </>
    );
  } else {
    return <Loading />;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  post: state.post,
});

export default connect(mapStateToProps)(Main);
