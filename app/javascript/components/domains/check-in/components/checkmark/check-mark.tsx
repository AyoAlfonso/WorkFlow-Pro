import React from "react";
import "../../../../../stylesheets/check.scss";

export const CheckMark = (): JSX.Element => {
  return (
    <div className="checkmark-div">
      <div className="checkmark draw"></div>
    </div>
  );
};
