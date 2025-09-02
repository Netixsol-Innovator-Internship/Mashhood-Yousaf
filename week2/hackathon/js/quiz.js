const quizzesByCategory = {
  universe: [
    {
      question: "What is the closest star to Earth (other than the Sun)?",
      options: ["Alpha Centauri", "Proxima Centauri", "Betelgeuse", "Sirius"],
      answer: "Proxima Centauri",
    },
    {
      question:
        "Which galaxy is the Milky Way expected to collide with in about 4 billion years?",
      options: [
        "Andromeda Galaxy (M31)",
        "Triangulum Galaxy",
        "Whirlpool Galaxy",
        "Sombrero Galaxy",
      ],
      answer: "Andromeda Galaxy (M31)",
    },
    {
      question:
        "What is the name of the largest known structure in the universe?",
      options: [
        "Hercules-Corona Borealis Great Wall",
        "Sloan Great Wall",
        "Laniakea Supercluster",
        "Bootes Void",
      ],
      answer: "Hercules-Corona Borealis Great Wall",
    },
    {
      question: "What is a supernova?",
      options: [
        "A powerful explosion of a dying star",
        "A new star being born",
        "A type of black hole",
        "A comet hitting a planet",
      ],
      answer: "A powerful explosion of a dying star",
    },
    {
      question: "What is the estimated age of the universe?",
      options: [
        "13.8 billion years",
        "10 billion years",
        "5 billion years",
        "20 billion years",
      ],
      answer: "13.8 billion years",
    },
    {
      question: "Which planet in our solar system has the most moons?",
      options: ["Jupiter", "Saturn", "Mars", "Neptune"],
      answer: "Jupiter",
    },
    {
      question: "What is a black hole's 'event horizon'?",
      options: [
        "The boundary beyond which nothing can escape its gravity",
        "The bright core of a black hole",
        "A hole in space where light escapes",
        "The outer atmosphere of a star",
      ],
      answer: "The boundary beyond which nothing can escape its gravity",
    },
    {
      question: "What causes a solar eclipse?",
      options: [
        "The Moon passing between Earth and the Sun",
        "Earth passing between the Moon and the Sun",
        "The Sun moving behind Earth",
        "A shadow from clouds",
      ],
      answer: "The Moon passing between Earth and the Sun",
    },
    {
      question: "Which spacecraft has traveled the farthest from Earth?",
      options: ["Voyager 1", "Apollo 11", "Pioneer 10", "New Horizons"],
      answer: "Voyager 1",
    },
    {
      question: "What is dark matter?",
      options: [
        "An invisible form of matter that makes up about 27% of the universe",
        "Dark-colored gas in space",
        "Matter from black holes",
        "A type of cosmic dust",
      ],
      answer:
        "An invisible form of matter that makes up about 27% of the universe",
    },
  ],

  civilization: [
    {
      question: "Which ancient civilization built the pyramids of Giza?",
      options: [
        "Ancient Egyptians",
        "Ancient Romans",
        "Mesopotamians",
        "Ancient Greeks",
      ],
      answer: "Ancient Egyptians",
    },
    {
      question: "What was the first known system of writing?",
      options: [
        "Cuneiform (Sumerian)",
        "Hieroglyphics",
        "Latin",
        "Chinese characters",
      ],
      answer: "Cuneiform (Sumerian)",
    },
    {
      question: "Which empire was ruled by Emperor Ashoka?",
      options: [
        "Maurya Empire (India)",
        "Roman Empire",
        "Ottoman Empire",
        "Persian Empire",
      ],
      answer: "Maurya Empire (India)",
    },
    {
      question: "What was the capital of the Inca Empire?",
      options: ["Cusco", "Tenochtitlan", "Machu Picchu", "Teotihuacan"],
      answer: "Cusco",
    },
    {
      question: "Which civilization invented paper?",
      options: [
        "Ancient China",
        "Ancient Egypt",
        "Ancient Greece",
        "Mesopotamia",
      ],
      answer: "Ancient China",
    },
    {
      question: "What was the main crop of the Mayan civilization?",
      options: ["Maize (corn)", "Wheat", "Rice", "Barley"],
      answer: "Maize (corn)",
    },
    {
      question: "Who was the first emperor of unified China?",
      options: ["Qin Shi Huang", "Genghis Khan", "Emperor Wu", "Liu Bang"],
      answer: "Qin Shi Huang",
    },
    {
      question: "Which ancient civilization developed democracy?",
      options: [
        "Ancient Greece (Athens)",
        "Ancient Rome",
        "Ancient Egypt",
        "Mesopotamia",
      ],
      answer: "Ancient Greece (Athens)",
    },
    {
      question: "What was the Silk Road?",
      options: [
        "A trade network connecting Asia, Europe, and Africa",
        "A river in China",
        "An ancient road in Europe",
        "A sea route for explorers",
      ],
      answer: "A trade network connecting Asia, Europe, and Africa",
    },
    {
      question: "Which civilization built Machu Picchu?",
      options: ["Inca", "Aztec", "Maya", "Olmec"],
      answer: "Inca",
    },
  ],

  shakespear: [
    {
      question:
        "Which Shakespeare play features the characters Romeo and Juliet?",
      options: ["Romeo and Juliet", "Hamlet", "Macbeth", "Othello"],
      answer: "Romeo and Juliet",
    },
    {
      question: "Who says 'To be, or not to be' in Hamlet?",
      options: ["Prince Hamlet", "King Claudius", "Polonius", "Laertes"],
      answer: "Prince Hamlet",
    },
    {
      question:
        "What is the name of the fairy king in A Midsummer Night's Dream?",
      options: ["Oberon", "Puck", "Titania", "Lysander"],
      answer: "Oberon",
    },
    {
      question:
        "Which play includes the witches' line 'Double, double toil and trouble'?",
      options: ["Macbeth", "Hamlet", "King Lear", "Julius Caesar"],
      answer: "Macbeth",
    },
    {
      question: "Who is the villain in Othello?",
      options: ["Iago", "Othello", "Cassio", "Roderigo"],
      answer: "Iago",
    },
    {
      question: "In which play does the character Shylock appear?",
      options: [
        "The Merchant of Venice",
        "Twelfth Night",
        "Much Ado About Nothing",
        "As You Like It",
      ],
      answer: "The Merchant of Venice",
    },
    {
      question: "What is the setting of The Tempest?",
      options: ["A remote island", "Venice", "Denmark", "Athens"],
      answer: "A remote island",
    },
    {
      question:
        "Which historical figure is the subject of the play 'Julius Caesar'?",
      options: ["Julius Caesar", "Mark Antony", "Brutus", "Cassius"],
      answer: "Julius Caesar",
    },
    {
      question: "Who is the protagonist in 'King Lear'?",
      options: ["King Lear", "Edmund", "Gloucester", "Kent"],
      answer: "King Lear",
    },
    {
      question: "What genre is 'Twelfth Night'?",
      options: ["Comedy", "Tragedy", "History", "Romance"],
      answer: "Comedy",
    },
  ],

  generalKnowledge: [
    {
      question: "What is the capital of Australia?",
      options: ["Sydney", "Canberra", "Melbourne", "Brisbane"],
      answer: "Canberra",
    },
    {
      question: "Which planet is known as the 'Red Planet'?",
      options: ["Mars", "Jupiter", "Venus", "Saturn"],
      answer: "Mars",
    },
    {
      question: "Who painted the Mona Lisa?",
      options: [
        "Leonardo da Vinci",
        "Vincent van Gogh",
        "Pablo Picasso",
        "Michelangelo",
      ],
      answer: "Leonardo da Vinci",
    },
    {
      question: "What is the largest ocean on Earth?",
      options: [
        "Pacific Ocean",
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
      ],
      answer: "Pacific Ocean",
    },
    {
      question: "Which country gifted the Statue of Liberty to the USA?",
      options: ["France", "England", "Germany", "Italy"],
      answer: "France",
    },
    {
      question: "What is the hardest natural substance on Earth?",
      options: ["Diamond", "Gold", "Iron", "Quartz"],
      answer: "Diamond",
    },
    {
      question: "Which animal is the tallest in the world?",
      options: ["Giraffe", "Elephant", "Ostrich", "Camel"],
      answer: "Giraffe",
    },
    {
      question: "What is the currency of Japan?",
      options: ["Yen", "Won", "Dollar", "Euro"],
      answer: "Yen",
    },
    {
      question: "Who wrote '1984'?",
      options: [
        "George Orwell",
        "Aldous Huxley",
        "Ray Bradbury",
        "J.K. Rowling",
      ],
      answer: "George Orwell",
    },
    {
      question: "Which language has the most native speakers?",
      options: ["Mandarin Chinese", "English", "Spanish", "Hindi"],
      answer: "Mandarin Chinese",
    },
  ],

  science: [
    {
      question: "What is the chemical symbol for gold?",
      options: ["Au", "Ag", "Fe", "Pb"],
      answer: "Au",
    },
    {
      question: "What is the powerhouse of the cell?",
      options: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"],
      answer: "Mitochondria",
    },
    {
      question: "Which gas do plants absorb from the atmosphere?",
      options: ["Carbon dioxide (CO2)", "Oxygen", "Nitrogen", "Hydrogen"],
      answer: "Carbon dioxide (CO2)",
    },
    {
      question: "What is the speed of light in a vacuum?",
      options: [
        "299,792 kilometers per second (or ~186,282 miles per second)",
        "150,000 kilometers per second",
        "1,080 kilometers per second",
        "30,000 kilometers per second",
      ],
      answer: "299,792 kilometers per second (or ~186,282 miles per second)",
    },
    {
      question: "Who developed the theory of relativity?",
      options: [
        "Albert Einstein",
        "Isaac Newton",
        "Galileo Galilei",
        "Nikola Tesla",
      ],
      answer: "Albert Einstein",
    },
    {
      question: "What is the pH value of pure water?",
      options: ["7 (neutral)", "0 (acidic)", "14 (alkaline)", "5 (acidic)"],
      answer: "7 (neutral)",
    },
    {
      question: "Which element has the atomic number 1?",
      options: ["Hydrogen", "Helium", "Oxygen", "Carbon"],
      answer: "Hydrogen",
    },
    {
      question: "What is Newton's first law of motion?",
      options: [
        "An object in motion stays in motion unless acted upon by an external force (Inertia)",
        "For every action, there is an equal and opposite reaction",
        "Force equals mass times acceleration",
        "Energy cannot be created or destroyed",
      ],
      answer:
        "An object in motion stays in motion unless acted upon by an external force (Inertia)",
    },
    {
      question: "What is the study of fossils called?",
      options: ["Paleontology", "Archaeology", "Geology", "Anthropology"],
      answer: "Paleontology",
    },
    {
      question: "Which vitamin is produced when sunlight hits the skin?",
      options: ["Vitamin D", "Vitamin C", "Vitamin A", "Vitamin B12"],
      answer: "Vitamin D",
    },
  ],

  history: [
    {
      question: "When did World War I begin?",
      options: ["1914", "1918", "1939", "1945"],
      answer: "1914",
    },
    {
      question: "Who was the first President of the United States?",
      options: [
        "George Washington",
        "Thomas Jefferson",
        "Abraham Lincoln",
        "John Adams",
      ],
      answer: "George Washington",
    },
    {
      question: "Which ancient wonder was located in Alexandria, Egypt?",
      options: [
        "The Lighthouse of Alexandria",
        "The Great Pyramid of Giza",
        "The Hanging Gardens of Babylon",
        "The Statue of Zeus at Olympia",
      ],
      answer: "The Lighthouse of Alexandria",
    },
    {
      question:
        "What was the name of the ship that carried the Pilgrims to America?",
      options: ["Mayflower", "Santa Maria", "Endeavour", "Beagle"],
      answer: "Mayflower",
    },
    {
      question: "Who was the first female Prime Minister of the UK?",
      options: [
        "Margaret Thatcher",
        "Theresa May",
        "Angela Merkel",
        "Indira Gandhi",
      ],
      answer: "Margaret Thatcher",
    },
    {
      question: "Which empire was ruled by Genghis Khan?",
      options: [
        "Mongol Empire",
        "Roman Empire",
        "Ottoman Empire",
        "Persian Empire",
      ],
      answer: "Mongol Empire",
    },
    {
      question: "What event marked the start of the French Revolution?",
      options: [
        "Storming of the Bastille (1789)",
        "Reign of Terror",
        "Execution of Louis XVI",
        "Napoleon's coup",
      ],
      answer: "Storming of the Bastille (1789)",
    },
    {
      question: "Who invented the printing press?",
      options: [
        "Johannes Gutenberg",
        "Thomas Edison",
        "Alexander Graham Bell",
        "Nikola Tesla",
      ],
      answer: "Johannes Gutenberg",
    },
    {
      question: "Which country was Nelson Mandela the president of?",
      options: ["South Africa", "Kenya", "Zimbabwe", "Nigeria"],
      answer: "South Africa",
    },
    {
      question: "What was the main cause of the Cold War?",
      options: [
        "Ideological conflict between the USA (capitalism) and USSR (communism)",
        "Territorial disputes",
        "Religious conflicts",
        "Trade wars",
      ],
      answer:
        "Ideological conflict between the USA (capitalism) and USSR (communism)",
    },
  ],

  explorationHistory: [
    {
      question: "Who was the first European to reach India by sea?",
      options: [
        "Vasco da Gama",
        "Christopher Columbus",
        "Ferdinand Magellan",
        "Marco Polo",
      ],
      answer: "Vasco da Gama",
    },
    {
      question: "Which explorer is credited with discovering America?",
      options: [
        "Christopher Columbus",
        "Leif Erikson",
        "Amerigo Vespucci",
        "John Cabot",
      ],
      answer: "Christopher Columbus",
    },
    {
      question: "Who led the first expedition to circumnavigate the globe?",
      options: [
        "Ferdinand Magellan (though he died en route)",
        "James Cook",
        "Francis Drake",
        "Vasco da Gama",
      ],
      answer: "Ferdinand Magellan (though he died en route)",
    },
    {
      question: "What was the name of Darwin's ship during his voyage?",
      options: ["HMS Beagle", "HMS Endeavour", "Santa Maria", "Mayflower"],
      answer: "HMS Beagle",
    },
    {
      question: "Which explorer reached the South Pole first?",
      options: [
        "Roald Amundsen (1911)",
        "Robert Falcon Scott",
        "Ernest Shackleton",
        "Fridtjof Nansen",
      ],
      answer: "Roald Amundsen (1911)",
    },
    {
      question: "Who mapped the Pacific Ocean and Australia?",
      options: [
        "Captain James Cook",
        "Christopher Columbus",
        "Vasco da Gama",
        "Ferdinand Magellan",
      ],
      answer: "Captain James Cook",
    },
    {
      question: "What was the Silk Road?",
      options: [
        "A trade route connecting Asia and Europe",
        "A sea route around Africa",
        "A road in ancient Rome",
        "A route across North America",
      ],
      answer: "A trade route connecting Asia and Europe",
    },
    {
      question: "Which civilization built the first known seafaring ships?",
      options: ["The Phoenicians", "The Romans", "The Greeks", "The Egyptians"],
      answer: "The Phoenicians",
    },
    {
      question: "Who discovered the source of the Nile River?",
      options: [
        "John Hanning Speke",
        "David Livingstone",
        "Henry Morton Stanley",
        "Richard Burton",
      ],
      answer: "John Hanning Speke",
    },
    {
      question: "What was the primary goal of Lewis and Clark's expedition?",
      options: [
        "To explore the Louisiana Purchase and find a route to the Pacific",
        "To find gold in California",
        "To establish new trade routes to Asia",
        "To map the Mississippi River",
      ],
      answer:
        "To explore the Louisiana Purchase and find a route to the Pacific",
    },
  ],

  modernHistory: [
    {
      question: "When did the Berlin Wall fall?",
      options: ["1989", "1991", "1987", "1993"],
      answer: "1989",
    },
    {
      question: "Which event started World War II?",
      options: [
        "Germany's invasion of Poland (1939)",
        "Attack on Pearl Harbor",
        "Treaty of Versailles",
        "Bombing of Hiroshima",
      ],
      answer: "Germany's invasion of Poland (1939)",
    },
    {
      question:
        "Who was the British Prime Minister during most of World War II?",
      options: [
        "Winston Churchill",
        "Neville Chamberlain",
        "Margaret Thatcher",
        "Clement Attlee",
      ],
      answer: "Winston Churchill",
    },
    {
      question: "What was the Manhattan Project?",
      options: [
        "The development of the atomic bomb",
        "The plan for D-Day invasion",
        "A secret spy network",
        "A WWII communication code",
      ],
      answer: "The development of the atomic bomb",
    },
    {
      question: "Who was the first person to walk on the Moon?",
      options: [
        "Neil Armstrong",
        "Buzz Aldrin",
        "Yuri Gagarin",
        "Michael Collins",
      ],
      answer: "Neil Armstrong",
    },
    {
      question: "What was the main cause of the Vietnam War?",
      options: [
        "Communist North Vietnam vs. Capitalist South Vietnam",
        "Territorial disputes",
        "Religious conflict",
        "Trade disagreements",
      ],
      answer: "Communist North Vietnam vs. Capitalist South Vietnam",
    },
    {
      question: "Which treaty ended World War I?",
      options: [
        "Treaty of Versailles",
        "Treaty of Paris",
        "Treaty of Ghent",
        "Treaty of Tordesillas",
      ],
      answer: "Treaty of Versailles",
    },
    {
      question:
        "Who was the leader of the Soviet Union during the Cuban Missile Crisis?",
      options: [
        "Nikita Khrushchev",
        "Joseph Stalin",
        "Leonid Brezhnev",
        "Mikhail Gorbachev",
      ],
      answer: "Nikita Khrushchev",
    },
    {
      question: "What year did India gain independence from Britain?",
      options: ["1947", "1950", "1935", "1965"],
      answer: "1947",
    },
    {
      question: "Who was the first Chancellor of unified Germany?",
      options: [
        "Konrad Adenauer",
        "Helmut Kohl",
        "Angela Merkel",
        "Willy Brandt",
      ],
      answer: "Konrad Adenauer",
    },
  ],
};

// Get category from URL ( URL is like "quiz.html?category=universe")
const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category"); // e.g., "universe"

// Get the questions for the selected category
const questions = quizzesByCategory[selectedCategory] || [];
const quizContainer = document.getElementById("question-container");
console.log("questions", questions);
console.log("questions[0]", questions[0]);
// Track current question and user answers
let currentQuestionIndex = 0;
const userAnswers = new Array(questions.length);

// Function to render the current question
function renderQuestion() {
  if (questions.length === 0) {
    quizContainer.innerHTML = `
      <div class="bg-red-100 text-red-700 p-4 rounded">
        No questions found for the selected category: <strong>${selectedCategory}</strong>.
      </div>
    `;
    return;
  }

  const q = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  quizContainer.innerHTML = `
    <div class="mb-4 md:mb-6">
      <h2 class="text-base md:text-lg font-semibold text-gray-800 mb-1">Progress</h2>
      <p class="text-sm md:text-base text-gray-600">Question ${
        currentQuestionIndex + 1
      } of ${questions.length}</p>
    </div>

    <!-- Timer Section -->
    <div class="flex justify-between items-center space-x-1 md:space-x-4">
      <!-- Hours -->
      <div class="flex-1 text-center">
        <div class="bg-[#f0f2f5] py-2 md:py-3 rounded-lg font-bold text-gray-800 w-full">00</div>
        <p class="text-xs md:text-sm text-gray-500 mb-1">Hours</p>
      </div>

      <!-- Minutes -->
      <div class="flex-1 text-center">
        <div class="bg-[#f0f2f5] py-2 md:py-3 rounded-lg font-bold text-gray-800 w-full">00</div>
        <p class="text-xs md:text-sm text-gray-500 mb-1">Minutes</p>
      </div>

      <!-- Seconds -->
      <div class="flex-1 text-center">
        <div class="bg-[#f0f2f5] py-2 md:py-3 rounded-lg font-bold text-gray-800 w-full">30</div>
        <p class="text-xs md:text-sm text-gray-500 mb-1">Seconds</p>
      </div>
    </div>

    <h2 class="text-xl font-semibold text-gray-800 mb-6">Q${
      currentQuestionIndex + 1
    }: ${q.question}</h2>
    
    <!-- Options -->
    <div class="space-y-3 mb-8" id="options-container">
      ${q.options
        .map(
          (option, i) => `
        <div class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input 
            type="radio" 
            id="q${currentQuestionIndex}-option${i}" 
            name="q${currentQuestionIndex}" 
            value="${option}"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            ${userAnswers[currentQuestionIndex] === option ? "checked" : ""}
          >
          <label for="q${currentQuestionIndex}-option${i}" class="ml-3 text-gray-700">${option}</label>
        </div>
      `
        )
        .join("")}
    </div>
    
    <!-- Navigation Buttons -->
    <div class="flex justify-between pt-4 border-gray-200">
      <button id="prev-btn" class="px-4 bg-[rgba(178, 178, 179, 1)] rounded py-2 text-gray-600 hover:text-gray-800 font-medium ${
        isFirstQuestion ? "invisible" : ""
      }">
        Previous
      </button>
      <button id="next-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
        ${isLastQuestion ? "Submit" : "Next"}
      </button>
    </div>
  `;

  // Add event listeners to options
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      userAnswers[currentQuestionIndex] = e.target.value;
    });
  });

  // Previous button event listener
  document.getElementById("prev-btn")?.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion();
    }
  });

  // Next/Submit button event listener
  document.getElementById("next-btn")?.addEventListener("click", () => {
    // Save the answer if any option is selected
    const selectedOption = document.querySelector(
      'input[name="q' + currentQuestionIndex + '"]:checked'
    );
    if (selectedOption) {
      userAnswers[currentQuestionIndex] = selectedOption.value;
    }

    if (!isLastQuestion) {
      currentQuestionIndex++;
      renderQuestion();
    } else {
      submitQuiz();
    }
  });
}

// Function to handle quiz submission
function submitQuiz() {
  // Calculate score
  let score = 0;
  questions.forEach((q, index) => {
    if (userAnswers[index] === q.answer) {
      score++;
    }
  });

  // Display Part-1 style results summary
  quizContainer.innerHTML = `
    <div class="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-2xl mx-auto text-center">
      <h2 class="text-2xl md:text-3xl font-bold mb-6">Quiz Results</h2>

      <div class="flex items-center justify-between mb-4">
        <span class="text-sm md:text-base text-gray-700">Quiz Completed</span>
        <span class="text-sm md:text-base font-medium text-gray-700">100%</span>
      </div>
      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
        <div class="h-full bg-gray-900 w-full transition-all duration-500 ease-in-out"></div>
      </div>

      <div class="bg-gray-100 text-left px-6 py-4 rounded-lg mb-6">
        <p class="text-sm text-gray-600 mb-1">Score</p>
        <p class="text-2xl font-bold text-gray-800">${score}/${questions.length}</p>
      </div>

      <p class="text-gray-700 mb-8 leading-relaxed">
        Congratulations! You’ve completed the quiz with a score of <strong>${score}</strong> out of <strong>${questions.length}</strong>.
        Your performance indicates a strong understanding of the subject matter. Keep up the excellent work!
      </p>

      <div class="flex flex-col max-w-[30%] mx-auto justify-center gap-4">
        <button id="review-btn" class="bg-blue-600 text-white font-medium px-6 py-2 rounded hover:bg-blue-700 transition">
          Review Answers
        </button>
        <button id="restart-btn" class="bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded hover:bg-gray-300 transition">
          Take Another Quiz
        </button>
      </div>
    </div>
  `;

  document.getElementById("review-btn").addEventListener("click", () => {
    currentQuestionIndex = 0;
    showReviewQuestion();
  });

  document.getElementById("restart-btn").addEventListener("click", () => {
    currentQuestionIndex = 0;
    userAnswers.fill(null);
    renderQuestion();
    startTimer();
  });
}

// Initialize the quiz
renderQuestion();

// progress bar
// Timer variables
let quizDuration = 10 * 60; // 10 minutes in seconds
let timerInterval;
let timeLeft = quizDuration;

// Function to update the progress bar (using the "TVTTTTTT" style from your image)
function updateProgressBar() {
  const progressContainer = document.getElementById("progress-container");
  if (!progressContainer) return;

  const totalQuestions = questions.length;
  const currentProgress = currentQuestionIndex + 1;
  const progressPercentage = (currentProgress / totalQuestions) * 100;

  // Add Tailwind-styled smooth progress bar
  progressContainer.innerHTML = `
    <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div class="h-full bg-gray-900 transition-all duration-300" style="width: ${progressPercentage}%;"></div>
    </div>
  `;
}

// Function to update and display the timer
function updateTimer() {
  timeLeft--;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    submitQuiz();
    return;
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const timerHours = document.getElementById("timer-hours");
  const timerMinutes = document.getElementById("timer-minutes");
  const timerSeconds = document.getElementById("timer-seconds");

  if (timerHours) timerHours.textContent = hours.toString().padStart(2, "0");
  if (timerMinutes)
    timerMinutes.textContent = minutes.toString().padStart(2, "0");
  if (timerSeconds)
    timerSeconds.textContent = seconds.toString().padStart(2, "0");
}

// Start the timer when the quiz begins
function startTimer() {
  clearInterval(timerInterval); // Clear any existing timer
  timeLeft = quizDuration;
  updateTimer(); // Update immediately
  timerInterval = setInterval(updateTimer, 1000);
}

// Modified renderQuestion function
function renderQuestion() {
  if (questions.length === 0) {
    quizContainer.innerHTML = `
      <div class="bg-red-100 text-red-700 p-4 rounded">
        No questions found for the selected category: <strong>${selectedCategory}</strong>.
      </div>
    `;
    return;
  }

  const q = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  quizContainer.innerHTML = `
    <div class="mb-4 md:mb-6">
      <h2 class="text-base md:text-lg font-semibold text-gray-800 mb-1">Progress</h2>
    <div>
  <div id="progress-container" class="w-full mb-2"></div>
  <div class="text-sm md:text-base text-gray-600 ">
    Question ${currentQuestionIndex + 1} of ${questions.length}
  </div>
</div>
    </div>

    <!-- Timer Section -->
    <div class="flex justify-between items-center space-x-1 md:space-x-4 mb-6">
      <!-- Hours -->
      <div class="flex-1 text-center">
        <div class="bg-[#f0f2f5] py-2 md:py-3 rounded-lg font-bold text-gray-800 w-full" id="timer-hours">00</div>
        <p class="text-xs md:text-sm text-gray-500 mb-1">Hours</p>
      </div>

      <!-- Minutes -->
      <div class="flex-1 text-center">
        <div class="bg-[#f0f2f5] py-2 md:py-3 rounded-lg font-bold text-gray-800 w-full" id="timer-minutes">00</div>
        <p class="text-xs md:text-sm text-gray-500 mb-1">Minutes</p>
      </div>

      <!-- Seconds -->
      <div class="flex-1 text-center">
        <div class="bg-[#f0f2f5] py-2 md:py-3 rounded-lg font-bold text-gray-800 w-full" id="timer-seconds">30</div>
        <p class="text-xs md:text-sm text-gray-500 mb-1">Seconds</p>
      </div>
    </div>

    <h2 class="text-xl font-semibold text-gray-800 mb-6">Q${
      currentQuestionIndex + 1
    }: ${q.question}</h2>
    
    <!-- Options -->
    <div class="space-y-3 mb-8" id="options-container">
      ${q.options
        .map(
          (option, i) => `
        <div class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input 
            type="radio" 
            id="q${currentQuestionIndex}-option${i}" 
            name="q${currentQuestionIndex}" 
            value="${option}"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            ${userAnswers[currentQuestionIndex] === option ? "checked" : ""}
          >
          <label for="q${currentQuestionIndex}-option${i}" class="ml-3 text-gray-700">${option}</label>
        </div>
      `
        )
        .join("")}
    </div>
    
    <!-- Navigation Buttons -->
    <div class="flex justify-between pt-4 n">
      <button id="prev-btn" class="px-4 py-2 bg-gray-100 rounded text-black hover:text-gray-800 font-medium ${
        isFirstQuestion ? "invisible" : ""
      }">
        Previous
      </button>
      <button id="next-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
        ${isLastQuestion ? "Submit" : "Next"}
      </button>
    </div>
  `;

  // Update progress bar
  updateProgressBar();

  // Add event listeners
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      userAnswers[currentQuestionIndex] = e.target.value;
    });
  });

  document.getElementById("prev-btn")?.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion();
    }
  });

  document.getElementById("next-btn")?.addEventListener("click", () => {
    const selectedOption = document.querySelector(
      'input[name="q' + currentQuestionIndex + '"]:checked'
    );
    if (selectedOption) {
      userAnswers[currentQuestionIndex] = selectedOption.value;
    }

    if (!isLastQuestion) {
      currentQuestionIndex++;
      renderQuestion();
    } else {
      clearInterval(timerInterval);
      submitQuiz();
    }
  });
}

// Initialize the quiz
renderQuestion();
startTimer(); // Start the timer when the quiz loads

// Clear timer when leaving the page
window.addEventListener("beforeunload", () => {
  clearInterval(timerInterval);
});

function showReviewQuestion() {
  const q = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  quizContainer.innerHTML = `
    <div class="mb-4 md:mb-6">
      <h2 class="text-base md:text-lg font-semibold text-gray-800 mb-1">Review Incorrect Answers</h2>
      <p class="text-sm md:text-base text-gray-600">Question ${
        currentQuestionIndex + 1
      } of ${questions.length}</p>
    </div>

    <h2 class="text-xl font-semibold text-gray-800 mb-6">Q${
      currentQuestionIndex + 1
    }: ${q.question}</h2>

    <div class="space-y-3 mb-8" id="options-container">
      ${q.options
        .map(
          (option, i) => `
        <div class="flex items-center p-3 border rounded-lg ${
          userAnswers[currentQuestionIndex] === option
            ? userAnswers[currentQuestionIndex] === q.answer
              ? "bg-green-100 border-green-300"
              : "bg-red-100 border-red-300"
            : option === q.answer
            ? "bg-green-50 border-green-200"
            : "border-gray-200"
        }">
          <input 
            type="radio" 
            id="review-q${currentQuestionIndex}-option${i}" 
            name="review-q${currentQuestionIndex}" 
            value="${option}"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            ${userAnswers[currentQuestionIndex] === option ? "checked" : ""}
            disabled
          >
          <label for="review-q${currentQuestionIndex}-option${i}" class="ml-3 text-gray-700">${option}</label>
        </div>
      `
        )
        .join("")}
    </div>

    <div class="flex justify-between pt-4  ">
      <button id="prev-btn" class="px-4 py-2 bg-gray-100 rounded text-black hover:text-gray-800 font-medium ${
        isFirstQuestion ? "invisible" : ""
      }">Previous</button>
      <button id="next-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
        ${isLastQuestion ? "Back To Quizzes" : "Next"}
      </button>
    </div>
  `;

  document.getElementById("prev-btn")?.addEventListener("click", () => {
    if (!isFirstQuestion) {
      currentQuestionIndex--;
      showReviewQuestion();
    }
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    if (!isLastQuestion) {
      currentQuestionIndex++;
      showReviewQuestion();
    } else {
      currentQuestionIndex = 0;
      userAnswers.fill(null);
      renderQuestion();
      startTimer();
    }
  });
}


// if (questions && questions.length > 0) {
//   container.innerHTML = questions
//     .map(
//       (q, index) => `
//     <div class="mb-4 md:mb-6">
//       <h2 class="text-base md:text-lg font-semibold text-gray-800 mb-1">Progress</h2>
//       <p class="text-sm md:text-base text-gray-600">Question ${index + 1} of ${
//         questions.length
//       }</p>
//     </div>

//     <!-- Timer Section -->
//     <div class="flex justify-between items-center space-x-1 md:space-x-4">
//       <!-- Hours -->
//       <div class="flex-1 text-center">
//         <div class="bg-[#f0f2f5] py-2 md:py-3 rounded-lg font-bold text-gray-800 w-full">00</div>
//         <p class="text-xs md:text-sm text-gray-500 mb-1">Hours</p>
//       </div>

//       <!-- Minutes -->
//       <div class="flex-1 text-center">
//         <div class="bg-[#f0f2f5] py-2 md:py-3 rounded-lg font-bold text-gray-800 w-full">00</div>
//         <p class="text-xs md:text-sm text-gray-500 mb-1">Minutes</p>
//       </div>

//       <!-- Seconds -->
//       <div class="flex-1 text-center">
//         <div class="bg-[#f0f2f5] py-2 md:py-3 rounded-lg font-bold text-gray-800 w-full">30</div>
//         <p class="text-xs md:text-sm text-gray-500 mb-1">Seconds</p>
//       </div>
//     </div>

//     <h2 class="text-xl font-semibold text-gray-800 mb-6">Q${index + 1}: ${
//         q.question
//       }</h2>

//     <!-- Options -->
//     <div class="space-y-3 mb-8">
//       ${q.options
//         .map(
//           (option, optionIndex) => `
//         <!-- Option ${optionIndex + 1} -->
//         <div class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
//           <input type="radio" id="q${index}-option${optionIndex}" name="q${index}" class="h-4 w-4 text-blue-600 focus:ring-blue-500">
//           <label for="q${index}-option${optionIndex}" class="ml-3 text-gray-700">${option}</label>
//         </div>
//       `
//         )
//         .join("")}
//     </div>

//     <!-- Navigation Buttons -->
//     <div class="flex justify-between pt-4 border-gray-200">
//       <button class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium ${
//         index === 0 ? "invisible" : ""
//       }">Previous</button>
//       <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
//         ${index === questions.length - 1 ? "Submit" : "Next"}
//       </button>
//     </div>
// `
//     )
//     .join("");
// } else {
//   container.innerHTML = `
//     <div class="bg-red-100 text-red-700 p-4 rounded">
//       No questions found for the selected category: <strong>${selectedCategory}</strong>.
//     </div>
//   `;
// }
