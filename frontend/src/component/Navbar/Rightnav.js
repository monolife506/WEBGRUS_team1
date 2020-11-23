import React from "react";
import { Link } from "react-router-dom";
import './Navbar.scss'

function Rightnav() {
  return (
    <div className='nav'>
      <ul>
        <Link to={{ pathname: "/login" }}>
          <li>로그인</li>
        </Link>

        <Link to={{ pathname: "/register" }}>
          <li>회원가입</li>
        </Link>
      </ul>
    </div>
  );
}

export default Rightnav;
