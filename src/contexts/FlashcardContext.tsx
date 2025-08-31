import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Flashcard {
  question: string;
  answer: string;
  all_options?: Record<string, string>;
  question_number: number;
  format: 'multiple_choice' | 'true_false';
}

export interface FlashcardSet {
  id: string;
  filename: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  card_count: number;
  created_date: string;
  tags: string[];
}

export interface Metadata {
  source_pdf?: string;
  total_pages?: number;
  format_type?: string;
  questions_extracted?: number;
  answer_key_entries?: number;
  valid_flashcards?: number;
  conversion_timestamp?: string;
}

interface FlashcardState {
  flashcards: Flashcard[];
  currentCardIndex: number;
  isAnswerVisible: boolean;
  originalOrder: Flashcard[];
  metadata: Metadata | null;
  currentSet: FlashcardSet | null;
  isLoading: boolean;
  error: string | null;
}

type FlashcardAction =
  | { type: 'SET_FLASHCARDS'; payload: Flashcard[] }
  | { type: 'SET_METADATA'; payload: Metadata }
  | { type: 'SET_CURRENT_SET'; payload: FlashcardSet }
  | { type: 'SET_CURRENT_CARD'; payload: number }
  | { type: 'TOGGLE_ANSWER' }
  | { type: 'SHUFFLE_CARDS' }
  | { type: 'RESET' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: FlashcardState = {
  flashcards: [],
  currentCardIndex: 0,
  isAnswerVisible: false,
  originalOrder: [],
  metadata: null,
  currentSet: null,
  isLoading: false,
  error: null,
};

function flashcardReducer(state: FlashcardState, action: FlashcardAction): FlashcardState {
  switch (action.type) {
    case 'SET_FLASHCARDS':
      return {
        ...state,
        flashcards: action.payload,
        originalOrder: [...action.payload],
        currentCardIndex: 0,
        isAnswerVisible: false,
        error: null,
      };
    
    case 'SET_METADATA':
      return {
        ...state,
        metadata: action.payload,
      };
    
    case 'SET_CURRENT_SET':
      return {
        ...state,
        currentSet: action.payload,
      };
    
    case 'SET_CURRENT_CARD':
      return {
        ...state,
        currentCardIndex: action.payload,
        isAnswerVisible: false,
      };
    
    case 'TOGGLE_ANSWER':
      return {
        ...state,
        isAnswerVisible: !state.isAnswerVisible,
      };
    
    case 'SHUFFLE_CARDS':
      const shuffled = [...state.flashcards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return {
        ...state,
        flashcards: shuffled,
        currentCardIndex: 0,
        isAnswerVisible: false,
      };
    
    case 'RESET':
      return {
        ...state,
        flashcards: [],
        currentCardIndex: 0,
        isAnswerVisible: false,
        originalOrder: [],
        metadata: null,
        error: null,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    default:
      return state;
  }
}

interface FlashcardContextType {
  state: FlashcardState;
  dispatch: React.Dispatch<FlashcardAction>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export function FlashcardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(flashcardReducer, initialState);

  return (
    <FlashcardContext.Provider value={{ state, dispatch }}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcard() {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcard must be used within a FlashcardProvider');
  }
  return context;
}
