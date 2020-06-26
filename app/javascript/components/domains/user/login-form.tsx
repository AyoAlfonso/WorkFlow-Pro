import React, { useState } from "react";
// import styled from "styled-components";
// import { observer } from "mobx-react";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";

import { Flex, Box } from "rebass";
import { Label, Input } from "../../shared/Input";

//replace with shared button
import styled from "styled-components";
import { color, space, layout, typography } from "styled-system";
const StyledButton = styled.button`
${color}
${space}
${layout}
${typography}
height: 40px;
width: 120px;
color: ${props => props.theme.colors.peach};
border-radius: 5px;
text-align: center;
`;

export const LoginForm = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
      <Flex alignItems={"center"}>
        <Box width={1 / 3}></Box>
        <Box as="form" width={1 / 3} sx={{ margin: "auto" }}>
          {sessionStore.loggedIn ? (
            <Label>You are logged in.</Label>
          ) : (
            <>
              <Label htmlFor="email">E-mail</Label>
              <Input name="email" onChange={e => setEmail(e.target.value)} />
              <Label>Password</Label>
              <Input name="password" type="password" onChange={e => setPassword(e.target.value)} />
              <StyledButton
                bg={"primary100"}
                borderColor={"primary100"}
                onClick={sessionStore.login(email, password)}
              >
                Login
              </StyledButton>
            </>
          )}
        </Box>
        <Box width={1 / 3}></Box>
      </Flex>
    );
  },
);
