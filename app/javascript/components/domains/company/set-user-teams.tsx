import * as React from "react";
import { useTranslation } from "react-i18next";
import { MultiSelect } from "~/components/shared/multi-select";
import { useMst } from "~/setup/root";
import { toJS } from "mobx";

interface ISetUserTeamsProps {
  teams: Array<any>;
  setTeams: React.Dispatch<React.SetStateAction<any>>;
}

export const SetUserTeams = ({ teams, setTeams }: ISetUserTeamsProps): JSX.Element => {
  const { t } = useTranslation();

  const { teamStore } = useMst();

  return (
    <MultiSelect
      selections={toJS(teamStore.teams)}
      label={t("profile.profileUpdateForm.teams")}
      selectedOptions={teams}
      setSelectedOptions={setTeams}
      displayFieldName={"name"}
    />
  );
};
