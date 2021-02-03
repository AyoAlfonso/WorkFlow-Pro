import * as React from "react";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { Loading } from "~/components/shared";
import { ForumAgendaSearch } from "./forum-agenda-search";

export const ForumAgenda = observer(() => {
  const { companyStore } = useMst();

  if (!companyStore.company) {
    return <Loading />;
  }

  return <ForumAgendaSearch />;
});
