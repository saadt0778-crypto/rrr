import React, { useEffect, useCallback, useState, useRef } from 'react';
import { ElementData } from '../types';
import BohrModel from './BohrModel';
import { CloseIcon, PlayIcon, PauseIcon, LoadingIcon, LightbulbIcon } from './icons';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { generateSpeech } from '../services/geminiService';

interface ElementDetailModalProps {
  element: ElementData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ElementDetailModal: React.FC<ElementDetailModalProps> = ({ element, isOpen, onClose }) => {
  const descriptionPlayer = useAudioPlayer();
  const configPlayer = useAudioPlayer();
  const configAudioFetched = useRef(false);

  const fetchDescriptionAudio = useCallback(async () => {
    if (!element) return;
    descriptionPlayer.stop(); // Stop any previous audio
    try {
      // New prompt for a more engaging and natural explanation
      const prompt = `أهلاً بك في عالم الكيمياء. سأقدم لك الآن شرحاً صوتياً شيقاً عن عنصر ${element.nameAr}. ${element.descriptionAr}`;
      const audioData = await generateSpeech(prompt);
      descriptionPlayer.setAudioData(audioData);
    } catch (err) {
      console.error("Failed to generate speech for description:", err);
    }
  }, [element, descriptionPlayer]);

  useEffect(() => {
    if (isOpen && element) {
      // Reset config fetched state when element changes
      configAudioFetched.current = false;
      configPlayer.stop();
      
      fetchDescriptionAudio();
    }

    return () => {
      descriptionPlayer.stop();
      configPlayer.stop();
    };
  }, [isOpen, element, fetchDescriptionAudio, configPlayer, descriptionPlayer]);
  
  const handleDescriptionPlay = () => {
    configPlayer.stop();
    descriptionPlayer.isPlaying ? descriptionPlayer.pause() : descriptionPlayer.play();
  };
  
  const handleConfigPlay = async () => {
      descriptionPlayer.stop();

      if (configPlayer.isPlaying) {
          configPlayer.pause();
          return;
      }

      if (configAudioFetched.current) {
          configPlayer.play();
      } else {
          if (!element) return;
          try {
              // New prompt for a clearer, more educational tone
              const prompt = `والآن، لنستمع إلى شرح مبسط للتوزيع الإلكتروني لعنصر ${element.nameAr}، وهو ${element.electronConfiguration}.`;
              const audioData = await generateSpeech(prompt);
              await configPlayer.setAudioData(audioData);
              configPlayer.play();
              configAudioFetched.current = true;
          } catch (err) {
              console.error("Failed to generate speech for config:", err);
          }
      }
  };

  if (!isOpen || !element) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      dir="rtl"
    >
      <div
        className={`relative w-11/12 max-w-4xl p-6 md:p-8 bg-gray-800 rounded-2xl shadow-2xl text-white transform transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors z-10">
          <CloseIcon />
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side: Bohr Model and basic info */}
          <div className="flex flex-col items-center justify-center md:w-1/3">
            <BohrModel electronsPerShell={element.electrons} />
            <h1 className="text-4xl font-bold mt-4">{element.symbol}</h1>
            <h2 className="text-2xl text-cyan-400">{element.nameAr}</h2>
            <p className="text-gray-400">العدد الذري: {element.atomicNumber}</p>
          </div>

          {/* Right side: Detailed info */}
          <div className="md:w-2/3 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-cyan-400/30 pb-2 mb-2">
                الوصف
              </h3>
              <div className="flex items-start gap-4">
                <p className="text-gray-300 leading-relaxed">{element.descriptionAr}</p>
                <button
                  onClick={handleDescriptionPlay}
                  disabled={descriptionPlayer.isLoading}
                  aria-label="تشغيل وصف العنصر"
                  className="flex-shrink-0 mt-1 p-2 bg-gray-700 rounded-full hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {descriptionPlayer.isLoading ? <LoadingIcon /> : descriptionPlayer.isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
              </div>
              {descriptionPlayer.error && <p className="text-red-400 mt-2 text-sm">{descriptionPlayer.error}</p>}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-cyan-400/30 pb-2 mb-2">
                الخصائص
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-300">
                <li><strong>الكتلة الذرية:</strong> {element.atomicMass.toFixed(3)}</li>
                <li className='text-left' dir="ltr">
                  <div className="flex items-center justify-between gap-2">
                    <span><strong>Config:</strong> {element.electronConfiguration}</span>
                    <button
                      onClick={handleConfigPlay}
                      disabled={configPlayer.isLoading}
                      aria-label="تشغيل شرح التوزيع الإلكتروني"
                      className="flex-shrink-0 p-1.5 bg-gray-700 rounded-full hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {configPlayer.isLoading ? <LoadingIcon className="h-5 w-5"/> : configPlayer.isPlaying ? <PauseIcon className="h-5 w-5"/> : <PlayIcon className="h-5 w-5"/>}
                    </button>
                  </div>
                </li>
                <li><strong>مجموعة العنصر:</strong> {element.groupBlockAr}</li>
                <li><strong>الدورة:</strong> {element.row}</li>
                <li><strong>المجموعة:</strong> {element.col}</li>
                <li><strong>إلكترونات التكافؤ:</strong> {element.valence}</li>
              </ul>
            </div>
            
            {element.funFactAr && (
              <div>
                <h3 className="flex items-center gap-2 text-xl font-semibold text-cyan-400 border-b-2 border-cyan-400/30 pb-2 mb-2">
                  <LightbulbIcon />
                  هل تعلم؟
                </h3>
                <p className="text-gray-300 bg-gray-900/50 p-3 rounded-lg italic">
                  {element.funFactAr}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementDetailModal;