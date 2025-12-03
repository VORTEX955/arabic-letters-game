// مسار ملف البيانات المحلي
const DATA_URL = './data/questions.json';

const arabicLetters = [
  "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر",
  "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف",
  "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
];

let showAnswers = false;
let questionsData = [];
let currentSelectedLetter = null;
let currentQuestionData = null;

// إخفاء شاشة التحميل
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}

// إخفاء رسالة الترحيب
function hideWelcomeSection() {
  const welcomeSection = document.getElementById('welcome-section');
  if (welcomeSection) {
    welcomeSection.style.opacity = '0';
    welcomeSection.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      welcomeSection.classList.add('hidden');
    }, 300);
  }
}

// تحديث الإحصائيات
function updateStats() {
  const totalQuestions = document.getElementById('total-questions');
  const totalLetters = document.getElementById('total-letters');
  
  if (totalQuestions) {
    totalQuestions.textContent = questionsData.length;
    // Animation
    totalQuestions.style.transform = 'scale(1.2)';
    setTimeout(() => {
      totalQuestions.style.transform = 'scale(1)';
    }, 300);
  }
  
  if (totalLetters) {
    totalLetters.textContent = arabicLetters.length;
  }
}

// جلب البيانات من الملف المحلي
async function getData() {
  try {
    const response = await fetch(DATA_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    questionsData = data;

    console.log(`✅ تم تحميل ${data.length} سؤال بنجاح`);

    // تحديث الإحصائيات
    updateStats();

    // إنشاء أزرار الحروف
    createLetterButtons();
    
    // إخفاء شاشة التحميل بعد تأخير بسيط
    setTimeout(() => {
      hideLoadingScreen();
    }, 1000);

  } catch (error) {
    console.error("❌ خطأ في جلب البيانات:", error);
    hideLoadingScreen();
    showError("حدث خطأ في تحميل البيانات. تأكد من وجود ملف data/questions.json");
  }
}

// إنشاء أزرار الحروف مع animation
function createLetterButtons() {
  const lettersContainer = document.getElementById('letters');
  if (!lettersContainer) return;
  
  lettersContainer.innerHTML = '';

  arabicLetters.forEach((letter, index) => {
    const button = document.createElement('button');
    button.innerText = letter;
    button.classList.add('letter-btn');
    button.setAttribute('aria-label', `اختر حرف ${letter}`);
    button.style.animationDelay = `${index * 0.03}s`;
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px)';
    
    button.addEventListener('click', () => handleLetterClick(letter));
    
    lettersContainer.appendChild(button);
    
    // Fade in animation
    setTimeout(() => {
      button.style.transition = 'all 0.3s ease';
      button.style.opacity = '1';
      button.style.transform = 'translateY(0)';
    }, index * 30);
  });
}

// معالجة النقر على الحرف
function handleLetterClick(letter) {
  // إخفاء رسالة الترحيب
  hideWelcomeSection();

  // Scroll to question section
  const questionSection = document.getElementById('question-section');
  if (questionSection) {
    questionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // إزالة التحديد من الحروف السابقة
  document.querySelectorAll('.letter-btn').forEach(btn => {
    btn.classList.remove('selected');
  });

  // إضافة التحديد للحرف المختار
  const clickedButton = Array.from(document.querySelectorAll('.letter-btn'))
    .find(btn => btn.innerText === letter);
  if (clickedButton) {
    clickedButton.classList.add('selected');
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  currentSelectedLetter = letter;
  showQuestion(letter);
  showSelectedLetterDisplay(letter);
}

// عرض مؤشر الحرف المختار
function showSelectedLetterDisplay(letter) {
  const display = document.getElementById('selected-letter-display');
  const letterText = document.getElementById('selected-letter-text');
  
  if (display && letterText) {
    letterText.textContent = letter;
    display.classList.remove('hidden');
    
    // Animation
    display.style.opacity = '0';
    display.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      display.style.transition = 'all 0.3s ease';
      display.style.opacity = '1';
      display.style.transform = 'translateY(0)';
    }, 10);
  }
}

// إخفاء مؤشر الحرف المختار
function hideSelectedLetterDisplay() {
  const display = document.getElementById('selected-letter-display');
  if (display) {
    display.style.opacity = '0';
    display.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      display.classList.add('hidden');
    }, 300);
  }
  
  // إزالة التحديد من الحروف
  document.querySelectorAll('.letter-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  currentSelectedLetter = null;
}

// عرض السؤال
function showQuestion(letter) {
  const questions = questionsData.filter(item => item.letter?.trim() === letter);

  if (questions.length === 0) {
    updateUI("❌ لا يوجد أسئلة لهذا الحرف!", "**********", "لا يوجد تصنيف", null);
    return;
  }

  // اختيار سؤال عشوائي
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  const questionText = randomQuestion.question || "🚨 خطأ: لا يوجد سؤال!";
  const answerText = randomQuestion.answer || "🚨 خطأ: لا يوجد إجابة!";
  const categoryText = randomQuestion.category || "لا يوجد تصنيف";

  currentQuestionData = randomQuestion;
  updateUI(questionText, answerText, categoryText, randomQuestion);
}

// تحديث واجهة المستخدم
function updateUI(question, answer, category, questionData) {
  const questionSection = document.getElementById('question-section');
  const questionContent = document.getElementById('question-content');
  const answerContent = document.getElementById('answer-content');
  const categoryBadge = document.getElementById('category-badge');
  
  // إظهار قسم السؤال
  if (questionSection) {
    questionSection.classList.remove('hidden');
    questionSection.style.opacity = '0';
    questionSection.style.transform = 'translateY(30px)';
    setTimeout(() => {
      questionSection.style.transition = 'all 0.5s ease';
      questionSection.style.opacity = '1';
      questionSection.style.transform = 'translateY(0)';
    }, 10);
  }
  
  // تحديث السؤال
  if (questionContent) {
    const questionElement = document.getElementById('question');
    if (questionElement) {
      questionElement.textContent = question;
    }
    questionContent.classList.remove('hidden');
  }

  // تحديث الإجابة
  const answerElement = document.getElementById('answer');
  if (answerElement) {
    answerElement.textContent = answer;
    answerElement.dataset.realAnswer = answer;
  }

  // تحديث التصنيف
  const categoryElement = document.getElementById('category');
  if (categoryElement) {
    categoryElement.textContent = category;
  }

  // إظهار التصنيف
  if (categoryBadge && category && category !== "لا يوجد تصنيف") {
    categoryBadge.classList.remove('hidden');
    categoryBadge.style.opacity = '0';
    categoryBadge.style.transform = 'scale(0.8)';
    setTimeout(() => {
      categoryBadge.style.transition = 'all 0.3s ease';
      categoryBadge.style.opacity = '1';
      categoryBadge.style.transform = 'scale(1)';
    }, 10);
  } else if (categoryBadge) {
    categoryBadge.classList.add('hidden');
  }

  // إعادة تعيين حالة الإجابة
  showAnswers = false;
  applyVisibility();

  // إظهار الأزرار
  const toggleBtn = document.getElementById('toggle-answer');
  const newQuestionBtn = document.getElementById('new-question-btn');
  
  if (toggleBtn) {
    toggleBtn.classList.remove('hidden');
  }
  
  if (newQuestionBtn && currentSelectedLetter) {
    newQuestionBtn.classList.remove('hidden');
  }
}

// تبديل إظهار/إخفاء الإجابة
function toggleAnswerVisibility() {
  showAnswers = !showAnswers;
  applyVisibility();
  updateToggleButton();
  
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// تطبيق حالة الإظهار
function applyVisibility() {
  const answerContent = document.getElementById('answer-content');
  const categoryBadge = document.getElementById('category-badge');
  
  if (answerContent) {
    if (showAnswers) {
      answerContent.classList.remove('hidden');
      answerContent.style.opacity = '0';
      answerContent.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        answerContent.style.transition = 'all 0.4s ease';
        answerContent.style.opacity = '1';
        answerContent.style.transform = 'translateX(0)';
      }, 10);
    } else {
      answerContent.style.opacity = '0';
      answerContent.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        answerContent.classList.add('hidden');
      }, 400);
    }
  }
}

// تحديث زر التبديل
function updateToggleButton() {
  const toggleIcon = document.getElementById('toggle-icon');
  const toggleText = document.getElementById('toggle-text');
  
  if (toggleIcon) {
    // Update SVG path for eye/eye-off
    if (showAnswers) {
      // Eye-off icon
      toggleIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12A18.45 18.45 0 0 1 5.06 5.06M9.9 4.24A9.12 9.12 0 0 1 12 4C17 4 21.27 7.61 23 12A18.5 18.5 0 0 1 19.74 16.74M1 1L23 23M9.9 4.24L14.76 9.1M17.94 17.94L14.76 14.76" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    } else {
      // Eye icon
      toggleIcon.innerHTML = `
        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      `;
    }
  }
  
  if (toggleText) {
    toggleText.textContent = showAnswers ? 'إخفاء الإجابة' : 'إظهار الإجابة';
  }
}

// الحصول على سؤال جديد
function getNewQuestion() {
  if (currentSelectedLetter) {
    // Animation feedback
    const newQuestionBtn = document.getElementById('new-question-btn');
    if (newQuestionBtn) {
      newQuestionBtn.style.transform = 'rotate(180deg)';
      setTimeout(() => {
        newQuestionBtn.style.transform = 'rotate(0deg)';
      }, 300);
    }
    
    showQuestion(currentSelectedLetter);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }
}

// عرض رسالة خطأ
function showError(message) {
  const questionSection = document.getElementById('question-section');
  if (questionSection) {
    questionSection.classList.remove('hidden');
    const questionElement = document.getElementById('question');
    if (questionElement) {
      questionElement.textContent = message;
    }
  }
}

// تهيئة الأحداث
function init() {
  // حدث زر التبديل
  const toggleBtn = document.getElementById('toggle-answer');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleAnswerVisibility);
  }

  // حدث زر السؤال الجديد
  const newQuestionBtn = document.getElementById('new-question-btn');
  if (newQuestionBtn) {
    newQuestionBtn.addEventListener('click', getNewQuestion);
  }

  // حدث زر إغلاق التحديد
  const closeSelection = document.getElementById('close-selection');
  if (closeSelection) {
    closeSelection.addEventListener('click', () => {
      hideSelectedLetterDisplay();
      const questionSection = document.getElementById('question-section');
      if (questionSection) {
        questionSection.classList.add('hidden');
      }
      const welcomeSection = document.getElementById('welcome-section');
      if (welcomeSection) {
        welcomeSection.classList.remove('hidden');
        welcomeSection.style.opacity = '1';
        welcomeSection.style.transform = 'translateY(0)';
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape to close selection
    if (e.key === 'Escape' && currentSelectedLetter) {
      hideSelectedLetterDisplay();
    }
    // Space to toggle answer
    if (e.key === ' ' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      if (currentSelectedLetter) {
        toggleAnswerVisibility();
      }
    }
  });

  // جلب البيانات
  getData();
}

// بدء التطبيق
init();
