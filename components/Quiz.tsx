
import React, { useState, useMemo } from 'react';
import { ElementData, QuizQuestion } from '../types';

interface QuizProps {
  elements: ElementData[];
}

const generateQuestions = (elements: ElementData[]): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];
    const shuffledElements = [...elements].sort(() => Math.random() - 0.5).slice(0, 10);

    shuffledElements.forEach(el => {
        const questionTypes = [
            { type: 'symbol', q: `ما هو العنصر الذي يرمز له بـ ${el.symbol}؟` },
            { type: 'atomicNumber', q: `ما هو العنصر الذي عدده الذري ${el.atomicNumber}؟` },
            { type: 'groupBlock', q: `أي عنصر ينتمي إلى مجموعة "${el.groupBlock.replace(/-/g, ' ')}"؟` }
        ];
        const randomQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        const wrongAnswers = elements
            .filter(e => e.atomicNumber !== el.atomicNumber)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(e => e.nameAr);
        
        questions.push({
            question: randomQuestion.q,
            options: [...wrongAnswers, el.nameAr].sort(() => Math.random() - 0.5),
            correctAnswer: el.nameAr,
            elementSymbol: el.symbol
        });
    });
    return questions;
};

const Quiz: React.FC<QuizProps> = ({ elements }) => {
  const questions = useMemo(() => generateQuestions(elements), [elements]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: string) => {
    setUserAnswers([...userAnswers, answer]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const score = userAnswers.reduce((acc, answer, index) => {
    return answer === questions[index].correctAnswer ? acc + 1 : acc;
  }, 0);
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
  }

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4">نتائج الاختبار</h1>
        <p className="text-2xl mb-6">لقد حصلت على {score} من {questions.length}</p>
        <div className="space-y-4 text-right">
          {questions.map((q, i) => (
            <div key={i} className={`p-3 rounded-md ${userAnswers[i] === q.correctAnswer ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <p className="font-bold">{i+1}. {q.question}</p>
              <p>إجابتك: <span className={userAnswers[i] === q.correctAnswer ? 'text-green-400' : 'text-red-400'}>{userAnswers[i]}</span></p>
              {userAnswers[i] !== q.correctAnswer && <p>الإجابة الصحيحة: <span className="text-green-400">{q.correctAnswer}</span></p>}
            </div>
          ))}
        </div>
        <button onClick={resetQuiz} className="mt-8 px-6 py-3 bg-cyan-500 rounded-md text-lg text-white hover:bg-cyan-600 transition-colors">
            إعادة الاختبار
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-cyan-400 mb-2">اختبار العناصر</h1>
      <p className="text-gray-400 mb-6">السؤال {currentQuestionIndex + 1} من {questions.length}</p>

      <div className="p-6 bg-gray-900 rounded-md">
        <p className="text-xl text-center font-semibold mb-6">{currentQuestion.question}</p>
        <div className="flex flex-col space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full p-4 bg-gray-700 rounded-md text-lg text-white hover:bg-cyan-600 transition-colors duration-200"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
