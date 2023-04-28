import React, { useContext } from "react";
import Modal from "react-modal";
import { UserContext } from "../contexts/userContext";

function Logout({ modalIsOpen, setModalIsOpen }) {
  const { setUser } = useContext(UserContext);
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
  const handleLogout = () => {
    setUser();
    setModalIsOpen(false);
    localStorage.removeItem("jwt");
  };
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <h2>Logout</h2>
        <p className="importantPara">
          Are you sure you want to logout from your account
        </p>
        <div className="parallelButton">
          <button onClick={handleLogout}>Yes</button>
          <button onClick={() => setModalIsOpen(false)}>No</button>
        </div>
      </Modal>
    </>
  );
}

export default Logout;
