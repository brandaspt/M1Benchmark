/* 
QUIZ GAME!

RULES:
/ The player must guess correctly a certain amount of questions
/ Each correct answer gives him one point
/ Answers could be multiple or true/false
/ At the end of the game, the user must know his total score

QUESTIONS:
/ You can get them from this URL ( http://bit.ly/strive_QUIZZ ) or you can write your own
/ Could be multiple of boolean (true / false)
/ [EXTRA] Show if the answer was wrong or correct after clicking
/ [EXTRA] Present them one a time

HINTS:
/ Keep a global variable score for the score
/ Keep a variable questionNumber for the question the user is answering
/ When questionNumber is bigger then the available questions, present the score
/ Start working with the question saved in a variable, and then include AJAX etc
/ Start with the easier version and THEN implement the EXTRAs
/ Please debug everything / try it on the console to be sure of what to expect from your code

EXTRA:
/ Show if the answer was wrong or correct after clicking
/ Present questions one a time
/ Let the user select difficulty and number of questions (you can get q/a from https://opentdb.com/api.php?amount=10&category=18&difficulty=easy modifying amount and difficulty)
*/

/*
IF YOU ARE DISPLAYING ALL THE QUESTIONS TOGETHER:
HINT: for each question, create a container with the "question"
create a radio button https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio with, as option the both the correct answer and the incorrect answers
when EVERY question has an answer (google for how to get a value from a radio button with JS)
IF YOU ARE DISPLAYING ONE QUESTION AT A TIME
Display first question with a title + radio button
when the user select the answer, pick the next question and remove this from the page after added in a varible the users' choice.
*/

/*
HOW TO calculate the result
You can do it in 2 ways:
If you are presenting all questions together, just take all the radio buttons and check if the selected answer === correct_answer
If you are presenting one question at a time, just add one point or not to the user score if the selected answer === correct_answer

*/

const questions = [
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What does CPU stand for?",
    correct_answer: "Central Processing Unit",
    incorrect_answers: [
      "Central Process Unit",
      "Computer Personal Unit",
      "Central Processor Unit",
    ],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "In the programming language Java, which of these keywords would you put on a variable to make sure it doesn't get modified?",
    correct_answer: "Final",
    incorrect_answers: ["Static", "Private", "Public"],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question: "The logo for Snapchat is a Bell.",
    correct_answer: "False",
    incorrect_answers: ["True"],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question:
      "Pointers were not used in the original C programming language; they were added later on in C++.",
    correct_answer: "False",
    incorrect_answers: ["True"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "What is the most preferred image format used for logos in the Wikimedia database?",
    correct_answer: ".svg",
    incorrect_answers: [".png", ".jpeg", ".gif"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "In web design, what does CSS stand for?",
    correct_answer: "Cascading Style Sheet",
    incorrect_answers: [
      "Counter Strike: Source",
      "Corrective Style Sheet",
      "Computer Style Sheet",
    ],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "What is the code name for the mobile operating system Android 7.0?",
    correct_answer: "Nougat",
    incorrect_answers: ["Ice Cream Sandwich", "Jelly Bean", "Marshmallow"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "On Twitter, what is the character limit for a Tweet?",
    correct_answer: "140",
    incorrect_answers: ["120", "160", "100"],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question: "Linux was first created as an alternative to Windows XP.",
    correct_answer: "False",
    incorrect_answers: ["True"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "Which programming language shares its name with an island in Indonesia?",
    correct_answer: "Java",
    incorrect_answers: ["Python", "C", "Jakarta"],
  },
]

const questionsSection = document.getElementById("questions-section")

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const prepareGame = () => {
  questions.forEach((question, index) => {
    const answers = [...question.incorrect_answers]
    answers.push(question.correct_answer)
    shuffleArray(answers)

    const newQuestionDiv = document.createElement("div")
    newQuestionDiv.classList.add("question-container")

    const newQuestionH3 = document.createElement("h3")
    newQuestionH3.innerText = question.question
    newQuestionDiv.appendChild(newQuestionH3)

    const newAnswersContainer = document.createElement("div")
    newAnswersContainer.classList.add("answers-container")

    answers.forEach((answer, index2) => {
      if (index2 === 0) {
        newAnswersContainer.innerHTML += `<label><input type="radio" name="question${index}" checked />${answer}</label>`
      } else {
        newAnswersContainer.innerHTML += `<label><input type="radio" name="question${index}" />${answer}</label>`
      }
    })
    newQuestionDiv.appendChild(newAnswersContainer)
    questionsSection.appendChild(newQuestionDiv)
  })
  questionsSection.innerHTML += `<section id="submit-section"><button type="button" id="submit-answers-btn">Submit</button></section>`
  document
    .getElementById("submit-answers-btn")
    .addEventListener("click", displayResult)
}

const displayResult = () => {
  const allAnswers = document.querySelectorAll("input")
  const userAnswers = []
  for (let i = 0; i < allAnswers.length; i++) {
    if (allAnswers[i].checked) {
      console.log(allAnswers[i])
      userAnswers.push(allAnswers[i].labels[0].innerText)
    }
  }

  let correctAnswers = 0
  for (let i = 0; i < userAnswers.length; i++) {
    if (userAnswers[i] === questions[i].correct_answer) {
      correctAnswers++
    }
  }

  // [firstQuestionAnswers DOM Element, secondQuestionAnswers DOM Element, thirdQuestionAnswers DOM El,...]
  const allAnswerContainers = document.querySelectorAll(".answers-container")

  // Cycle through the array with all answer containers
  for (let i = 0; i < allAnswerContainers.length; i++) {
    // Question i's answers:
    // First iteration: [Q0FirstAnswer DOM El, Q0SecondAnswer DOM El, ...]
    // Second iteration: [Q1FirstAnswer DOM El, Q1SecondAnswer DOM El, ...]
    // Third iteration: [Q2FirstAnswer DOM El, Q2SecondAnswer DOM El, ...]
    // ...
    let currentAnswers = allAnswerContainers[i].children

    // Cycle through the array with answers
    for (let j = 0; j < currentAnswers.length; j++) {
      // If current answer's innerText is equal to first question's correct answer apply 'correct-answer' class
      if (currentAnswers[j].innerText === questions[i].correct_answer) {
        currentAnswers[j].classList.add("correct-answer")
      }
    }
  }

  const submitSection = document.getElementById("submit-section")
  submitSection.innerHTML = `<h2>Correct answers: ${correctAnswers}/${userAnswers.length}</h2><button id="play-again-btn">PLAY AGAIN</button>`
  document.getElementById("play-again-btn").addEventListener("click", resetGame)
}

const resetGame = () => {
  document.getElementById("submit-section").remove()
  questionsSection.innerText = ""
  prepareGame()
}

prepareGame()
