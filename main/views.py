from django.shortcuts import render
from .models import FrameData, Characters

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

#request for the home page, sends all the character names to make the buttons for the user
def home(request):
    character_list = Characters.objects.all()
    characters = Characters.objects.all()

    character_list = []
    for character in characters:
        character_list.append((character.name))

    return render(request, "home.html", {"character_list" : character_list})

#request for the character page, pulls the full movelist of a character based on the buttons pressed
#then uses the parsing function to make it understandable to a human being.
def character(request):
    character = request.GET.get("character")
    character_list = Characters.objects.all()
    framedata = FrameData.objects.filter(character__name=character)

    moves_list = []
    for move in framedata:
        parsed_move = parse_move(move.move) if move.move else []
        moves_list.append({
            "move": parsed_move,
            "hit_type": move.hit_type,
            "damage": move.damage,
            "startup": move.startup,
            "block": move.block,
            "hit": move.hit,
            "counter_hit": move.counter_hit,
        })

    return render(request, "character.html", {"moves_list": moves_list, "character_list": character_list, "character_name": character.replace("_", " "),})

    