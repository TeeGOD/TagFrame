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
    STANCE = {"WS", "SS", "BT"}
    DIRECTIONS = {"U", "D", "F", "B", "UF", "UB", "DF", "DB"}
    QCF = ["D", "DF", "F"]
    QCB = ["D", "DB", "B"]

    result = []
    parts = [p.strip() for p in move_str.split(',') if p.strip()]

    for part in parts:
        # Handle bracket (~)
        if '~' in part:
            bracket_group = ['bracketl']
            for sp in part.split('~'):
                sub_result = parse_move(sp)
                for elem in sub_result:
                    if isinstance(elem, list) and len(elem) == 1:
                        bracket_group.append(elem[0])
                    else:
                        bracket_group.append(elem)
            bracket_group.append('bracketr')
            result.append(bracket_group)
            continue

        tokens = part.split()
        combined_tokens = []
        i = 0

        while i < len(tokens):
            token = tokens[i]

            # Handle qcf / qcb shorthand
            if token.lower() == 'qcf':
                combined_tokens.extend(QCF)
                i += 1
                continue
            if token.lower() == 'qcb':
                combined_tokens.extend(QCB)
                i += 1
                continue

            # Handle qcf+ or qcb+
            if token.lower().startswith('qcf+'):
                combined_tokens.extend(QCF)
                remainder = token[4:]
                if remainder:
                    combined_tokens.append(remainder)
                i += 1
                continue
            if token.lower().startswith('qcb+'):
                combined_tokens.extend(QCB)
                remainder = token[4:]
                if remainder:
                    combined_tokens.append(remainder)
                i += 1
                continue

            # Handle DB Errors (When hit, ...)
            if token.startswith('(') and token.endswith(')'):
                combined_tokens.append(token)
                i += 1
                continue

            if token == 'When' and i + 2 < len(tokens) and tokens[i+1] == 'hit':
                combined_tokens.append(f"When hit {tokens[i+2]}")
                i += 3
                continue

            if token == 'Any' and i + 1 < len(tokens) and tokens[i+1] == 'button':
                combined_tokens.append('Any button')
                i += 2
                continue

            components = token.split('+')

            leading_labels = []
            while components and components[0].upper() in STANCE:
                leading_labels.append(components[0].upper())
                components = components[1:]
            combined_tokens.extend(leading_labels)

            directions = []
            others = []

            for c in components:
                if '/' in c:
                    dirs = c.split('/')
                    directions.append(''.join(d.upper() for d in dirs))
                elif c.upper() in DIRECTIONS:
                    directions.append(c.upper())
                else:
                    others.append(c)

            combined_tokens.extend(directions)
            if others:
                combined_tokens.append('+'.join(others))

            i += 1

        if combined_tokens:
            result.append(combined_tokens)

    return result