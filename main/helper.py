import re

def normalize_move_text(text):
    if not text:
        return ""

    normalized = text.strip()
    normalized = re.sub(r"\bor\b", "", normalized, flags=re.IGNORECASE)
    normalized = normalized.replace(",", "")
    normalized = normalized.replace("~", "")
    normalized = normalized.replace(" ", "")
    normalized = normalized.replace("+", "")
    normalized = normalized.replace("/", "")
    normalized = normalized.replace("cd", "fnddf")
    normalized = normalized.replace("qcf", "ddff")
    normalized = normalized.replace("qcb", "ddbb")
    #normalized = normalized.replace("fhcf", "fbdbddff")
    return normalized.upper()


def matches_move_search(move_text, search_text):
    """Return True when the move text matches the search text."""
    normalized_search = normalize_move_text(search_text)
    if not normalized_search:
        return True

    move_norm = normalize_move_text(move_text)
    if move_norm == normalized_search or move_norm.startswith(normalized_search):
        return True

    move_parts = [part.strip() for part in (move_text or "").split(',') if part.strip()]
    part_norms = [normalize_move_text(part) for part in move_parts]
    return any(
        normalized_search == part_norm or part_norm.startswith(normalized_search)
        for part_norm in part_norms
    )


def parse_move(move_str):
    # Parse Tekken move strings into a list of display elements.
    #       Handles:
    # - ',' separates moves
    # - '~' wraps in brackets
    # - '/' merges directional inputs
    # - '+' splits directional inputs from numbers if needed
    # - Text labels (WS, FC, SS) stay as text
    # - Multi-button combos stay combined

    TEXT_LABELS = {"WS", "FC", "SS"}
    result = []

    parts = [p.strip() for p in move_str.split(',') if p.strip()]

    for part in parts:
        # Handle bracket (~)
        if '~' in part:
            bracket_group = ['bracketl']
            for sp in part.split('~'):
                # parse subpart normally
                sub_result = parse_move(sp)
                # flatten single-element sublists
                for elem in sub_result:
                    if isinstance(elem, list) and len(elem) == 1:
                        bracket_group.append(elem[0])
                    else:
                        bracket_group.append(elem)
            bracket_group.append('bracketr')
            result.append(bracket_group)
            continue

        # Normal part
        tokens = part.split()
        combined_tokens = []

        for token in tokens:
            components = token.split('+')

            # If first component is a text label, keep as text
            if components[0].upper() in TEXT_LABELS:
                combined_tokens.append(components[0].upper())
                components = components[1:]

            directions = []
            others = []

            for c in components:
                if c == 'qcf':
                    directions.append('d df f')
                elif c == 'qcb':
                    directions.append('d db b')

                if '/' in c:  # merge directional inputs
                    dirs = c.split('/')
                    directions.append(''.join(d.upper() for d in dirs))
                elif c.upper() in {'U','D','F','B'}:
                    directions.append(c.upper())
                else:
                    others.append(c)

            combined_tokens.extend(directions)
            if others:
                combined_tokens.append('+'.join(others))

        if combined_tokens:
            result.append(combined_tokens)

    return result