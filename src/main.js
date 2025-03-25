import './style.css';

const sheetUrl = 'https://api.sheetbest.com/sheets/4f4a2079-9e8a-4419-9c2c-20686bbf18e0';

// جميع الحروف العربية
const arabicLetters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"];

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

    // إنشاء أزرار لكل الحروف العربية
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
    document.getElementById('answer').innerText = "";
    return;
  }

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

  console.log("🧐 البيانات المختارة:", randomQuestion); // ✅ طباعة السؤال العشوائي بالكامل

  // ✅ التأكد من أن الأعمدة مكتوبة كما في الجدول
  const questionText = randomQuestion["السؤال"] || "🚨 خطأ: العمود غير موجود!";
  const answerText = randomQuestion["الأجابة"] || "🚨 خطأ: العمود غير موجود!"; // هنا استخدمنا "الأجابة" كما هي في الجدول

  document.getElementById('question').innerText = `❓ السؤال: ${questionText}`;
  document.getElementById('answer').innerText = `✅ الجواب: ${answerText}`;
}


getData();
