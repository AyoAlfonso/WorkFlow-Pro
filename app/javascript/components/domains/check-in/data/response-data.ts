import moment from "moment";

export const cadenceOptions = [
  "Once",
  "Daily",
  "Every Weekday",
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "Quarterly",
];

export const timelineLabels = (desiredStartTime: string, interval: number, period: any) => {
  const periodsInADay = moment.duration(1, "day").as(period);

  const timeLabels = [];
  const startTimeMoment = moment(desiredStartTime, "hh:mm");
  for (let i = 0; i <= periodsInADay; i += interval) {
    startTimeMoment.add(i === 0 ? 0 : interval, period);
    timeLabels.push(startTimeMoment.format("hh:mm A"));
  }

  return timeLabels.slice(0, -1);
};

