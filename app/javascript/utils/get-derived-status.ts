export const getDerviedStatus = (keyResults: Array<any>) => {
  const statusValueArray = [];
  for (let i = 0; i < keyResults.length; i++) {
    const value = getValue(keyResults[i].status);
    statusValueArray.push(value);
  }

  const avg = Math.floor(average(statusValueArray));

 if (avg >= 85) {
    return "completed";
  } else if (85 > avg && avg >= 70) {
    return "in_progress";
  } else if (70 > avg && avg >= 50) {
    return "incomplete";
  } else return "unstarted";
};

const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

const getValue = status => {
  switch (status) {
    case "incomplete":
      return 50;
    case "in_progress":
      return 70;
    case "completed":
      return 100;
    case "done":
      return 100;
    default:
      return 0;
  }
};
