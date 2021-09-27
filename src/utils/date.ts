import i18n from "@/i18n";

enum Type {
  "24h" = "0",
  "12h" = "1",
}

function formatAmPm(date: Date) {
  let hours = date.getHours();
  let minutes: number | string = date.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + amPm;
  return strTime;
}

function getFullTime(date: Date, type?: Type) {
  if (type === Type["12h"]) {
    return formatAmPm(date);
  }
  let finalTime = "";
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (hours <= 9) {
    finalTime = `0${hours}`;
  } else {
    finalTime = `${hours}`;
  }

  if (minutes <= 9) {
    finalTime += `:0${minutes}`;
  } else {
    finalTime += `:${minutes}`;
  }
  return finalTime;
}

export function time(milliseconds: number, type?: Type) {
  const messageDate = new Date(milliseconds);
  return getFullTime(messageDate, type);
}
function sameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
function yesterDay(date: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return sameDay(yesterday, date);
}

function getFullDateWithTime(date: Date, type?: Type) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  return `${dayName} ${date.getDate()} ${monthName} ${date.getFullYear()} at ${getFullTime(
    date,
    type
  )}`;
}

export default (milliseconds: number, type?: Type) => {
  let friendlyDate = "";
  const now = new Date();
  const messageDate = new Date(milliseconds);

  if (sameDay(now, messageDate)) {
    friendlyDate = i18n.global.t("time.today-at", [
      getFullTime(messageDate, type),
    ]) as string;
  } else if (yesterDay(messageDate)) {
    friendlyDate = i18n.global.t("time.yesterday-at", [
      getFullTime(messageDate, type),
    ]) as string;
  } else {
    friendlyDate = getFullDateWithTime(messageDate, type);
  }
  return friendlyDate;
};
