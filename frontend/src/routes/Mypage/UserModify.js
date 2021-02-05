import Axios from "axios";
import React, { useState } from "react";
import { SERVER_API } from "../../_actions/config";

function UserModify() {
  const [OldPW, setOldPW] = useState(""); //변경하기 전 비번
  const [NewPW, setNewPW] = useState(""); //변경할 비번
  const [NewPWcheck, setNewPWcheck] = useState(""); //변경할 비번 체크
  const [Email, setEmail] = useState(""); //변경할 이메일

  const changeOldPW = (e) => {
    setOldPW(e.target.value);
  };

  const changeNewPW = (e) => {
    setNewPW(e.target.value);
  };

  const changeNewPWcheck = (e) => {
    setNewPWcheck(e.target.value);
  };

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  const clickModify = (e) => {
    if (NewPW === NewPWcheck) {
      e.preventDefault();
      let body = {
        oldpassword: OldPW,
        useremail: Email,
        password: NewPW,
      };
      console.log(body);
      Axios.put(`${SERVER_API}/api/users`, body)
        .then((res) => {
          if (res.data.done) {
            alert("변경이 완료되었습니다");
            setOldPW("");
            setNewPW("");
            setNewPWcheck("");
            setEmail("");
          }
        })
        .catch((err) => {
          alert("변경에 실패하였습니다");
          setOldPW("");
          setNewPW("");
          setNewPWcheck("");
          setEmail("");
        });
    } else {
      alert("비밀번호 확인이 맞지 않습니다");
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <div>
        현재 비밀번호:{" "}
        <input
          type='password'
          name='oldpassword'
          value={OldPW}
          onChange={changeOldPW}
        />
      </div>
      <br />
      <div>
        변경할 비밀번호:{" "}
        <input
          type='password'
          name='newpassword'
          value={NewPW}
          onChange={changeNewPW}
        />
      </div>
      <br />
      <div>
        변경할 비밀번호 확인:{" "}
        <input
          type='password'
          name='newpasswordcheck'
          value={NewPWcheck}
          onChange={changeNewPWcheck}
        />
      </div>
      <br />
      <div>
        변경할 이메일:{" "}
        <input
          type='text'
          name='useremail'
          value={Email}
          onChange={changeEmail}
        />
      </div>
      <button type='submit' onClick={clickModify}>
        변경하기
      </button>
    </div>
  );
}

export default UserModify;
