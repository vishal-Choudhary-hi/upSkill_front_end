import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { UserContext } from "../contexts/userContext";

function SignUp({ modalIsOpen, setModalIsOpen }) {
  const { setUser } = useContext(UserContext);
  const [OTP, setOTP] = useState(0);
  const [error, setError] = useState({
    name: false,
    emailId: false,
    password: false,
    confirmPassword: false,
    phoneNumber: false,
    otp: false,
  });
  const [err, setErr] = useState(false);
  useEffect(() => console.log(error), [error]);
  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [OTPs, setOTPs] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let boolError = false;
    setErr(false);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    for (let i in formData) {
      if (typeof formData[i] === "string" && formData[i].trim() === "") {
        console.log("hi");
        setError((prev) => ({ ...prev, [i]: true }));
        boolError = true;
      } else {
        setError((prev) => ({ ...prev, [i]: false }));
      }
    }
    if (OTP === 2) {
      formData.optVerified = 1;
      setError((prev) => ({ ...prev, otp: false }));
    } else {
      formData.optVerified = 0;
      setError((prev) => ({ ...prev, otp: true }));
      boolError = true;
    }
    if (!emailPattern.test(formData.emailId)) {
      setError((prev) => ({ ...prev, emailId: true }));
      boolError = true;
    } else {
      setError((prev) => ({ ...prev, emailId: false }));
    }
    if (!phonePattern.test(formData.phoneNumber)) {
      setError((prev) => ({ ...prev, phoneNumber: true }));
      boolError = true;
    } else {
      setError((prev) => ({ ...prev, phoneNumber: false }));
    }
    if (
      formData.password.trim() != "" &&
      formData.password === formData.confirmPassword
    ) {
      setError((prev) => ({ ...prev, password: false }));
    } else {
      setError((prev) => ({ ...prev, password: true }));
      boolError = true;
    }
    if (boolError) return;
    const res = await axios.post("http://localhost:8080/signup", formData);
    if (res.status === 201) {
      localStorage.setItem("jwt", res.data.token);
      const userId = JSON.parse(atob(res.data.token.split(".")[1])).id;
      setUser(userId);
      alert("Signup successfull");
    } else {
      console.log("Fail");
    }
    setFormData({
      name: "",
      emailId: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    });
    setError({
      name: false,
      emailId: false,
      password: false,
      confirmPassword: false,
      phoneNumber: false,
      otp: false,
    });
    setOTP(0);
    setOTPs();
    setModalIsOpen(false);
  };
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "25%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "50px",
    },
  };
  const handleSendOTP = async () => {
    if (formData.emailId.trim() === "") {
      setOTP(5);
      return;
    }
    const res = await axios.post(`http://localhost:8080/sendOTP`, {
      email: formData.emailId,
    });
    if (res.status === 201) {
      setOTP(1);
    } else {
      handleSendOTP();
    }
  };
  const verifyOTP = async () => {
    if (OTPs.trim() === "") {
      setOTP(4);
      return;
    }
    const res = await axios.post("http://localhost:8080/verifyOTP", {
      email: formData.emailId,
      OTP: OTPs,
    });
    if (res.data === "OTP Matched") {
      setOTP(2);
    } else {
      setOTP(3);
    }
  };

  useEffect(() => {
    for (let i in error) {
      if (error[i] === true) {
        setErr(true);
        return;
      }
    }
  }, [error]);
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              name="name"
              type="string"
              placeholder="Name"
              style={{ borderColor: error.name === true && "red" }}
              value={formData.name}
              onChange={(e) => handleFormChange(e)}
            />
          </label>
          <label>
            <input
              name="emailId"
              type="string"
              disabled={OTP === 2 ? true : false}
              style={{ borderColor: error.emailId === true && "red" }}
              placeholder="Email"
              value={formData.emailId}
              onChange={(e) => handleFormChange(e)}
            />
          </label>
          <div
            className="verifyOTP"
            style={{ borderColor: error.otp && "red" }}
          >
            {OTP === 5 && <p style={{ color: "Red" }}>Please Enter Email</p>}
            {OTP === 0 && <p onClick={handleSendOTP}>Send OTP</p>}
            {(OTP === 1 || OTP >= 3) && (
              <>
                <input
                  type=""
                  placeholder="Entry OTP"
                  onChange={(e) => setOTPs(e.target.value)}
                />
                <div>
                  <p onClick={handleSendOTP}>Send OTP</p>
                  <p onClick={verifyOTP}>Verify OTP</p>
                </div>
              </>
            )}
            {OTP === 2 && <p style={{ color: "Green" }}>OTP Accepted</p>}
            {OTP === 3 && <p style={{ color: "Red" }}>OTP not matched</p>}
            {OTP === 4 && <p style={{ color: "Red" }}>Please Enter OTP</p>}
          </div>
          <label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              style={{ borderColor: error.password === true && "red" }}
              value={formData.password}
              onChange={(e) => handleFormChange(e)}
            />
          </label>
          <label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Comfirm Password"
              style={{ borderColor: error.password === true && "red" }}
              value={formData.confirmPassword}
              onChange={(e) => handleFormChange(e)}
            />
          </label>
          <label>
            <input
              name="phoneNumber"
              type="string"
              placeholder="Phone Number"
              style={{
                borderColor: error.phoneNumber === true && "red",
              }}
              value={formData.phoneNumber}
              onChange={(e) => handleFormChange(e)}
            />
          </label>
          {err && (
            <div className="error">
              Error: Please check the red underlined field for errors.
            </div>
          )}
          <button type="submit">Submit</button>
        </form>
      </Modal>
    </>
  );
}

export default SignUp;
