const sheetUrl = 'https://api.sheetbest.com/sheets/4f4a2079-9e8a-4419-9c2c-20686bbf18e0';

const arabicLetters = [
  "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر",
  "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف",
  "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
];

let showAnswers = false; // حالة عامة لتحديد عرض الإجابة

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

  document.getElementById('answer').innerText = showAnswers ? answer : "**********";
  document.getElementById('answer').classList.toggle('hidden', !showAnswers);

  document.getElementById('category').innerText = category;
  document.getElementById('category').classList.remove('hidden');

  const toggleBtn = document.getElementById('toggle-answer');
  toggleBtn.classList.remove('hidden');
  updateToggleIcon();
  
  toggleBtn.onclick = toggleAnswerVisibility;
}

function toggleAnswerVisibility() {
  showAnswers = !showAnswers; // تغيير الحالة العامة
  document.getElementById('answer').innerText = showAnswers ? document.getElementById('answer').dataset.realAnswer : "**********";
  document.getElementById('answer').classList.toggle('hidden', !showAnswers);
  updateToggleIcon();
}

function updateToggleIcon() {
  const toggleIcon = document.getElementById('toggle-icon');
  toggleIcon.src = showAnswers ? 'public/icons8-invisible-90.png' : 'public/icons8-eye-90.png';
}

getData();
