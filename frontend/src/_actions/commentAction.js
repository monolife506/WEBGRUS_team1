import axios from "axios";
import { SERVER_API } from "./config";
import { GET_COMMENT, UPDATE_COMMENT, MODIFY_COMMENT, DELETE_COMMENT } from "./types";


//해당 포스트 댓글 불러오기
export function getComment(postid) {
  const request = axios
    .get(`${SERVER_API}/api/posts/${postid}/comments`)
    .then((res) => res.data);
  return {
    type: GET_COMMENT,
    payload: request,
  };
}

//포스트 댓글 추가
export function uploadComment({postid, body}) {
  const request = axios
    .post(`${SERVER_API}/api/posts/${postid}/comments`, body)
    .then((res) => res.data);
  return {
    type: UPDATE_COMMENT,
    payload: request,
  };
}

//포스트 댓글 수정
export function modifyComment({postid, commentid, body}) {
  const request = axios
    .put(`${SERVER_API}/api/posts/${postid}/comments/${commentid}`, body)
    .then((res) => res.data);
  return {
    type: MODIFY_COMMENT,
    payload: request,
  };
}

//포스트 댓글 삭제
export function deleteComment({postid, commentid}) {
  const request = axios
    .delete(`${SERVER_API}/api/posts/${postid}/comments/${commentid}`)
    .then((res) => res.data);
  return {
    type: DELETE_COMMENT,
    payload: request,
  };
}
