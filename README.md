# Flashcard App

A modern React-based flashcard application for studying PDF-converted questions.

## Features

- 📚 Load and study flashcards from JSON files
- 🎯 Multiple choice and true/false question formats
- 🔄 Shuffle cards for better learning
- 📱 Responsive design with modern UI
- 🎨 Beautiful animations and transitions
- 📊 Organized flashcard sets with metadata

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Python 3 (for PDF conversion utilities)

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd flashcard
   ```

3. Install React dependencies:
   ```bash
   npm install
   ```

4. (Optional) Install Python utilities:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install PyPDF2
   ```

### Running the Application

**Important**: You must run the development server to use the app properly. Opening the HTML file directly in a browser will not work due to CORS restrictions and file access limitations.

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. The app will automatically scan for available flashcard sets in the `public/flashcard-data/` folder

### Converting PDFs to Flashcards

1. **Convert your PDF:**
   ```bash
   python utils/pdf_converter.py your_file.pdf
   ```

2. **Add to organized structure:**
   ```bash
   python utils/add_flashcard_set.py your_file.json "Your Set Title" "Description" "Category" "Difficulty"
   ```

3. **Study with the React app** - The new flashcard set will appear automatically

### Building for Production

1. Create a production build:
   ```bash
   npm run build
   ```

2. The built files will be in the `build/` directory

3. Deploy the `build/` folder to your web server

## Flashcard Data Format

The app expects JSON files with the following structure:

```json
{
  "flashcards": [
    {
      "question": "What is the capital of France?",
      "answer": "Paris",
      "question_number": 1,
      "format": "multiple_choice",
      "all_options": {
        "A": "London",
        "B": "Paris", 
        "C": "Berlin",
        "D": "Madrid"
      }
    }
  ],
  "metadata": {
    "source_pdf": "example.pdf",
    "total_pages": 10,
    "questions_extracted": 50,
    "conversion_timestamp": "2024-01-15T10:00:00Z"
  }
}
```

## File Structure

```
flashcard/
├── src/                          # React application
│   ├── components/               # React components
│   ├── contexts/                 # React contexts
│   └── App.tsx                   # Main app component
├── public/                       # Static assets
│   └── flashcard-data/          # Organized flashcard sets
│       ├── sets-metadata.json   # Set information and metadata
│       └── flashcard.json       # Actual flashcard data
├── utils/                        # Python utilities
│   ├── pdf_converter.py         # PDF to JSON converter
│   ├── add_flashcard_set.py     # Flashcard set manager
│   └── README.md                # Utilities documentation
├── package.json                  # React app dependencies
└── README.md                    # This file
```

## Development

The app is built with:
- React 18
- TypeScript
- Chakra UI for styling
- Framer Motion for animations
- Lucide React for icons

## License

This project is open source and available under the MIT License.
