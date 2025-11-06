
import { useState, useRef, useCallback, useEffect } from 'react';
import { decode, decodeAudioData } from '../utils/audioUtils';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioDataRef = useRef<string | null>(null);

  useEffect(() => {
    // Initialize AudioContext on mount, suspended until user interaction
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return () => {
      audioContextRef.current?.close();
    };
  }, []);
  
  const setAudioData = useCallback(async (base64: string) => {
      audioDataRef.current = base64;
      setIsLoading(true);
      setError(null);
      if (!audioContextRef.current) {
        setError("Audio context not initialized.");
        setIsLoading(false);
        return;
      }
      try {
        const decodedBytes = decode(base64);
        const buffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
        audioBufferRef.current = buffer;
      } catch (err) {
        console.error("Failed to decode audio data", err);
        setError("لا يمكن فك تشفير الصوت.");
        audioBufferRef.current = null;
      } finally {
        setIsLoading(false);
      }
  }, []);

  const play = useCallback(() => {
    if (!audioBufferRef.current || isPlaying) return;
    
    const context = audioContextRef.current;
    if (!context) return;
    
    // Resume context if it's suspended (required by modern browsers)
    if (context.state === 'suspended') {
        context.resume();
    }
    
    const source = context.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(context.destination);
    source.onended = () => {
      setIsPlaying(false);
      sourceRef.current = null;
    };
    source.start();
    sourceRef.current = source;
    setIsPlaying(true);
  }, [isPlaying]);

  const pause = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      // onended will set isPlaying to false
    }
  }, []);

  const stop = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
      setIsPlaying(false);
    }
    audioBufferRef.current = null;
    audioDataRef.current = null;
  }, []);

  return { isPlaying, isLoading, error, play, pause, stop, setAudioData };
};
