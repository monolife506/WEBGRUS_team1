import Axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, connect } from "react-redux";
import {
  updateComment,
  modifyComment,
  deleteComment,
} from "../_actions/commentAction";

import { getPostDetail } from "../_actions/postAction";

function CommentComponent(props) {
  const dispatch = useDispatch();
  const auth = props.auth;
  const postid = props.postid;
  const Comments = props.comments;

  const [CommentValue, setCommentValue] = useState(""); //댓글 입력값
  const [ModifyCommentValue, setModifyCommentValue] = useState(""); //수정하는 댓글 입력값
  const [ModifyComment, setModifyComment] = useState(""); //수정할 댓글 아이디 저장
  const [IsModify, setIsModify] = useState(false);

  const onChangeComment = (e) => {
    setCommentValue(e.target.value);
  };

  const onChangeModifyComment = (e) => {
    setModifyCommentValue(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") onSubmit(e);
  };

  const onModifyKeyPress = (e) => {
    if (e.key === "Enter") onModifySubmit(e);
  };

  //댓글 시간 스트링
  const commentTime = (posttime) => {
    let year = posttime.substring(0, 4);
    let month = posttime.substring(5, 7);
    let date = posttime.substring(8, 10);

    return `${year}. ${month}. ${date}.`;
  };

  //댓글 올리기
  const onSubmit = (e) => {
    e.preventDefault();

    //로그인 돼있을 때만 가능
    if (auth.isAuth) {
      //댓글에 무언가 입력했을 때 가능
      if (CommentValue) {
        const body = { content: CommentValue };
        console.log("댓글 올리기 실행");
        dispatch(updateComment({ postid, body }))
          .then((res) => {
            props.updateCommentArray(res.payload.comment);
            setCommentValue("");
            console.log("댓글올리기 성공");
          })
          .catch((err) => {
            // alert("댓글 입력에 실패했습니다");
            console.log(err);
          });
      }else{
        alert('내용을 입력하세요')
      }
    } else {
      alert("로그인 후 이용하실 수 있습니다");
    }
  };

  //수정할 댓글 인풋창 열기
  const onmodify = (e, commentid) => {
    // 수정할 댓글 찾기
    for (let i = 0; i < Comments.length; i++) {
      if (Comments[i]._id === commentid) {
        setModifyCommentValue(Comments[i].content);
        setModifyComment(Comments[i]._id);
        break;
      }
    }
    setIsModify(true);
  };

  //수정한 댓글 올리기
  const onModifySubmit = (e, commentid) => {
    e.preventDefault();

    const body = { content: ModifyCommentValue };
    dispatch(modifyComment({ postid, commentid, body }))
      .then((res) => {
        props.commentRefresh();
        setIsModify(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //댓글 삭제 요청
  const ondelete = (e, commentid) => {
    e.preventDefault();

    dispatch(deleteComment({ postid, commentid }))
      .then((res) => {
        props.updateDeleteCommentArray(commentid);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //댓글 작성 창
  const writeComment = (
    <>
      <input
        style={{ width: "900px", height: "100px" }}
        type='textarea'
        name='Comment'
        value={CommentValue}
        onChange={onChangeComment}
        onKeyPress={onKeyPress}
      />
      {/* 댓글 올리기 버튼 */}
      <button type='button' onClick={onSubmit}>
        댓글
      </button>
    </>
  );

  //댓글들 보여주기
  const CommentsArray = () => {
    return (
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {Comments
          ? Comments.map((comment) => (
              <div
                style={{ borderStyle: "solid", margin: "5px" }}
                key={comment._id}
              >
                {/* 수정 중인 게시물일 경우 인풋창 띄움 */}
                {IsModify && ModifyComment === comment._id ? (
                  <>
                    <input
                      style={{ width: "900px", height: "100px" }}
                      type='textarea'
                      name='Comment'
                      value={ModifyCommentValue}
                      onChange={onChangeModifyComment}
                      onKeyPress={onModifyKeyPress}
                    />
                    {/* 댓글 올리기 버튼 */}
                    <button
                      type='button'
                      onClick={(e) => onModifySubmit(e, ModifyComment)}
                    >
                      수정
                    </button>
                    <button
                      type='button'
                      onClick={(e) => {
                        e.preventDefault();
                        setIsModify(false);
                      }}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    {/* 수정중인 게시물이 아닌 댓글들 띄움 */}
                    <div>작성자: {comment.owner} </div>
                    <div>{comment.content} </div>
                    <div>{commentTime(comment.posttime)} </div>

                    {/* 내가 작성한 댓글일 경우 수정, 삭제 버튼 나타남 */}
                    {auth.userData && auth.userData.userid === comment.owner ? (
                      <div>
                        <button
                          type='button'
                          onClick={(e) => onmodify(e, comment._id)}
                        >
                          수정
                        </button>
                        <button
                          type='button'
                          onClick={(e) => ondelete(e, comment._id)}
                        >
                          삭제
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </div>
            ))
          : ""}
      </div>
    );
  };

  if (props.comments && Comments !== []) {
    return (
      <>
        <div
          style={{
            width: "1000px",
            borderStyle: "solid",
            margin: "0 5px 5px 10px",
          }}
        >
          {writeComment}
          <div>{CommentsArray()}</div>
        </div>
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
}

const mapStateToProps = (state) => ({
  post: state.post,
  auth: state.auth,
});

export default connect(mapStateToProps, { getPostDetail })(CommentComponent);
