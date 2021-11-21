export const getNoticationName = type => {
  let notificationName = type;
  switch (notificationName) {
    case "Daily Planning":
      notificationName = "Today's Focus";
      break;
    case "Weekly Planning":
      notificationName = "Weekly Review";
      break;
    case "Weekly Checkin":
      notificationName = "Weekly Check In";
      break;
  }
  return notificationName;
};
