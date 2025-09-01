import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack,
  HStack,
  Button,
  Icon,
  Badge,
  useBreakpointValue
} from '@chakra-ui/react';
import { HelpCircle } from 'lucide-react';
import { FlashcardProvider, useFlashcard } from './contexts/FlashcardContext';
import { UploadSection } from './components/UploadSection';
import { FlashcardSection } from './components/FlashcardSection';
import { Instructions } from './components/Instructions';

function AppContent() {
  const { state } = useFlashcard();
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Responsive values
  const containerMaxW = useBreakpointValue({ base: "100%", md: "4xl" });
  const containerPx = useBreakpointValue({ base: 2, md: 4 });
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const textSize = useBreakpointValue({ base: "md", lg: "lg" });
  const py = useBreakpointValue({ base: 4, md: 8 });

  return (
    <Box 
      minH="100vh" 
      bgGradient="linear(to-br, blue.50, indigo.100)"
      py={py}
    >
      <Container maxW={containerMaxW} px={containerPx}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={4} mb={8} textAlign="center">
            <HStack spacing={4} align="center" flexWrap="wrap" justify="center">
              <Heading 
                size={headingSize} 
                color="gray.800"
                fontWeight="bold"
                textAlign="center"
              >
                🎓 Cait's Flashcard App
              </Heading>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstructions(!showInstructions)}
                leftIcon={<Icon as={HelpCircle} />}
                colorScheme="blue"
                _hover={{ bg: 'blue.50' }}
              >
                Help
              </Button>
            </HStack>
            <Text 
              fontSize={textSize} 
              color="gray.600"
              textAlign="center"
            >
              {state.flashcards.length > 0 
                ? `Studying ${state.flashcards.length} flashcards`
                : "Your smart study companion"
              }
            </Text>
            
            {/* Set Description */}
            {state.currentSet && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Box 
                  bg="white" 
                  rounded="lg" 
                  shadow="sm" 
                  p={3} 
                  maxW="xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  mx="auto"
                >
                  <HStack spacing={3} justify="center" flexWrap="wrap">
                    <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                      {state.currentSet.title}
                    </Text>
                    <Badge colorScheme="blue" variant="subtle">
                      {state.currentSet.category}
                    </Badge>
                    <Badge colorScheme="orange" variant="subtle">
                      {state.currentSet.difficulty}
                    </Badge>
                  </HStack>
                </Box>
              </motion.div>
            )}
          </VStack>
        </motion.div>

        {/* Main Content */}
        <UploadSection />
        <FlashcardSection />
        
        {/* Instructions - Only show when help is clicked */}
        {showInstructions && <Instructions />}
      </Container>
    </Box>
  );
}

function App() {
  return (
    <FlashcardProvider>
      <AppContent />
    </FlashcardProvider>
  );
}

export default App;
