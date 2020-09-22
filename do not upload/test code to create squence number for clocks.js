// Getter/Setter to create a sequence number for the classes
// sequence numbers will start at 1, as clock-0 is the static local clock

static get count(){
  return this._count || 0;
}
static set count(c){
  throw new Error ('Only the constructor may update the counter!')
}

// in the constructor

// increment the counter and set the sequence numbers
  this.constructor._count = this.constructor.count +1;
  this._numCl = this.constructor.count;
  // we have a class data attribute named count that gets incremented each time a new instance is created, and, each instance stores the value of the count when it was created as the private instance data attribute _numCl.

  // next I guess I start creating the details with getters and setters?
  // for example I need timeDescriptionID: 'search1TSID', to change into `searchTSID-${this._numCl}`

  // do I need getters and setters like Bart's uniqueClass?
  // get uniqueClass(){
  //  return `nerdtouche-${this._numCl}`;
  // }

  // he needs that because he's going to push the uniqueClass onto the DOM element. I don't need that because I'm going to just make the _numCl be part of the dictionary

  // so I need a function to build an object containing the instance parameters necessary to build a clock. An event handler triggers this
  // Don't need it to make decisions but it DOES have to create the parameters with the sequence numbers

  let clockAttributesArray = []
  let numberOfClocks = 3;
  function buildClockAttributes(){
    for (i = 0; i < numberOfClocks; i++){
      numCl = i;
      clockAttributesArray.push({
        key1: "test",
        key2: `x-${numCl}`
      });
      numCl = numCl + 1
    }
  }
  buildClockAttributes();
  console.log(clockAttributesArray);

  // Can I just build a button that when clicked increments numberOfClocks by 1?
  // let clockParameters include the current time to start
  //  Then I set numberOfClocks to 2
  // Run buildClockParameters

  let clockAttributesArray = [
  {
    clockPlaceholder: staticClocksPlaceholder,
      timeDescriptionID: 'localID',
      clockBorder: '',
      timeDescription: 'Your current local time is:',
      timeID: 'localTime',
      timeFormat: TIME12WSEC,
      location: moment.tz.guess(true),
      timeShifted: false,
  },
  {
    timeDescriptionID: 'searchTSID-1',
    clockBorder: 'border border-primary rounded',
    timeDescription: "The time in Los Angeles becomes:",
    timeID: 'searchTime-1',
    timeFormat: TIME12WSEC,
    timeShifted: true,
    location: 'America/Los_Angeles',
    searchBoxDivID: 'sbsearchClock1Div',
    searchBoxID: 'sbsearchClock-1',
    clockPlaceholder: shiftingClocksPlaceholder
  },
  {
    timeDescriptionID: 'searchTSID-2',
    clockBorder: 'border border-primary rounded',
    //timeDescription: 'Time in Europe/Dublin becomes:',
    timeDescription: 'Time in Europe/Dublin becomes:',
    timeID: 'searchTime-2',
    timeFormat: TIME12WSEC,
    timeShifted: true,
    location: 'Europe/Dublin',
    searchBoxDivID: 'sbsearchClock2Div',
    searchBoxID: 'sbsearchClock-2',
    clockPlaceholder: shiftingClocksPlaceholder
  },
]
let numClock = 2;
// click handler to add a clock
$('#addClock').click(function(){
  numCl = numCl + 1; // increment sequence to 
  clockAttributesArray.push({
    timeDescriptionID: `searchTSID-${numCl}`,
    clockBorder: 'border border-primary rounded',
    timeDescription: "The time in New Zealand becomes:",
    timeID: `searchTime-${numCl}`,
    timeFormat: TIME12WSEC,
    timeShifted: true,
    location: 'Pacific/Auckland',
    searchBoxDivID: `sbsearchClockDiv-${numCl}`,
    searchBoxID: `sbsearchClock-${numCl}`,
    clockPlaceholder: shiftingClocksPlaceholder
  })
  // create another clock with the attributes 
  let x = new arrayOfClocks(clockAttributesArray[numCl])
  arrayOfClocks.push(x)
  // need to render all the clocks
})

