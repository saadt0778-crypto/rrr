import React, { useState } from 'react';
import Header from './components/Header';
import PeriodicTable from './components/PeriodicTable';
import Game from './components/Game';
import Quiz from './components/Quiz';
import { elementsData } from './data/elements';

const App: React.FC = () => {
  const [view, setView] = useState<'table' | 'game' | 'quiz'>('table');

  const renderView = () => {
    switch (view) {
      case 'game':
        return <Game elements={elementsData} />;
      case 'quiz':
        return <Quiz elements={elementsData} />;
      case 'table':
      default:
        return <PeriodicTable elements={elementsData} />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans" dir="rtl">
      <Header currentView={view} setView={setView} />
      <main className="p-4 md:p-8">
        {renderView()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>تم الإنشاء باستخدام واجهة برمجة تطبيقات Gemini</p>
      </footer>
    </div>
  );
};

export default App;
