document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    
    let myQuestions = [];

async function loadQuestions() {
  try {
    const response = await fetch('https://sokalahmed.github.io/sa/questions.json?t=${Date.now()}`);');
    if (!response.ok) throw new Error("Failed to load questions");
    myQuestions = await response.json();
    buildQuiz();
  } catch (error) {
    console.error("Error loading questions:", error);
    document.getElementById('quiz').innerHTML = 
      '<p class="error">Error loading questions. Please try again later.</p>';
  }
}

// Replace DOMContentLoaded event with:
document.addEventListener('DOMContentLoaded', loadQuestions);
    

    function buildQuiz() {
        const output = [];

        myQuestions.forEach((currentQuestion, questionNumber) => {
            const answers = [];
            
            for (const letter in currentQuestion.answers) {
                answers.push(
                    `<div class="answer">
                        <input type="radio" name="question${questionNumber}" value="${letter}" id="q${questionNumber}${letter}">
                        <label for="q${questionNumber}${letter}">
                            ${letter}: ${currentQuestion.answers[letter]}
                        </label>
                    </div>`
                );
            }
            
            output.push(
                `<div class="question">
                    <h3>${questionNumber + 1}. ${currentQuestion.question}</h3>
                    <div class="answers">${answers.join('')}</div>
                </div>`
            );
        });

        quizContainer.innerHTML = output.join('');
    }

    function showResults() {
        const answerContainers = quizContainer.querySelectorAll('.answers');
        let numCorrect = 0;
        
        // Reset all answer styles first
        document.querySelectorAll('.answer input').forEach(input => {
            input.parentElement.classList.remove('correct-answer', 'wrong-answer', 'correct-selected');
        });
        
        myQuestions.forEach((currentQuestion, questionNumber) => {
            const answerContainer = answerContainers[questionNumber];
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;
            const correctAnswer = currentQuestion.correctAnswer;
            
            // Mark correct answer with green
            const correctInput = document.querySelector(`#q${questionNumber}${correctAnswer}`);
            correctInput.parentElement.classList.add('correct-answer');
            
            if (userAnswer === correctAnswer) {
                numCorrect++;
                // If user selected correct answer, make it green
                correctInput.parentElement.classList.add('correct-selected');
            } else if (userAnswer) {
                // Mark wrong user selection with red
                const wrongInput = document.querySelector(`#q${questionNumber}${userAnswer}`);
                wrongInput.parentElement.classList.add('wrong-answer');
            }
        });
        
        resultsContainer.innerHTML = `You scored ${numCorrect} out of ${myQuestions.length}!`;
        resultsContainer.style.display = 'block';
        
        // Disable all inputs after submission
        document.querySelectorAll('.answer input').forEach(input => {
            input.disabled = true;
        });
        
        // Disable submit button
        submitButton.disabled = true;
    }
    
    buildQuiz();
    
    submitButton.addEventListener('click', showResults);
});
