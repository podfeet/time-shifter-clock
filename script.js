// 
// Define globally-scoped variables
// 

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
// don't understand this but it takes the array which is just a list of the region/city and makes it into an object where the key is the region/city and so is the value. which for some reason works in autocomplete!  Claus Wolf added this as a pull request to replace the _ with a space so humans can type the search.
let tzNamesObject = TzNamesArray.reduce(function (o, val) {
  o[val.replace("_", " ")] = val;
  return o;
}, {});

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
      this.addSearchBox();

      // Adds autocomplete box (from bootstrap-4-autocomplete) to search clocks 
         $(`#${this.searchBoxID}`).autocomplete({
          source: tzNamesObject, // dictionary object with the values from which to search
          onSelectItem: onSelectItem, // callback to run when item is selected
          highlightTyped: false, // if typed text is highlighted in search results, the name gets broken in two for screen readers. e.g. "Det roit"
          treshold: 2, // minimum characters to search before it starts displaying
          maximumitems: 0
        });
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
              .attr("placeholder", `${this.location} (search to change)`)
             
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
  } 
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
  // Finish AClock Class definition  //
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //

  // Create a function to make the original 2 clocks
  function makeClocks(){
    for (i = 0; i < clockAttributesArray.length; i++) {
      let x = new AClock(clockAttributesArray[i]);
      arrayOfClocks.push(x);
      // this builds an array of the locations of each clock (in quotes!), which can be inserted into the URL with a loop on arrayOfLocations[i]
      let y = clockAttributesArray[i].location;
      arrayOfLocations.push(y);
    }
  }

  // Creat a function to reset slider and clocks on changes
  function resetTimes(){
    // reset the clocks
    clockAttributesArray.forEach(function (element, index) {
      if (index < 1) {
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

  // Create a function to make additional clocks
  function anotherClock(){
    let x = new AClock(clockAttributesArray[numCl]);
    arrayOfClocks.push(x);
    arrayOfLocations.push(x.location);
    }
  
  // click handler to add a another city clock
  $("#addClock").click(function () {
    numCl = numCl + 1;
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
    // reset the clocks and slider
    resetTimes();
    // create another clock with the attributes
    anotherClock();
    // Scroll the page until the Copy URL button is visible after clicking Add City
    let element1 = document.getElementById("copyBtn");
    element1.scrollIntoView({behavior: "smooth"});
  });
  // Function to set time on searchClocks to the selected locatin from the search box autocomplete

  // item is what is selected from the searchbox dropdown, element is the searchbox itself. so element.id is the ID of the searchbox
  function onSelectItem(item, element) {
    let searchText = element.id // element.id is sbsearchClock-1 etc
    let x = searchText.match(/[0-9]{1,}/) // extract just the number at the end to be the index in clockAttributesArray
    let selectedSearchBox = clockAttributesArray[x];
    // set the location to the selected city
    selectedSearchBox.location = `${item.value}`;

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
    arrayOfLocations[x] = selectedSearchBox.location;
    // reset the clocks & slider
    resetTimes();
  };

  // *******************************//
    //          Error Checking        //
    // *******************************//

   
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
      // convert thisTime to current time in UTC+0
      let nowUTC = moment.tz(thisTime, thisLocation).utc().format(); // this is a string
      // Create a moment object for the current time in UTC+0 (otherwise you can't startOf() on it)
      // this gives a deprecation warning, b/c it wants .format() on it, but If I do, it won't let me startOf() on it
      let nowUTCObj = moment(nowUTC);
      // round down UTC+0 current time to nearest hour
      let UTCrdtObj = nowUTCObj.startOf("h"); // COMMENT: UTCrdtObj is still an object
      // convert UTCrdtObj to a string
      let UTCrdt = UTCrdtObj.format();
      console.log(`DEBUG: UTCrdt is ${UTCrdt}`) //rounded down now in UTC+0
      // shift hours in UTC rounddown time
      let UTCrdtShifted = moment(UTCrdt).add(timeShiftedVal, "h"); //github copilot wrote this!

      // convert current time to corresponding offset with time rounded down at UTC+0
      let thisRDTShifted = moment.utc(UTCrdtShifted).tz(thisLocation).format(FORMATTEDTIME);
      // convert thisRDT to an object (AGAIN)
      let thisRDTShiftedObj = moment(thisRDTShifted);
      // shift hours by adding the slider's offset to the rounded down time and putting it back into the correct ID
      $(`#${clockAttributesArray[i].timeID}`).html(
        thisRDTShiftedObj.format(FORMATTEDTIME)
      );
    }
  });

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
  
  // ========================
  // creating sendable times
  //=========================

  
  // ****************************************************************************** //
  // function to extract and set the times, change the existing clocks AND add any extra clocks //
  // ****************************************************************************** //
 

  // Create a string from the URL Query string to be used to populate the clocks when a URL has been copied/sent
  let queryStringReceived = window.location.search;
  // initialize an array to hold the search query parameters
  let paramArray = [];
  
  // function to see if there's a query string and if so populate clockAttributesArray
  function checkQuery() {
    if (queryStringReceived !== ""){
      let searchParams = new URLSearchParams(queryStringReceived);
      for (let pair of searchParams.entries()){
        paramArray.push(pair);
      }
    } else{}; 
  };

function setTimesFromURL(){ 
  if (queryStringReceived !== ""){ 
    checkQuery();
    // Create a moment object for the unformatted time
    let utcT = paramArray[0][1];
 
    // Change clocks 1 & 2 to the new location according to the query string
    for (i = 1; i < 3; i++){
      let sl = paramArray[i][1];
      clockAttributesArray[i].location = sl;
      clockAttributesArray[i].timeDescription = `The time in ${sl} becomes:`
    };

    // then add clocks 3+ to clockAttributesArray with the search locations from the query string
    for (i = 3; i < paramArray.length; i++){ // start at 3 for first additional clocks
        let sl = paramArray[i][1];
        clockAttributesArray.push({
          timeDescriptionID: `searchTSID-${i}`,
          clockBorder: "border border-primary rounded",
          timeDescription: `The time in ${sl} becomes:`,
          timeID: `searchTime-${i}`,
          timeFormat: TIME12WSEC,
          timeShifted: true,
          location: sl,
          searchBoxDivID: `sbsearchClockDiv-${i}`,
          searchBoxID: `sbsearchClock-${i}`,
          clockPlaceholder: shiftingClocksPlaceholder,
        });
      };
    // makeClocks() has to be after the clockAttributesArray has clocks 3+
    makeClocks();
    // HTML for the clocks is changed after the clocks are made
    // For all clocks, set their time relative to UTC time from query string
    for (i = 1; i < paramArray.length; i++){
      // set clock counter so addClock click function knows where to start
      numCl = (paramArray.length - 1);
      let sl = paramArray[i][1];
      let momentOBJ = moment.utc(utcT).tz(sl);
      let theTimeID = `#${clockAttributesArray[i].timeID}`
      $(theTimeID).html(momentOBJ.format(FORMATTEDTIME));
    }
  } else {
    makeClocks();
  }
}
setTimesFromURL();

  // ================================================================
  // New and improved event handler for copy button to create the URL
  // ================================================================

  $("#copyBtn").click(function () {
    copyBtnPushed = true;
    function createURL() {
      // could I test to see if the onSelectItem function was called? Even if I could do it here, it wouldn't pick up if someone likes the defaults, and it would have to know how MANY times it was called to know if it was called on every clock.

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
        let sl = arrayOfLocations[i]; // sl is the city name in the query string
        sendableURL += `&sloc${i}` + `=` + `${sl}`;
      }
      console.log(sendableURL); // returns http://localhost:8888/time-shifter-clock/?utcT="2021-04-14T04:13:25Z"&sloc1=America/Los_Angeles&sloc2=Europe/Dublin&sloc3=Pacific/Auckland&sloc4=America/Detroit


      async function writeURLtoClipboard(text) {
        try {
          await navigator.clipboard.writeText(text);
          alert(
            "Sendable times URL copied to your clipboard and ready to send to your colleague."
          );
        } catch (error) {
          console.log("Something went wrong", error);
        }
      }
      writeURLtoClipboard(sendableURL);

      
      $("input").remove(".dummy");
    };
    createURL();
  });

}); // end document ready