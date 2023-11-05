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

async function doAnswer(id, inputElement, BUTTON_ONE) {
  document.getElementsByClassName("ace_scroller")[0].click() // Select all so that the current answer is deleted
  inputElement.select();
  var text = await fetch("https://raw.githubusercontent.com/starchyunderscore/codehscheat/main/answers/"+id+".txt") // Fetch the answer, then convert it to text
  .then(response => response.text());
  if(text == "404: Not Found") {
    alert("There is not an answer for this assignment yet");
  } else {
    inputElement.value = text; // Simulate typing the text
    const tracker = inputElement._valueTracker
    tracker && tracker.setValue(text);
    inputElement.dispatchEvent(EVENTS.INPUT);
    inputElement.dispatchEvent(EVENTS.BLUR);
    BUTTON_ONE.click(); // Click the submit button
    await delay(10000); // Wait ten seconds before trying to click the second submit button to give the autograder time
    document.getElementById("submit-correct").click();
  }
}
async function answerQuiz(questions, id) {
  var questions = document.querySelector(".quiz-questions").querySelectorAll("ol");
  var text = await fetch("https://raw.githubusercontent.com/starchyunderscore/codehscheat/main/answers/"+id+".txt") // Fetch the answer, then convert it to text
  .then(response => response.text());
  if(text == "404: Not Found") {
    alert("There is not an answer for this assignment yet");
  } else {
    var answers = text.split("");
    answers.remove(-1);
    for(i=0;i<answers.length;i++) {
      var choices = questions[i].querySelectorAll('input');
      choices[answers[i]].click();
    }
    document.getElementById("next-button").click();
    await delay(1000);
    document.querySelector("#alert-modal a.btn.btn-main.alert-close.ok-button").click();
  }
}

async function skipExample(BUTTON_ONE) {
  await delay(10000);
  BUTTON_ONE.click();
}

async function skipVideo(BUTTON_TWO) {
  document.getElementById("play-btn-container").children[0].click();
  await delay(10000)
  BUTTON_TWO.click();
}

window.addEventListener("load", (event) => {
  try { // "Submit + Continue" or "Next" button.
    var BUTTON_ONE = document.getElementsByClassName("__abacus_button")[2];
  } catch {
    console.log("HI")
  }
  try { // Done button on video pages
    var BUTTON_TWO = document.getElementById("done-button");
  } catch {
    console.log("HI")
  }
  try { // Quiz name
    var QUIZ_NAME = document.getElementsByClassName("center")[3].innerHTML;
  } catch {
    console.log("HI")
  }
  try {
    if(BUTTON_ONE.innerHTML == "Next") { // skip if it is an example
      skipExample(BUTTON_ONE);
    } else if (BUTTON_ONE.innerHTML == "Submit + Continue") { // put code if it is an example
      // Constants
      const inputElement = document.getElementById("ace_text-input-textarea");
      const assignment = toHex(document.getElementsByClassName("__abacus_editor-label")[0].children[0].innerHTML);
      // Move to the function to actually do all the work
      doAnswer(assignment,inputElement,BUTTON_ONE);
    }
  } catch {
    console.log("move on")
  } finally {
    try {
      if (BUTTON_TWO != undefined) { // Skip the videos
        skipVideo(BUTTON_TWO);
      }
    } catch {
      console.log("move on")
    } finally {
      try {
        if (QUIZ_NAME[0] != "\n") { // Answer the quizzes
          if (document.querySelector(".btn.btn-lg.continue-btn").innerHTML != "Submit") {
            document.querySelector(".btn.btn-lg.continue-btn").click();
          } else {
            document.querySelector(".btn.btn-lg.continue-btn").click();
            const questions = document.querySelector(".quiz-questions").querySelectorAll("li");
            const id = toHex(QUIZ_NAME)
            answerQuiz(questions, id)
          }
        }
      } catch {
        console.log("move on")
      } finally {
        console.log("DONE")
      }
    }
  }
});
