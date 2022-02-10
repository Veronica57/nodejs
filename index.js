// input date format hh-DD-MM-YYYY
import "moment-precise-range-plugin";
import moment, { preciseDiff } from "moment";
import EventEmitter from "events";
const [dateStringInFuture] = process.argv.slice(2);
const DATE_FORMAT_PATTERN = "YYYY-MM-DD HH:mm:ss";

/**
 * String to Date
 * @param dateString
 * @returns {Date}
 */
const getDateFromDateString = (dateString) => {
  const [hour, day, month, year] = dateString.split("-");

  return new Date(Date.UTC(year, month - 1, day, hour));
};

/**
 * Function outputs / completes timer
 * @param {Date} dateInFuture
 */
const showRemainingTime = (dateInFuture) => {
  const dateNow = new Date();

  if (dateNow >= dateInFuture) {
    emitter.emit("timerEnd");
  } else {
    const currentDateFormatted = moment(dateNow, DATE_FORMAT_PATTERN);
    const futureDateFormatted = moment(dateInFuture, DATE_FORMAT_PATTERN);
    const diff = preciseDiff(currentDateFormatted, futureDateFormatted);

    console.clear();
    console.log(diff);
  }
};

/**
 * Function completes timer
 * @param {Number} timerId
 */
const showTimerDone = (timerId) => {
  clearInterval(timerId);
  console.log("Таймер истек");
};

const emitter = new EventEmitter();
const dateInFuture = getDateFromDateString(dateStringInFuture);
const timerId = setInterval(() => {
  emitter.emit("timerTick", dateInFuture);
}, 1000);

emitter.on("timerTick", showRemainingTime);
emitter.on("timerEnd", () => {
  showTimerDone(timerId);
});
