// Data
const featuredQuizzes = [
  {
    title: "The Universe",
    description: "Test your knowledge about the cosmos.",
    image: "./images/universe.png",
    category: "universe",
  },
  {
    title: "Ancient Civilizations",
    description: "Explore the mysteries of ancient cultures.",
    image: "./images/ancient.png",
    category: "civilization",
  },
  {
    title: "Shakespearean Plays",
    description: "Dive into the world of the Bard.",
    image: "./images/shakespear.png",
    category: "shakespear",
  },
];

const allQuizzes = [
  {
    title: "General Knowledge",
    description: "Test your overall knowledge with a mix of questions.",
    image: "./images/gk.png",
    category: "generalKnowledge",
  },
  {
    title: "Science",
    description: "Explore the wonders of science from biology to physics.",
    image: "./images/cs.png",
    category: "science",
  },
  {
    title: "History",
    description: "Journey through time and learn about historical events.",
    image: "./images/js.png",
    category: "history",
  },
  {
    title: "Exploration History",
    description: "Journey through time and learn about historical events.",
    image: "./images/exp.png",
    category: "explorationHistory",
  },
  {
    title: "Modern History",
    description: "Journey through time and learn about historical events.",
    image: "./images/js.png",
    category: "modernHistory",
  },
];

// Populate Featured Quizzes
const featuredContainer = document.getElementById("featured-quizzes");
featuredContainer.innerHTML = featuredQuizzes
  .map(
    (quiz) => `
  <a href="../quizes.html?category=${quiz.category}" class="block bg-white rounded shadow hover:shadow-md transition">
    <img src="${quiz.image}" alt="${quiz.title}" class="w-full rounded-t h-36 object-cover">
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-1">${quiz.title}</h3>
      <p class="text-sm text-gray-600">${quiz.description}</p>
    </div>
  </a>
  `
  )

  .join("");

// Populate All Quizzes
const allContainer = document.getElementById("all-quizzes");
allContainer.innerHTML = allQuizzes
  .map(
    (quiz) => `
  <a href="../quizes.html?category=${quiz.category}" class="block">
    <div class="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg mb-5 px-5 py-4 shadow hover:shadow-md transition">
      <div class="md:w-2/3 mb-4 md:mb-0 md:mr-6">
        <h3 class="text-lg font-semibold mb-1">${quiz.title}</h3>
        <p class="text-sm text-gray-600">${quiz.description}</p>
      </div>
      <img src="${quiz.image}" alt="${quiz.title}" class="w-[18rem] h-36 object-cover rounded-md" />
    </div>
  </a>
  `
  )

  .join("");
