#!/usr/bin/env python3
"""
Flashcard Set Manager - Add new flashcard sets to the organized structure
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

def add_flashcard_set(json_file_path, title=None, description=None, category="Other", difficulty="Intermediate"):
    """
    Add a new flashcard set to the organized structure
    
    Args:
        json_file_path: Path to the JSON file to add
        title: Title for the flashcard set (defaults to filename)
        description: Description of the set
        category: Category (Medical, Science, History, etc.)
        difficulty: Difficulty level (Beginner, Intermediate, Advanced)
    """
    
    # Validate input file
    if not os.path.exists(json_file_path):
        print(f"❌ Error: File {json_file_path} not found")
        return False
    
    try:
        with open(json_file_path, 'r') as f:
            data = json.load(f)
        
        if 'flashcards' not in data or not isinstance(data['flashcards'], list):
            print("❌ Error: Invalid JSON format - missing flashcards array")
            return False
        
        card_count = len(data['flashcards'])
        if card_count == 0:
            print("❌ Error: No flashcards found in the file")
            return False
            
    except json.JSONDecodeError:
        print("❌ Error: Invalid JSON file")
        return False
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return False
    
    # Generate filename and ID
    filename = os.path.basename(json_file_path)
    if not filename.endswith('.json'):
        filename += '.json'
    
    # Generate unique ID based on filename
    base_name = os.path.splitext(filename)[0]
    set_id = base_name.lower().replace(' ', '_').replace('-', '_')
    
    # Use provided title or generate from filename
    if not title:
        title = base_name.replace('_', ' ').title()
    
    if not description:
        description = f"Flashcard set containing {card_count} cards"
    
    # Create flashcard-data directory if it doesn't exist
    flashcard_data_dir = Path("public/flashcard-data")
    flashcard_data_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy file to flashcard-data directory
    dest_path = flashcard_data_dir / filename
    try:
        import shutil
        shutil.copy2(json_file_path, dest_path)
        print(f"✅ Copied {json_file_path} to {dest_path}")
    except Exception as e:
        print(f"❌ Error copying file: {e}")
        return False
    
    # Load existing metadata or create new
    metadata_path = flashcard_data_dir / "sets-metadata.json"
    if metadata_path.exists():
        try:
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
        except Exception as e:
            print(f"❌ Error reading existing metadata: {e}")
            return False
    else:
        metadata = {
            "flashcard_sets": [],
            "categories": [
                "Medical", "Science", "History", "Language", 
                "Mathematics", "Technology", "Business", "Other"
            ],
            "last_updated": datetime.now().isoformat()
        }
    
    # Check if set already exists
    existing_ids = [set_data.get('id') for set_data in metadata['flashcard_sets']]
    if set_id in existing_ids:
        # Update existing set
        for set_data in metadata['flashcard_sets']:
            if set_data.get('id') == set_id:
                set_data.update({
                    "filename": filename,
                    "title": title,
                    "description": description,
                    "category": category,
                    "difficulty": difficulty,
                    "card_count": card_count,
                    "created_date": datetime.now().strftime("%Y-%m-%d"),
                    "tags": [category.lower(), difficulty.lower()]
                })
                print(f"✅ Updated existing set: {title}")
                break
    else:
        # Add new set
        new_set = {
            "id": set_id,
            "filename": filename,
            "title": title,
            "description": description,
            "category": category,
            "difficulty": difficulty,
            "card_count": card_count,
            "created_date": datetime.now().strftime("%Y-%m-%d"),
            "tags": [category.lower(), difficulty.lower()]
        }
        metadata['flashcard_sets'].append(new_set)
        print(f"✅ Added new set: {title}")
    
    # Update timestamp
    metadata['last_updated'] = datetime.now().isoformat()
    
    # Save updated metadata
    try:
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"✅ Updated metadata file: {metadata_path}")
    except Exception as e:
        print(f"❌ Error saving metadata: {e}")
        return False
    
    print(f"\n🎉 Successfully added flashcard set!")
    print(f"📁 File: {filename}")
    print(f"📊 Cards: {card_count}")
    print(f"📂 Category: {category}")
    print(f"📈 Difficulty: {difficulty}")
    print(f"\nThe set will now appear in Cait's Flashcard App!")
    
    return True

def list_categories():
    """List available categories"""
    categories = [
        "Medical", "Science", "History", "Language", 
        "Mathematics", "Technology", "Business", "Other"
    ]
    print("📂 Available categories:")
    for i, category in enumerate(categories, 1):
        print(f"  {i}. {category}")

def main():
    if len(sys.argv) < 2:
        print("📖 Flashcard Set Manager")
        print("Usage:")
        print("  python add_flashcard_set.py <json_file> [title] [description] [category] [difficulty]")
        print("\nExamples:")
        print("  python add_flashcard_set.py my_flashcards.json")
        print("  python add_flashcard_set.py math_quiz.json 'Math Quiz' 'Basic mathematics questions' 'Mathematics' 'Beginner'")
        print("\nCategories:")
        list_categories()
        print("\nDifficulties: Beginner, Intermediate, Advanced")
        return
    
    json_file = sys.argv[1]
    title = sys.argv[2] if len(sys.argv) > 2 else None
    description = sys.argv[3] if len(sys.argv) > 3 else None
    category = sys.argv[4] if len(sys.argv) > 4 else "Other"
    difficulty = sys.argv[5] if len(sys.argv) > 5 else "Intermediate"
    
    success = add_flashcard_set(json_file, title, description, category, difficulty)
    
    if success:
        print("\n🚀 You can now start the React app to see your new flashcard set!")
        print("   npm start")
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
