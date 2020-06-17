import * as React from "react";
import IcoMoon from "react-icomoon";
const iconSet = require("../../assets/icons/selection.json");

/*
  attachment
  attachment-1
  chevron
  chevron-1
  chevron-2
  chevron-3
  close
  comment
  comment-1
  company
  company-1
  deadline-calendar
  deadline-calendar-1
  deadline-calendar-2 
  deadline-calendar-3
  delete
  download
  edit
  edit-2
  emotion-A
  emotion-B
  emotion-C
  emotion-D
  emotion-E
  frog
  help
  help-1
  home
  home-1
  log-out
  alert
  move
  new-user
  notification
  plus
  priority-high-1
  priority-high
  urgent
  search
  settings-1
  settings
  tasks-1
  tasks
  team-3 
  global-add
*/

const Icon = ({ ...props }) => {
  return <IcoMoon iconSet={iconSet} {...props} />;
};

export default Icon;
