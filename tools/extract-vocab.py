#!/usr/bin/env python3
"""
Extract vocabulary, inference, spelling and WIBFEN data from Dark History epub files.

Outputs:
  data/vocabulary.json   - 220 words with 3 question types each
  data/inference.json    - inference challenge questions per book
  data/spelling.json     - spelling quiz data
  data/writing-prompts.json - WIBFEN prompts per book
"""

import json
import os
import re
import sys
from pathlib import Path

import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

EPUB_DIR = "/Users/brendaneburagho/Library/CloudStorage/GoogleDrive-advisoryscience@gmail.com/My Drive/05 - Projects & Clients/Jacob and Avs/DarkHistoryAudio"
OUT_DIR = "/Users/brendaneburagho/jacob-11plus-tutor/data"

EPUB_FILES = [
    ("GoldieLeigh_ABriefHistory.epub", "GoldieLeigh"),
    ("TowerOfLondon_FortressOfFear.epub", "TowerOfLondon"),
    ("GreatPlague_DeathComesToLondon.epub", "GreatPlague"),
    ("Bedlam_TheAsylum.epub", "Bedlam"),
    ("Titanic_ShipThatCouldNotSink.epub", "Titanic"),
    ("PendleWitchTrials_ChildrenBetrayedFamilies.epub", "PendleWitchTrials"),
    ("TollundMan_AncientMurderMystery.epub", "TollundMan"),
    ("ResurrectionMen_BodySnatchers.epub", "ResurrectionMen"),
    ("TheBlitz_BombsOnLondon.epub", "TheBlitz"),
    ("Alcatraz_PrisonEscape.epub", "Alcatraz"),
    ("MaryCeleste_GhostShip.epub", "MaryCeleste"),
]


def get_sections(book):
    """Return a dict mapping section type to (item, soup) tuples.
    Section types: 'wordvault', 'inference', 'wibfen', 'story'
    """
    sections = {}
    for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
        content = item.get_content().decode("utf-8", errors="replace")
        soup = BeautifulSoup(content, "html.parser")
        name = item.get_name().lower()
        # Try to identify by filename first
        for key in ("wordvault", "inference", "wibfen", "story"):
            if key in name:
                sections[key] = (item, soup)
        # Also check h1/h3 text for books with ch0/ch1 naming
        for h in soup.find_all(["h1", "h2", "h3"]):
            text = h.get_text().lower().strip()
            if "word vault" in text and "wordvault" not in sections:
                sections["wordvault"] = (item, soup)
            elif "inference" in text and "inference" not in sections:
                sections["inference"] = (item, soup)
            elif "wibfen" in text and "wibfen" not in sections:
                sections["wibfen"] = (item, soup)
            # Story is usually the main narrative chapter
        # Identify story section by finding the one with most vocab spans
        if "story" not in sections:
            vocab_count = len(soup.find_all("span", class_="vocab"))
            if vocab_count > 10:
                # Likely the story section
                if "story" not in sections or vocab_count > len(
                    sections["story"][1].find_all("span", class_="vocab")
                ):
                    sections["story"] = (item, soup)
    return sections


def extract_word_vault(soup, book_id):
    """Extract vocabulary words from the Word Vault table."""
    words = []
    table = soup.find("table")
    if not table:
        print(f"  WARNING: No table found in Word Vault for {book_id}")
        return words
    rows = table.find_all("tr")
    for row in rows[1:]:  # Skip header
        cells = row.find_all("td")
        if len(cells) >= 4:
            word = cells[0].get_text().strip()
            meaning = cells[1].get_text().strip()
            example = cells[2].get_text().strip()
            similar = cells[3].get_text().strip()
            words.append(
                {
                    "word": word,
                    "definition": meaning,
                    "example": example,
                    "synonym": similar,
                    "book": book_id,
                }
            )
        elif len(cells) >= 3:
            word = cells[0].get_text().strip()
            meaning = cells[1].get_text().strip()
            example = cells[2].get_text().strip()
            words.append(
                {
                    "word": word,
                    "definition": meaning,
                    "example": example,
                    "synonym": "",
                    "book": book_id,
                }
            )
    return words


def extract_inference(soup, book_id):
    """Extract inference challenge questions."""
    questions = []

    # --- Parse answers first ---
    answers = {}
    answer_section = False
    for elem in soup.find_all(["h2", "h3", "p"]):
        text = elem.get_text().strip()
        if re.search(r"^answers?$", text, re.IGNORECASE) or (
            "answer" in text.lower()
            and elem.name in ("h2", "h3")
            and len(text) < 20
        ):
            answer_section = True
            continue
        if answer_section:
            # Format 1: "1. b) explanation" or "1. b - explanation"
            for m in re.finditer(
                r"(\d+)\.\s*(?:\*\*)?([a-dA-D])\)?(?:\*\*)?\s*[-–)]\s*(.*?)(?=\d+\.|$)",
                text,
            ):
                q_num = int(m.group(1))
                ans_letter = m.group(2).lower()
                explanation = m.group(3).strip()
                answers[q_num] = (ans_letter, explanation)

            # Format 2: compact "1 - B | 2 - C | ..."
            for m in re.finditer(r"(\d+)\s*[-–]\s*([a-dA-D])", text):
                q_num = int(m.group(1))
                ans_letter = m.group(2).lower()
                if q_num not in answers:
                    answers[q_num] = (ans_letter, "")

            # Format 3: "1. b) explanation" on separate lines
            m3 = re.match(
                r"(\d+)\.\s*(?:\*\*)?([a-dA-D])\)?(?:\*\*)?\s*[-–)]\s*(.*)", text
            )
            if m3:
                q_num = int(m3.group(1))
                ans_letter = m3.group(2).lower()
                explanation = m3.group(3).strip()
                answers[q_num] = (ans_letter, explanation)

    # --- Parse questions ---
    elements = soup.find_all(["h3", "p", "ul"])
    letter_to_idx = {"a": 0, "b": 1, "c": 2, "d": 3}

    i = 0
    while i < len(elements):
        elem = elements[i]
        text = elem.get_text().strip()

        # Detect question header
        q_num = None
        q_text_in_header = ""

        if elem.name == "h3":
            # "Question 1" or "1. Why do you think..."
            m = re.match(r"(?:Question\s+)?(\d+)\.?\s*(.*)", text, re.IGNORECASE)
            if m:
                num = int(m.group(1))
                rest = m.group(2).strip()
                # Skip "Answers" heading
                if "answer" in text.lower():
                    i += 1
                    continue
                q_num = num
                q_text_in_header = rest
        elif elem.name == "p":
            strong = elem.find("strong")
            if strong:
                st = strong.get_text().strip()
                m = re.match(r"Question\s+(\d+)", st, re.IGNORECASE)
                if m:
                    q_num = int(m.group(1))
                    q_text_in_header = text.replace(st, "").strip()

        if q_num is None:
            i += 1
            continue

        # We found a question header - now collect question text, passage, options
        current_question = q_text_in_header if len(q_text_in_header) > 10 else None
        current_passage = None
        current_options = []

        j = i + 1
        while j < len(elements):
            nxt = elements[j]
            nt = nxt.get_text().strip()

            # Stop at next question or answers
            if nxt.name == "h3":
                if "answer" in nt.lower():
                    break
                m2 = re.match(r"(?:Question\s+)?(\d+)\.?\s*", nt, re.IGNORECASE)
                if m2 and int(m2.group(1)) != q_num:
                    break
            if nxt.name == "p":
                strong2 = nxt.find("strong")
                if strong2 and re.match(
                    r"Question\s+\d+", strong2.get_text().strip(), re.IGNORECASE
                ):
                    break

            # Options in ul/li (A) or a) format)
            if nxt.name == "ul":
                for li in nxt.find_all("li"):
                    li_text = li.get_text().strip()
                    if re.match(r"[a-dA-D]\)", li_text):
                        current_options.append(li_text)
                j += 1
                continue

            if nxt.name == "p":
                # Check for passage (em/italic)
                em = nxt.find("em")
                if em and not current_passage and not current_question:
                    passage_text = em.get_text().strip().strip('"').strip("'")
                    if len(passage_text) > 15:
                        current_passage = passage_text
                        j += 1
                        continue

                # Check for options in p (with br tags), case-insensitive
                if re.search(r"[a-dA-D]\)", nt):
                    opts = re.split(r"(?=[a-dA-D]\))", nt)
                    for opt in opts:
                        opt = opt.strip()
                        if opt and re.match(r"[a-dA-D]\)", opt):
                            current_options.append(opt)
                    j += 1
                    continue

                # Question text
                if not current_question:
                    if len(nt) > 10 and ("?" in nt or len(nt) > 20):
                        current_question = nt
                        j += 1
                        continue

            j += 1

        # Save question
        if current_question and len(current_options) >= 2:
            ans_letter, explanation = answers.get(q_num, ("b", ""))
            ans_idx = letter_to_idx.get(ans_letter, 1)

            # Clean options - remove A)/a) prefix, normalise
            clean_options = []
            for opt in current_options[:4]:
                clean = re.sub(r"^[a-dA-D]\)\s*", "", opt).strip()
                clean_options.append(clean)

            q_entry = {
                "book": book_id,
                "question": current_question,
                "options": clean_options,
                "answer": ans_idx,
                "explanation": explanation,
            }
            if current_passage:
                q_entry["passage"] = current_passage
            questions.append(q_entry)

        i += 1

    return questions


def extract_wibfen(soup, book_id):
    """Extract WIBFEN writing prompts."""
    prompts = {"book": book_id, "sections": []}

    current_section = None
    current_letter = None
    current_items = []

    for elem in soup.find_all(["h3", "h4", "p", "ul"]):
        text = elem.get_text().strip()

        # Skip the main header
        if "WIBFEN" in text and ("Challenge" in text or "Writing" in text):
            continue

        # Detect WIBFEN letter sections
        # Patterns: "W - Who...", "W — WHO...", "I - What was Important..."
        m = re.match(
            r"([WIBFEN])\s*[-–—]\s*(.*)",
            text,
            re.IGNORECASE,
        )
        if m and elem.name in ("h3", "h4"):
            # Save previous section
            if current_letter and current_items:
                prompts["sections"].append(
                    {
                        "letter": current_letter,
                        "title": current_section,
                        "prompts": current_items,
                    }
                )
            current_letter = m.group(1).upper()
            current_section = m.group(2).strip()
            current_items = []
            continue

        # Collect prompts from ul/li
        if elem.name == "ul" and current_letter:
            for li in elem.find_all("li"):
                li_text = li.get_text().strip()
                if li_text:
                    current_items.append(li_text)
            continue

    # Save last section
    if current_letter and current_items:
        prompts["sections"].append(
            {
                "letter": current_letter,
                "title": current_section,
                "prompts": current_items,
            }
        )

    return prompts


# ----- Question generation for vocabulary -----

# Bank of plausible distractors by category
GENERIC_DISTRACTORS = {
    "adjective": [
        "cheerful",
        "enormous",
        "gentle",
        "ancient",
        "quiet",
        "brilliant",
        "ordinary",
        "pleasant",
        "delicate",
        "humble",
        "wealthy",
        "swift",
        "narrow",
        "feeble",
        "stubborn",
        "eager",
        "hollow",
        "dreadful",
        "bold",
        "graceful",
        "tedious",
        "mighty",
        "peculiar",
        "solemn",
        "fragile",
        "cautious",
        "vivid",
        "stern",
        "timid",
        "elegant",
    ],
    "noun": [
        "celebration",
        "garden",
        "friendship",
        "decoration",
        "instrument",
        "mountain",
        "journey",
        "treasure",
        "melody",
        "harvest",
        "monument",
        "shelter",
        "festival",
        "vehicle",
        "companion",
        "boundary",
        "creature",
        "portrait",
        "spectacle",
        "dwelling",
        "garment",
        "riddle",
        "merchant",
        "orchard",
        "banquet",
    ],
    "verb": [
        "celebrate",
        "wander",
        "whisper",
        "gather",
        "polish",
        "arrange",
        "decorate",
        "observe",
        "nurture",
        "construct",
        "explore",
        "cultivate",
        "appreciate",
        "demonstrate",
        "encourage",
        "surrender",
        "navigate",
        "distribute",
        "illuminate",
        "establish",
    ],
    "adverb": [
        "carefully",
        "quietly",
        "happily",
        "swiftly",
        "eagerly",
        "gently",
        "boldly",
        "firmly",
    ],
}


def guess_pos(definition):
    """Very rough guess at part of speech from definition."""
    d = definition.lower()
    if d.startswith(("the act of", "the state of", "the process of", "a person", "a place", "a group", "a formal", "a large", "a king", "a supreme", "a dark", "a type")):
        return "noun"
    if d.startswith(("to ", "put into", "showing", "causing", "having")):
        return "verb"
    if d.startswith(("in a ", "with ")):
        return "adverb"
    # Default to adjective for descriptive definitions
    return "adjective"


def pick_distractors(correct, category, all_words_set, n=3):
    """Pick n plausible distractors that are not the correct answer."""
    pool = GENERIC_DISTRACTORS.get(category, GENERIC_DISTRACTORS["adjective"])
    result = []
    for w in pool:
        if w.lower() != correct.lower() and w.lower() not in all_words_set:
            result.append(w)
        if len(result) == n:
            break
    # Pad if needed
    fallbacks = ["remarkable", "temporary", "practical", "miniature", "abundant"]
    while len(result) < n:
        for f in fallbacks:
            if f not in result and f.lower() != correct.lower():
                result.append(f)
                break
        else:
            result.append("unusual")
            break
    return result[:n]


def generate_meaning_question(entry, all_words_set):
    """Generate a 'what does X mean?' question."""
    word = entry["word"]
    definition = entry["definition"]
    pos = guess_pos(definition)

    # Correct option is a simplified version of the definition
    correct = definition
    # Get 3 wrong definitions from other words if possible, else generic
    distractors = []

    # Use generic wrong definitions
    wrong_defs = {
        "adjective": [
            "Very large in size or amount",
            "Happening at the same time",
            "Extremely pleased or satisfied",
            "Belonging to the distant past",
            "Moving in a slow and careful way",
            "Connected to a specific region",
            "Full of energy and enthusiasm",
            "Relating to everyday matters",
        ],
        "noun": [
            "A loud and sudden noise",
            "A type of traditional dance",
            "A large outdoor gathering",
            "A piece of official equipment",
            "A written record of events",
            "A small enclosed space",
            "A group of travelling performers",
            "A method of communication",
        ],
        "verb": [
            "To move quickly from one place to another",
            "To speak very loudly to a crowd",
            "To carefully examine something in detail",
            "To build something from scratch",
            "To quietly leave without being noticed",
            "To celebrate with a grand feast",
            "To divide something into equal parts",
            "To collect items over a long period",
        ],
    }

    pool = wrong_defs.get(pos, wrong_defs["adjective"])
    # Filter out anything too similar to the correct answer
    for d in pool:
        if d.lower() != correct.lower() and len(distractors) < 3:
            # Basic similarity check
            if not any(
                w in d.lower()
                for w in correct.lower().split()
                if len(w) > 4
            ):
                distractors.append(d)

    while len(distractors) < 3:
        distractors.append("Something that is extremely ordinary")

    # Place correct answer at a varied position
    import random

    options = distractors[:3] + [correct]
    random.shuffle(options)
    answer_idx = options.index(correct)

    return {
        "type": "meaning",
        "stem": f"What does '{word}' mean?",
        "options": options,
        "answer": answer_idx,
    }


def generate_synonym_question(entry, all_words_set):
    """Generate a synonym question."""
    word = entry["word"]
    synonym = entry["synonym"]
    pos = guess_pos(entry["definition"])

    if not synonym:
        synonym = word  # fallback

    correct = synonym
    distractors = pick_distractors(correct, pos, all_words_set, 3)

    import random

    options = distractors[:3] + [correct]
    random.shuffle(options)
    answer_idx = options.index(correct)

    return {
        "type": "synonym",
        "stem": f"Which word is closest in meaning to '{word}'?",
        "options": options,
        "answer": answer_idx,
    }


def generate_context_question(entry, all_words_set):
    """Generate a fill-in-the-blank context question."""
    import random

    word = entry["word"]
    pos = guess_pos(entry["definition"])

    # Create a context sentence with a blank
    context_templates = {
        "adjective": [
            f"The ___ conditions made the journey extremely difficult.",
            f"Everyone agreed that the situation was truly ___.",
            f"The ___ atmosphere in the room made people uncomfortable.",
            f"It was clear that the leader was ___ in every way.",
            f"The ___ landscape stretched out before them.",
        ],
        "noun": [
            f"The ___ was known throughout the land.",
            f"They could not escape the ___.",
            f"The ___ changed everything for the people who lived there.",
            f"Nobody had ever seen such a ___ before.",
            f"The ___ lasted for many years.",
        ],
        "verb": [
            f"The authorities decided to ___ the prisoners immediately.",
            f"They had no choice but to ___ the situation.",
            f"The crowd watched as they began to ___ the evidence.",
            f"It was impossible to ___ what had happened.",
            f"The officials planned to ___ the entire area.",
        ],
    }

    templates = context_templates.get(pos, context_templates["adjective"])
    stem = random.choice(templates)

    distractors = pick_distractors(word, pos, all_words_set, 3)

    correct = word
    options = distractors[:3] + [correct]
    random.shuffle(options)
    answer_idx = options.index(correct)

    return {
        "type": "context",
        "stem": stem,
        "options": options,
        "answer": answer_idx,
    }


def generate_spelling_entry(entry, idx):
    """Generate a spelling quiz entry."""
    word = entry["word"]
    difficulty = 1
    if len(word) >= 10:
        difficulty = 3
    elif len(word) >= 7:
        difficulty = 2

    hint = f"{word[0]}{'_' * (len(word) - 1)} ({len(word)} letters)"

    return {
        "id": f"s{idx:03d}",
        "word": word,
        "definition": entry["definition"],
        "hint": hint,
        "difficulty": difficulty,
        "book": entry["book"],
    }


def main():
    import random

    random.seed(42)

    all_vocab = []
    all_inference = []
    all_wibfen = []

    for filename, book_id in EPUB_FILES:
        filepath = os.path.join(EPUB_DIR, filename)
        if not os.path.exists(filepath):
            print(f"SKIP: {filename} not found")
            continue

        print(f"Processing: {filename} ({book_id})")
        book = epub.read_epub(filepath)
        sections = get_sections(book)

        # Extract Word Vault
        if "wordvault" in sections:
            _, soup = sections["wordvault"]
            words = extract_word_vault(soup, book_id)
            print(f"  Word Vault: {len(words)} words")
            all_vocab.extend(words)
        else:
            print(f"  WARNING: No Word Vault section found")

        # Extract Inference
        if "inference" in sections:
            _, soup = sections["inference"]
            questions = extract_inference(soup, book_id)
            print(f"  Inference: {len(questions)} questions")
            all_inference.extend(questions)
        else:
            print(f"  WARNING: No Inference section found")

        # Extract WIBFEN
        if "wibfen" in sections:
            _, soup = sections["wibfen"]
            wibfen = extract_wibfen(soup, book_id)
            print(f"  WIBFEN: {len(wibfen['sections'])} sections")
            all_wibfen.append(wibfen)
        else:
            print(f"  WARNING: No WIBFEN section found")

    print(f"\nTotals: {len(all_vocab)} vocab words, {len(all_inference)} inference questions, {len(all_wibfen)} WIBFEN books")

    # Build vocabulary.json with question types
    all_words_set = {w["word"].lower() for w in all_vocab}
    all_words_set.update({w.get("synonym", "").lower() for w in all_vocab})

    vocabulary_json = []
    for idx, entry in enumerate(all_vocab):
        q_meaning = generate_meaning_question(entry, all_words_set)
        q_synonym = generate_synonym_question(entry, all_words_set)
        q_context = generate_context_question(entry, all_words_set)

        vocab_entry = {
            "id": f"v{idx + 1:03d}",
            "word": entry["word"],
            "definition": entry["definition"],
            "example": entry["example"],
            "synonyms": [entry["synonym"]] if entry.get("synonym") else [],
            "book": entry["book"],
            "questionTypes": [q_meaning, q_synonym, q_context],
        }
        vocabulary_json.append(vocab_entry)

    # Build inference.json
    inference_json = []
    for idx, q in enumerate(all_inference):
        inf_entry = {
            "id": f"i{idx + 1:03d}",
            "book": q["book"],
            "question": q["question"],
            "options": q["options"],
            "answer": q["answer"],
            "explanation": q.get("explanation", ""),
        }
        if "passage" in q:
            inf_entry["passage"] = q["passage"]
        inference_json.append(inf_entry)

    # Build spelling.json
    spelling_json = []
    for idx, entry in enumerate(all_vocab):
        spelling_json.append(generate_spelling_entry(entry, idx + 1))

    # Write output files
    os.makedirs(OUT_DIR, exist_ok=True)

    with open(os.path.join(OUT_DIR, "vocabulary.json"), "w", encoding="utf-8") as f:
        json.dump(vocabulary_json, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {len(vocabulary_json)} entries to vocabulary.json")

    with open(os.path.join(OUT_DIR, "inference.json"), "w", encoding="utf-8") as f:
        json.dump(inference_json, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(inference_json)} entries to inference.json")

    with open(os.path.join(OUT_DIR, "spelling.json"), "w", encoding="utf-8") as f:
        json.dump(spelling_json, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(spelling_json)} entries to spelling.json")

    with open(os.path.join(OUT_DIR, "writing-prompts.json"), "w", encoding="utf-8") as f:
        json.dump(all_wibfen, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(all_wibfen)} books to writing-prompts.json")


if __name__ == "__main__":
    main()
