import { useState, useEffect } from "react";

const API_URL = "https://api.sheetbest.com/sheets/1d7d8dab-3439-4dd5-8fc5-ad802611700f";

function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // جلب البيانات من Google Sheets
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 البيانات المسترجعة:", data);
        setQuestions(data);
      })
      .catch((error) => console.error("❌ Error fetching data:", error));
  }, []);

  // عند اختيار حرف معين
  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    getRandomQuestion(letter);
  };

  // اختيار سؤال عشوائي بناءً على الحرف
  const getRandomQuestion = (letter) => {
    const filteredQuestions = questions.filter((q) => q.LITER === letter);
    if (filteredQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      setCurrentQuestion(filteredQuestions[randomIndex]);
    } else {
      setCurrentQuestion(null);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>لعبة الحروف</h1>
      
      {/* أزرار الحروف */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
        {"أبجد هوز حطي كلمن سعفص قرشت ثخذ ضظغ".split(" ").map((letter) => (
          <button key={letter} onClick={() => handleLetterClick(letter)} style={{ padding: "10px", fontSize: "20px" }}>
            {letter}
          </button>
        ))}
      </div>

      {/* عرض السؤال */}
      {selectedLetter && (
        <div style={{ marginTop: "20px", padding: "20px", border: "1px solid black" }}>
          <h2>الحرف المختار: {selectedLetter}</h2>
          {currentQuestion ? (
            <>
              <p><strong>التصنيف:</strong> {currentQuestion.CATO}</p>
              <p><strong>السؤال:</strong> {currentQuestion.QWES}</p>
              <p><strong>الإجابة:</strong> {currentQuestion.ANSW}</p>
              <button onClick={() => getRandomQuestion(selectedLetter)} style={{ marginTop: "10px", padding: "10px" }}>
                سؤال جديد
              </button>
            </>
          ) : (
            <p>لا يوجد أسئلة لهذا الحرف.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
