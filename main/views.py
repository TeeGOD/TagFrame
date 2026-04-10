from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import FrameData, Characters
from .helper import matches_move_search, parse_move
import random


"""request for the home page, sends all the character names to make the buttons for the user"""
def home(request):
    characters = Characters.objects.all().order_by('order_number')
    character_list = []
    
    for character in characters:
        character_list.append({
            "raw": character.name,
            "display": character.name.replace("_", " ")
        })

    return render(request, "home.html", {"character_list" : character_list})


"""request for the character page, pulls the full movelist of a character based on the buttons pressed
then uses the parsing function to make it understandable to a human being."""
def character(request):
    character_list = Characters.objects.all()
    character = request.GET.get("character")
    search = request.GET.get("search", "").strip()
    
    # If the character is "random", redirect to a random character page
    if character == "random":
        return redirect(f"/character?character={random.choice(character_list).name}")
        
    framedata = FrameData.objects.filter(character__name=character)
    moves_list = []

    for move in framedata:
        if search and not matches_move_search(move.move, search):
            continue

        parsed_move = parse_move(move.move) if move.move else []
        moves_list.append({
            "move_id": move.id,
            "move": parsed_move,
            "hit_type": move.hit_type,
            "damage": move.damage,
            "startup": move.startup,
            "block": move.block,
            "hit": move.hit,
            "move_name": move.move_name
        })

    return render(request, "character.html", {
        "moves_list": moves_list,
        "character_name": character.replace("_", " "),
        "character_raw": character,
    })

def move_detail(request, move_id):
    move = get_object_or_404(FrameData, id=move_id)
    return JsonResponse({
        "counter_hit": move.counter_hit,
        "condition": move.condition,
        "notes": move.notes,
    })


def credit(request):
    return render(request, "credit.html")