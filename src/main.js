// src/main.js

const sheetUrl = 'https://api.sheetbest.com/sheets/4f4a2079-9e8a-4419-9c2c-20686bbf18e0';

// قائمة الحروف العربية
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

    console.log("🔍 أسماء الحقول:", Object.keys(data[0]));

    const lettersContainer = document.getElementById('letters');
    if (!lettersContainer) {
      console.error("❌ عنصر الأزرار 'letters' غير موجود في الـ HTML!");
      return;
    }

    // إنشاء أزرار لكل حرف
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
  // البحث عن الأسئلة التي يطابق فيها عمود "الحرف" الحرف المختار
  const questions = data.filter(item => item["الحرف"]?.trim() === letter);

  if (questions.length === 0) {
    document.getElementById('question').innerText = `❌ لا يوجد أسئلة لهذا الحرف "${letter}"!`;
    document.getElementById('answer').innerText = "";
    document.getElementById('category').classList.add('hidden');
    document.getElementById('toggle-answer').style.display = 'none';
    return;
  }

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  console.log("🧐 البيانات المختارة:", randomQuestion);

  const questionText = randomQuestion["السؤال"] || "🚨 خطأ: العمود غير موجود!";
  const answerText = randomQuestion["الأجابة"] || "🚨 خطأ: العمود غير موجود!";
  const categoryText = randomQuestion["التصنيف"] || "";

  document.getElementById('question').innerText = `❓ السؤال: ${questionText}`;
  document.getElementById('answer').innerText = `✅ الجواب: ${answerText}`;

  const categoryElem = document.getElementById('category');
  if (categoryText) {
    categoryElem.innerText = `📂 التصنيف: ${categoryText}`;
    categoryElem.classList.remove('hidden');
  } else {
    categoryElem.classList.add('hidden');
  }

  // عرض زر التبديل لإخفاء/إظهار الإجابة
  const toggleBtn = document.getElementById('toggle-answer');
  const toggleIcon = document.getElementById('toggle-icon');
  // تأكد أن الإجابة تظهر بشكل افتراضي
  document.getElementById('answer').style.display = 'block';
  toggleBtn.style.display = 'inline-block';
  // اضف حدث لتبديل عرض الإجابة
  toggleBtn.onclick = function () {
    const answerElem = document.getElementById('answer');
    if (answerElem.style.display === 'none') {
      answerElem.style.display = 'block';
      toggleIcon.src = 'https://img.icons8.com/ios-filled/50/000000/eye.png';
    } else {
      answerElem.style.display = 'none';
      toggleIcon.src = 'https://img.icons8.com/ios-filled/50/000000/closed-eye.png';
    }
  };
}

getData();
