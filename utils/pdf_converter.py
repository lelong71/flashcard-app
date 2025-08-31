#!/usr/bin/env python3
"""
PDF to Flashcard Converter
==========================
A command-line tool to convert PDF files with questions and answers into JSON format
for use with the flashcard web application.

Usage:
    python pdf_converter.py input.pdf output.json
    python pdf_converter.py --help
"""

import PyPDF2
import re
import json
import sys
import os
import argparse
from pathlib import Path

class PDFFlashcardConverter:
    def __init__(self):
        self.supported_formats = {
            'multiple_choice': {
                'description': 'Multiple choice questions with A, B, C, D options',
                'question_pattern': r'(\d+)\.\s*(.+?)(?=\d+\.|$)',
                'option_pattern': r'([A-D])\.\s*(.+?)(?=[A-D]\.|$)',
                'answer_pattern': r'(\d+)\.\s*([A-D])'
            },
            'true_false': {
                'description': 'True/False questions',
                'question_pattern': r'(\d+)\.\s*(.+?)(?=\d+\.|$)',
                'option_pattern': r'(True|False)',
                'answer_pattern': r'(\d+)\.\s*(True|False)'
            }
        }
    
    def detect_format(self, text):
        """Detect the format of the PDF based on content analysis"""
        # Count multiple choice options vs true/false
        mc_options = len(re.findall(r'[A-D]\.', text))
        tf_options = len(re.findall(r'\b(True|False)\b', text))
        
        if mc_options > tf_options:
            return 'multiple_choice'
        else:
            return 'true_false'
    
    def extract_questions(self, text, format_type='multiple_choice'):
        """Extract questions from text based on format"""
        format_config = self.supported_formats[format_type]
        questions = []
        
        # For your PDF format, we need to handle the specific structure
        if format_type == 'multiple_choice':
            # Split by question numbers and extract
            question_blocks = re.split(r'(\d+\.)', text)
            
            for i in range(1, len(question_blocks), 2):  # Skip first empty block
                if i + 1 < len(question_blocks):
                    question_num = int(question_blocks[i].replace('.', ''))
                    question_content = question_blocks[i + 1]
                    
                    # Extract options from the content
                    options = {}
                    option_matches = re.findall(r'([A-D])\.\s*(.+?)(?=[A-D]\.|$)', question_content, re.DOTALL)
                    
                    for opt_match in option_matches:
                        option_letter = opt_match[0]
                        option_text = opt_match[1].strip()
                        options[option_letter] = option_text
                    
                    # Clean question text (remove options)
                    clean_question = re.sub(r'[A-D]\.\s*.+?(?=[A-D]\.|$)', '', question_content, flags=re.DOTALL).strip()
                    
                    if clean_question and options:
                        questions.append({
                            'number': question_num,
                            'text': clean_question,
                            'options': options
                        })
        
        return questions
    
    def extract_answer_key(self, text, format_type='multiple_choice'):
        """Extract answer key from text"""
        format_config = self.supported_formats[format_type]
        answer_key = {}
        
        if format_type == 'multiple_choice':
            # Handle the specific format: "1. D  74. C  147. C"
            # The format has groups of 3 answers per line
            answer_matches = re.findall(r'(\d+)\.\s*([A-D])', text)
            for match in answer_matches:
                question_num = int(match[0])
                answer = match[1]
                answer_key[question_num] = answer
        
        return answer_key
    
    def create_flashcards(self, questions, answer_key, format_type='multiple_choice'):
        """Create flashcards from questions and answer key"""
        flashcards = []
        
        for question in questions:
            if question['number'] in answer_key:
                correct_answer = answer_key[question['number']]
                
                if format_type == 'multiple_choice':
                    # Find the correct option
                    correct_option = None
                    for option_letter, option_text in question['options'].items():
                        if option_letter == correct_answer:
                            correct_option = option_text
                            break
                    
                    if correct_option:
                        flashcards.append({
                            'question': f"Question {question['number']}: {question['text']}",
                            'answer': f"{correct_answer}. {correct_option}",
                            'all_options': question['options'],
                            'question_number': question['number'],
                            'format': 'multiple_choice'
                        })
                
                elif format_type == 'true_false':
                    flashcards.append({
                        'question': f"Question {question['number']}: {question['text']}",
                        'answer': f"Answer: {correct_answer}",
                        'question_number': question['number'],
                        'format': 'true_false'
                    })
        
        return flashcards
    
    def convert_pdf(self, pdf_path, output_path=None, format_type=None):
        """Convert PDF to flashcard JSON"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                print(f"📄 Processing PDF: {pdf_path}")
                print(f"📊 Total pages: {len(pdf_reader.pages)}")
                
                # Extract text from all pages
                all_text = ""
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text()
                    all_text += page_text + " "
                
                # Detect format if not specified
                if not format_type:
                    format_type = self.detect_format(all_text)
                    print(f"🔍 Detected format: {format_type}")
                
                # Split content: questions (all but last page) and answer key (last page)
                question_pages = len(pdf_reader.pages) - 1
                question_text = ""
                answer_text = ""
                
                for page_num in range(question_pages):
                    page = pdf_reader.pages[page_num]
                    question_text += page.extract_text() + " "
                
                if len(pdf_reader.pages) > 0:
                    answer_page = pdf_reader.pages[-1]
                    answer_text = answer_page.extract_text()
                    
                # Check if answer page is empty, try page 23 (index 22)
                if len(answer_text.strip()) < 10:
                    answer_page = pdf_reader.pages[22]  # Page 23
                    answer_text = answer_page.extract_text()
                
                # Extract questions and answers
                questions = self.extract_questions(question_text, format_type)
                answer_key = self.extract_answer_key(answer_text, format_type)
                flashcards = self.create_flashcards(questions, answer_key, format_type)
                
                # Create output data
                output_data = {
                    'metadata': {
                        'source_pdf': str(pdf_path),
                        'total_pages': len(pdf_reader.pages),
                        'format_type': format_type,
                        'questions_extracted': len(questions),
                        'answer_key_entries': len(answer_key),
                        'valid_flashcards': len(flashcards),
                        'conversion_timestamp': str(Path(pdf_path).stat().st_mtime)
                    },
                    'flashcards': flashcards
                }
                
                # Determine output path
                if not output_path:
                    output_path = str(Path(pdf_path).with_suffix('.json'))
                
                # Save to JSON
                with open(output_path, 'w', encoding='utf-8') as json_file:
                    json.dump(output_data, json_file, indent=2, ensure_ascii=False)
                
                print(f"✅ Successfully converted!")
                print(f"📊 Questions extracted: {len(questions)}")
                print(f"🔑 Answer key entries: {len(answer_key)}")
                print(f"🎯 Valid flashcards: {len(flashcards)}")
                print(f"📁 Output saved to: {output_path}")
                
                return output_data
                
        except Exception as e:
            print(f"❌ Error converting PDF: {e}")
            return None

def main():
    parser = argparse.ArgumentParser(
        description='Convert PDF files with questions and answers to JSON format for flashcard apps',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python pdf_converter.py input.pdf
  python pdf_converter.py input.pdf output.json
  python pdf_converter.py input.pdf --format multiple_choice
  python pdf_converter.py input.pdf --format true_false
        """
    )
    
    parser.add_argument('input', help='Input PDF file path')
    parser.add_argument('output', nargs='?', help='Output JSON file path (optional)')
    parser.add_argument('--format', choices=['multiple_choice', 'true_false'], 
                       help='Force specific format (auto-detected if not specified)')
    parser.add_argument('--list-formats', action='store_true', 
                       help='List supported formats and exit')
    
    args = parser.parse_args()
    
    converter = PDFFlashcardConverter()
    
    if args.list_formats:
        print("Supported formats:")
        for fmt, config in converter.supported_formats.items():
            print(f"  {fmt}: {config['description']}")
        return
    
    if not os.path.exists(args.input):
        print(f"❌ Error: Input file '{args.input}' not found")
        sys.exit(1)
    
    result = converter.convert_pdf(args.input, args.output, args.format)
    
    if result:
        print("\n🎉 Conversion completed successfully!")
        print("You can now use the JSON file with the flashcard web app.")
    else:
        print("\n❌ Conversion failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
