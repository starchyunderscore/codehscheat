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

function getAnswer(e){
    var x = await fetch("https://raw.githubusercontent.com/starchyunderscore/codehscheat/main/answers/"+e+".txt")
    .then(response => response.text());
}

window.addEventListener("load", (event) => {
  const BUTTON_ONE = document.getElementsByClassName("__abacus_button")[2] // Submit & continue or next
  if(BUTTON_ONE.innerHTML == "Next") { // skip if it is an example
    BUTTON_ONE.click();
  } else if (BUTTON_ONE.innerHTML == "Submit + Continue") { // put code if it is an example
    const inputElement = document.querySelector("#ace_text-input-textarea");
    const assignment = toHex(document.getElementsByClassName("__abacus_editor-label")[0].children[0].innerHTML);
    const answer = getAnswer(assignment);
    
    inputElement.value = answer;
    const tracker = inputElement._valueTracker;
    tracker && tracker.setValue(answer);
    inputElement.dispatchEvent(EVENTS.INPUT);
    inputElement.dispatchEvent(EVENTS.BLUR);
  }
});
