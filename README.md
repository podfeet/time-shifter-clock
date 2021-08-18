# Time Shifter Clock

Have you ever wanted to tell several people in different regions of the globe what time you would like to meet with them?  It's easy to find out what time it is _now_ in several timezones, but how do you figure out what time it _will_ be in different timezones?  Time Shifter Clock is designed to allow you to choose a time in your own timezone and then create a URL to send to your meeting attendees to show them the time in their timezones.

## Usage

The Time Shifter clock shows you your constantly-updating local date and time at the top. In the main section of the tool you'll see two fields where you can search for different cities. By default, the first city is Los Angeles (where I live) and the second city is Dublin (where my tech partner Bart Busschots lives).  

The purpose of this clock is to help you find and communicate a time in the future across multiple timezones when planning a meetup.

1. Search for your own city.
2. Search for another city or time zone (e.g. PST). Add cities as needed if you have more than two participants.
3. Now drag the time shifter by half-hour increments till you see a day and time in the future that is convenient for you.
4. Click the "Copy URL to send times" button, and then paste it in a message to your participants.

They will see the date/time exactly as you've sent it. If they don't like the time chosen, they can shift time themselves and send it back to you as an alternate proposal.

If you need to meet with more than one other person, you can use the "Add another city" to add as many cities as you desire.

## Background

This clock was created in its original form as a challenge from the Programming By Stealth podcast hosted by Bart Busschots and me. It has transformed well beyond the original assignment, and I'm pretty proud of what I was able to create as only my third open source web app since starting the podcast with Bart.

I encourage you to check out the Programming By Stealth podcast in your podcatcher of choice, and to see Bart's tutorial shownotes at https://pbs.bartificer.net. 

This tool was inspired by Terry Brett's [TimeScroller](http://timescroller.com/) app for iOS and the original widget for OSX.

## Call For Help

There is currently no error checking on the text input boxes where you search for a city. I worked for over a month on trying to add error checking but because of the way library works for the dropdown (it causes an on blur event), I was unable to "crack the code" to get error checking to work.

Currently you can type in a valid city such as "American/Detroit" and the time will not adjust unless you choose from the dropdown.  You can type in numbers, or the word "boogers" and you'll still get the default city's time.  I would love for someone to figure out how to check for these errors and submit a pull request.


