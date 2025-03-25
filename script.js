document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    let myQuestions = [];

    // Load questions from JSON
    async function loadQuestions() {
        try {
            const response = await fetch('questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            myQuestions = await response.json();
            buildQuiz();
            submitButton.disabled = false;
        } catch (error) {
            console.error('Error loading questions:', error);
            quizContainer.innerHTML = `
                <div class="error">
                    <p>⚠️ Failed to load questions. Please:</p>
                    <ul>
                        <li>Check your internet connection</li>
                        <li>Refresh the page</li>
                        <li>Ensure questions.json exists</li>
                    </ul>
                    <p>Error details: ${error.message}</p>
                </div>
            `;
        }
    }

    function buildQuiz() {
        const output = [];

        myQuestions.forEach((currentQuestion, questionNumber) => {
            const answers = [];
            
            for (const letter in currentQuestion.answers) {
                answers.push(
                    `<div class="answer">
                        <input type="radio" name="question${questionNumber}" 
                               id="q${questionNumber}${letter}" value="${letter}">
                        <label for="q${questionNumber}${letter}">
                            ${letter.toUpperCase()}. ${currentQuestion.answers[letter]}
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
        
        myQuestions.forEach((currentQuestion, questionNumber) => {
            const answerContainer = answerContainers[questionNumber];
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;
            const correctAnswer = currentQuestion.correctAnswer;
            
            // Mark correct answer
            const correctInput = document.querySelector(`#q${questionNumber}${correctAnswer}`);
            correctInput.parentElement.classList.add('correct-answer');
            
            if (userAnswer === correctAnswer) {
                numCorrect++;
                correctInput.parentElement.classList.add('correct-selected');
            } else if (userAnswer) {
                // Mark wrong answer
                const wrongInput = document.querySelector(`#q${questionNumber}${userAnswer}`);
                wrongInput.parentElement.classList.add('wrong-answer');
            }
        });
        
        resultsContainer.innerHTML = `
            <h2>Your Score: ${numCorrect}/${myQuestions.length}</h2>
            <p>${getScoreFeedback(numCorrect, myQuestions.length)}</p>
        `;
        resultsContainer.style.display = 'block';
    }

    function getScoreFeedback(correct, total) {
        const percentage = (correct / total) * 100;
        if (percentage >= 90) return "🎉 Excellent! You're a genius!";
        if (percentage >= 70) return "👍 Good job! You know your stuff!";
        if (percentage >= 50) return "😊 Not bad! Keep learning!";
        return "📚 Keep studying! You'll do better next time!";
    }

    // Initialize quiz
    loadQuestions();
    submitButton.addEventListener('click', showResults);
});