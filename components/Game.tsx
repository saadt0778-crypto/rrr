
import React, { useState, useEffect, useCallback } from 'react';
import { ElementData } from '../types';

interface GameProps {
  elements: ElementData[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

type GameState = 'settings' | 'playing';

const Game: React.FC<GameProps> = ({ elements }) => {
  const [gameState, setGameState] = useState<GameState>('settings');
  const [numberOfOptions, setNumberOfOptions] = useState(4);
  const [currentElement, setCurrentElement] = useState<ElementData | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; correct: boolean } | null>(null);

  const getNextQuestion = useCallback(() => {
    setFeedback(null);
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    setCurrentElement(randomElement);

    const wrongOptions = elements
      .filter(el => el.atomicNumber !== randomElement.atomicNumber)
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfOptions - 1)
      .map(el => el.nameAr);
      
    setOptions(shuffleArray([...wrongOptions, randomElement.nameAr]));
    setQuestionCount(prev => prev + 1);
  }, [elements, numberOfOptions]);

  useEffect(() => {
    if (gameState === 'playing' && questionCount === 0) {
      getNextQuestion();
    }
  }, [gameState, getNextQuestion, questionCount]);

  const handleAnswer = (answer: string) => {
    if (!currentElement) return;

    if (answer === currentElement.nameAr) {
      setScore(prev => prev + 1);
      setFeedback({ message: 'إجابة صحيحة!', correct: true });
    } else {
      setFeedback({ message: `خطأ! الإجابة الصحيحة هي ${currentElement.nameAr}`, correct: false });
    }

    setTimeout(() => {
      getNextQuestion();
    }, 1500);
  };

  const startGame = (optionsCount: number) => {
    setNumberOfOptions(optionsCount);
    setScore(0);
    setQuestionCount(0);
    setCurrentElement(null);
    setFeedback(null);
    setGameState('playing');
  };

  const goBackToSettings = () => {
    setGameState('settings');
  };
  
  if (gameState === 'settings') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">اختر مستوى الصعوبة</h1>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => startGame(2)}
            className="w-full p-4 bg-gray-700 rounded-md text-xl text-white hover:bg-cyan-600 transition-colors duration-200"
          >
            سهل (خياران)
          </button>
          <button
            onClick={() => startGame(4)}
            className="w-full p-4 bg-gray-700 rounded-md text-xl text-white hover:bg-cyan-600 transition-colors duration-200"
          >
            متوسط (4 خيارات)
          </button>
          <button
            onClick={() => startGame(6)}
            className="w-full p-4 bg-gray-700 rounded-md text-xl text-white hover:bg-cyan-600 transition-colors duration-200"
          >
            صعب (6 خيارات)
          </button>
        </div>
      </div>
    );
  }


  if (!currentElement) {
    return <div className="text-center text-xl">جار التحميل...</div>;
  }
  
  const questionType = Math.floor(Math.random() * 3);
  let questionText = '';
  switch(questionType) {
    case 0:
      questionText = `أي عنصر له الرمز ${currentElement.symbol}؟`;
      break;
    case 1:
      questionText = `أي عنصر عدده الذري ${currentElement.atomicNumber}؟`;
      break;
    case 2:
      questionText = `أي عنصر توزيعه الإلكتروني ${currentElement.electronConfiguration}؟`;
      break;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-cyan-400">لعبة العناصر</h1>
        <div className="flex items-center gap-4">
            <div className="text-lg font-bold">النتيجة: {score} / {questionCount > 0 ? questionCount - 1 : 0}</div>
             <button onClick={goBackToSettings} className="px-3 py-1 bg-gray-700 rounded-md text-sm text-white hover:bg-gray-600 transition-colors">
                العودة
            </button>
        </div>
      </div>

      <div className="p-6 bg-gray-900 rounded-md">
        <p className="text-xl text-center font-semibold mb-6">{questionText}</p>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={!!feedback}
              className="p-4 bg-gray-700 rounded-md text-lg text-white hover:bg-cyan-600 transition-colors duration-200 disabled:opacity-50"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      {feedback && (
        <div className={`mt-6 p-4 rounded-md text-center text-lg font-bold ${feedback.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default Game;
