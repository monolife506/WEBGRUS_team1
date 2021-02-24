import React, { useState } from "react";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";

import { registerUser } from "../_actions/authAction";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

function SignUp(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordcheck, setPasswordcheck] = useState("");
  const [passwordchecking, setPasswordchecking] = useState(true);

  const onId = (e) => {
    setId(e.target.value);
  };
  const onEmail = (e) => {
    setEmail(e.target.value);
  };
  const onPassword = (e) => {
    setPassword(e.target.value);
  };
  const onPasswordcheck = async (e) => {
    await setPasswordcheck(e.target.value);
    if (e.target.value !== password) setPasswordchecking(false);
    else setPasswordchecking(true);
  };

  const onSubmitpress = (e) => {
    if (e.key === "Enter") onSubmit(e);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let body = {
      userid: id,
      useremail: email,
      password: password,
    };

    //액션
    await dispatch(registerUser(body)).then((res) => {
      if (res) {
        alert("회원가입을 축하합니다! 사이트를 이용하시려면 로그인해주세요.");
        history.push("/login");
      } else {
        alert("회원가입에 실패했습니다");
        setId("");
        setEmail("");
        setPassword("");
        setPasswordcheck("");
      }
    });
  };

  return (
    <>
      <div>
        <h3>회원가입</h3>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <input
                type='text'
                value={id}
                placeholder='아이디'
                onChange={onId}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type='email'
                value={email}
                placeholder='이메일'
                onChange={onEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type='password'
                value={password}
                placeholder='비밀번호'
                onChange={onPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                error={!passwordchecking}
                helperText={
                  !passwordchecking ? "비밀번호와 일치하지 않습니다." : ""
                }
                type='password'
                value={passwordcheck}
                placeholder='비밀번호 확인'
                onChange={onPasswordcheck}
                onKeyPress={onSubmitpress}
              />
            </Grid>
          </Grid>
          <button type='submit'>확인</button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link href='/login' variant='body2'>
                이미 계정이 있나요? 로그인
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default SignUp;
