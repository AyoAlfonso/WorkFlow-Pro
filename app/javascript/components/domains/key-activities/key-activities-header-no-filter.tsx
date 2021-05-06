import * as React from "react";
import { Heading } from "~/components/shared";

interface KeyActivitiesHeaderProps {
  title: string;
}

export const KeyActivitiesHeader = (props: KeyActivitiesHeaderProps): JSX.Element => {
  return (
    <Heading type={"h2"} fontSize={"20px"} fontWeight={"bold"} mt={0}>
      {props.title}
    </Heading>
  );
};
