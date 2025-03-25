// src/main.js

// لا تقم باستيراد ملف CSS هنا لأننا ربطناه في index.html

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

    // إنشاء أزرار لكل حرف من الحروف
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
    return;
  }
  
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  console.log("🧐 البيانات المختارة:", randomQuestion);

  // استخراج محتوى السؤال، الجواب والتصنيف
  const questionText = randomQuestion["السؤال"] || "🚨 خطأ: العمود غير موجود!";
  const answerText = randomQuestion["الأجابة"] || "🚨 خطأ: العمود غير موجود!";
  const categoryText = randomQuestion["التصنيف"] || "";

  // عرض البيانات
  document.getElementById('question').innerText = `❓ السؤال: ${questionText}`;
  document.getElementById('answer').innerText = `✅ الجواب: ${answerText}`;
  
  // عرض التصنيف إذا وجد
  const categoryElem = document.getElementById('category');
  if (categoryText) {
    categoryElem.innerText = `📂 التصنيف: ${categoryText}`;
    categoryElem.classList.remove('hidden');
  } else {
    categoryElem.classList.add('hidden');
  }
}

getData();
