from django.shortcuts import render
from .models import Characters, FrameData

def home(request):
    framedata = FrameData.objects.filter(character__name="Kazuya")
    return render(request, "home.html", {"framedata": framedata})