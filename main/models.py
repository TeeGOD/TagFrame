from django.db import models

class Characters(models.Model):
    name = models.TextField(primary_key=True)
    special = models.TextField(null=True, blank=True)
    order_number = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Character"
        verbose_name_plural = "Characters"


class FrameData(models.Model):
    character = models.ForeignKey(
        Characters, 
        on_delete=models.CASCADE, 
        related_name="frame_data", 
        null=True, 
        blank=True
    )
    id = models.AutoField(primary_key=True)
    move = models.TextField(null=True, blank=True)
    hit_type = models.TextField(null=True, blank=True)
    damage = models.TextField(null=True, blank=True)
    startup = models.TextField(null=True, blank=True)
    block = models.TextField(null=True, blank=True)
    hit = models.TextField(null=True, blank=True)
    counter_hit = models.TextField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    move_name = models.TextField(null=True, blank=True)
    condition = models.TextField(null=True, blank=True)
    WS = models.BooleanField(default=False)
    SS = models.BooleanField(default=False)
    BT = models.BooleanField(default=False)
    P1_Grounded = models.BooleanField(default=False)
    P2_Grounded = models.BooleanField(default=False)
    Homing = models.BooleanField(default=False)
    FloorBreak = models.BooleanField(default=False)
    WallBreak = models.BooleanField(default=False)
    BalconyBreak = models.BooleanField(default=False)
    Bound = models.BooleanField(default=False)
    ForceCrouch = models.BooleanField(default=False)
    Throw = models.BooleanField(default=False)
    # TagLuncher = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.character.name} - {self.move}"

    class Meta:
        verbose_name = "Frame Data"
        verbose_name_plural = "Frame Data"
