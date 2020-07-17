import React, { useState } from "react";

export const Notifications = (): JSX.Element => {
  return (
    <div>
      Table with following columns:
      <p>Name of the notification</p>
      <p>Repeat pattern (if applicable) (i.e. Monthly on fourth Friday)</p>
      <p>Time (if applicable)</p>
      <p>Notification (checkbox) (in beta)</p>
      <p>Email (checkbox)</p>
    </div>
  );
};
