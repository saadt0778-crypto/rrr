import React from 'react';

type View = 'table' | 'game' | 'quiz';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItems = [
    { key: 'table' as View, label: 'الجدول الدوري' },
    { key: 'game' as View, label: 'لعبة' },
    { key: 'quiz' as View, label: 'اختبار' },
  ];

  return (
    <header className="bg-gray-800 shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-cyan-400">
          الجدول الدوري التفاعلي
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`px-3 py-2 text-sm md:text-base rounded-md font-semibold transition-colors duration-300 ${
                currentView === item.key
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
