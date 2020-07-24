import React, { useState } from "react";
import * as R from "ramda";

import { observer } from "mobx-react";
import { UserCard } from "~/components/shared/user-card";
import { useMst } from "~/setup/root";

export const Users = observer(
  (): JSX.Element => {
    const {
      userStore: { users },
    } = useMst();

    return (
      <div>
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
      </div>
    );
  },
);
