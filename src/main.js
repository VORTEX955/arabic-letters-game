const sheetUrl = 'https://api.sheetbest.com/sheets/4f4a2079-9e8a-4419-9c2c-20686bbf18e0';

const arabicLetters = [
  "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر",
  "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف",
  "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
];

async function getData() {
  try {
    const response = await fetch(sheetUrl);
    const data = await response.json();

    const lettersContainer = document.getElementById('letters');

    arabicLetters.forEach(letter => {
      const button = document.createElement('button');
      button.innerText = letter;
      button.classList.add('letter-btn');
      button.addEventListener('click', () => showQuestion(letter, data));
      lettersContainer.appendChild(button);
    });
  } catch (error) {
    console.error("❌ خطأ في جلب البيانات:", error);
  }
}

function showQuestion(letter, data) {
  const questions = data.filter(item => item["الحرف"]?.trim() === letter);

  if (questions.length === 0) {
    updateUI("❌ لا يوجد أسئلة!", "**********", "لا يوجد تصنيف");
    return;
  }

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  const questionText = randomQuestion["السؤال"] || "🚨 خطأ: لا يوجد سؤال!";
  const answerText = randomQuestion["الأجابة"] || "🚨 خطأ: لا يوجد إجابة!";
  const categoryText = randomQuestion["التصنيف"] || "لا يوجد تصنيف";

  updateUI(questionText, answerText, categoryText);
}

function updateUI(question, answer, category) {
  document.getElementById('question').innerText = `❓ السؤال: ${question}`;
  document.getElementById('question').classList.remove('hidden');

  document.getElementById('answer').innerText = "**********";
  document.getElementById('answer').classList.add('hidden');

  document.getElementById('category').innerText = category;
  document.getElementById('category').classList.remove('hidden');

  const toggleBtn = document.getElementById('toggle-answer');
  toggleBtn.classList.remove('hidden');
  toggleBtn.onclick = function () {
    const answerElem = document.getElementById('answer');
    const toggleIcon = document.getElementById('toggle-icon');

    if (answerElem.classList.contains('hidden')) {
      answerElem.classList.remove('hidden');
      answerElem.innerText = answer;
      toggleIcon.src = 'public/icons8-invisible-90.png';
    } else {
      answerElem.classList.add('hidden');
      answerElem.innerText = "**********";
      toggleIcon.src = 'public/icons8-eye-90.png';
    }
  };
}

getData();
