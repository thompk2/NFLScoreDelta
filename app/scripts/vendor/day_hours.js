/**
 * day_hours.js
 *
 * @author Eric Metcalf
 */

/**
 * Class to calculate 12-hour clock hours.
 * 
 * Wrote because easier than to manipulate using Date.
 * Doesn't figure if am or pm.
 */
function DayHours(currentHour) {
  this.currentHour = currentHour;
  this.hoursList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  this.addHour = DayHoursAddHour;
  this.subtractHour = DayHoursSubtractHour;
  this.addHours = DayHoursAddHours;
  this.subtractHours = DayHoursSubtractHours;
}

/**
 * Adds an hour, rolling to 1 after 12.
 */
function DayHoursAddHour() {
  if ((this.currentHour + 1) > 12) {
    this.currentHour = 1
  } else {
    this.currentHour++;
  }
}

/**
 * Substracts an hour, rolling to 12 after 1.
 */
function DayHoursSubtractHour() {
  if ((this.currentHour - 1) < 1) {
    this.currentHour = 12
  } else {
    this.currentHour--;
  }
}

/**
 * Adds number of hours.
 *
 * @param {int} hours Number of hours to add.
 */
function DayHoursAddHours(hours) {
  for (var i = 0; i < hours; i++) {
    this.addHour();
  }
}
 
/**
 * Substracts number of hours.
 *
 * @param {int} hours Number of hours to subtract.
 */ 
function DayHoursSubtractHours(hours) {
  for (var i = 0; i < hours; i++) {
    this.subtractHour();
  }
}
