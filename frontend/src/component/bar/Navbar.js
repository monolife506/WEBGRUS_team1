import React from "react";
import { Link } from "react-router-dom";
import Right from "./Rightnav";
import "./bar.scss";
import Searchbar from "./Searchbar";

function Navbar() {
  return (
    <div>
      <div
        style={{
          height: "67px",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#B2B2B2",
          borderBottom: "1px solid black",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 10,
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
        <div style={{ position: "absolute", right: 20, marginRight: "10px" }}>
          <Right />
        </div>
      </div>

      {/* 한줄데코 */}
      <div
        style={{
          backgroundColor: "#EEEEEE",
          height: "4px",
          borderBottom: "2px solid black",
        }}
      ></div>
    </div>
  );
}

export default Navbar;
