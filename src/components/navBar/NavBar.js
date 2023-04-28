import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { UserContext } from "../contexts/userContext";
import SignUp from "../modal/Signup";
import Login from "../modal/Login";
import Logout from "../modal/Logout";
import "./NavBar.css";
import logo from "../../Images/logo.png";

Modal.setAppElement("#root");

function NavBar() {
  const { user, setUser } = useContext(UserContext);
  const [signupModal, setSignupModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  return (
    <>
      <div className="navBar">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <h2>Dev Site</h2>
        </div>
        <div className="menu">
          {!user ? (
            <>
              <p onClick={() => setSignupModal(true)}>Signup</p>
              <p onClick={() => setLoginModal(true)}>Login</p>
            </>
          ) : (
            <>
              <p>Account</p>
              <p onClick={() => setLogoutModal(true)}>Logout</p>
            </>
          )}
        </div>
      </div>
      <div style={{ width: "50%", margin: "auto" }}>
        <SignUp modalIsOpen={signupModal} setModalIsOpen={setSignupModal} />
        <Login modalIsOpen={loginModal} setModalIsOpen={setLoginModal} />
        <Logout modalIsOpen={logoutModal} setModalIsOpen={setLogoutModal} />
      </div>
    </>
  );
}

export default NavBar;
