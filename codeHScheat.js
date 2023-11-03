// ==UserScript==
// @name        New script - codehs.com
// @namespace   Violentmonkey Scripts
// @match       https://codehs.com/student/*
// @grant       none
// @version     1.0
// @author      -
// @description 11/2/2023, 10:04:43 AM
// ==/UserScript==

const EVENT_OPTIONS = {bubbles: true, cancelable: false, composed: true};
const EVENTS = {
  BLUR: new Event("blur", EVENT_OPTIONS),
  CHANGE: new Event("change", EVENT_OPTIONS),
  INPUT: new Event("input", EVENT_OPTIONS),
};

function toHex(s) {
  var s = unescape(encodeURIComponent(s))
  var h = ''
  for (var i = 0; i < s.length; i++) {
      h += s.charCodeAt(i).toString(16)
  }
  return h
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function doAnswer(assignment, inputElement, BUTTON_ONE) {
  document.getElementsByClassName("ace_scroller")[0].click() // Select all so that the current answer is deleted
  inputElement.select();
  var text = await fetch("https://raw.githubusercontent.com/starchyunderscore/codehscheat/main/answers/"+assignment+".txt") // Fetch the answer, then convert it to text
  .then(response => response.text());
  inputElement.value = text; // Simulate typing the text
  const tracker = inputElement._valueTracker
  tracker && tracker.setValue(text);
  inputElement.dispatchEvent(EVENTS.INPUT);
  inputElement.dispatchEvent(EVENTS.BLUR);
  BUTTON_ONE.click(); // Click the submit button
  await delay(10000); // Wait ten seconds before trying to clikc the second submit button to give the autograder time
  document.getElementById("submit-correct").click();
}

window.addEventListener("load", (event) => {
  const BUTTON_ONE = document.getElementsByClassName("__abacus_button")[2] // Submit & continue or next
  if(BUTTON_ONE.innerHTML == "Next") { // skip if it is an example
    BUTTON_ONE.click();
  } else if (BUTTON_ONE.innerHTML == "Submit + Continue") { // put code if it is an example
    // Constants
    const inputElement = document.getElementById("ace_text-input-textarea");
    const assignment = toHex(document.getElementsByClassName("__abacus_editor-label")[0].children[0].innerHTML);
    // Move to the function to actually do all the work
    doAnswer(assignment,inputElement,BUTTON_ONE);
  }
});
