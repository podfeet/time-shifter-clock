// ========================
  // UTC TIME CONVERSION 
  //=========================

  // #searchTime-1 will always exist, it's the first clock
  let sl1 = clockAttributesArray[1].location; // search location 1 (default Los Angeles)
  // console.log(`Reference city is ${sl1}`);
  let st1 = $("#searchTime-1").html(); // search time 1
  // console.log(`Time in reference city is ${st1}`);
  // convert the first time and location into UTC time
  let utcT = moment.tz(st1, FORMATTEDTIME, sl1).utc().format(); // converting st1 to UTC time
  // console.log(`UTC time is ${utcT}`);

  // Given the time in UTC, how do I convert that back to the time in the reference city?
  let convertedBack = moment.utc(utcT).tz(sl1).format(FORMATTEDTIME)
  // console.log(`Time back in LA is ${convertedBack}`); // This shows correctly returned time in FORMATTEDTIME