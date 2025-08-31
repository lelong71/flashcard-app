# Flashcard Utilities

This folder contains Python utilities for converting PDF files to flashcard JSON format and managing flashcard sets.

## Tools

### `pdf_converter.py`
Converts PDF files with questions and answers into JSON format for use with the React flashcard app.

**Usage:**
```bash
python utils/pdf_converter.py input.pdf output.json
python utils/pdf_converter.py --help
```

**Features:**
- Supports multiple choice and true/false questions
- Auto-detects question format
- Extracts metadata (source PDF, page count, etc.)
- Handles various PDF structures

### `add_flashcard_set.py`
Manages flashcard sets by adding them to the organized structure with metadata.

**Usage:**
```bash
python utils/add_flashcard_set.py json_file.json "Title" "Description" "Category" "Difficulty"
```

**Examples:**
```bash
python utils/add_flashcard_set.py math_quiz.json "Math Quiz" "Basic mathematics questions" "Mathematics" "Beginner"
python utils/add_flashcard_set.py history_facts.json "History Facts" "World history questions" "History" "Intermediate"
```

## Setup

1. **Install Python dependencies:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install PyPDF2
   ```

2. **Convert your PDF:**
   ```bash
   python utils/pdf_converter.py your_file.pdf
   ```

3. **Add to organized structure:**
   ```bash
   python utils/add_flashcard_set.py your_file.json "Your Set Title" "Description" "Category" "Difficulty"
   ```

## Supported PDF Formats

### Multiple Choice Questions
- Questions numbered: `1.`, `2.`, `3.`, etc.
- Options labeled: `A.`, `B.`, `C.`, `D.`
- Answer key format: `1. A  2. B  3. C` (on final page)

### True/False Questions
- Questions numbered: `1.`, `2.`, `3.`, etc.
- Options: `True` or `False`
- Answer key format: `1. True  2. False` (on final page)

## Output

Both tools generate JSON files that are compatible with the React flashcard app located in the `src/` directory.
