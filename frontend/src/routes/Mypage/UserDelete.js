import Axios from "axios";
import React, { useState } from "react";
import {useHistory} from 'react-router-dom'
import { SERVER_API } from "../../_actions/config";

function UserDelete() {
  const history = useHistory()

  const [PW, setPW] = useState(""); //탈퇴할 때 필요한 비번

  const changePW = (e) => {
    setPW(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter")  clickDelete(e)
  };

  const clickDelete = (e) => {
    e.preventDefault();
    let body = {
      password: PW,
    };
    console.log(body);
    Axios.delete(`${SERVER_API}/api/users`, body)
      .then((res) => {
        console.log(res);
        if (res.data.done) {
          alert("탈퇴가 완료되었습니다");
          history.push('/')
        }
      })
      .catch((err) => {
        alert("탈퇴에 실패하였습니다");
      });
  };

  return (
    <div style={{ height: "100vh" }}>
      탈퇴하면 모든 게시물이 삭제됩니다...
      <br />
      <div>
        비밀번호:{" "}
        <input type='password' name='oldpassword' onChange={changePW} onKeyPress={onKeyPress}/>
      </div>
      <button type='submit' onClick={clickDelete}>
        탈퇴하기
      </button>
    </div>
  );
}

export default UserDelete;
