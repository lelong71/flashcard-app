import React, { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Button, 
  Icon, 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription,
  useToast,
  Badge,
  Divider,
  useColorModeValue,
  SimpleGrid,
  useBreakpointValue
} from '@chakra-ui/react';
import { Upload, FileText, FolderOpen, RefreshCw } from 'lucide-react';
import { useFlashcard } from '../contexts/FlashcardContext';

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

export function UploadSection() {
  const { state, dispatch } = useFlashcard();
  const [isDragOver, setIsDragOver] = useState(false);
  const [availableSets, setAvailableSets] = useState<FlashcardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const toast = useToast();
  const selectedSetRef = useRef<string>('');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Responsive values
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" });
  const textSize = useBreakpointValue({ base: "md", lg: "lg" });

  const scanForFlashcardSets = useCallback(async () => {
    setIsScanning(true);
    try {
      // Load the metadata file to get organized flashcard sets
      const metadataResponse = await fetch('./flashcard-data/sets-metadata.json');
      if (!metadataResponse.ok) {
        throw new Error(`Could not load flashcard sets metadata: ${metadataResponse.status} ${metadataResponse.statusText}`);
      }
      
      // Check if the response is actually JSON
      const contentType = metadataResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await metadataResponse.text();
        if (text.includes('<!DOCTYPE')) {
          throw new Error('Received HTML instead of JSON. The flashcard-data files may not be accessible from the current server.');
        }
        throw new Error(`Expected JSON but received: ${contentType}`);
      }
      
      const metadata = await metadataResponse.json();
      const availableSets: FlashcardSet[] = [];
      
      // Check which files actually exist
      for (const set of metadata.flashcard_sets) {
        try {
          const response = await fetch(`./flashcard-data/${set.filename}`);
          if (response.ok) {
            // Verify it's actually JSON
            const fileContentType = response.headers.get('content-type');
            if (fileContentType && fileContentType.includes('application/json')) {
              availableSets.push(set);
            }
          }
        } catch (error) {
          // File not found or error checking file
        }
      }
      
      setAvailableSets(availableSets);
      
      // Auto-select the first set if available and no set is currently selected
      if (availableSets.length > 0 && !selectedSetRef.current) {
        setSelectedSet(availableSets[0].filename);
        selectedSetRef.current = availableSets[0].filename;
      }
    } catch (error) {
      setAvailableSets([]);
      
      // Show a more helpful error message
      toast({
        title: 'Flashcard Data Not Found',
        description: error instanceof Error ? error.message : 'Could not load flashcard data. Please ensure the flashcard-data folder is accessible.',
        status: 'warning',
        duration: 8000,
        isClosable: true,
      });
    } finally {
      setIsScanning(false);
    }
  }, [toast]);

  const loadSelectedSet = useCallback(async (filename: string) => {
    if (!filename) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Load the actual JSON file from the flashcard-data folder
      const response = await fetch(`./flashcard-data/${filename}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check if the response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (text.includes('<!DOCTYPE')) {
          throw new Error('Received HTML instead of JSON. The flashcard-data files may not be accessible from the current server.');
        }
        throw new Error(`Expected JSON but received: ${contentType}`);
      }
      
      const data = await response.json();

      if (!data.flashcards || !Array.isArray(data.flashcards)) {
        throw new Error('Invalid JSON format: missing flashcards array');
      }

      if (data.flashcards.length === 0) {
        throw new Error('No flashcards found in the JSON file');
      }

      dispatch({ type: 'SET_FLASHCARDS', payload: data.flashcards });
      dispatch({ type: 'SET_METADATA', payload: data.metadata || {} });
      
      // Find and set the current set information
      try {
        const metadataResponse = await fetch('./flashcard-data/sets-metadata.json');
        if (metadataResponse.ok) {
          const setsMetadata = await metadataResponse.json();
          const currentSet = setsMetadata.flashcard_sets.find((set: any) => set.filename === filename);
          if (currentSet) {
            dispatch({ type: 'SET_CURRENT_SET', payload: currentSet });
          }
        }
      } catch (error) {
        // Could not load set metadata
      }
      
      toast({
        title: 'Success!',
        description: `Loaded ${data.flashcards.length} flashcards from ${filename}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage = `Failed to load ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      toast({
        title: 'Error loading file',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, toast]);

  // Scan for flashcard sets on component mount
  useEffect(() => {
    scanForFlashcardSets();
  }, [scanForFlashcardSets]);

  // Load selected set when it changes
  useEffect(() => {
    if (selectedSet) {
      loadSelectedSet(selectedSet);
    }
  }, [selectedSet, loadSelectedSet]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.endsWith('.json')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a JSON file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.flashcards || !Array.isArray(data.flashcards)) {
        throw new Error('Invalid JSON format: missing flashcards array');
      }

      if (data.flashcards.length === 0) {
        throw new Error('No flashcards found in the JSON file');
      }

      dispatch({ type: 'SET_FLASHCARDS', payload: data.flashcards });
      dispatch({ type: 'SET_METADATA', payload: data.metadata || {} });
      
      toast({
        title: 'Success!',
        description: `Loaded ${data.flashcards.length} flashcards from ${file.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Modal is hidden, so no need to close it
    } catch (error) {
      const errorMessage = `Failed to load JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      toast({
        title: 'Error loading file',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [dispatch, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleSetSelect = useCallback((filename: string) => {
    setSelectedSet(filename);
    selectedSetRef.current = filename;
    loadSelectedSet(filename);
  }, [loadSelectedSet]);

  // If we have flashcards loaded, show a minimal upload button
  if (state.flashcards.length > 0) {
    return null; // Hide the "Add More Sets" button for now
  }

  // If we're still scanning for files, show a loading state
  if (isScanning) {
    return (
      <Box 
        bg={bgColor} 
        rounded="lg" 
        shadow="lg" 
        p={8} 
        mb={8}
        borderWidth="1px"
        borderColor={borderColor}
        textAlign="center"
      >
        <VStack spacing={4}>
          <Icon as={FolderOpen} w={12} h={12} color="blue.500" />
          <Text fontSize="lg" color="gray.600">
            Loading your flashcard sets...
          </Text>
        </VStack>
      </Box>
    );
  }

  // If no flashcards are loaded, show the full upload interface
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Box 
          bg={bgColor} 
          rounded="lg" 
          shadow="lg" 
          p={8} 
          mb={8}
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={6} textAlign="center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Icon as={FolderOpen} w={16} h={16} color="blue.500" />
            </motion.div>
            
            <VStack spacing={4}>
              <Heading size={headingSize} color="gray.800">
                Welcome to Cait's Flashcard App! 🎓
              </Heading>
              
              <Text color="gray.600" fontSize={textSize}>
                Choose from your organized flashcard sets
              </Text>
            </VStack>

            {/* Available Sets Section */}
            {availableSets.length > 0 && (
              <Box w="100%" textAlign="left">
                <HStack justify="space-between" mb={4} flexWrap="wrap">
                  <Text fontWeight="semibold" color="gray.700" fontSize="lg">
                    📁 Available Flashcard Sets
                  </Text>
                  <Button
                    size={buttonSize}
                    variant="ghost"
                    leftIcon={<Icon as={RefreshCw} />}
                    onClick={scanForFlashcardSets}
                    isLoading={isScanning}
                  >
                    Refresh
                  </Button>
                </HStack>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {availableSets.map((set, index) => (
                    <motion.div
                      key={set.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderColor={selectedSet === set.filename ? "blue.300" : "gray.200"}
                        bg={selectedSet === set.filename ? "blue.50" : "transparent"}
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
                          <HStack justify="space-between" w="100%" flexWrap="wrap">
                            <HStack spacing={3}>
                              <Icon as={FileText} color="blue.500" />
                              <Text fontWeight="bold" fontSize="md">
                                {set.title}
                              </Text>
                            </HStack>
                            {selectedSet === set.filename && (
                              <Badge colorScheme="blue" variant="subtle">
                                Selected
                              </Badge>
                            )}
                          </HStack>
                          
                          <Text fontSize="sm" color="gray.600">
                            {set.description}
                          </Text>
                          
                          <HStack spacing={2} flexWrap="wrap">
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
                    </motion.div>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {/* Divider */}
            <Divider />

            {/* Upload New File Section */}
            <Box w="100%" textAlign="left">
              <Text fontWeight="semibold" color="gray.700" mb={3}>
                📤 Upload New Flashcard Set
              </Text>
              
              <Box
                borderWidth={2}
                borderStyle="dashed"
                borderColor={isDragOver ? "blue.500" : "gray.300"}
                bg={isDragOver ? "blue.50" : "transparent"}
                rounded="lg"
                p={6}
                transition="all 0.2s"
                _hover={{ borderColor: "gray.400" }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <VStack spacing={4}>
                  <label htmlFor="jsonFile" style={{ cursor: 'pointer' }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        colorScheme="brand" 
                        size="lg"
                        leftIcon={<Icon as={Upload} />}
                      >
                        Choose JSON File
                      </Button>
                    </motion.div>
                  </label>
                  
                  <input
                    type="file"
                    id="jsonFile"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleFileInput}
                  />
                  
                  <Text fontSize="sm" color="gray.500">
                    or drag and drop JSON file here
                  </Text>
                </VStack>
              </Box>
            </Box>

            {/* Error Display */}
            <AnimatePresence>
              {state.error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ width: '100%' }}
                >
                  <Alert status="error" rounded="lg">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Error Loading File</AlertTitle>
                      <AlertDescription>{state.error}</AlertDescription>
                    </Box>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </VStack>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
