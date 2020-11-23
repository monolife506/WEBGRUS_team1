import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./component/Navbar/Navbar";
import Footer from "./component/Footer";
import Main from "./component/Main";
import LoginPage from "./component/LoginPage";
import RegisterPage from "./component/RegisterPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div
          style={{ minHeight: "calc(100vh-80px)", padding: "20px 0 20px 0" }}
        >
          <Switch>
            <Route exact path='/' component={Main} />
            <Route exact path='/Login' component={LoginPage} />
            <Route exact path='/Register' component={RegisterPage} />
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
