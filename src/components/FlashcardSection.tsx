import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HStack, 
  Button, 
  Text, 
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Box,
  Badge,
  SimpleGrid
} from '@chakra-ui/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  RotateCcw,
  FolderOpen,
  ChevronDown
} from 'lucide-react';
import { useFlashcard } from '../contexts/FlashcardContext';
import { Flashcard } from './Flashcard';

interface FlashcardSet {
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

export function FlashcardSection() {
  const { state, dispatch } = useFlashcard();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [availableSets, setAvailableSets] = React.useState<FlashcardSet[]>([]);

  const handlePrevious = () => {
    if (state.currentCardIndex > 0) {
      dispatch({ type: 'SET_CURRENT_CARD', payload: state.currentCardIndex - 1 });
    }
  };

  const handleNext = () => {
    if (state.currentCardIndex < state.flashcards.length - 1) {
      dispatch({ type: 'SET_CURRENT_CARD', payload: state.currentCardIndex + 1 });
    }
  };

  const handleShuffle = () => {
    dispatch({ type: 'SHUFFLE_CARDS' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const loadAvailableSets = async () => {
    try {
      const metadataResponse = await fetch('./flashcard-data/sets-metadata.json');
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        const availableSets: FlashcardSet[] = [];
        
        for (const set of metadata.flashcard_sets) {
          try {
            const response = await fetch(`./flashcard-data/${set.filename}`);
            if (response.ok) {
              availableSets.push(set);
            }
          } catch (error) {
            // File not found
          }
        }
        
        setAvailableSets(availableSets);
      }
    } catch (error) {
      // Could not load available sets
    }
  };

  const handleSetSelect = async (filename: string) => {
    try {
              const response = await fetch(`./flashcard-data/${filename}`);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'SET_FLASHCARDS', payload: data.flashcards });
        dispatch({ type: 'SET_METADATA', payload: data.metadata || {} });
        onClose();
      }
    } catch (error) {
      console.error('Error loading set:', error);
    }
  };

  if (state.flashcards.length === 0) {
    return null;
  }

  const currentCard = state.flashcards[state.currentCardIndex];
  const isFirstCard = state.currentCardIndex === 0;
  const isLastCard = state.currentCardIndex === state.flashcards.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress and Controls */}
        <HStack justify="space-between" mb={6}>
          <HStack spacing={4}>
            <motion.div
              whileHover={!isFirstCard ? { scale: 1.05 } : {}}
              whileTap={!isFirstCard ? { scale: 0.95 } : {}}
            >
              <Button
                colorScheme="gray"
                size="md"
                onClick={handlePrevious}
                disabled={isFirstCard}
                leftIcon={<Icon as={ChevronLeft} />}
                opacity={isFirstCard ? 0.5 : 1}
                cursor={isFirstCard ? 'not-allowed' : 'pointer'}
              >
                Previous
              </Button>
            </motion.div>
            
            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
              {state.currentCardIndex + 1} of {state.flashcards.length}
            </Text>
            
            <motion.div
              whileHover={!isLastCard ? { scale: 1.05 } : {}}
              whileTap={!isLastCard ? { scale: 0.95 } : {}}
            >
              <Button
                colorScheme="gray"
                size="md"
                onClick={handleNext}
                disabled={isLastCard}
                rightIcon={<Icon as={ChevronRight} />}
                opacity={isLastCard ? 0.5 : 1}
                cursor={isLastCard ? 'not-allowed' : 'pointer'}
              >
                Next
              </Button>
            </motion.div>
          </HStack>
          
          <HStack spacing={2}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                colorScheme="purple"
                size="md"
                onClick={handleShuffle}
                leftIcon={<Icon as={Shuffle} />}
              >
                Shuffle
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                colorScheme="green"
                size="md"
                onClick={handleReset}
                leftIcon={<Icon as={RotateCcw} />}
              >
                Reset
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                colorScheme="blue"
                size="md"
                onClick={() => {
                  loadAvailableSets();
                  onOpen();
                }}
                rightIcon={<Icon as={ChevronDown} />}
                leftIcon={<Icon as={FolderOpen} />}
              >
                Change Set
              </Button>
            </motion.div>
          </HStack>
        </HStack>

        {/* Flashcard Display */}
        <Flashcard card={currentCard} />

        {/* Change Set Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>📁 Change Flashcard Set</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Text color="gray.600">
                  Choose a different flashcard set to study
                </Text>
                
                <SimpleGrid columns={1} spacing={3} w="100%">
                  {availableSets.map((set) => (
                    <Box
                      key={set.id}
                      p={4}
                      borderWidth="1px"
                      borderColor="gray.200"
                      rounded="lg"
                      cursor="pointer"
                      _hover={{ 
                        borderColor: "blue.300",
                        bg: "blue.50"
                      }}
                      onClick={() => handleSetSelect(set.filename)}
                      transition="all 0.2s"
                    >
                      <VStack align="start" spacing={2}>
                        <HStack justify="space-between" w="100%">
                          <HStack spacing={3}>
                            <Icon as={FolderOpen} color="blue.500" />
                            <Text fontWeight="bold" fontSize="md">
                              {set.title}
                            </Text>
                          </HStack>
                        </HStack>
                        
                        <Text fontSize="sm" color="gray.600">
                          {set.description}
                        </Text>
                        
                        <HStack spacing={2}>
                          <Badge colorScheme="green" variant="outline">
                            {set.card_count} cards
                          </Badge>
                          <Badge colorScheme="purple" variant="outline">
                            {set.category}
                          </Badge>
                          <Badge colorScheme="orange" variant="outline">
                            {set.difficulty}
                          </Badge>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </motion.div>
    </AnimatePresence>
  );
}

