/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// 
// Define globally-scoped variables
// 
//

// TODO: do this!
// FIXME: I need fixing
// BUG: another bug
// HACK: this is a hack
// NOTE: This is a note 
// SQUIRREL: this is a squirrel

// Variables Representing Optional Time formats
let h = "h";
let m = "mm";
let s = "ss a";
let TIME12WSEC = "DD MMMM YYYY h:mm:ss a";
let TIME12WOSEC = "DD MMMM YYYY h:mm a";
let TIME24WSEC = "DD MMMM YYYY HH:mm:ss";
let TIME24WOSEC = "DD MMMM YYYY HH:mm";
let FORMATTEDTIME = TIME12WSEC; // Default formatted time
//
let TRUESECONDS = true; // boolean true if show seconds is true
let TRUE12HR = true; // boolean true if numHrs is 12

// TimeShifter variables
let hrsShifted = "";
let minShifted = "";

// Create an array from the official list of timezone names
let TzNamesArray = moment.tz.names();
// don't understand this but it takes the array which is just a list of the region/city and makes it into an object where the key is the region/city and so is the value. which for some reason works in autocomplete!
let tzNamesObject = TzNamesArray.reduce(function (o, val) {
  o[val.replace("_", " ")] = val;
  return o;
}, {});

// declare two global moment objects to be used in 12/24 hour toggle
// FIXME: These need to not be specific like this
let momentObjST1 = {};
let momentObjST2 = {};

// attributes of local time and 2 default time-shifting clocks
// will be used to create clocks in the makeClocks function
let clockAttributesArray = [
  {
    clockPlaceholder: staticClocksPlaceholder,
    timeDescriptionID: "localID",
    clockBorder: "",
    timeDescription: "Your current local time is:",
    timeID: "localTime",
    timeFormat: TIME12WSEC,
    location: moment.tz.guess(true),
    timeShifted: false,
  },
  {
    timeDescriptionID: "searchTSID-1",
    clockBorder: "border border-primary rounded",
    timeDescription: "The time in Los Angeles becomes:",
    timeID: "searchTime-1",
    timeFormat: TIME12WSEC,
    timeShifted: true,
    location: "America/Los_Angeles",
    searchBoxDivID: "sbsearchClockDiv-1",
    searchBoxID: "sbsearchClock-1",
    clockPlaceholder: shiftingClocksPlaceholder,
  },
  {
    timeDescriptionID: "searchTSID-2",
    clockBorder: "border border-primary rounded",
    //timeDescription: 'Time in Europe/Dublin becomes:',
    timeDescription: "Time in Europe/Dublin becomes:",
    timeID: "searchTime-2",
    timeFormat: TIME12WSEC,
    timeShifted: true,
    location: "Europe/Dublin",
    searchBoxDivID: "sbsearchClockDiv-2",
    searchBoxID: "sbsearchClock-2",
    clockPlaceholder: shiftingClocksPlaceholder,
  },
];
// I'll be pushing all time-shifting clocks into this array
let arrayOfClocks = [];
// clock 0 is local time
// clocks 1 and 2 are default clocks, numCl is a counter of clocks
let numCl = 2;

// All locations will be pushed into here
let arrayOfLocations = [];

//
// Document Ready Handler
//
$(function () {
  /**
   * A class to create clocks
   *
   * Dictionary to build the clock:
   * @timeDescription - The text to explain what clock is showing
   * @#timeID - name for the id of the div that will hold the clock
   * @location - if specifying a particular location, a string of the format "region/city" per zones.js
   * @interval - boolean if true, setInterval() fires and keeps clock updated. Static clocks required for Time Shifting
   * @startTimeH - for static clocks, the hour on which to start display
   * @FORMATTEDTIME - string - global variable holding the format for displaying the time as chosen by show/hide seconds and 12/24 clock check boxes
   *
   * Instance functions:
   * @aRenderTime - renders the html for the clocks with inputs of timeID,location and time format
   * @clockInterval - sets the interval for the clock
   * Errors thrown e.g. @throws {RangeError} and why
   * Errors thrown e.g. @throws {TypeError} and why
   */
  class AClock {
    // ************************** //
    // Define Getters and Setters //
    // ************************** //

    // Clock will go into either the existing shifting or static placeholder div
    /**
     * @type {object} div where the clock will be placed, default is shiftingClocksPlaceholder
     */
    get clockPlaceholder() {
      return this._clockPlaceholder;
    }
    /**
     * @type {object} div where the clock will be placed
     * @throws {RangeError} if not one of two values
     */
    set clockPlaceholder(cph) {
      if (cph == shiftingClocksPlaceholder || cph == staticClocksPlaceholder) {
        this._clockPlaceholder = cph;
      } else {
        throw new RangeError(
          `clockPlaceholder must be either shiftingClocksPlaceholder or staticClocksPlaceholder`
        );
      }
      this._clockPlaceholder = cph;
    }
    //
    // Create the ID into which the description for the clock instance will be placed
    //
    /**
     * @type {string}
     */
    get timeDescriptionID() {
      return this._timeDescriptionID;
    }
    /**
     * @type {string}
     * @throws {TypeError}
     * // no range error because I have a default
     */
    set timeDescriptionID(tdid) {
      if (is.not.string(tdid)) {
        throw new TypeError("Time description ID must be a string");
      }
      this._timeDescriptionID = tdid;
    }
    // Create border around clocks
    /**
     * @type {string}
     */
    get clockBorder() {
      return this._clockBorder;
    }
    /**
     * @type {string}
     * @throws {RangeError}
     */
    set clockBorder(brdr) {
      // need to define range error - annoying because so many wrong answers
      this._clockBorder = brdr;
    }
    //
    // Create the description of the clock instance
    //
    /**
     *
     * @type {string}
     */
    get timeDescription() {
      return this._timeDescription;
    }
    /**
     * @type {string}
     * @throws {TypeError}
     * // no range error because I have a default
     */
    set timeDescription(td) {
      if (is.not.string(td)) {
        throw new TypeError("Time description must be a string");
      }
      this._timeDescription = td;
    }
    //
    // the ID into which the clock will be placed
    //
    /**
     * @type {string}
     */
    get timeID() {
      return this._timeID;
    }
    /**
     * @type {string}
     * @throws {TypeError}
     * @throws {RangeError}
     */
    set timeID(tid) {
      if (is.not.string(tid)) {
        throw new TypeError("timeID must be a string");
      }
      if (is.empty(tid)) {
        throw new RangeError("You must enter a timeID");
      }
      this._timeID = tid;
    }

    // Determine if clock will be timeshifted or static
    // If static it will update with interval
    /**
     * @type {Boolean}
     */
    get timeShifted() {
      return this._timeShifted;
    }
    /**
     * @type {boolean} defaults to true
     * @throws {TypeError} if not boolean
     */
    set timeShifted(ts) {
      if (typeof ts === "boolean") {
        this._timeShifted = ts;
      } else {
        if (typeof ts === "undefined") {
          this._timeShifted = true;
        } else {
          throw new TypeError("timeShifted must be true or false");
        }
      }
    }
    // Choose a time format
    /**
     * @type {string}
     */
    get timeFormat() {
      return this._timeFormat;
    }
    /**
     * @type {string}
     * @throws {TypeError} if not one of two variables
     */
    set timeFormat(tf) {
      if (tf == TIME12WSEC || tf == TIME24WSEC) {
        this._timeFormat = tf;
      } else {
        if (tf === "undefined") {
          tf = FORMATTEDTIME;
        } else {
          throw new RangeError("timeFormat must be TIME12WSEC or TIME24WSEC");
        }
      }
    }
    // ID for the Div to hold the search box
    /**
     * @typeof {string} Unique name of div for search box
     */
    get searchBoxDivID() {
      return this._searchBoxDivID;
    }
    /**
     * @type {string}
     * @throws {TypeError}
     * @throws {RangeError}
     */
    set searchBoxDivID(sbdid) {
      if (!sbdid) {
        return;
      } else {
        if (is.not.string(sbdid)) {
          throw new TypeError("searchBoxDivID must be a string");
        } else {
          this._searchBoxDivID = sbdid;
        }
      }
    }
    // ID for the search box itself
    /**
     * @typeof {string} Unique name of div for search box
     */
    get searchBoxID() {
      return this._searchBoxID;
    }
    /**
     * @type {string}
     * @throws {TypeError}
     */
    set searchBoxID(sbid) {
      if (!sbid) {
        return;
      }
      if (is.not.string(sbid)) {
        throw new TypeError("searchBoxID must be a string");
      }
      this._searchBoxID = sbid;
    }

    /**
     *
     * @typeof {string} location
     */
    get location() {
      return this._location;
    }
    /**
     *
     * @typeof {string} location
     * @throws {typeError}
     * @throws {rangeError} if not from the TzNamesArray values
     */
    set location(loc) {
      if (is.not.string(loc)) {
        throw new TypeError("Location must be a string");
      } else {
        if (!TzNamesArray.includes(loc)) {
          throw new RangeError(
            "Location must be a city listed in moment.tz.names() from moment.js"
          );
        } else {
          this._location = loc;
        }
      }
    }

    // ********************** //
    // define the constructor //
    // ********************** //

    constructor(details) {
      // Choose whether clock goes in shifting or static div
      this.clockPlaceholder = details.clockPlaceholder;

      // Text to be shown before time in clock
      this.timeDescriptionID = details.timeDescriptionID;
      this.timeDescription = details.timeDescription; // could throw error

      // set background color of clock
      // this.bgcolor = details.bgcolor;

      // set border for clock
      this.clockBorder = details.clockBorder;

      // Unique IDs to hold the time (must have values)
      this.timeID = details.timeID; // could throw error

      // Setting default location of clock if not defined
      this.location = details.location;

      // determine if the clock will move with the timeshifter
      this.timeShifted = details.timeShifted;

      // time format variable to allow change with slider
      this.timeFormat = details.timeFormat;

      // Unique Div to hold the text box for search
      this.searchBoxDivID = details.searchBoxDivID;

      // Unique ID to hold the text box for search
      this.searchBoxID = details.searchBoxID;

      // Apply font awesome to only shifting clocks
      this.fas = details.fas;

      // Put the clocks up, enable/disable interval, and enable timeshifting
      this.putClockUp();
      this.clockInterval();
      // this.shiftTime();
      this.addSearchBox();
    }
    // ****************************** //
    //  Define the Instance functions //
    // ****************************** //
    aRenderTime() {
      $(`#${this.timeID}`).html(moment.tz(this.location).format(FORMATTEDTIME));
    }

    // Render the html for the clocks
    putClockUp() {
      // Convert the placeholder template script to a string
      let clockCardTemplate = $("#clockCards").html();
      // render the html for the clocks
      $(this.clockPlaceholder).append(Mustache.render(clockCardTemplate, this));
      this.aRenderTime();
    }

    clockInterval() {
      // only static clocks show changing seconds
      if (!this.timeShifted) {
        setInterval(this.aRenderTime.bind(this), 1000);
      } else {
        return;
      }
    }

    // Add text search box for cities
    addSearchBox() {
      if (this.timeShifted) {
        if (this.searchBoxDivID) {
          if (this.searchBoxID) {
            const $thisSearchBox = $('<input type="text">')
              .addClass("mySearchboxes w-100 border-0")
              .attr("id", `${this.searchBoxID}`)
              .attr("placeholder", `default: ${this.location}`);
            // define a variable for the div which will hold the <input> text box
            let aSearchBoxDivID = $(`#${this.searchBoxDivID}`);
            aSearchBoxDivID.append($thisSearchBox);
          } else {
            throw new Error(
              "You must provide a searchBoxID for the search box"
            );
          }
        } else {
          throw new Error(
            "You must provide a searchBoxDivID to hold the search box"
          );
        }
      } else {
        return;
      }
    }
  } // complete AClock Class definition

  // Create a function to make the clocks
  // Accept parameters a,b,c,d as the query string values to populate searchClock1 and 2 for location and timeDescription
  // a and c are the location names in the search boxes
  // b and d are the timeDescriptions, e.g. "Time in Europe/London becomes"

  for (i = 0; i < clockAttributesArray.length; i++) {
    let x = new AClock(clockAttributesArray[i]);
    arrayOfClocks.push(x);

    // this builds an array of the locations of each clock (in quotes!), which can be inserted into the URL with a loop on arrayOfLocations[i]
    
    let y = clockAttributesArray[i].location;
    arrayOfLocations.push(y);
  
  // console.log(`All locations: ${arrayOfLocations}`); // csv of locations not the array itself
  // console.log(arrayOfLocations); // the array itself

  }
  // click handler to add a another city clock
  $("#addClock").click(function () {
    numCl = numCl + 1; // increment sequence to
    clockAttributesArray.push({
      timeDescriptionID: `searchTSID-${numCl}`,
      clockBorder: "border border-primary rounded",
      timeDescription: "The time in New Zealand becomes:",
      timeID: `searchTime-${numCl}`,
      timeFormat: TIME12WSEC,
      timeShifted: true,
      location: "Pacific/Auckland",
      searchBoxDivID: `sbsearchClockDiv-${numCl}`,
      searchBoxID: `sbsearchClock-${numCl}`,
      clockPlaceholder: shiftingClocksPlaceholder,
    });
    // create another clock with the attributes
    let x = new AClock(clockAttributesArray[numCl]);
    arrayOfClocks.push(x);
    arrayOfLocations.push(x.location);
    // need to render all the clocks
    addAutocomplete();

    console.log(`arrayOfLocations is updated to: ${arrayOfLocations}`);
  });

  // ********************************************************* //
  // Check Query String, set defaults if empty                 //
  // ********************************************************* //

  // pull the query string that may have been received in the URL
  const queryStringReceived = window.location.search;

  // Determine if URL has a query string and pass values to search clocks or send defaults if not

  // SQUIRREL: This code works to modify clockAttributesArray but the clocks themselves don't update. see ~line 678 fimctopm setTimesFromURL()
  function checkQuery() {
    // if URL has no query string use these defaults
    if (queryStringReceived !== "") {
     let searchParams = new URLSearchParams(queryStringReceived);
     let paramArray = [];
     for (let pair of searchParams.entries()){
       paramArray.push(pair);
      let utcT = paramArray[0][1] // this should be the real utcT
      for (i=1; i < paramArray.length; i++){
        clockAttributesArray[i].location = paramArray[i][1];
        clockAttributesArray[i].timeDescription = `The time in ${paramArray[i][1]} becomes:`
        // SQUIRREL: I think I was supposed to created sc1 and sC2, etc.
      }
     }
    }
    // TODO: Add time toggle to URL - was &time12=true 
  }

  checkQuery();

  // make the individual clocks:
  // pass parameters for cities and locations to searchClock 1 and 2  that were parsed from the URL query string
  // makeClocks(sC1,sTD1,sC2,sTD2);

  // Set time on searchClocks to the entered location

  function onSelectItem(item) {
    // console.log(`ID of search box is ${item.parentIDIndex}`); // returns correct ID e.g. "1"
    let x = item.parentIDIndex;
    let selectedSearchBox = clockAttributesArray[x];

    // set the location to the selected city
    selectedSearchBox.location = `${item.value}`;

    // console.log(`selectedSearchBox location is ${selectedSearchBox.location}`); // correctly shows new location

    // set the description to match selected city
    selectedSearchBox.timeDescription = `Time in ${item.label} becomes:`;
    // render the time description in the clock
    $(`#${selectedSearchBox.timeDescriptionID}`).html(
      selectedSearchBox.timeDescription
    );
    $(`#${selectedSearchBox.timeID}`).html(
      moment.tz(selectedSearchBox.location).format(FORMATTEDTIME)
    );
    // change city in arrayOfLocations
    
    // SQUIRREL:  note that clicking in EITHER city box throws an error "Emtpy string passed to getElementByID(). says FormAutofillHeuristics.jsm:403:22" doesn't seem to hurt anything tho?

    // console.log(`array of locations before thinks it is ${arrayOfLocations}`); 

    arrayOfLocations[x] = selectedSearchBox.location;

    // console.log(`this location is ${arrayOfLocations[x]}`);
    // console.log(`arrayOfLocations after change city: ${arrayOfLocations}`);

    clockAttributesArray.forEach(function (element, index) {
      if (index < 1) {
        return;
      } else {
        $(`#${element.timeID}`).html(
          moment.tz(element.location).format(FORMATTEDTIME)
        );
      }
    });

    // reset range slider and label back to 0
    $("input[type=range]").val(0);
    showSliderLabel();
  }

  // Click function for 12/24 hour toggle
  $("#numHrs").click(function () {
    // run ifTrue function which sets the FORMATTEDTIME variable to either 12 (checked) or 24 (unchecked). Just sets this value, no visual change onscreen
    ifTrue();

    // Create moment objects for every clock with the time delivered by the query string (if there is one)
    for (i = 1; i < clockAttributesArray.length; i++) {
      // console.log(`searchTime-${i}`);
      if (window.location.search && $(".slider_label") == 0) {
        // console.log('found a search query');
        const queryStringSend = window.location.search;
        myUrlParam = new URLSearchParams(queryStringSend);
        // create moment objects from the strings for the received time in the URL
        // This works perfectly - keeps the times that came in and does the 12/24 toggle
        momentObjST = moment(`${myUrlParam.get(`searchTime-${i}`)}`);
        // momentObjST2 = moment(`${myUrlParam.get('searchtime2')}`);
      } else {
        // creates strings from the visible time values for time-shifted clocks
        let searchT = $(`#searchTime-${i}`).html();
        // creates a moment object from time strings
        momentObjST = moment(searchT,FORMATTEDTIME);
        // render moment objects with toggled time format back into clocks
        $(`#searchTime-${i}`).html(momentObjST.format(FORMATTEDTIME));
      } // end else
    } // end for loop through clock attributes
  });

  // function to show value chosen on range sliders
  // https://codepen.io/prasanthmj/pen/OxoamJ
  function showSliderLabel() {
    $(function () {
      $(".slider").on("input change", function () {
        $(this).next($(".slider_label")).html(this.value);
      });
      $(".slider_label").each(function () {
        var value = $(this).prev().attr("value");
        $(this).html(value);
      });
    });
  }
  showSliderLabel();

  // event handler to shift time with slider

  $("#changeHrs").on("input change", function () {
    for (i = 1; i < clockAttributesArray.length; i++) {
      let timeShiftedVal = $("input[type=range]").val();
      let thisLocation = `${clockAttributesArray[i].location}`;
      // create a moment object for the time at this location
      let thisTime = moment.tz(thisLocation);
      // create moment object for the time rounded down to nearest hour
      let roundDownTime = thisTime.startOf("h");
      // shift hours by adding the slider's offset to the rounded down time and putting it back into the correct ID
      $(`#${clockAttributesArray[i].timeID}`).html(
        roundDownTime.add(timeShiftedVal, "h").format(FORMATTEDTIME)
      );
    }
  });

  // Adds Bootstrap autocomplete function to the ID #myAutocomplete

  // was $('#sbsearchClock1').autocomplete({ })
  function addAutocomplete() {
    // start i at [1] because [0] is non-time-shifting local time
    for (i = 1; i < clockAttributesArray.length; i++) {
      $(`#${clockAttributesArray[i].searchBoxID}`).autocomplete({
        source: tzNamesObject, // dictionary object with the values from which to search
        onSelectItem: onSelectItem, // callback to run when item is selected
        highlightTyped: false, // if typed text is highlighted in search results, the name gets broken in two for screen readers. e.g. "Det roit"
        threshold: 3, // minimum characters to search before it starts displaying
        parentIDIndex: i, //
      });
    }
  }

  addAutocomplete();

  // ********************************************************* //
  // Click Handler checking for 12/24 hr //
  // ********************************************************* //
  /**
   * Define Time format
   *
   * What comes in:
   * @numHrs {string} 12 or 24
   * @return {string} Returns a string that defines the time format
   */

  function ifTrue() {
    TRUE12HR = $("input[id][name$='numHrs']").prop("checked");
    if (TRUE12HR) {
      FORMATTEDTIME = TIME12WOSEC;
    } else {
      FORMATTEDTIME = TIME24WOSEC;
    }
  }
  // ========================
  // creating sendable times
  //=========================

  // Extract information from clocks

  // ========================
  // UTC TIME CONVERSION 
  //=========================

  // #searchTime-1 will always exist, it's the first clock
  let sl1 = clockAttributesArray[1].location; // search location 1 (default Los Angeles)
  console.log(`Reference city is ${sl1}`);
  let st1 = $("#searchTime-1").html(); // search time 1
  console.log(`Time in reference city is ${st1}`);
  // convert the first time and location into UTC time
  let utcT = moment.tz(st1, FORMATTEDTIME, sl1).utc().format(); // converting st1 to UTC time
  console.log(`UTC time is ${utcT}`);

  // Given the time in UTC, how do I convert that back to the time in the reference city?
  let convertedBack = moment.utc(utcT).tz(sl1).format(FORMATTEDTIME)
  console.log(`Time back in LA is ${convertedBack}`); // This shows correctly returned time in FORMATTEDTIME

  
  function setTimesFromURL() {
    if (window.location.search) {
      // queryStringSend;
      // myUrlParam = new URLSearchParams(queryStringSend);
      // set times
      // Set 12/24 hour toggle to match format of incoming times
      // FIXME time param isn't in the URL yet (was &time12=true)
      // time12 = myUrlParam.get("time12");
      // if (time12 == "false") {
      //   $("#numHrs").prop("checked", false);
      //   FORMATTEDTIME = TIME24WSEC;
      // }
      //sendableURL will come in like this with unknown number of sloc[i]
      // http://localhost:8888/time-shifter-clock/?utcT="2021-04-14T04:23:43Z"&sloc1=America/Los_Angeles&sloc2=Europe/Dublin

      // ********************************************************* //
      // Check Query String, set defaults if empty                 //
      // ********************************************************* //

      // pull the query string that may have been received in the URL
      const queryStringReceived = window.location.search;
      // Determine if URL has a query string and pass values to search clocks or send defaults if not
      // SQUIRREL: This code works to modify clockAttributesArray but the clocks themselves don't update. see ~line 678 fimctopm setTimesFromURL()
      // BUG: this FAILS if there are 3 clocks since it doens't know where to put that third location - there aren't already 3 clocks
      function checkQuery() {
        // if URL has no query string use these defaults
        let searchParams = new URLSearchParams(queryStringReceived);
        let paramArray = [];
        for (let pair of searchParams.entries()){
          paramArray.push(pair);
          for (i=1; i < paramArray.length; i++){
            clockAttributesArray[i].location = paramArray[i][1];
            clockAttributesArray[i].timeDescription = `The time in ${paramArray[i][1]} becomes:`
            // SQUIRREL: I think I was supposed to created sc1 and sC2, etc.
          }
          let utcT = paramArray[0][1] // this should be the real utcT
          console.log(`utcT from the URL is ${utcT}`);
        }
      }
      checkQuery();


      // $("#localTSTime").html(`${myUrlParam.get("loctime")}`); // this is always true
      // $("#search1Time").html(`${myUrlParam.get("searchtime1")}`);
      // $("#search2Time").html(`${myUrlParam.get("searchtime2")}`);

      // // set location names (timeDescription)
      // // $('#localTSID').html(`${myUrlParam.get('localTimeDesc')}`)
      // $("#search1TSID").html(`${myUrlParam.get("searchTimeDesc1")}`);
      // $("#search2TSID").html(`${myUrlParam.get("searchTimeDesc2")}`);
      // // if no search city is entered, this will be blank
      // $("#sbsearchClock1").val(`${myUrlParam.get("searchCity1")}`);
      // $("#sbsearchClock2").val(`${myUrlParam.get("searchCity2")}`);
    }
  }
  setTimesFromURL();
  // ================================================================
  // New and improved event handler for copy button to create the URL
  // ================================================================
  $("#copyBtn").click(function () {
    function createURL() {
      // split the url to remove any existing search queries
      let thisURL = $(location).attr("href").split("?")[0];
      
      // create the url adding FORMATTEDTIME to the end
      // sendableURL = `${thisURL}?searchtime1=${sT1}&searchtime2=${sT2}&searchTimeDesc1=${sTD1}&searchTimeDesc2=${sTD2}&searchCity1=${sC1}&searchCity2=${sC2}&time12=${time12}`;

      // I need to build a string with a loop
      let sendableURL = `${thisURL}?`;
      
      // Find Time in UTC
      // #searchTime-1 will always exist, it's the first clock
      let sl1 = clockAttributesArray[1].location; // search location 1 (default Los Angeles)
      // console.log(`Reference city is ${sl1}`);
      let st1 = $("#searchTime-1").html(); // search time 1
      // console.log(`Time in reference city is ${st1}`);
      // convert the first time and location into UTC time
      let utcT = moment.tz(st1, FORMATTEDTIME, sl1).utc().format(); // converting st1 to UTC time
      // console.log(`UTC time is ${utcT}`);
      sendableURL += `utcT=${utcT}`

      for (i = 1; i < arrayOfLocations.length; i++){
        // sl means search location
        let sl = arrayOfLocations[i];
        console.log(`search location is ${sl}`); // sl is the city name in the loop
        //searchtime1=${sT1}
      
        sendableURL += `&sloc${i}` + `=` + `${sl}`;
      }
      console.log(sendableURL); // returns http://localhost:8888/time-shifter-clock/?utcT="2021-04-14T04:13:25Z"&sloc1=America/Los_Angeles&sloc2=Europe/Dublin&sloc3=Pacific/Auckland&sloc4=America/Detroit


      async function writeURLtoClipboard(text) {
        try {
          await navigator.clipboard.writeText(text);
        } catch (error) {
          console.log("Something went wrong", error);
        }
      }
      writeURLtoClipboard(sendableURL);

      alert(
        "Sendable times URL copied to your clipboard and ready to send to your colleague."
      );
      $("input").remove(".dummy");
    };
    createURL();
  });


  // Event handler for the copy button to create the URL
  // $("#copyBtn").click(function () {
  //   function createURL() {
  //     // need to remove spaces in values & replace with +
  //     const space = /\s/g;

  //     // check to see if 12/24 toggle is on 24
  //     let time12 = new Boolean(); // defaults to false
  //     if ($("#numHrs").prop("checked") == false) {
  //       time12 = false;
  //     } else {
  //       time12 = true;
  //     }

  //     // find search times and remove spaces
      
  //     let searchT1 = $("#search1Time").html();
  //     let searchT2 = $("#search2Time").html();

  //     let sT1 = searchT1.replace(space, "+");
  //     let sT2 = searchT2.replace(space, "+");

  //     // find time descriptions (locations) and search city names & remove spaces
  //     let searchTimeDesc1 = $("#search1TSID").html();
  //     let searchTimeDesc2 = $("#search2TSID").html();
  //     let searchCity1 = $("#sbsearchClock1").val();
  //     let searchCity2 = $("#sbsearchClock2").val();

  //     // trim any spaces on either side and replace spaces with + so the URL works
  //     let sTD1 = searchTimeDesc1.trim().replace(space, "+");
  //     let sTD2 = searchTimeDesc2.trim().replace(space, "+");
  //     let sC1 = searchCity1.trim().replace(space, "+");
  //     let sC2 = searchCity2.trim().replace(space, "+");

  //     // split the url to remove any existing search queries
  //     let thisURL = $(location).attr("href").split("?")[0];
  //     // create the url adding FORMATTEDTIME to the end
  //     sendableURL = `${thisURL}?searchtime1=${sT1}&searchtime2=${sT2}&searchTimeDesc1=${sTD1}&searchTimeDesc2=${sTD2}&searchCity1=${sC1}&searchCity2=${sC2}&time12=${time12}`;

  //     async function writeURLtoClipboard(text) {
  //       try {
  //         await navigator.clipboard.writeText(text);
  //       } catch (error) {
  //         console.log("Something went wrong", error);
  //       }
  //     }
  //     writeURLtoClipboard(sendableURL);

  //     alert(
  //       "Sendable times URL copied to your clipboard and ready to send to your colleague."
  //     );
  //     $("input").remove(".dummy");

  //     alert(`Copy this URL and send it to someone:\n\n${sendableURL}`);
  //   }
  //   // if both search boxes are empty, create the URL with the defaults

  // // ========================
  // // figure out this stuff
  // // =========================

  //   if ($("#sbsearchClock1").val() == "" && $("#sbsearchClock2").val() == "") {
  //     createURL();
  //   } else {
  //     // put underscores in region/city name before testing if it's in the time zone array
  //     const space = /\s/g;
  //     let sbclock1Under = $("#sbsearchClock1").val().replace(space, "_");
  //     let sbclock2Under = $("#sbsearchClock2").val().replace(space, "_");

  //     // (if 1 is not in array AND 1 is not blank) OR (2 is not in array and 2 is not blank)
  //     if (
  //       (!TzNamesArray.includes(sbclock1Under) && !sbclock1Under == "") ||
  //       (!TzNamesArray.includes(sbclock2Under) && !sbclock2Under == "")
  //     ) {
  //       alert("You must search and select a valid city from the dropdown");
  //     } else {
  //       // if both values in both searchboxes have been chosen from the dropdown, create the URL
  //       createURL();
  //     }
  //   }
  // });
}); // end document ready
