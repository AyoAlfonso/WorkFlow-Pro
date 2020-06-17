import React, { useState } from "react";
// import styled from "styled-components";
// import { observer } from "mobx-react";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";

export const LoginForm = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    console.log("***logged in", sessionStore.loggedIn);

    return sessionStore.loggedIn ? (
      <div>You are logged in.</div>
    ) : (
      <>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          onClick={(e) => {
            sessionStore.loginForm.submit(email, password);
          }}
        >
          Login
        </button>
      </>
    );
  }
);
