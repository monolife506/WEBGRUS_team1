import React from "react";
import { Link } from "react-router-dom";
import Right from "./Rightnav";
import "./bar.scss";
import Searchbar from "./Searchbar";

function Navbar() {
  return (
    <>
      <div
        style={{
          backgroundColor: "#B2B2B2",
          height: "67px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid black",
        }}
      >
        <div
          style={{
            marginLeft: "20px",
            fontFamily: "notoBold",
            fontSize: "46px",
            fontWeight: 900,
            textShadow: "-2px 0 white, 2px 0 white, 0 2px white,  0 -2px white",
            letterSpacing: "-3px",
            paddingBottom: 5,
          }}
        >
          <Link to={{ pathname: "/" }}>Paper</Link>
        </div>
        <div>
          <Searchbar />
        </div>
        <div style={{ marginRight: "10px" }}>
          <Right />
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#EEEEEE",
          height: "4px",
          borderBottom: "2px solid black",
        }}
      ></div>
    </>
  );
}

export default Navbar;
