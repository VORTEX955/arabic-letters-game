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
    console.log("📊 البيانات المسترجعة:", data);

    if (!Array.isArray(data) || data.length === 0) {
      console.error("❌ لم يتم العثور على بيانات في الجدول!");
      document.getElementById('question').innerText = "⚠️ لم يتم العثور على بيانات في الجدول!";
      return;
    }

    const lettersContainer = document.getElementById('letters');
    if (!lettersContainer) {
      console.error("❌ عنصر الأزرار 'letters' غير موجود في الـ HTML!");
      return;
    }

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
    document.getElementById('question').innerText = `❌ لا يوجد أسئلة لهذا الحرف "${letter}"!`;
    document.getElementById('answer').innerText = "**********";
    document.getElementById('category').innerText = "لا يوجد";
    document.getElementById('toggle-answer').style.display = 'none';
    return;
  }

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  const questionText = randomQuestion["السؤال"] || "🚨 خطأ: العمود غير موجود!";
  const answerText = randomQuestion["الأجابة"] || "🚨 خطأ: العمود غير موجود!";
  const categoryText = randomQuestion["التصنيف"] || "";

  document.getElementById('question').innerText = `❓ السؤال: ${questionText}`;
  document.getElementById('answer').innerText = "**********";
  document.getElementById('category').innerText = categoryText || "لا يوجد";

  const toggleBtn = document.getElementById('toggle-answer');
  toggleBtn.style.display = 'inline-block';

  // إخفاء الإجابة افتراضيًا
  document.getElementById('answer').style.display = 'none';

  toggleBtn.onclick = function () {
    const answerElem = document.getElementById('answer');
    const toggleIcon = document.getElementById('toggle-icon');
    
    if (answerElem.style.display === 'none') {
      answerElem.style.display = 'block';
      answerElem.innerText = answerText;
      toggleIcon.src = 'https://img.icons8.com/ios-filled/50/000000/eye.png';
    } else {
      answerElem.style.display = 'none';
      answerElem.innerText = "**********";
      toggleIcon.src = 'https://img.icons8.com/ios-filled/50/000000/closed-eye.png';
    }
  };
}

getData();
