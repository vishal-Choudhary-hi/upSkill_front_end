import React, { useState, useContext, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { UserContext } from "../contexts/userContext";

function Login({ modalIsOpen, setModalIsOpen }) {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });
  const [error, setError] = useState({
    emailId: false,
    password: false,
    errorData: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let boolError = false;
    for (let i in formData) {
      if (typeof formData[i] === "string" && formData[i].trim() === "") {
        setError((prev) => ({ ...prev, [i]: true }));
        boolError = true;
      } else {
        setError((prev) => ({ ...prev, [i]: false }));
      }
    }
    if (!emailPattern.test(formData.emailId)) {
      setError((prev) => ({ ...prev, emailId: true }));
      boolError = true;
    } else {
      setError((prev) => ({ ...prev, emailId: false }));
    }
    if (boolError) {
      setError((prev) => ({
        ...prev,
        errorData: "Error: Please check the red underlined field for errors.",
      }));
      return;
    }
    const res = await axios.post("http://localhost:8080/login", formData);
    if (res.data.token) {
      localStorage.setItem("jwt", res.data.token);
      const userId = JSON.parse(atob(res.data.token.split(".")[1])).id;
      setUser(userId);
      setModalIsOpen(false);
      setFormData({
        emailId: "",
        password: "",
      });
      setError({
        emailId: false,
        password: false,
        errorData: "",
      });
    } else {
      setError((prev) => ({ ...prev, errorData: "Invalid credentials" }));
    }
  };
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "50%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "50px",
    },
  };
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="emailId"
            type="email"
            placeholder="Email"
            style={{ borderColor: error.emailId === true && "red" }}
            value={formData.emailId}
            onChange={(e) => handleFormChange(e)}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            style={{ borderColor: error.password === true && "red" }}
            value={formData.password}
            onChange={(e) => handleFormChange(e)}
          />
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
        {error.errorData.length > 0 && (
          <div className="error">{error.errorData}</div>
        )}
      </Modal>
    </>
  );
}

export default Login;
