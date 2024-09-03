document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const nextButton = document.getElementById('next-btn');
    const questionContainerElement = document.querySelector('.question-container');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const questionNumbersElement = document.getElementById('question-numbers');
    const feedbackContainer = document.getElementById('feedback-container');
    const restartButton = document.createElement('button');
    const storyContainer = document.getElementById('story-container');
    const buttonsContainer = document.querySelector('.buttons');

    let questions = [];
    let currentQuestionIndex = 0;
    let quizCompleted = false; // Flag to track quiz completion


    // Fetch and display story content from story.html
    fetch('story.html')
        .then(response => response.text())
        .then(data => {
            // Extract the content from the start div only
            const startDiv = extractStartDiv(data);
            storyContainer.innerHTML = startDiv;

            // Update image source
            const imgElement = document.querySelector('.right-container img');
            if (imgElement) {
                imgElement.src = './assests/story/1.png';
            }
        })
        .catch(error => console.error('Error loading story:', error));

    startButton.addEventListener('click', startGame);
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        setNextQuestion();
    });

    restartButton.innerText = 'Restart Quiz';
    restartButton.classList.add('btn', 'restart-btn', 'hide');
    restartButton.addEventListener('click', () => {
        questionContainerElement.classList.remove('hide');
        restartButton.classList.add('hide');
        startGame();
    });
    buttonsContainer.appendChild(restartButton); // Append restart button initially

    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            startButton.disabled = false;
        })
        .catch(error => console.error('Error loading questions:', error));

    function startGame() {

        startButton.classList.add('hide');
        restartButton.classList.add('hide');
        currentQuestionIndex = 0;
        questionContainerElement.classList.remove('hide');
        setNextQuestion();
        storyContainer.innerHTML = ''; // Clear story content
        hideStoryEnd(); // Ensure story-end is hidden on restart
        document.getElementById('question').classList.remove('hide'); // Ensure it's not hidden

        quizCompleted = false; // Reset quiz completion flag
    }

    function setNextQuestion() {
        resetState();

        if (currentQuestionIndex >= questions.length) {
            showCompletionMessage();
        } else {
            showQuestion(questions[currentQuestionIndex]);
        }
    }

    // function showQuestion(question) {
    //     questionElement.innerText = question.question;
    //     questionNumbersElement.innerHTML = '';

    //     questions.forEach((_, index) => {
    //         const numberButton = document.createElement('button');
    //         numberButton.innerText = index + 1;
    //         numberButton.classList.add('btn');
    //         if (index === currentQuestionIndex) {
    //             numberButton.classList.add('current');
    //         }
    //         numberButton.addEventListener('click', () => {
    //             currentQuestionIndex = index;
    //             setNextQuestion();
    //         });
    //         questionNumbersElement.appendChild(numberButton);
    //     });

    //     const rightContainer = document.querySelector('.right-container');
    //     rightContainer.innerHTML = '';

    //     const imgElement = document.createElement('img');
    //     imgElement.src = question.img || './assests/story/1.png';
    //     imgElement.alt = 'Question Image';
    //     rightContainer.appendChild(imgElement);

    //     question.options.forEach(option => {
    //         const button = document.createElement('button');
    //         button.innerText = option;
    //         button.classList.add('btn');
    //         if (question.correct === question.options.indexOf(option)) {
    //             button.dataset.correct = true;
    //         }
    //         button.addEventListener('click', selectAnswer);
    //         answerButtonsElement.appendChild(button);
    //     });
    // }
    function showQuestion(question) {
        const questionElement = document.querySelector('.question');
    
        questionElement.innerHTML = question.question; // Use innerHTML to allow HTML content
    
        questionNumbersElement.innerHTML = '';
    
        questions.forEach((_, index) => {
            const numberButton = document.createElement('button');
            numberButton.innerText = index + 1;
            numberButton.classList.add('btn');
            if (index === currentQuestionIndex) {
                numberButton.classList.add('current');
            }
            numberButton.addEventListener('click', () => {
                currentQuestionIndex = index;
                setNextQuestion();
            });
            questionNumbersElement.appendChild(numberButton);
        });
    
        const rightContainer = document.querySelector('.right-container');
        rightContainer.innerHTML = '';
    
        const imgElement = document.createElement('img');
        imgElement.src = question.img || './assests/story/3.png';
        imgElement.alt = 'Question Image';
        rightContainer.appendChild(imgElement);
    
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('btn');
            if (question.correct === question.options.indexOf(option)) {
                button.dataset.correct = true;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }
    

    function resetState() {
        clearStatusClass(document.body);
        clearStatusClass(questionContainerElement);
        nextButton.classList.add('hide');
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
        feedbackContainer.classList.add('hide');
    }

    function showCompletionMessage() {
        const cheersAudio = document.getElementById('cheers');
        cheersAudio.play();
        
        questionElement.innerText = "";
        questionNumbersElement.innerHTML = '';
        answerButtonsElement.classList.add('hide');
        nextButton.classList.add('hide');
        restartButton.classList.remove('hide');
    
        // Update image source
        const imgElement = document.querySelector('.right-container img');
        if (imgElement) {
            imgElement.src = './assests/story/1.png';
        }
    
        if (!quizCompleted) {
            fetch('story.html')
                .then(response => response.text())
                .then(data => {
                    const endDiv = extractEndDiv(data);
                    storyContainer.innerHTML = endDiv;
                })
                .catch(error => console.error('Error loading story end:', error));
    
            quizCompleted = true; // Set quiz completion flag
        }
    }
    
    function restartQuiz() {
        currentQuestionIndex = 0;
        resetState();
        setNextQuestion();
        restartButton.classList.add('hide');
        hideStoryEnd(); // Ensure story-end is hidden on restart
        quizCompleted = false; // Reset quiz completion flag
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        
        const correct = selectedButton.dataset.correct === 'true';
    
        // Play audio based on correctness
        if (correct) {
            const pointsAudio = document.getElementById('points');
            pointsAudio.play();
        } else {
            const failAudio = document.getElementById('fail');
            failAudio.currentTime = 0; // Reset playback position to start
            failAudio.play();
        }
        clearStatusClass(document.body);
        clearStatusClass(questionContainerElement);
    
        Array.from(answerButtonsElement.children).forEach(button => {
            clearStatusClass(button);
        });
    
        setStatusClass(selectedButton, correct);
        setStatusClass(questionContainerElement, correct);
    
        Array.from(answerButtonsElement.children).forEach(button => {
            if (button.dataset.correct === 'true') {
                button.classList.add('correct-answer');
            } else {
                clearStatusClass(button);
            }
        });
    
        if (correct) {
            showFeedback('Good job! 👏', 'correct');
            nextButton.classList.remove('hide');
        } else {
            showFeedback('Try again! 💪', 'wrong');
            nextButton.classList.add('hide');
        }
    }
    
    function showFeedback(message, status) {
        feedbackContainer.innerText = message;
        feedbackContainer.classList.remove('hide');
        feedbackContainer.classList.add(status);
    }

    function setStatusClass(element, correct) {
        clearStatusClass(element);
        if (correct) {
            element.classList.add('correct-bg');
        } else {
            element.classList.add('wrong-bg');
        }
    }

    function clearStatusClass(element) {
        element.classList.remove('correct-bg', 'wrong-bg');
    }

    // Function to extract content from the start div
    function extractStartDiv(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const startDiv = doc.querySelector('.start').innerHTML;
        return startDiv;
    }

    function extractEndDiv(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const endDiv = doc.querySelector('.end').innerHTML;
        return endDiv;
    }

    function hideStoryEnd() {
        storyContainer.innerHTML = ''; // Clear story content
    }
});
