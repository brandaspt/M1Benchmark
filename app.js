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

const topicsArr = [
  {
    id: 9,
    name: "General knowledge",
  },
  {
    id: 11,
    name: "Cinema",
  },
  {
    id: 17,
    name: "Science & Nature",
  },
  {
    id: 21,
    name: "Sports",
  },
  {
    id: 22,
    name: "Geography",
  },
]

// Global variables
let currentTopic
let fetchedQuestions = []
let correctAnswers = []
let userScore = 0
let currentQuestion = 0

// Page Elements
let currentQuestionH3
let allQuestionContainers
let allAnswerBtns
let nextQuestionBtn
const topicsSection = document.getElementById("topics-section")
const questionsSection = document.getElementById("questions-section")
const resultsSection = document.getElementById("results-section")

// First UI
const topicsScreen = () => {
  topicsSection.innerHTML += `<h2>Choose a topic</h2>`

  for (const topic of topicsArr) {
    topicsSection.innerHTML += `<button class="topic-btn">${topic.name}</button>`
  }

  const topicBtns = document.querySelectorAll(".topic-btn")
  topicBtns.forEach((btn) => {
    btn.addEventListener("click", prepareGame)
  })
}

// Get topic and trigger AJAX
const prepareGame = (event) => {
  let chosenTopic = event.currentTarget.innerText
  currentTopic = chosenTopic
  for (const topic of topicsArr) {
    if (topic.name === chosenTopic) {
      chosenTopic = topic.id
      break
    }
  }
  getQuestions(chosenTopic).then((fetchedQuestions) =>
    createQuestionEls(fetchedQuestions)
  )
}

// AJAX func gets 10 questions from API for the chose topic
const getQuestions = async (chosenTopic) => {
  const urlToFetch = `https://opentdb.com/api.php?amount=10&category=${chosenTopic}`
  try {
    const response = await fetch(urlToFetch)
    if (response.ok) {
      const jsonResponse = await response.json()
      fetchedQuestions = jsonResponse.results
      fetchedQuestions.forEach((fetchedQuestion) => {
        const tempSpan = document.createElement("span")
        tempSpan.innerHTML = fetchedQuestion.correct_answer
        correctAnswers.push(tempSpan.innerHTML)
        tempSpan.remove()
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// Creates all question container elements (hidden)
const createQuestionEls = () => {
  // Current topic
  document.querySelector(
    "header"
  ).innerHTML += `<h3 id="current-topic">${currentTopic}</h3>`

  // Current question h3
  document.querySelector("header").innerHTML += `<h3 id="current-question">${
    currentQuestion + 1
  }/${fetchedQuestions.length}</h3>`

  for (const question of fetchedQuestions) {
    const answers = [...question.incorrect_answers]
    answers.push(question.correct_answer)
    // Shuffle array
    shuffleArray(answers)

    // Create a div that will contain the question and its answers
    const newQuestionDiv = document.createElement("div")
    newQuestionDiv.classList.add("question-container", "hidden")

    // Create h3 for the question and append it to the above div
    const newQuestionH3 = document.createElement("h3")
    newQuestionH3.innerHTML = question.question
    newQuestionDiv.appendChild(newQuestionH3)

    // Create a div to contain the answers
    const newAnswersContainer = document.createElement("div")
    newAnswersContainer.classList.add("answers-container")

    // Add each answer to the above div
    answers.forEach((answer) => {
      newAnswersContainer.innerHTML += `<button class="answer-btn">${answer}</button>`
    })

    // Add answers container to question container
    newQuestionDiv.appendChild(newAnswersContainer)
    questionsSection.appendChild(newQuestionDiv)
  }
  // Next question btn
  questionsSection.innerHTML += `<button id="next-question-btn">next question</button>`
  nextQuestionBtn = document.getElementById("next-question-btn")

  // Get current question element
  currentQuestionH3 = document.getElementById("current-question")

  // Get all answer btns and apply event listener
  allAnswerBtns = document.querySelectorAll(".answer-btn")
  allAnswerBtns.forEach((answerBtn) => {
    answerBtn.addEventListener("click", getAnswer)
  })

  // Get all question containers
  allQuestionContainers = document.querySelectorAll(".question-container")

  startGame()
}

const startGame = () => {
  // Hide topics section
  topicsSection.classList.add("hidden")

  // Show first question
  questionsSection.classList.remove("hidden")
  questionsSection
    .querySelector(".question-container")
    .classList.remove("hidden")
}

const getAnswer = (event) => {
  const selectedAnswer = event.currentTarget
  selectedAnswer.classList.add("selected-answer")
  if (selectedAnswer.innerHTML === correctAnswers[currentQuestion]) {
    selectedAnswer.classList.add("correct-answer")
    userScore++
  }
  const parentEl = selectedAnswer.parentElement
  const answerEls = parentEl.querySelectorAll(".answer-btn")
  answerEls.forEach((answerEl) => {
    if (answerEl.innerHTML === correctAnswers[currentQuestion]) {
      answerEl.classList.add("correct-answer")
    }
  })

  // Disable current answer btns
  const currentAnswerBtns = event.currentTarget.parentElement.querySelectorAll(
    ".answer-btn"
  )
  currentAnswerBtns.forEach((btn) => {
    btn.removeEventListener("click", getAnswer)
  })

  // Enable next question btn
  nextQuestionBtn.addEventListener("click", nextQuestion)
}

const nextQuestion = () => {
  // Hide current question
  allQuestionContainers[currentQuestion].classList.add("hidden")

  // Increase current question and check if it's last
  currentQuestion++
  if (currentQuestion === fetchedQuestions.length) {
    nextQuestionBtn.classList.add("hidden")
    currentQuestionH3.remove()
    questionsSection.classList.add("hidden")
    resultsSection.classList.remove("hidden")
    displayResult()
  } else {
    document
      .querySelectorAll(".question-container")
      [currentQuestion].classList.remove("hidden")
    nextQuestionBtn.removeEventListener("click", nextQuestion)
    currentQuestionH3.innerHTML = `${currentQuestion + 1}/${
      fetchedQuestions.length
    }`
  }
}

const displayResult = () => {
  resultsSection.innerHTML = `<h2>Correct Answers: ${userScore}/${fetchedQuestions.length}</h2><button id="play-again-btn">PLAY AGAIN</button>`
  document.getElementById("play-again-btn").addEventListener("click", resetGame)
}

const resetGame = () => {
  currentTopic = ""
  fetchedQuestions = []
  correctAnswers = []
  userScore = 0
  currentQuestion = 0
  allQuestionContainers.innerHTML = ""
  allAnswerBtns.innerHTML = ""
  nextQuestionBtn.innerHTML = ""
  resultsSection.innerHTML = ""
  topicsSection.innerHTML = ""
  topicsSection.classList.remove("hidden")
  resultsSection.classList.add("hidden")
  questionsSection.innerHTML = ""
  document.getElementById("current-topic").remove()
  topicsScreen()
}

// Helper shuffle array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

topicsScreen()
