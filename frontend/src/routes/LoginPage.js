import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { loginUser } from "../_actions/authAction";

import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function SignIn() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const onId = (e) => {
    setId(e.currentTarget.value);
  };
  const onPassword = (e) => {
    setPassword(e.currentTarget.value);
  };

  const onSubmitpress = (e) => {
    if (e.key === "Enter") onSubmit(e);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let body = {
      userid: id,
      password: password,
    };

    //액션
    await dispatch(loginUser(body)).then((res) => {
      //로그인 성공시 홈으로 이동
      if (res) {
        history.push("/");
      } else {
        alert("로그인에 실패했습니다.");
        setId("");
        setPassword("");
      }
    });
  };

  return (
    <>
      <div>
        <h3>로그인</h3>
        <form onSubmit={onSubmit}>
          <input
            type='text'
            value={id}
            placeholder='아이디'
            autoFocus
            onChange={onId}
          />
          <input
            type='password'
            value={password}
            label='비밀번호'
            placeholder='비밀번호'
            onChange={onPassword}
            onKeyPress={onSubmitpress}
          />
          <button type='submit'>로그인</button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link href='/register'>{"계정이 없나요? 회원가입"}</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default SignIn;
