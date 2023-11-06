// ==UserScript==
// @name        CodeHScheat
// @namespace   https://github.com/starchyunderscore
// @match       https://codehs.com/student/*
// @grant       none
// @version     2.0
// @author      Starchyunderscore
// @description Script to automatically cheat on codehs.com
// ==/UserScript==

const EVENT_OPTIONS = {bubbles: true, cancelable: false, composed: true}; // Constants for faking typing input
const EVENTS = {
  BLUR: new Event("blur", EVENT_OPTIONS),
  CHANGE: new Event("change", EVENT_OPTIONS),
  INPUT: new Event("input", EVENT_OPTIONS),
};

function toHex(s) { // Hex encode strings
  var s = unescape(encodeURIComponent(s))
  var h = ''
  for (var i = 0; i < s.length; i++) {
      h += s.charCodeAt(i).toString(16)
  }
  return h
}

const delay = ms => new Promise(res => setTimeout(res, ms)); // Easy delays

async function doAnswer(id, inputElement, BUTTON_ONE) { // Answers exercises
  document.getElementsByClassName("ace_scroller")[0].click() // Select all so that the current answer is deleted
  inputElement.select();
  var text = await fetch("https://raw.githubusercontent.com/starchyunderscore/codehscheat/main/answers/"+id+".txt") // Fetch the answer, then convert it to text
  .then(response => response.text());
  if(text == "404: Not Found") { // If there isn't an answer yet, tell the user and stop
    alert("There is not an answer for this assignment yet");
  } else {
    inputElement.value = text; // Simulate typing the text
    const tracker = inputElement._valueTracker
    tracker && tracker.setValue(text);
    inputElement.dispatchEvent(EVENTS.INPUT);
    inputElement.dispatchEvent(EVENTS.BLUR);
    BUTTON_ONE.click(); // Click the submit button
    await delay(15000); // Wait fifteen seconds before trying to click the second submit button to give the autograder time
    document.getElementById("submit-correct").click();
  }
}

async function answerQuiz(questions, id) { // Answer the quizzes
  var questions = document.querySelector(".quiz-questions").querySelectorAll("ol"); // Get each of the questions
  var text = await fetch("https://raw.githubusercontent.com/starchyunderscore/codehscheat/main/answers/"+id+".txt") // Fetch the answer, then convert it to text
  .then(response => response.text());
  if(text == "404: Not Found") { // Tell the user and stop if there is no answer yet
    alert("There is not an answer for this assignment yet");
  } else {
    var answers = text.split("");
    answers.remove(-1); // Remove the trailing newline
    for(i=0;i<answers.length;i++) { // Repeat for as many questions as there are
      var choices = questions[i].querySelectorAll('input'); // Select the answers in each question
      choices[answers[i]].click(); // Click the correct answer
    }
    document.getElementById("next-button").click(); // Click the submit button
    await delay(1000); // Wait one second for the "are you sure" dialouge to appear
    document.querySelector("#alert-modal a.btn.btn-main.alert-close.ok-button").click(); // Click the second submit button
  }
}

async function skipExample(BUTTON_ONE) { // Skips the examples
  await delay(10000); // Wait a bit, then click "Next"
  BUTTON_ONE.click();
}

async function skipVideo(BUTTON_TWO) { // Skip the videos
  document.getElementById("play-btn-container").children[0].click(); // Click the start viedo button
  await delay(10000) // Wait a bit
  BUTTON_TWO.click(); // Click the next button
}

window.addEventListener("load", (event) => { // Start the script only after the page has fully loaded
  console.log("START");
  try { // "Submit + Continue" or "Next" button.
    var BUTTON_ONE = document.getElementsByClassName("__abacus_button")[2];
  } catch {
    console.log("BUTTON_ONE failed")
  }
  try { // Done button on video pages
    var BUTTON_TWO = document.getElementById("done-button");
  } catch {
    console.log("BUTTON_TWO failed")
  }
  try { // Quiz name
    var QUIZ_NAME = document.getElementsByClassName("center")[3].innerHTML;
  } catch {
    console.log("QUIZ_NAME failed")
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
    console.log("NOT EXAMPLE OR EXERCISE")
  } finally {
    try {
      if (BUTTON_TWO != undefined) { // Skip the videos
        skipVideo(BUTTON_TWO);
      }
    } catch {
      console.log("NOT VIEDO")
    } finally {
      try {
        if (QUIZ_NAME[0] != "\n") { // Answer the quizzes
          if (document.querySelector(".btn.btn-lg.continue-btn").innerHTML != "Submit") { // If the quiz is already submitted, move on to the next assignment
            document.querySelector(".btn.btn-lg.continue-btn").click();
          } else { // If the quiz is not already submitted, answer the quiz
            const questions = document.querySelector(".quiz-questions").querySelectorAll("li");
            const id = toHex(QUIZ_NAME)
            answerQuiz(questions, id)
          }
        }
      } catch {
        console.log("NOT QUIZ")
      } finally {
        console.log("DONE")
      }
    }
  }
});
