'use strict';

const moment = require('moment');

const TIMEOUT_MS  = 1000/*milliseconds*/;
const TIMELIMIT_S = 10/*seconds*/;

const TIMEFORMAT_24HR             = 'HH:mm:ss';
const TIMEFORMAT_12HR             = 'hh:mm:ss';
const TIMEFORMAT_CHANGE_INTERVAL  = 10000/*milliseconds*/;

/* ==========================================================================
   File:
   Class:              PodfeetDemo
   Description:	       Class Demonstration for Allison's Clock Question
   Copyright:          May 2020
   ========================================================================== */
class PodfeetDemo {
  /* ========================================================================
   Description:    Constructor

   @param {number} [id] - Identifier for recognizing specific instances of a class

   @return {object}  - Instance of PodfeetDemo

   @throws {TypeError}  - thrown if 'id' is not a number.
   ======================================================================== */
  constructor(id) {

    if (typeof(id) !== 'number') {
      throw new TypeError(`id needs to be a number. id=${id}`);
    }

    // Cache the id
    this._id = id;

    // Bind to this instance's OnTimeout function for use with setInterval.
    this._OnTimeoutCB = this.OnTimeout.bind(this);

    // Cache the timer id's
    this._IntervalId = undefined;
  }

  /* ========================================================================
     Description:    Read-Only Property Accessor for the Identifier

     @return {number}  - Instance identifier
  ======================================================================== */
  get Id() {
    return this._id;
  }

  /* ========================================================================
     Description:    Interval timer callback

     @remarks Invoked based on setInterval() called from StartMe()
  ======================================================================== */
  OnTimeout() {
    // Get the current time via the moment API.
    const theMoment = moment().format(PodfeetDemo.TimeFormat);

    // Show 'the moment' so @Podfeet can see the format change on both instances every TIMEFORMAT_CHANGE_INTERVAL
    console.log(`The moment from Instance#${this.Id} is: ${theMoment}`);
  }

  /* ========================================================================
     Description:    Initiates decoupled time updates via setInterval()
  ======================================================================== */
  StartMe() {
    // Kick off the intervals with and without binding to the callback.
    this._IntervalId = setInterval(this._OnTimeoutCB, TIMEOUT_MS);
  }

  /* ========================================================================
     Description:    Stops the periodic timer
  ======================================================================== */
  KillMe() {
    if (this._IntervalId) {
      clearInterval(this._IntervalId);
      this._IntervalId = undefined;
    }
  }

  /* ========================================================================
     Description: Static 'setter' property accessor for the time format to use
                  for displaying the time.

     @param {string} [format] - Format to use for displaying the time from MomentJS

     @throws {TypeError}  - thrown if 'format' is not a string

     @remarks Assumes a good developer has passed a valid format!!
  ======================================================================== */
  static set TimeFormat(format) {
    if (typeof(format) !== 'string') {
      throw new TypeError(`format must be a string.....and make it a valid one b/c I am too tired to try to validate that!! format=${format}`);
    }

    // Assume the good developer has passed a valid time format string and
    // update the static variable for all instances to shate.
    PodfeetDemo._theTimeFormat = format;
  }

  /* ========================================================================
     Description: Static 'getter' property accessor for the time format to use
                  for displaying the time.

     @return {string} - Format to use for displaying the time from MomentJS

     @remarks Assumes a good developer has passed a valid format!!
  ======================================================================== */
  static get TimeFormat() {
    // If there is no static member variable for the format, set that now.
    if (!PodfeetDemo._theTimeFormat) {
      // The class does not yet have a time format. Use the setter to make one.
      PodfeetDemo.TimeFormat = TIMEFORMAT_24HR;
    }

    // Return the static time format shared by all the instances of PodfeetDemo
    return PodfeetDemo._theTimeFormat;
  }
}

/* ========================================================================
   Description:    Quick hack to change the timeformat for all the PodfeetDemo's
   ======================================================================== */
function ToggleTimeFormat() {
  if (TIMEFORMAT_24HR === PodfeetDemo.TimeFormat) {
    PodfeetDemo.TimeFormat = TIMEFORMAT_12HR;
  }
  else {
    PodfeetDemo.TimeFormat = TIMEFORMAT_24HR;
  }

  // Set another timeout to toggle the time format back.
  setTimeout(ToggleTimeFormat, TIMEFORMAT_CHANGE_INTERVAL);
}

/* ========================================================================
   Script implementation starts here !
======================================================================== */
const podfeet1 = new PodfeetDemo(1);
const podfeet2 = new PodfeetDemo(2);
podfeet1.StartMe();
podfeet2.StartMe();

// Kick off a one-use timer to toggle the time format.
setTimeout(ToggleTimeFormat, TIMEFORMAT_CHANGE_INTERVAL);
