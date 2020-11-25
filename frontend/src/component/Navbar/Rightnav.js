import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.scss";
import { SERVER_API } from "../../_actions/config";

function Rightnav(props) {
  // id가 있으면 로그인 된걸로 간주
  const userlogined = useSelector((state) => state.user);

  const onLogout = () => {
    axios.post(`${SERVER_API}/auth/logout`).then((res) => {
      if (res.status === 200) {
        props.history.push("/login");
      } else {
        alert("로그아웃에 실패했습니다.");
      }
    });
  };

  if (userlogined) {
    return (
      <div className='nav'>
        <ul>
          <li>
            <Link to={{ pathname: "/mypage" }}>마이페이지</Link>
          </li>
          <li>
            <button onClick={onLogout}>로그아웃</button>
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <div className='nav'>
        <ul>
          <li>
            <Link to={{ pathname: "/login" }}>로그인</Link>
          </li>
          <li>
            <Link to={{ pathname: "/register" }}>회원가입</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Rightnav;
