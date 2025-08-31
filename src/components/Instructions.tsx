import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Icon,
  Code,
  useColorModeValue
} from '@chakra-ui/react';
import { HelpCircle } from 'lucide-react';

export function Instructions() {
  const bgColor = useColorModeValue('yellow.50', 'yellow.900');
  const borderColor = useColorModeValue('yellow.200', 'yellow.700');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      style={{ width: '100%' }}
    >
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        rounded="lg"
        p={6}
        mt={8}
      >
        <HStack spacing={3} mb={4}>
          <Icon as={HelpCircle} color="yellow.600" />
          <Heading size="md" color="yellow.800">
            📖 How to Use
          </Heading>
        </HStack>
        
        <VStack spacing={3} align="start">
          <Text fontSize="sm" color="yellow.700">
            <Text as="span" fontWeight="bold">
              🎯 Getting Started:
            </Text>
          </Text>
          
          <Text fontSize="sm" color="yellow.700">
            • The app automatically detects and loads available flashcard sets
          </Text>
          
          <Text fontSize="sm" color="yellow.700">
            • Click on any file in the "Available Flashcard Sets" section to load it
          </Text>
          
          <Text fontSize="sm" color="yellow.700">
            • Use the "Change Set" button to switch between different sets
          </Text>
          
          <Text fontSize="sm" color="yellow.700" mt={2}>
            <Text as="span" fontWeight="bold">
              📤 Adding New Content:
            </Text>
          </Text>
          
          <Text fontSize="sm" color="yellow.700">
            • Convert your PDF using the command-line tool:
          </Text>
          
          <Code
            bg={useColorModeValue('yellow.100', 'yellow.800')}
            color={useColorModeValue('yellow.800', 'yellow.100')}
            px={2}
            py={1}
            rounded="md"
            fontSize="sm"
            display="block"
            w="100%"
          >
            python utils/pdf_converter.py your_file.pdf
          </Code>
          
          <Text fontSize="sm" color="yellow.700">
            • Upload the generated JSON file using the upload section
          </Text>
          
          <Text fontSize="sm" color="yellow.700">
            • The new set will appear in your available files list
          </Text>
          
          <Text fontSize="sm" color="yellow.700" mt={2}>
            <Text as="span" fontWeight="bold">
              📁 Manual Setup (Already have JSON files):
            </Text>
          </Text>
          
          <Text fontSize="sm" color="yellow.700">
            • Copy your JSON files directly to the flashcard-data folder:
          </Text>
          
          <Code
            bg={useColorModeValue('yellow.100', 'yellow.800')}
            color={useColorModeValue('yellow.800', 'yellow.100')}
            px={2}
            py={1}
            rounded="md"
            fontSize="sm"
            display="block"
            w="100%"
          >
            cp your_flashcards.json public/flashcard-data/
          </Code>
          
          <Text fontSize="sm" color="yellow.700">
            • Add set information to the metadata file:
          </Text>
          
          <Code
            bg={useColorModeValue('yellow.100', 'yellow.800')}
            color={useColorModeValue('yellow.800', 'yellow.100')}
            px={2}
            py={1}
            rounded="md"
            fontSize="sm"
            display="block"
            w="100%"
          >
            python utils/add_flashcard_set.py your_flashcards.json "Set Title" "Description" "Category" "Difficulty"
          </Code>
          
          <Text fontSize="sm" color="yellow.700">
            • Refresh the app to see your new flashcard set
          </Text>
          
          <Text fontSize="sm" color="yellow.700" mt={2}>
            <Text as="span" fontWeight="bold">
              📋 JSON Format Required:
            </Text>
          </Text>
          
          <Text fontSize="sm" color="yellow.700">
            Your JSON file must have this structure:
          </Text>
          
          <Code
            bg={useColorModeValue('yellow.100', 'yellow.800')}
            color={useColorModeValue('yellow.800', 'yellow.100')}
            px={2}
            py={1}
            rounded="md"
            fontSize="sm"
            display="block"
            w="100%"
          >
            {`{
  "flashcards": [
    {
      "question": "Your question here?",
      "answer": "Your answer here",
      "question_number": 1,
      "format": "multiple_choice"
    }
  ]
}`}
          </Code>
        </VStack>
      </Box>
    </motion.div>
  );
}
