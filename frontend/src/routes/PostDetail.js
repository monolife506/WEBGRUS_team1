import React from "react";
import { useHistory, useParams } from "react-router-dom";
import ViewPostDetail from "../component/ViewPostDetail";
import {postDelete} from "../_actions/postAction"
import {useDispatch} from 'react-redux'

function PostDetail() {
  const history = useHistory();
  const param = useParams();
  const dispatch = useDispatch()

  return (
    <div>
      <button
        name='modify'
        onClick={() => {
          history.push(`/postModify/${param.postid}`);
        }}
      >
        수정
      </button>
      <button
        name='delete'
        onClick={() => {
          dispatch(postDelete(param.postid)).then((response) => {
            //삭제 성공시 마이페이지로 이동
            if (response) {
              history.push(`/mypage`);
            } else {
              alert("포스트 삭제에 실패했습니다.");
            } 
          });
        }}
      >
        삭제
      </button>
      <ViewPostDetail />
    </div>
  );
}

export default PostDetail;
