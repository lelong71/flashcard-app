import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { HelpCircle, CheckCircle } from 'lucide-react';
import { useFlashcard } from '../contexts/FlashcardContext';
import { Flashcard as FlashcardType } from '../contexts/FlashcardContext';

interface FlashcardProps {
  card: FlashcardType;
}

export function Flashcard({ card }: FlashcardProps) {
  const { state, dispatch } = useFlashcard();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleToggleAnswer = () => {
    dispatch({ type: 'TOGGLE_ANSWER' });
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.3 }}
      style={{ width: '100%' }}
    >
      <Box
        bg={bgColor}
        rounded="lg"
        shadow="lg"
        p={8}
        minH="96"
        position="relative"
        borderWidth="1px"
        borderColor={borderColor}
        className={`flashcard ${state.isAnswerVisible ? 'flipped' : ''}`}
        style={{ perspective: '1000px' }}
      >
        <div className="flashcard-inner" style={{ 
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: state.isAnswerVisible ? 'rotateY(180deg)' : 'rotateY(0deg)',
          width: '100%',
          height: '100%',
          position: 'relative'
        }}>
          {/* Front of card (Question) */}
          <div className="flashcard-front" style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2rem'
          }}>
            {/* Top section with icon and title */}
            <div style={{ textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <Icon as={HelpCircle} w={12} h={12} color="blue.500" />
              </motion.div>
              
              <Heading size="lg" color="gray.800" mt={4}>
                Question
              </Heading>
            </div>
            
            {/* Middle section with question text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                padding: '1rem 0'
              }}
            >
              <Text fontSize="lg" color="gray.700" lineHeight="relaxed">
                {card.question}
              </Text>
            </motion.div>
            
            {/* Bottom section with button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                colorScheme="brand"
                size="lg"
                onClick={handleToggleAnswer}
              >
                Show Answer
              </Button>
            </motion.div>
          </div>

          {/* Back of card (Answer) */}
          <div className="flashcard-back" style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2rem'
          }}>
            {/* Top section with icon and title */}
            <div style={{ textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <Icon as={CheckCircle} w={12} h={12} color="green.500" />
              </motion.div>
              
              <Heading size="lg" color="gray.800" mt={4}>
                Answer
              </Heading>
            </div>
            
            {/* Middle section with answer text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                padding: '1rem 0'
              }}
            >
              <Text fontSize="lg" color="gray.700" lineHeight="relaxed">
                {card.answer}
              </Text>
            </motion.div>
            
            {/* Bottom section with button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                colorScheme="green"
                size="lg"
                onClick={handleToggleAnswer}
              >
                Show Question
              </Button>
            </motion.div>
          </div>
        </div>
      </Box>
    </motion.div>
  );
}
