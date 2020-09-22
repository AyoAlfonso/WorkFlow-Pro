import moment from "moment";
import * as React from "react";

export const HeaderDateParser = () => {
  const dayOfWeek = new Date().getDay();
  if ([0, 5, 6].includes(dayOfWeek)) {
    return (
      <>
        Week of{" "}
        {moment()
          .add(1, "weeks")
          .startOf("isoWeek")
          .format("MMMM Do")}{" "}
        -{" "}
        {moment()
          .add(1, "weeks")
          .endOf("isoWeek")
          .format("MMMM Do")}
      </>
    );
  } else {
    return (
      <>
        Week of{" "}
        {moment()
          .startOf("isoWeek")
          .format("MMMM Do")}{" "}
        -{" "}
        {moment()
          .endOf("isoWeek")
          .format("MMMM Do")}
      </>
    );
  }
};
