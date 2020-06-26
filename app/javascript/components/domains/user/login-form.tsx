import React, { useState } from "react";
// import styled from "styled-components";
// import { observer } from "mobx-react";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";

import { Icon } from "../../shared/Icon";
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

const LogoHeaderDiv = styled.div`
  text-align: center;
`;

export const LoginForm = observer(
  (): JSX.Element => {
    const { sessionStore } = useMst();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
      <Flex
        sx={{
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        {" "}
        <Box sx={{ minWidth: "200px", margin: "auto", border: "1" }}>
          {sessionStore.loggedIn ? (
            <Label>You are logged in.</Label>
          ) : (
            <>
              <LogoHeaderDiv>
                <Icon icon={"Logo"} size={"14em"} iconColor={"primary100"} paddingBottom={"15px"} />
              </LogoHeaderDiv>
              <Label htmlFor="email">E-mail</Label>
              <Input name="email" onChange={e => setEmail(e.target.value)} />
              <Label>Password</Label>
              <Input name="password" type="password" onChange={e => setPassword(e.target.value)} />
              <StyledButton bg={"primary100"} onClick={() => sessionStore.login(email, password)}>
                Login
              </StyledButton>
              <div>Forgot your password? (To be added)</div>
            </>
          )}
        </Box>
      </Flex>
    );
  },
);
