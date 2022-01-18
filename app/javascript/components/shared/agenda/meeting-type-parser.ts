import humanizeString from "humanize-string"

export const meetingTypeParser = (meetingType: string) : string => {
  switch(meetingType) {
    case "forum_monthly":
      return "Forum Meeting"
    default:
      return humanizeString(meetingType);
  }
}