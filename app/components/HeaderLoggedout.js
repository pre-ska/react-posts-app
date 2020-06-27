import React, { useState, useContext, useRef } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

const HeaderLoggedout = () => {
  const appDispatch = useContext(DispatchContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usernameInput = useRef();
  const passwordInput = useRef();

  const handleSubmit = async e => {
    e.preventDefault();

    if (username === "" || password === "") {
      if (username === "")
        usernameInput.current.className =
          "form-control is-invalid form-control-sm";

      if (password === "")
        passwordInput.current.className =
          "form-control is-invalid form-control-sm";

      appDispatch({
        type: "flashMessage",
        value: "Login fields cannot be empty",
        warning: true
      });
    } else {
      try {
        const response = await Axios.post("/login", {
          username,
          password
        });

        if (response.data) {
          appDispatch({ type: "login", data: response.data });
          appDispatch({
            type: "flashMessage",
            value: "You have successfuly logged in"
          });
        } else {
          console.log("Incorrect usename / password");
          appDispatch({
            type: "flashMessage",
            value: "Invalid username / password",
            warning: true
          });
        }
      } catch (error) {
        console.log(error.response.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            ref={usernameInput}
            name="username"
            className="form-control form-control-sm"
            type="text"
            placeholder="Username"
            autoComplete="off"
            value={username}
            onChange={e => {
              usernameInput.current.className = "form-control form-control-sm";
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            ref={passwordInput}
            name="password"
            className="form-control form-control-sm"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => {
              passwordInput.current.className = "form-control form-control-sm";
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};

export default HeaderLoggedout;
