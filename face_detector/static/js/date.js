const timeHourElement = document.getElementById("time-hour");
const timeMinutesElement = document.getElementById("time-minutes");
const dateElement = document.getElementById("date");

/* TIME */

function formatTime(date) {
  const hours24 = date.getHours() % 24 || 24;
  const minutes = date.getMinutes();

  const formattedHour = `${hours24.toString().padStart(2, "0")}.`;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  timeHourElement.textContent = formattedHour;
  timeMinutesElement.textContent = formattedMinutes;
}


/* CLOSE TIME */

/* DATE */

  function formatDate(date) {
    const DAYS = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  
    return `${DAYS[date.getDay()]}, ${
      MONTHS[date.getMonth()]
    } ${date.getDate()} ${date.getFullYear()}`;
  }

/* CLOSE DATE */


setInterval(() => {
  const now = new Date();
  formatTime(now);
  dateElement.textContent = formatDate(now);
}, 200);
