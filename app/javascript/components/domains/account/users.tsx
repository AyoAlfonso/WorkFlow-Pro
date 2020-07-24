import React, { useState } from "react";
import * as R from "ramda";

import { observer } from "mobx-react";
import { UserCard } from "~/components/shared/user-card";
import { useMst } from "~/setup/root";

import { Container, BodyContainer } from "./container-styles";
import { Box } from "rebass";

export const Users = observer(
  (): JSX.Element => {
    const {
      userStore: { users },
    } = useMst();

    return (
      <Box
        sx={{
          display: "grid",
          gridGap: 3, // theme.space[3]
        }}
      >
        {R.map(
          user => (
            <UserCard
              firstName={user.firstName}
              lastName={user.lastName}
              avatarUrl={user.avatarUrl}
            />
          ),
          users,
        )}
      </Box>
    );
  },
);
