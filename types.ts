export interface ElementData {
  atomicNumber: number;
  symbol: string;
  nameAr: string;
  atomicMass: number;
  electronConfiguration: string;
  generalConfiguration: string;
  orbitalType: 's' | 'p' | 'd';
  electrons: number[];
  groupBlock: 'alkali-metal' | 'alkaline-earth-metal' | 'lanthanide' | 'actinide' | 'transition-metal' | 'post-transition-metal' | 'metalloid' | 'nonmetal' | 'halogen' | 'noble-gas' | 'diatomic-nonmetal' | 'polyatomic-nonmetal';
  groupBlockAr: string;
  valence: number;
  row: number;
  col: number;
  descriptionAr: string;
  funFactAr: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  elementSymbol: string;
}